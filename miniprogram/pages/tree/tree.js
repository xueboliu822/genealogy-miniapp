const api = require('../../services/api');

Page({
  data: {
    tree: null,
    familyId: '',
    loading: false
  },

  onLoad(options) {
    this.setData({ familyId: options.familyId || '' });
    if (this.data.familyId) {
      this.loadTree();
    }
  },

  loadTree() {
    this.setData({ loading: true });
    api.getFamilyTree(this.data.familyId).then(res => {
      // 递归设置展开状态
      const setExpand = (node, expanded = false) => {
        node.expand = expanded;
        if (node.children) {
          node.children.forEach(c => setExpand(c, false));
        }
      };
      if (res.data) {
        setExpand(res.data, true);
      }
      this.setData({ tree: res.data, loading: false });
    }).catch(() => {
      this.setData({ loading: false });
    });
  },

  toggleNode(e) {
    const id = e.currentTarget.dataset.id;
    const toggle = (node) => {
      if (node.id === id) {
        node.expand = !node.expand;
        return true;
      }
      if (node.children) {
        return node.children.some(toggle);
      }
      return false;
    };
    const tree = JSON.parse(JSON.stringify(this.data.tree));
    toggle(tree);
    this.setData({ tree });
  },

  goToPerson(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/person/person?personId=${id}` });
  }
});