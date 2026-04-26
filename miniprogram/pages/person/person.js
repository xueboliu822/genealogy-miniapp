const api = require('../../services/api');

Page({
  data: {
    person: null,
    personId: ''
  },

  onLoad(options) {
    this.setData({ personId: options.personId || '' });
    if (this.data.personId) {
      this.loadPerson();
    }
  },

  loadPerson() {
    wx.showLoading({ title: '加载中' });
    api.getPerson(this.data.personId).then(res => {
      this.setData({ person: res.data });
      wx.hideLoading();
    }).catch(() => {
      wx.hideLoading();
    });
  }
});