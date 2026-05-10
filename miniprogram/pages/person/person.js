const api = require('../../services/api.js');

Page({
  data: {
    person_id: '',
    person: null,
    isEditing: false,
    evaluations: [],
    places: [],
    fathers: [],
    mothers: [],
    newEvaluation: '',
    editForm: {
      name: '',
      gender: '',
      generation_num: 1,
      generation_name: '',
      birth_year: '',
      death_year: '',
      is_alive: true,
      bio: '',
      place_id: '',
      place_name: '',
      father_id: '',
      father_name: '',
      mother_id: '',
      mother_name: ''
    }
  },

  onLoad(opts) {
    this.setData({ person_id: opts.person_id || '' });
    if (opts.person_id) {
      this.load();
      this.loadPlaces();
    }
  },

  load() {
    wx.showLoading({ title: '加载中...' });
    Promise.all([
      api.getPerson(this.data.person_id),
      api.getEvaluations(this.data.person_id).catch(() => [])
    ]).then(([p, evals]) => {
      this.setData({ person: p });
      this.setData({ evaluations: evals || [] });
      // 加载家庭成员列表（用于选择父亲/母亲）
      if (p.family_id) {
        this.loadParents(p.family_id);
      }
      this.setData({
        editForm: {
          name: p.name,
          gender: p.gender,
          generation_num: p.generation_num,
          generation_name: p.generation_name || '',
          birth_year: p.birth_year || '',
          death_year: p.death_year || '',
          is_alive: p.is_alive !== false,
          bio: p.bio || '',
          place_id: p.place_id || '',
          place_name: '',
          father_id: p.father_id || '',
          father_name: '',
          mother_id: p.mother_id || '',
          mother_name: ''
        }
      });
      wx.hideLoading();
    }).catch(() => {
      wx.hideLoading();
      wx.showToast({ title: '加载失败', icon: 'none' });
    });
  },

  loadPlaces() {
    api.getPlaces().then(places => {
      this.setData({ places: places || [] });
    }).catch(() => {});
  },

  loadParents(familyId) {
    api.getPersons(familyId).then(persons => {
      const list = persons || [];
      this.setData({
        fathers: list.filter(p => p.gender === 'M' && p.id !== this.data.person_id),
        mothers: list.filter(p => p.gender === 'F' && p.id !== this.data.person_id)
      });
      // 回填当前父亲/母亲名称
      const { editForm, fathers, mothers } = this.data;
      const father = fathers.find(p => p.id === editForm.father_id);
      const mother = mothers.find(p => p.id === editForm.mother_id);
      if (father) this.setData({ 'editForm.father_name': father.name });
      if (mother) this.setData({ 'editForm.mother_name': mother.name });
    }).catch(() => {});
  },

  onEdit() {
    const p = this.data.person;
    if (p.family_id) this.loadParents(p.family_id);
    this.loadPlaces();
    this.setData({ isEditing: true });
  },

  onCancelEdit() {
    const p = this.data.person;
    this.setData({
      isEditing: false,
      editForm: {
        name: p.name,
        gender: p.gender,
        generation_num: p.generation_num,
        generation_name: p.generation_name || '',
        birth_year: p.birth_year || '',
        death_year: p.death_year || '',
        is_alive: p.is_alive !== false,
        bio: p.bio || '',
        place_id: p.place_id || '',
        place_name: '',
        father_id: p.father_id || '',
        father_name: '',
        mother_id: p.mother_id || '',
        mother_name: ''
      }
    });
  },

  onNameInput(e) { this.setData({ 'editForm.name': e.detail.value }); },
  onGenderChange(e) {
    const genders = ['M', 'F', 'O'];
    this.setData({ 'editForm.gender': genders[e.detail.value] });
  },
  onGenerationChange(e) {
    this.setData({ 'editForm.generation_num': parseInt(e.detail.value) + 1 });
  },
  onGenerationNameInput(e) { this.setData({ 'editForm.generation_name': e.detail.value }); },
  onBirthYearInput(e) { this.setData({ 'editForm.birth_year': e.detail.value }); },
  onDeathYearInput(e) { this.setData({ 'editForm.death_year': e.detail.value }); },
  onIsAliveChange(e) { this.setData({ 'editForm.is_alive': e.detail.value === '1' }); },
  onBioInput(e) { this.setData({ 'editForm.bio': e.detail.value }); },
  onPlaceChange(e) {
    const idx = e.detail.value;
    const place = this.data.places[idx];
    if (!place) return;
    this.setData({ 'editForm.place_id': place.id, 'editForm.place_name': place.name });
  },
  onFatherChange(e) {
    const idx = e.detail.value;
    const father = this.data.fathers[idx];
    if (!father) return;
    this.setData({ 'editForm.father_id': father.id, 'editForm.father_name': father.name });
  },
  onMotherChange(e) {
    const idx = e.detail.value;
    const mother = this.data.mothers[idx];
    if (!mother) return;
    this.setData({ 'editForm.mother_id': mother.id, 'editForm.mother_name': mother.name });
  },

  onSave() {
    const { editForm, person, isEditing } = this.data;
    if (!isEditing) return;
    if (!editForm.name.trim()) {
      wx.showToast({ title: '请输入姓名', icon: 'none' }); return;
    }
    wx.showLoading({ title: '保存中...' });
    api.updatePerson(person.id, {
      name: editForm.name.trim(),
      gender: editForm.gender,
      generation_num: editForm.generation_num,
      generation_name: editForm.generation_name || null,
      birth_year: editForm.birth_year ? parseInt(editForm.birth_year) : null,
      death_year: editForm.death_year ? parseInt(editForm.death_year) : null,
      is_alive: editForm.is_alive,
      bio: editForm.bio || null,
      place_id: editForm.place_id || null,
      father_id: editForm.father_id || null,
      mother_id: editForm.mother_id || null,
      version: person.version
    }).then(updated => {
      this.setData({ person: updated, isEditing: false });
      wx.hideLoading();
      wx.showToast({ title: '保存成功', icon: 'success' });
    }).catch(err => {
      wx.hideLoading();
      if (err.statusCode === 409) {
        wx.showToast({ title: '数据已过期，请刷新重试', icon: 'none' });
      } else {
        wx.showToast({ title: '保存失败', icon: 'none' });
      }
    });
  },

  // ---- 头像上传 ----
  onChooseAvatar() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: res => {
        const tempFilePath = res.tempFiles[0].tempFilePath;
        // 简化处理：直接用临时路径作为 avatar_url
        // 实际项目应上传到 OSS/CDN 后取回 URL
        api.updatePerson(this.data.person.id, {
          avatar_url: tempFilePath,
          version: this.data.person.version
        }).then(updated => {
          this.setData({ person: updated });
          wx.showToast({ title: '头像已更新', icon: 'success' });
        }).catch(() => {
          wx.showToast({ title: '上传失败', icon: 'none' });
        });
      }
    });
  },

  // ---- 评价 ----
  onEvaluationInput(e) {
    this.setData({ newEvaluation: e.detail.value });
  },
  onSubmitEvaluation() {
    const content = this.data.newEvaluation.trim();
    if (!content) { wx.showToast({ title: '请输入评价内容', icon: 'none' }); return; }
    api.createEvaluation(this.data.person.id, content).then(ev => {
      this.setData({ evaluations: [ev, ...this.data.evaluations], newEvaluation: '' });
      wx.showToast({ title: '评价已添加', icon: 'success' });
    }).catch(() => {
      wx.showToast({ title: '添加失败', icon: 'none' });
    });
  }
});
