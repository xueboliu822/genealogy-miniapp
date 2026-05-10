const api = require('../../services/api.js');
const cache = require('../../utils/cache.js');

Page({
  data: {
    family_id: '',
    family_name: '',
    members: 0,
    treeData: null,
    verticalLevels: [],
    flatListData: [],  // 扁平化列表数据
    loading: true,
    viewMode: 'tree' // 'tree'（垂直世系） or 'list'
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
      const roots = this._injectHasChildren(cached.roots || []);
      this.setData({
        family_name: cached.family_name || this.data.family_name,
        members: cached.members,
        treeData: roots
      });
      this._buildVerticalLevels(roots);
      this._buildFlatList(roots);
    }

    this.setData({ loading: !cached });
    api.getFamilyTree(this.data.family_id).then(res => {
      const roots = this._injectHasChildren(res.roots || []);
      this.setData({
        family_name: res.family_name,
        members: res.members,
        treeData: roots
      });
      this._buildVerticalLevels(roots);
      this._buildFlatList(roots);
      // 缓存5分钟
      cache.set(cacheKey, res, 5 * 60 * 1000);
      wx.hideLoading();
    }).catch(() => {
      this.setData({ loading: false, verticalLevels: [] });
      wx.hideLoading();
      if (!cache.get(cacheKey)) {
        wx.showToast({ title: '加载失败', icon: 'none' });
      }
    });
  },

  // 向下钻取：给每个节点注入 _hasChildren 标志（避免 WXML 里出现 .children.length）
  _injectHasChildren(roots) {
    const mark = (nodes) => {
      if (!nodes || !nodes.length) return;
      for (const node of nodes) {
        node._hasChildren = !!(node.children && node.children.length > 0);
        if (node.spouse) node.spouse._hasChildren = !!(node.spouse.children && node.spouse.children.length > 0);
        if (node.children) mark(node.children);
      }
    };
    mark(roots);
    return roots;
  },

  /** 垂直世系：按世代聚合同一代内的节点（先序：本人 → 配偶 → 子支） */
  _buildVerticalLevels(roots) {
    const genMap = new Map();
    const seen = new Set();
    const add = (p, role) => {
      if (!p || p.id == null || seen.has(p.id)) return;
      seen.add(p.id);
      const g = Number(p.generation_num) || 1;
      if (!genMap.has(g)) genMap.set(g, []);
      genMap.get(g).push({ ...p, _rowRole: role });
    };
    const walk = (node) => {
      if (!node) return;
      add(node, 'primary');
      if (node.spouse) add(node.spouse, 'spouse');
      const kids = node.children || [];
      for (const c of kids) walk(c);
    };
    (roots || []).forEach(walk);
    const sortedGens = Array.from(genMap.keys()).sort((a, b) => a - b);
    const verticalLevels = sortedGens.map((g, idx) => {
      const members = genMap.get(g);
      const isFirstGen = idx === 0;
      let rankLabel = `第${g}代`;
      if (isFirstGen) rankLabel = `第${g}代 · 始祖`;
      const hasPair =
        members.length === 2 &&
        members[1] &&
        members[1]._rowRole === 'spouse';
      return { generation_num: g, rankLabel, members, isFirstGen, hasPair };
    });
    this.setData({ verticalLevels });
  },

  // 将嵌套树结构扁平化为列表（按 generation_num 排序）
  _buildFlatList(roots) {
    const result = [];
    const traverse = (node, depth = 0) => {
      result.push({ ...node, depth });
      if (node.spouse) {
        result.push({ ...node.spouse, depth, isSpouse: true });
      }
      if (node.children && node.children.length > 0) {
        for (const child of node.children) {
          traverse(child, depth + 1);
        }
      }
    };
    for (const root of roots) {
      traverse(root);
    }
    // 按世代排序，同世代按姓名排序
    result.sort((a, b) => a.generation_num - b.generation_num || a.name.localeCompare(b.name));
    this.setData({ flatListData: result });
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
  },

  onManageFamily() {
    const name = encodeURIComponent(this.data.family_name || '');
    wx.navigateTo({ url: `/pages/family/family?family_id=${this.data.family_id}&family_name=${name}` });
  }
});
