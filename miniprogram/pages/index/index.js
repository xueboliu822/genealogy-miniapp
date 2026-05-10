const api = require('../../services/api.js');
const cache = require('../../utils/cache.js');

Page({
  data: {
    families: [],
    isDemo: false,
    hasMore: false,
    isLoading: false,
    page: 1,
    pageSize: 20
  },

  onShow() {
    // 每次显示页面时尝试从缓存加载，快速响应
    const cached = cache.get('families');
    if (cached) {
      this.setData({ families: cached, isDemo: false });
    }
    // 再异步更新最新数据
    this.load();
  },

  onPullDownRefresh() {
    this.setData({ page: 1 });
    this.load().finally(() => wx.stopPullDownRefresh());
  },

  load() {
    if (this.data.isLoading) return Promise.resolve();
    this.setData({ isLoading: true });

    return api.getFamilies().then(list => {
      this.setData({
        families: list || [],
        isDemo: false,
        hasMore: (list || []).length >= this.data.pageSize,
        page: 1
      });
      cache.set('families', list || []);
    }).catch(() => {
      const cached = cache.get('families');
      if (cached && cached.length > 0) {
        this.setData({ families: cached, isDemo: false });
      } else {
        this.setData({
          families: [{
            id: 'demo_liu',
            name: '田湖刘氏家族',
            surname: '刘',
            hall_name: '亲睦堂',
            member_count: 11
          }],
          isDemo: true
        });
      }
    }).finally(() => {
      this.setData({ isLoading: false });
      wx.hideLoading();
    });
  },

  onReachBottom() {
    if (!this.data.hasMore || this.data.isDemo) return;
    // TODO: 实现分页加载更多
    wx.showToast({ title: '暂无更多数据', icon: 'none' });
  },

  onFamilyTap(e) {
    const { id, name } = e.currentTarget.dataset;
    cache.remove(`tree_${id}`);
    wx.navigateTo({ url: `/pages/tree/tree?family_id=${id}&family_name=${name}` });
  },

  onCreateFamily() {
    cache.remove('families');
    wx.navigateTo({ url: '/pages/add/add' });
  }
});
