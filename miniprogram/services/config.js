// 环境配置
// 根据编译版本自动选择 API 地址
module.exports = {
  // 开发环境（使用局域网IP，让模拟器能访问）
  dev: {
    API_BASE: 'http://192.168.3.153:8000/api/v1'
  },
  // 体验版/预发布
  trial: {
    API_BASE: 'https://your-staging-domain.com/api/v1'
  },
  // 生产环境
  release: {
    API_BASE: 'https://your-production-domain.com/api/v1'
  }
};
