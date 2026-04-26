const api = require('../../services/api');

Page({
  data: {
    families: [],
    loading: false
  },

  onLoad() {
    this.loadFamilies();
  },

  onShow() {
    this.loadFamilies();
  },

  loadFamilies() {
    this.setData({ loading: true });
    api.getFamilies().then(res => {
      this.setData({ families: res.data || [], loading: false });
    }).catch(() => {
      this.setData({ loading: false });
    });
  },

  goToTree(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/tree/tree?familyId=${id}` });
  },

  createFamily() {
    wx.showModal({
      title: '创建家族',
      editable: true,
      placeholderText: '请输入家族名称',
      success: res => {
        if (res.confirm && res.content) {
          api.createFamily({ name: res.content }).then(() => {
            wx.showToast({ title: '创建成功' });
            this.loadFamilies();
          });
        }
      }
    });
  }
});