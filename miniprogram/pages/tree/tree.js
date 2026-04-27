const api = require('../../services/api.js');
const DEMO_MEMBERS = [
  { id: 'p1', name: '刘德辉', gender: 'M', generation_num: 1 },
  { id: 'p2', name: '刘建国', gender: 'M', generation_num: 2 },
  { id: 'p3', name: '刘建军', gender: 'M', generation_num: 2 },
  { id: 'p4', name: '刘秀英', gender: 'F', generation_num: 2 },
  { id: 'p5', name: '刘志强', gender: 'M', generation_num: 3 },
  { id: 'p6', name: '刘志华', gender: 'M', generation_num: 3 },
  { id: 'p7', name: '刘芳', gender: 'F', generation_num: 3 },
  { id: 'p8', name: '刘伟', gender: 'M', generation_num: 3 },
  { id: 'p9', name: '刘磊', gender: 'M', generation_num: 4 },
  { id: 'p10', name: '刘欣', gender: 'F', generation_num: 4 },
  { id: 'p11', name: '刘晨', gender: 'M', generation_num: 4 },
];
Page({
  data: { family_id: '', family_name: '', members: [], generations: [], loading: true },
  onLoad(opts) {
    this.setData({ family_id: opts.family_id || '', family_name: opts.family_name || '' });
    this.load();
  },
  load() {
    this.setData({ loading: true });
    // Try real API first
    api.getPersons(this.data.family_id).then(persons => {
      this._renderPersons(persons || []);
    }).catch(() => {
      // Fallback to demo data
      this._renderPersons(DEMO_MEMBERS);
    });
  },
  _renderPersons(list) {
    const genMap = {};
    list.forEach(p => {
      const g = p.generation_num || 1;
      if (!genMap[g]) genMap[g] = [];
      genMap[g].push(p);
    });
    const gens = Object.keys(genMap).sort((a,b) => a-b).map(g => ({ gen: g, members: genMap[g] }));
    this.setData({ members: list, generations: gens, loading: false });
    wx.hideLoading();
  },
  onAddMember() {
    wx.navigateTo({ url: `/pages/add/add?family_id=${this.data.family_id}` });
  },
  onMemberTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/person/person?person_id=${id}` });
  }
});
