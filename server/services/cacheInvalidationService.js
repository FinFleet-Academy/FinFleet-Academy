import cacheService from './cacheService.js';
import logger from '../utils/logger.js';

class CacheInvalidationService {
  /**
   * Event-to-Key Mapping
   */
  EVENT_MAP = {
    'COURSE_UPDATED': (data) => [`course:${data.id}`, 'courses:list'],
    'CLASS_UPDATED': (data) => [`live_class:${data.id}`, 'live_classes:list'],
    'USER_UPDATED': (data) => [`user:${data.userId}`],
    'PAYMENT_COMPLETED': (data) => [
      `user:${data.userId}`, 
      'analytics:dashboard', 
      'live_classes:list'
    ],
    'MARKET_CONFIG_CHANGED': () => ['stocks:list', 'stocks:sectors']
  };

  /**
   * Invalidate cache based on high-level system event
   */
  async invalidateByEvent(eventName, data = {}) {
    try {
      const getKeys = this.EVENT_MAP[eventName];
      if (!getKeys) return;

      const keysToInvalidate = getKeys(data);
      
      for (const key of keysToInvalidate) {
        // Handle both exact keys and patterns
        if (key.includes('*')) {
          const matchedKeys = await cacheService.client.keys(key);
          if (matchedKeys.length > 0) {
            await cacheService.client.del(...matchedKeys);
          }
        } else {
          await cacheService.invalidate(key);
        }
      }

      logger.info(`Cache invalidated for event: ${eventName}`, { keys: keysToInvalidate });
    } catch (error) {
      logger.error('Cache Invalidation Error:', error);
    }
  }
}

export default new CacheInvalidationService();
