const api = require('../../services/api.js');

Page({
  data: {
    person_id: '',
    person: null,
    isEditing: false,
    editForm: {
      name: '',
      gender: '',
      generation_num: 1,
      birth_year: '',
      bio: ''
    }
  },

  onLoad(opts) {
    this.setData({ person_id: opts.person_id || '' });
    if (opts.person_id) this.load();
  },

  load() {
    wx.showLoading({ title: '加载中...' });
    api.getPerson(this.data.person_id).then(p => {
      this.setData({
        person: p,
        editForm: {
          name: p.name,
          gender: p.gender,
          generation_num: p.generation_num,
          birth_year: p.birth_year || '',
          bio: p.bio || ''
        }
      });
      wx.hideLoading();
    }).catch(() => {
      wx.hideLoading();
      wx.showToast({ title: '加载失败', icon: 'none' });
    });
  },

  onEdit() {
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
        birth_year: p.birth_year || '',
        bio: p.bio || ''
      }
    });
  },

  onNameInput(e) {
    this.setData({ 'editForm.name': e.detail.value });
  },

  onGenderChange(e) {
    const genders = ['M', 'F', 'O'];
    this.setData({ 'editForm.gender': genders[e.detail.value] });
  },

  onGenerationChange(e) {
    this.setData({ 'editForm.generation_num': parseInt(e.detail.value) + 1 });
  },

  onBirthYearInput(e) {
    this.setData({ 'editForm.birth_year': e.detail.value });
  },

  onBioInput(e) {
    this.setData({ 'editForm.bio': e.detail.value });
  },

  onSave() {
    const { editForm, person, isEditing } = this.data;
    if (!isEditing) return;

    if (!editForm.name.trim()) {
      wx.showToast({ title: '请输入姓名', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '保存中...' });
    api.updatePerson(person.id, {
      name: editForm.name.trim(),
      gender: editForm.gender,
      generation_num: editForm.generation_num,
      version: person.version
    }).then(updated => {
      this.setData({
        person: updated,
        isEditing: false
      });
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
  }
});
