const api = require('../../services/api.js');
Page({
  data: { loading: false },
  onLogin() {
    this.setData({ loading: true });
    const mockCode = 'dev_' + Date.now();
    api.login(mockCode).then(data => {
      wx.setStorageSync('token', data.access_token);
      wx.setStorageSync('user_id', data.user_id);
      wx.navigateTo({ url: '/pages/index/index' });
    }).catch(() => {
      this.setData({ loading: false });
      wx.showToast({ title: '登录失败，后台未启动', icon: 'none' });
    });
  },
  onSkip() {
    wx.setStorageSync('token', 'dev_token_12345');
    wx.setStorageSync('user_id', 'dev_user');
    wx.navigateTo({ url: '/pages/index/index' });
  }
});
