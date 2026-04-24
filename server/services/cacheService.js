import { createClient } from 'redis';
import logger from '../utils/logger.js';

// TTL strategy per data type (seconds)
export const TTL = {
  ANALYTICS: 300,       // 5 min - pre-aggregated dashboard stats
  LIVE_CLASSES: 60,     // 1 min - class listings (invalidated on mutation)
  MARKET_SNAPSHOT: 10,  // 10 sec - market data snapshots
  USER_PROFILE: 120,    // 2 min - user profiles (invalidated on update)
};

// Cache version for key rotation
const CACHE_VERSION = 'v1';

class CacheService {
  constructor() {
    this.client = null;
    this.isConnected = false;
  }

  async connect() {
    if (!process.env.REDIS_URL) {
      logger.warn('CacheService: REDIS_URL not set. Caching disabled.');
      return;
    }
    try {
      this.client = createClient({ url: process.env.REDIS_URL });
      this.client.on('error', (err) => logger.error('Redis Client Error:', err));
      this.client.on('connect', () => {
        this.isConnected = true;
        logger.info('CacheService: Connected to Redis');
      });
      this.client.on('end', () => {
        this.isConnected = false;
        logger.warn('CacheService: Redis connection closed');
      });
      await this.client.connect();
    } catch (err) {
      logger.error('CacheService: Failed to connect to Redis:', err.message);
      this.isConnected = false;
    }
  }

  _buildKey(key) {
    return `${CACHE_VERSION}:${key}`;
  }

  async get(key) {
    if (!this.isConnected) return null;
    try {
      const data = await this.client.get(this._buildKey(key));
      return data ? JSON.parse(data) : null;
    } catch (err) {
      logger.error(`CacheService.get error [${key}]:`, err.message);
      return null;
    }
  }

  async set(key, value, ttlSeconds) {
    if (!this.isConnected) return;
    try {
      await this.client.setEx(this._buildKey(key), ttlSeconds, JSON.stringify(value));
    } catch (err) {
      logger.error(`CacheService.set error [${key}]:`, err.message);
    }
  }

  // Invalidate a single key or a pattern prefix
  async invalidate(keyOrPattern) {
    if (!this.isConnected) return;
    try {
      const fullKey = this._buildKey(keyOrPattern);
      // If pattern, scan and delete
      if (keyOrPattern.includes('*')) {
        const keys = await this.client.keys(fullKey);
        if (keys.length > 0) {
          await this.client.del(keys);
          logger.info(`CacheService: Invalidated ${keys.length} keys matching ${fullKey}`);
        }
      } else {
        await this.client.del(fullKey);
      }
    } catch (err) {
      logger.error(`CacheService.invalidate error [${keyOrPattern}]:`, err.message);
    }
  }

  // Pub/Sub for horizontal socket scaling
  async createPublisher() {
    if (!process.env.REDIS_URL) return null;
    const pub = createClient({ url: process.env.REDIS_URL });
    await pub.connect();
    return pub;
  }

  async createSubscriber() {
    if (!process.env.REDIS_URL) return null;
    const sub = createClient({ url: process.env.REDIS_URL });
    await sub.connect();
    return sub;
  }
}

export const cacheService = new CacheService();
export default cacheService;
