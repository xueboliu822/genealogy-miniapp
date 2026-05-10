const api = require('../../services/api.js');

function parseDonations(str) {
  if (!str) return [];
  try {
    const x = JSON.parse(str);
    return Array.isArray(x) ? x : [];
  } catch (e) {
    return [];
  }
}

function formatMomentTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const pad = (n) => (n < 10 ? '0' + n : '' + n);
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
}

Page({
  data: {
    family_id: '',
    family_name: '',
    mgmt: null,
    hall_name: '',
    hall_location: '',
    migration_note: '',
    generation_poem: '',
    tab: 'info',
    hallDonationsList: [],
    qingmingDonationsList: [],
    otherHonorsList: [],
    newDonation: { name: '', amount: '', date: '', note: '', type: 'hall' },
    boundPerson: null,
    moments: [],
    composerOpen: false,
    composerText: ''
  },
  onLoad(opts) {
    let name = opts.family_name || '';
    try {
      name = decodeURIComponent(name);
    } catch (e) {
      /* ignore */
    }
    this.setData({
      family_id: opts.family_id || '',
      family_name: name
    });
    this.load();
    this.loadBinding();
  },
  onShow() {
    if (this.data.family_id) this.loadBinding();
  },
  syncListsFromMgmt(mgmt) {
    if (!mgmt) return;
    this.setData({
      hallDonationsList: parseDonations(mgmt.hall_donations),
      qingmingDonationsList: parseDonations(mgmt.qingming_donations),
      otherHonorsList: parseDonations(mgmt.other_honors)
    });
  },
  load() {
    wx.showLoading({ title: '加载中...' });
    api.getFamilyManagement(this.data.family_id).then((mgmt) => {
      this.setData({
        mgmt,
        hall_name: mgmt.hall_name || '',
        hall_location: mgmt.hall_location || '',
        migration_note: mgmt.migration_note || '',
        generation_poem: mgmt.generation_poem || ''
      });
      this.syncListsFromMgmt(mgmt);
      wx.hideLoading();
    }).catch(() => {
      wx.hideLoading();
      wx.showToast({ title: '加载失败', icon: 'none' });
    });
  },
  loadBinding() {
    if (!this.data.family_id) return;
    api.getMyBoundPerson(this.data.family_id).then((p) => {
      const genLine = p.generation_name ? `${p.generation_num}世 · ${p.generation_name}字辈` : `第${p.generation_num}世`;
      this.setData({
        boundPerson: {
          id: p.id,
          name: p.name,
          genLine
        }
      });
    }).catch(() => {
      this.setData({ boundPerson: null });
    });
  },
  loadMoments() {
    if (!this.data.family_id) return;
    api.listFamilyMoments(this.data.family_id).then((rows) => {
      const moments = (rows || []).map((m) => ({
        ...m,
        displayTime: formatMomentTime(m.created_at),
        avatarLetter: (m.author_name && m.author_name.charAt(0)) || '宗'
      }));
      this.setData({ moments });
    }).catch(() => {
      wx.showToast({ title: '动态加载失败', icon: 'none' });
    });
  },
  onTabChange(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ tab });
    if (tab === 'activities') this.loadMoments();
  },
  onHallNameInput(e) {
    this.setData({ hall_name: e.detail.value });
  },
  onHallLocationInput(e) {
    this.setData({ hall_location: e.detail.value });
  },
  onMigrationNoteInput(e) {
    this.setData({ migration_note: e.detail.value });
  },
  onGenerationPoemInput(e) {
    this.setData({ generation_poem: e.detail.value });
  },
  onSaveHall() {
    wx.showLoading({ title: '保存中...' });
    api.updateFamilyManagement(this.data.family_id, {
      hall_name: this.data.hall_name,
      hall_location: this.data.hall_location,
      migration_note: this.data.migration_note,
      generation_poem: this.data.generation_poem
    }).then((mgmt) => {
      this.setData({ mgmt });
      this.syncListsFromMgmt(mgmt);
      wx.hideLoading();
      wx.showToast({ title: '保存成功', icon: 'success' });
    }).catch(() => {
      wx.hideLoading();
      wx.showToast({ title: '保存失败', icon: 'none' });
    });
  },
  onDonationNameInput(e) {
    this.setData({ 'newDonation.name': e.detail.value });
  },
  onDonationAmountInput(e) {
    this.setData({ 'newDonation.amount': e.detail.value });
  },
  onDonationDateInput(e) {
    this.setData({ 'newDonation.date': e.detail.value });
  },
  onDonationNoteInput(e) {
    this.setData({ 'newDonation.note': e.detail.value });
  },
  onDonationTypeChange(e) {
    this.setData({ 'newDonation.type': e.currentTarget.dataset.type });
  },
  onAddDonation() {
    const d = this.data.newDonation;
    if (!d.name) {
      wx.showToast({ title: '请输入姓名', icon: 'none' });
      return;
    }
    wx.showLoading({ title: '添加中...' });
    api.addDonationRecord(this.data.family_id, {
      donation_type: d.type,
      name: d.name,
      amount: d.amount,
      date: d.date,
      note: d.note
    }).then((mgmt) => {
      this.setData({
        mgmt,
        newDonation: { name: '', amount: '', date: '', note: '', type: 'hall' }
      });
      this.syncListsFromMgmt(mgmt);
      wx.hideLoading();
      wx.showToast({ title: '已添加', icon: 'success' });
    }).catch(() => {
      wx.hideLoading();
      wx.showToast({ title: '添加失败', icon: 'none' });
    });
  },
  onOpenComposer() {
    this.setData({ composerOpen: true, composerText: '' });
  },
  onCloseComposer() {
    this.setData({ composerOpen: false });
  },
  onComposerInput(e) {
    this.setData({ composerText: e.detail.value });
  },
  onPublishMoment() {
    const t = (this.data.composerText || '').trim();
    if (!t) {
      wx.showToast({ title: '请输入内容', icon: 'none' });
      return;
    }
    wx.showLoading({ title: '发送中...' });
    api.createFamilyMoment(this.data.family_id, { content: t, image_urls: [] }).then(() => {
      wx.hideLoading();
      this.setData({ composerOpen: false, composerText: '' });
      wx.showToast({ title: '已发布', icon: 'success' });
      this.loadMoments();
    }).catch(() => {
      wx.hideLoading();
      wx.showToast({ title: '发布失败（需管理员权限）', icon: 'none' });
    });
  },
  onUnbind() {
    const p = this.data.boundPerson;
    if (!p || !p.id) return;
    wx.showModal({
      title: '解绑微信',
      content: '确定与当前谱员节点解除绑定？',
      success: (res) => {
        if (!res.confirm) return;
        wx.showLoading({ title: '处理中...' });
        api.unbindPersonWechat(p.id).then(() => {
          wx.hideLoading();
          wx.showToast({ title: '已解绑', icon: 'success' });
          this.setData({ boundPerson: null });
        }).catch(() => {
          wx.hideLoading();
          wx.showToast({ title: '解绑失败', icon: 'none' });
        });
      }
    });
  },
  onBindHint() {
    wx.showModal({
      title: '绑定谱员',
      content: '请在「族谱树」中打开本人节点，使用详情页的绑定入口完成微信绑定。',
      showCancel: false
    });
  },
  preventBubble() {}
});
