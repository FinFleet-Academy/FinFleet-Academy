import axios from 'axios';

const cache = new Map();
const CACHE_TIME = 5 * 60 * 1000; // 5 minutes

export const cachedGet = async (url, options = {}) => {
  const cacheKey = url + JSON.stringify(options);
  const cachedData = cache.get(cacheKey);

  if (cachedData && (Date.now() - cachedData.timestamp < CACHE_TIME)) {
    console.log(`[Cache Hit] ${url}`);
    return cachedData.data;
  }

  const response = await axios.get(url, options);
  cache.set(cacheKey, {
    data: response.data,
    timestamp: Date.now()
  });

  return response.data;
};

export const clearCache = () => {
  cache.clear();
};

// Simple debounce function for API calls
export const debounce = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};
