const api = require('../../services/api.js');
Page({
  data: {
    family_id: '',
    family_name: '',
    mgmt: null,
    hall_name: '',
    hall_location: '',
    migration_note: '',
    generation_poem: '',
    isEditing: false,
    newDonation: { name: '', amount: '', date: '', note: '', type: 'hall' },
    tab: 'info' // 'info' | 'donations'
  },
  onLoad(opts) {
    this.setData({ family_id: opts.family_id || '', family_name: opts.family_name || '' });
    this.load();
  },
  load() {
    wx.showLoading({ title: '加载中...' });
    api.getFamilyManagement(this.data.family_id).then(mgmt => {
      this.setData({
        mgmt,
        hall_name: mgmt.hall_name || '',
        hall_location: mgmt.hall_location || '',
        migration_note: mgmt.migration_note || '',
        generation_poem: mgmt.generation_poem || ''
      });
      wx.hideLoading();
    }).catch(() => {
      wx.hideLoading();
      wx.showToast({ title: '加载失败', icon: 'none' });
    });
  },
  onTabChange(e) {
    this.setData({ tab: e.currentTarget.dataset.tab });
  },
  onHallNameInput(e) { this.setData({ hall_name: e.detail.value }); },
  onHallLocationInput(e) { this.setData({ hall_location: e.detail.value }); },
  onMigrationNoteInput(e) { this.setData({ migration_note: e.detail.value }); },
  onGenerationPoemInput(e) { this.setData({ generation_poem: e.detail.value }); },
  onSaveHall() {
    wx.showLoading({ title: '保存中...' });
    api.updateFamilyManagement(this.data.family_id, {
      hall_name: this.data.hall_name,
      hall_location: this.data.hall_location,
      migration_note: this.data.migration_note,
      generation_poem: this.data.generation_poem
    }).then(mgmt => {
      this.setData({ mgmt, isEditing: false });
      wx.hideLoading();
      wx.showToast({ title: '保存成功', icon: 'success' });
    }).catch(() => {
      wx.hideLoading();
      wx.showToast({ title: '保存失败', icon: 'none' });
    });
  },
  onDonationNameInput(e) { this.setData({ 'newDonation.name': e.detail.value }); },
  onDonationAmountInput(e) { this.setData({ 'newDonation.amount': e.detail.value }); },
  onDonationDateInput(e) { this.setData({ 'newDonation.date': e.detail.value }); },
  onDonationNoteInput(e) { this.setData({ 'newDonation.note': e.detail.value }); },
  onDonationTypeChange(e) { this.setData({ 'newDonation.type': e.currentTarget.dataset.type }); },
  onAddDonation() {
    const d = this.data.newDonation;
    if (!d.name) { wx.showToast({ title: '请输入姓名', icon: 'none' }); return; }
    wx.showLoading({ title: '添加中...' });
    api.addDonationRecord(this.data.family_id, {
      donation_type: d.type, name: d.name, amount: d.amount, date: d.date, note: d.note
    }).then(mgmt => {
      this.setData({ mgmt, newDonation: { name: '', amount: '', date: '', note: '', type: 'hall' } });
      wx.hideLoading();
      wx.showToast({ title: '已添加', icon: 'success' });
    }).catch(() => {
      wx.hideLoading();
      wx.showToast({ title: '添加失败', icon: 'none' });
    });
  },
  parseJson(str) {
    if (!str) return [];
    try { return JSON.parse(str); } catch { return []; }
  }
});
