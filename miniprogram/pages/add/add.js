const api = require('../../services/api.js');
Page({
  data: {
    mode: 'family',
    family_id: '',
    name: '', surname: '',
    gender: 'M', generation_num: '1', birth_year: '', bio: '',
    fathers: [], selectedFather: '', selectedFatherId: '',
    loading: false
  },
  onLoad(opts) {
    if (opts.family_id) {
      this.setData({ mode: 'person', family_id: opts.family_id });
      this.loadFathers(opts.family_id);
    }
  },
  loadFathers(familyId) {
    api.getPersons(familyId).then(persons => {
      this.setData({ fathers: (persons || []).filter(p => p.gender === 'M') });
    }).catch(() => {});
  },
  onModeChange(e) { this.setData({ mode: e.currentTarget.dataset.mode }); },
  onNameInput(e) { this.setData({ name: e.detail.value }); },
  onSurnameInput(e) { this.setData({ surname: e.detail.value }); },
  onGenderChange(e) { this.setData({ gender: e.currentTarget.value }); },
  onGenInput(e) { this.setData({ generation_num: e.detail.value }); },
  onBirthInput(e) { this.setData({ birth_year: e.detail.value }); },
  onBioInput(e) { this.setData({ bio: e.detail.value }); },
  onFatherChange(e) {
    const idx = e.detail.value;
    const father = this.data.fathers[idx];
    this.setData({ selectedFather: father.name, selectedFatherId: father.id });
  },
  onSubmitFamily() {
    if (!this.data.name) { wx.showToast({ title: '请输入家族名称', icon: 'none' }); return; }
    this.setData({ loading: true });
    api.createFamily({ name: this.data.name, surname: this.data.surname }).then(() => {
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
      family_id: this.data.family_id,
      father_id: this.data.selectedFatherId || undefined,
      birth_year: this.data.birth_year ? parseInt(this.data.birth_year) : undefined,
      bio: this.data.bio || undefined
    }).then(() => {
      wx.showToast({ title: '添加成功', icon: 'success' });
      setTimeout(() => wx.navigateBack(), 1500);
    }).catch(() => { this.setData({ loading: false }); wx.showToast({ title: '添加失败', icon: 'none' }); });
  }
});
