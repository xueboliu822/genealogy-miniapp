const api = require('../../services/api');

Page({
  data: {
    name: '',
    gender: '男',
    generation: 1,
    fatherId: '',
    motherId: '',
    familyId: '',
    persons: []
  },

  onLoad(options) {
    this.setData({ familyId: options.familyId || '' });
    if (this.data.familyId) {
      this.loadPersons();
    }
  },

  loadPersons() {
    api.getPersons(this.data.familyId).then(res => {
      this.setData({ persons: res.data || [] });
    });
  },

  onNameInput(e) {
    this.setData({ name: e.detail.value });
  },

  onGenderChange(e) {
    this.setData({ gender: e.detail.value });
  },

  onGenerationChange(e) {
    this.setData({ generation: parseInt(e.detail.value) || 1 });
  },

  onFatherChange(e) {
    this.setData({ fatherId: e.detail.value });
  },

  onMotherChange(e) {
    this.setData({ motherId: e.detail.value });
  },

  submit() {
    if (!this.data.name.trim()) {
      wx.showToast({ title: '请输入姓名', icon: 'none' });
      return;
    }
    const data = {
      name: this.data.name.trim(),
      gender: this.data.gender,
      generation: this.data.generation,
      family_id: this.data.familyId || undefined
    };
    if (this.data.fatherId) data.father_id = this.data.fatherId;
    if (this.data.motherId) data.mother_id = this.data.motherId;

    wx.showLoading({ title: '提交中' });
    api.createPerson(data).then(() => {
      wx.hideLoading();
      wx.showToast({ title: '创建成功' });
      setTimeout(() => wx.navigateBack(), 1500);
    }).catch(() => {
      wx.hideLoading();
    });
  }
});