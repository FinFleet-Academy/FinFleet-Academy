import IORedis from 'ioredis';

/**
 * 📡 FinFleet Resilient Event Bus
 * Decentralized messaging backbone for the microservices cluster.
 */
class EventBus {
  constructor() {
    this.isEnabled = !!process.env.REDIS_URL;
    if (!this.isEnabled) {
      console.warn('[EventBus]: REDIS_URL not set. Event-driven features are disabled.');
      return;
    }

    this.redisUrl = process.env.REDIS_URL;
    const redisOptions = {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      retryStrategy: (times) => Math.min(times * 100, 10000)
    };

    this.publisher = new IORedis(this.redisUrl, redisOptions);
    this.subscriber = new IORedis(this.redisUrl, redisOptions);
    
    this.publisher.on('error', (err) => {
      if (err.code === 'ECONNREFUSED') return; // Silence connection noise
      console.error('[EventBus] Publisher Error:', err.message);
    });
    
    this.subscriber.on('error', (err) => {
      if (err.code === 'ECONNREFUSED') return;
      console.error('[EventBus] Subscriber Error:', err.message);
    });
  }

  /**
   * 📤 Broadcasts an event to all listening services
   */
  async publish(event, data) {
    if (!this.isEnabled) return;
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
    if (!this.isEnabled) return;
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
