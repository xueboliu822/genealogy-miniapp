const api = require('../../services/api.js');
Page({
  data: { loading: false },
  onLogin() {
    this.setData({ loading: true });
    // 开发模式：使用 dev_token 直接测试
    wx.setStorageSync('token', 'dev_token');
    wx.setStorageSync('user_id', 'dev_user');
    wx.showToast({ title: '登录成功', icon: 'success' });
    setTimeout(() => wx.navigateTo({ url: '/pages/index/index' }), 1000);
  },
  onSkip() {
    wx.setStorageSync('token', 'dev_token');
    wx.setStorageSync('user_id', 'dev_user');
    wx.navigateTo({ url: '/pages/index/index' });
  }
});
