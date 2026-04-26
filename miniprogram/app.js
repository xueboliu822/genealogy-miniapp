App({
  onLaunch() {
    // 检查登录态
    const token = wx.getStorageSync('token');
    if (!token) {
      // 简单静默登录（实际应静默获取 code）
      console.log('No token, need login');
    }
  },
  globalData: {
    userInfo: null
  }
});