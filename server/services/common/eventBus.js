import IORedis from 'ioredis';

/**
 * 📡 FinFleet Resilient Event Bus
 * Decentralized messaging backbone for the microservices cluster.
 */
class EventBus {
  constructor() {
    this.redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    this.publisher = new IORedis(this.redisUrl, { retryStrategy: (times) => Math.min(times * 50, 2000) });
    this.subscriber = new IORedis(this.redisUrl, { retryStrategy: (times) => Math.min(times * 50, 2000) });
    
    this.publisher.on('error', (err) => console.error('[EventBus] Publisher Error:', err));
    this.subscriber.on('error', (err) => console.error('[EventBus] Subscriber Error:', err));
  }

  /**
   * 📤 Broadcasts an event to all listening services
   */
  async publish(event, data) {
    try {
      const payload = JSON.stringify({
        event,
        data,
        metadata: {
          timestamp: new Date().toISOString(),
          service: process.env.SERVICE_NAME || 'unknown',
          correlationId: data.correlationId || null
        }
      });
      await this.publisher.publish('finfleet:events', payload);
    } catch (error) {
      console.error(`[EventBus] Publish Failed for ${event}:`, error);
    }
  }

  /**
   * 📥 Subscribes to the platform-wide event stream
   */
  subscribe(callback) {
    this.subscriber.subscribe('finfleet:events');
    this.subscriber.on('message', (channel, message) => {
      if (channel === 'finfleet:events') {
        try {
          const { event, data, metadata } = JSON.parse(message);
          callback(event, data, metadata);
        } catch (e) {
          console.error('[EventBus] Serialization Error:', e);
        }
      }
    });
  }
}

export default new EventBus();
