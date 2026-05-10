const envConfig = require('./config.js');
const accountInfo = wx.getAccountInfoSync();
const envVersion = accountInfo.miniProgram.envVersion;

// 根据环境自动选择 API 地址
const API_BASE = envConfig[envVersion]?.API_BASE || envConfig.dev.API_BASE;

function request(path, method, data) {
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync('token') || '';
    wx.request({
      url: API_BASE + path,
      method: method || 'GET',
      data: data || {},
      header: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      success: res => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          resolve(res.data);
        } else if (res.statusCode === 401) {
          wx.removeStorageSync('token');
          wx.showToast({ title: '请先登录', icon: 'none' });
          reject(res);
        } else {
          wx.showToast({ title: res.data.message || '请求失败', icon: 'none' });
          reject(res);
        }
      },
      fail: err => {
        wx.showToast({ title: '网络错误', icon: 'none' });
        reject(err);
      }
    });
  });
}

// 微信小程序 chooseImage 返回本地临时路径，
// 实际项目应上传至 OSS/CDN 后将 URL 存到 avatar_url 字段。
// 这里简化处理：直接用临时路径作为 avatar_url 展示。

module.exports = {
  // 认证
  login: (code) => request('/auth/wechat', 'POST', { code }),

  // 家族
  getFamilies: () => request('/families', 'GET'),
  createFamily: (data) => request('/families', 'POST', data),
  getFamily: (id) => request(`/families/${id}`, 'GET'),
  getFamilyManagement: (id) => request(`/families/${id}/management`, 'GET'),
  updateFamilyManagement: (id, data) => request(`/families/${id}/management`, 'PUT', data),

  // 成员
  getPerson: (id) => request(`/persons/${id}`, 'GET'),
  createPerson: (data) => request('/persons', 'POST', data),
  updatePerson: (id, data) => request(`/persons/${id}`, 'PUT', data),
  getPersons: (familyId) => request(`/families/${familyId}/persons`, 'GET'),
  getFamilyTree: (id) => request(`/families/${id}/tree`, 'GET'),

  // 头像
  updateAvatar: (personId, avatarUrl) => request(`/persons/${personId}/avatar`, 'POST', { avatar_url: avatarUrl }),

  // 辈分
  getGenerationNames: (familyId) => request(`/families/${familyId}/generation-names`, 'GET'),
  suggestGenerationName: (personId) => request(`/persons/${personId}/suggested-generation-name`, 'GET'),

  // 评价
  getEvaluations: (personId) => request(`/persons/${personId}/evaluations`, 'GET'),
  createEvaluation: (personId, content) => request(`/persons/${personId}/evaluations`, 'POST', { content }),

  // 地点
  getPlaces: (q) => request('/places' + (q ? `?q=${q}` : ''), 'GET'),
  createPlace: (data) => request('/places', 'POST', data),
  getFamilyPlaceStats: (familyId) => request(`/families/${familyId}/places`, 'GET'),

  // 系统参数
  getSystemParams: (familyId) => request(`/families/${familyId}/system-params`, 'GET'),
  updateSystemParam: (familyId, key, value) =>
    request(`/families/${familyId}/system-params`, 'PUT', { param_key: key, param_value: String(value) }),
};
