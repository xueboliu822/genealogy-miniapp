const api = require('../../services/api.js');
Page({
  data: { families: [], isDemo: false },
  onShow() { this.load(); },
  onLoad() { this.load(); },
  load() {
    wx.showLoading({ title: '加载中...' });
    api.getFamilies().then(list => {
      this.setData({ families: list || [], isDemo: false });
      wx.hideLoading();
    }).catch(() => {
      // API fails - show demo Liu family
      this.setData({ 
        families: [{ id: 'demo_liu', name: '刘氏家族', surname: '刘', member_count: 11 }],
        isDemo: true 
      });
      wx.hideLoading();
    });
  },
  onFamilyTap(e) {
    const { id, name } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/tree/tree?family_id=${id}&family_name=${name}` });
  },
  onCreateFamily() {
    wx.navigateTo({ url: '/pages/add/add' });
  }
});
