const api = require('../../services/api.js');
Page({
  data: { loading: false },
  onLogin() {
    this.setData({ loading: true });
    // 开发者工具测试：用固定测试token直连后端
    const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYWE5ZWVhMDYtM2MyMy00YmFmLWI1MzgtNWEwN2JjM2YyZGI3Iiwib3BlbmlkIjoidGVzdDEyMyIsImV4cCI6MTc3NzM2Nzc5NX0.vfAmXIEuRx5n8WoiKhiPTxni66AI_tIR2wINneddbnU';
    const testUserId = 'aa9eea06-3c23-4baf-b538-5a07bc3f2db7';
    wx.setStorageSync('token', testToken);
    wx.setStorageSync('user_id', testUserId);
    wx.showToast({ title: '登录成功', icon: 'success' });
    setTimeout(() => wx.navigateTo({ url: '/pages/index/index' }), 1000);
  },
  onSkip() {
    wx.setStorageSync('token', 'dev_token');
    wx.setStorageSync('user_id', 'dev_user');
    wx.navigateTo({ url: '/pages/index/index' });
  }
});
