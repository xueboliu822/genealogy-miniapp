const api = require('../../services/api.js');
const cache = require('../../utils/cache.js');

Page({
  data: {
    family_id: '',
    family_name: '',
    members: 0,
    treeData: null,
    loading: true,
    viewMode: 'tree' // 'tree' or 'list'
  },

  onLoad(opts) {
    this.setData({
      family_id: opts.family_id || '',
      family_name: opts.family_name || ''
    });
    this.load();
  },

  load() {
    const cacheKey = `tree_${this.data.family_id}`;
    // 优先从缓存加载
    const cached = cache.get(cacheKey);
    if (cached) {
      this.setData({
        family_name: cached.family_name || this.data.family_name,
        members: cached.members,
        treeData: cached.roots || []
      });
    }

    this.setData({ loading: !cached });
    // 使用 getFamilyTree API 获取真正的树形数据
    api.getFamilyTree(this.data.family_id).then(res => {
      this.setData({
        family_name: res.family_name,
        members: res.members,
        treeData: res.roots || [],
        loading: false
      });
      // 缓存5分钟
      cache.set(cacheKey, res, 5 * 60 * 1000);
      wx.hideLoading();
    }).catch(() => {
      this.setData({ loading: false });
      wx.hideLoading();
      if (!cache.get(cacheKey)) {
        wx.showToast({ title: '加载失败', icon: 'none' });
      }
    });
  },

  onViewModeChange(e) {
    this.setData({ viewMode: e.currentTarget.dataset.mode });
  },

  onAddMember() {
    // 添加成员后清除缓存
    cache.remove(`tree_${this.data.family_id}`);
    wx.navigateTo({ url: `/pages/add/add?family_id=${this.data.family_id}` });
  },

  onMemberTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/person/person?person_id=${id}` });
  }
});
