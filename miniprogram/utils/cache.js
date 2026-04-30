/**
 * 简单的内存缓存工具
 * 用于减少 API 请求，提升小程序性能
 */

const CACHE_PREFIX = 'cache_';
const DEFAULT_TTL = 5 * 60 * 1000; // 默认5分钟过期

/**
 * 设置缓存
 * @param {string} key 缓存key
 * @param {any} data 缓存数据
 * @param {number} ttl 过期时间(ms)，默认5分钟
 */
function set(key, data, ttl = DEFAULT_TTL) {
  const cacheData = {
    data,
    expireAt: Date.now() + ttl
  };
  wx.setStorageSync(CACHE_PREFIX + key, cacheData);
}

/**
 * 获取缓存
 * @param {string} key 缓存key
 * @returns {any|null} 缓存数据，过期或不存在返回null
 */
function get(key) {
  const cacheData = wx.getStorageSync(CACHE_PREFIX + key);
  if (!cacheData) return null;
  if (Date.now() > cacheData.expireAt) {
    wx.removeStorageSync(CACHE_PREFIX + key);
    return null;
  }
  return cacheData.data;
}

/**
 * 删除指定缓存
 * @param {string} key 缓存key
 */
function remove(key) {
  wx.removeStorageSync(CACHE_PREFIX + key);
}

/**
 * 清空所有缓存
 */
function clear() {
  const keys = wx.getStorageInfoSync().keys || [];
  keys.forEach(k => {
    if (k.startsWith(CACHE_PREFIX)) {
      wx.removeStorageSync(k);
    }
  });
}

/**
 * 包装异步函数，自动使用缓存
 * @param {string} key 缓存key
 * @param {Function} fetchFn 获取数据的异步函数
 * @param {number} ttl 缓存时间
 */
async function withCache(key, fetchFn, ttl = DEFAULT_TTL) {
  const cached = get(key);
  if (cached) {
    return cached;
  }
  const data = await fetchFn();
  set(key, data, ttl);
  return data;
}

module.exports = {
  set,
  get,
  remove,
  clear,
  withCache
};
