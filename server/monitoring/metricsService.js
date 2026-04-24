import cacheService from '../services/cacheService.js';
import logger from '../utils/logger.js';

class MetricsService {
  constructor() {
    this.prefix = 'metrics:';
    this.WINDOW_SIZE = 3600; // 1 hour of metrics history
  }

  /**
   * Track API Latency and Status
   */
  async trackRequest(method, path, statusCode, duration) {
    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const key = `${this.prefix}requests:${timestamp}`;

      const multi = cacheService.client.multi();
      
      // Store request metadata
      multi.hincrby(key, 'total', 1);
      multi.hincrby(key, `status:${statusCode}`, 1);
      multi.hincrby(key, 'duration_total', duration);
      
      // Keep track of slow requests
      if (duration > 500) {
        multi.lpush(`${this.prefix}slow_requests`, JSON.stringify({
          method, path, statusCode, duration, timestamp: Date.now()
        }));
        multi.ltrim(`${this.prefix}slow_requests`, 0, 99); // Keep last 100 slow requests
      }

      // Expire metric key after 2 hours
      multi.expire(key, 7200);
      
      await multi.exec();
    } catch (error) {
      logger.error('Metrics Tracking Error:', error);
    }
  }

  /**
   * Get Real-time System Health Stats
   */
  async getSystemHealth() {
    try {
      const now = Math.floor(Date.now() / 1000);
      const last5MinKeys = Array.from({ length: 5 }, (_, i) => `${this.prefix}requests:${now - (i * 60)}`);
      
      let totalReq = 0;
      let errorReq = 0;
      let totalDuration = 0;

      for (const key of last5MinKeys) {
        const stats = await cacheService.client.hgetall(key);
        if (stats.total) {
          totalReq += parseInt(stats.total);
          totalDuration += parseInt(stats.duration_total || 0);
          
          Object.keys(stats).forEach(k => {
            if (k.startsWith('status:5')) errorReq += parseInt(stats[k]);
          });
        }
      }

      return {
        latency: totalReq > 0 ? (totalDuration / totalReq).toFixed(2) : 0,
        errorRate: totalReq > 0 ? ((errorReq / totalReq) * 100).toFixed(2) : 0,
        requestCount: totalReq,
        status: errorReq / totalReq > 0.05 ? 'Degraded' : 'Healthy'
      };
    } catch (error) {
      return { status: 'Unknown', error: error.message };
    }
  }
}

export default new MetricsService();
