const api = require('../../services/api.js');
Page({
  data: { person_id: '', person: null },
  onLoad(opts) {
    this.setData({ person_id: opts.person_id || '' });
    if (opts.person_id) this.load();
  },
  load() {
    wx.showLoading({ title: '加载中...' });
    api.getPerson(this.data.person_id).then(p => {
      this.setData({ person: p });
      wx.hideLoading();
    }).catch(() => {
      wx.hideLoading();
      wx.showToast({ title: '加载失败', icon: 'none' });
    });
  },
  onEdit() {
    wx.showToast({ title: '编辑功能开发中', icon: 'none' });
  }
});
