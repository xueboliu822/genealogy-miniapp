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

module.exports = {
  login: (code) => request('/auth/wechat', 'POST', { code }),
  getFamilies: () => request('/families', 'GET'),
  getFamilyTree: (id) => request(`/families/${id}/tree`, 'GET'),
  getPerson: (id) => request(`/persons/${id}`, 'GET'),
  updatePerson: (id, data) => request(`/persons/${id}`, 'PUT', data),
  createPerson: (data) => request('/persons', 'POST', data),
  getPersons: (familyId) => request(`/families/${familyId}/persons`, 'GET'),
  createFamily: (data) => request('/families', 'POST', data),
};