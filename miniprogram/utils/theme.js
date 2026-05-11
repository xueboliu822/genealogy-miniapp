/** V2 原型：暖纸 / 青黛，本地持久化 */
function syncTheme(page) {
  const app = getApp();
  let theme = (app && app.globalData && app.globalData.theme) || wx.getStorageSync('ui_theme');
  if (theme !== 'warm' && theme !== 'celadon') theme = 'warm';
  if (app && app.globalData) app.globalData.theme = theme;
  if (page && typeof page.setData === 'function') {
    page.setData({ theme });
  }
}

module.exports = { syncTheme };
