const api = require('../../services/api.js');
const cache = require('../../utils/cache.js');

Page({
  data: {
    mode: 'family',
    family_id: '',
    name: '', surname: '',
    hall_name: '', migration_note: '', generation_poem: '',
    gender: 'M', generation_num: '1', generation_name: '', birth_year: '', death_year: '',
    is_alive: true,
    bio: '',
    fathers: [], selectedFather: '', selectedFatherId: '',
    mothers: [], selectedMother: '', selectedMotherId: '',
    spouses: [], selectedSpouse: '', selectedSpouseId: '',
    places: [], selectedPlace: '', selectedPlaceId: '',
    loading: false
  },
  onLoad(opts) {
    if (opts.family_id) {
      this.setData({ mode: 'person', family_id: opts.family_id });
      this.loadFathers(opts.family_id);
      this.loadMothers(opts.family_id);
      this.loadSpouses(opts.family_id);
      this.loadPlaces();
    }
  },
  loadFathers(familyId) {
    api.getPersons(familyId).then(persons => {
      this.setData({ fathers: (persons || []).filter(p => p.gender === 'M') });
    }).catch(err => {
      console.error('加载父亲列表失败:', err);
    });
  },
  loadMothers(familyId) {
    api.getPersons(familyId).then(persons => {
      this.setData({ mothers: (persons || []).filter(p => p.gender === 'F') });
    }).catch(err => {
      console.error('加载母亲列表失败:', err);
    });
  },
  loadSpouses(familyId) {
    // 配偶：同代异性的家族成员
    api.getPersons(familyId).then(persons => {
      this.setData({ spouses: (persons || []).filter(p => p.id !== this.data.selectedFatherId) });
    }).catch(err => {
      console.error('加载配偶列表失败:', err);
    });
  },
  loadPlaces() {
    api.getPlaces().then(places => {
      this.setData({ places: places || [] });
    }).catch(() => {});
  },
  onModeChange(e) { this.setData({ mode: e.currentTarget.dataset.mode }); },
  onNameInput(e) { this.setData({ name: e.detail.value }); },
  onSurnameInput(e) { this.setData({ surname: e.detail.value }); },
  onHallNameInput(e) { this.setData({ hall_name: e.detail.value }); },
  onMigrationNoteInput(e) { this.setData({ migration_note: e.detail.value }); },
  onGenerationPoemInput(e) { this.setData({ generation_poem: e.detail.value }); },
  onGenderChange(e) { this.setData({ gender: e.currentTarget.value }); },
  onGenInput(e) { this.setData({ generation_num: e.detail.value }); },
  onBirthInput(e) { this.setData({ birth_year: e.detail.value }); },
  onDeathYearInput(e) { this.setData({ death_year: e.detail.value }); },
  onIsAliveChange(e) { this.setData({ is_alive: e.detail.value === '1' }); },
  onBioInput(e) { this.setData({ bio: e.detail.value }); },
  onGenerationNameInput(e) { this.setData({ generation_name: e.detail.value }); },
  onFatherChange(e) {
    const idx = e.detail.value;
    const father = this.data.fathers[idx];
    if (!father) return;
    this.setData({
      selectedFather: father.name,
      selectedFatherId: father.id,
      generation_num: String(father.generation_num + 1)
    });
    // 自动查询字辈
    if (father.generation_num) {
      api.suggestGenerationName(father.id).then(res => {
        if (res.next_character) {
          this.setData({ generation_name: res.next_character });
        }
      }).catch(() => {});
    }
    // 刷新配偶列表（排除自己选的父亲）
    if (father.family_id) this.loadSpouses(father.family_id);
  },
  onMotherChange(e) {
    const idx = e.detail.value;
    const mother = this.data.mothers[idx];
    if (!mother) return;
    this.setData({
      selectedMother: mother.name,
      selectedMotherId: mother.id
    });
  },
  onSpouseChange(e) {
    const idx = e.detail.value;
    const spouse = this.data.spouses[idx];
    if (!spouse) return;
    this.setData({
      selectedSpouse: spouse.name,
      selectedSpouseId: spouse.id
    });
  },
  onPlaceChange(e) {
    const idx = e.detail.value;
    const place = this.data.places[idx];
    if (!place) return;
    this.setData({ selectedPlace: place.name, selectedPlaceId: place.id });
  },
  onSubmitFamily() {
    if (!this.data.name) { wx.showToast({ title: '请输入家族名称', icon: 'none' }); return; }
    this.setData({ loading: true });
    const payload = { name: this.data.name, surname: this.data.surname };
    if (this.data.hall_name) payload.hall_name = this.data.hall_name;
    if (this.data.migration_note) payload.migration_note = this.data.migration_note;
    if (this.data.generation_poem) payload.generation_poem = this.data.generation_poem;
    api.createFamily(payload).then(() => {
      cache.remove('families');
      wx.showToast({ title: '创建成功', icon: 'success' });
      setTimeout(() => wx.navigateBack(), 1500);
    }).catch(() => { this.setData({ loading: false }); wx.showToast({ title: '创建失败', icon: 'none' }); });
  },
  onSubmitPerson() {
    if (!this.data.name) { wx.showToast({ title: '请输入姓名', icon: 'none' }); return; }
    if (!this.data.family_id) { wx.showToast({ title: '请先选择家族', icon: 'none' }); return; }
    this.setData({ loading: true });
    api.createPerson({
      name: this.data.name, gender: this.data.gender,
      generation_num: parseInt(this.data.generation_num) || 1,
      generation_name: this.data.generation_name || undefined,
      family_id: this.data.family_id,
      father_id: this.data.selectedFatherId || undefined,
      mother_id: this.data.selectedMotherId || undefined,
      spouse_id: this.data.selectedSpouseId || undefined,
      birth_year: this.data.birth_year ? parseInt(this.data.birth_year) : undefined,
      death_year: this.data.death_year ? parseInt(this.data.death_year) : undefined,
      is_alive: this.data.is_alive,
      bio: this.data.bio || undefined,
      place_id: this.data.selectedPlaceId || undefined,
    }).then(() => {
      wx.showToast({ title: '添加成功', icon: 'success' });
      setTimeout(() => wx.navigateBack(), 1500);
    }).catch(() => { this.setData({ loading: false }); wx.showToast({ title: '添加失败', icon: 'none' }); });
  }
});
