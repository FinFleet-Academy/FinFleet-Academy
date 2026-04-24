import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import IORedis from 'ioredis';

const redisUrl = process.env.REDIS_URL;
let redisClient;
let store;

if (redisUrl) {
  redisClient = new IORedis(redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    retryStrategy: (times) => Math.min(times * 100, 10000)
  });
  
  redisClient.on('error', (err) => {
    if (err.code === 'ECONNREFUSED') return;
    console.error('RateLimiter Redis Error:', err.message);
  });

  store = new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  });
}

// Helper to create a Redis-backed limiter with memory fallback
const createLimiter = (options) => rateLimit({
  ...options,
  store: store || undefined, // Fallback to memory store if store is null
  standardHeaders: true,
  legacyHeaders: false,
  validate: false,
});

/**
 * 🛡️ FinFleet Distributed Rate Limiting
 * Synchronized across all pods via Redis.
 */
export const apiLimiter = createLimiter({
  windowMs: 15 * 60 * 1000, 
  max: 200, 
  message: { message: 'Api frequency threshold reached.' }
});

export const authLimiter = createLimiter({
  windowMs: 60 * 60 * 1000, 
  max: 15, 
  message: { message: 'Security threshold: excessive login attempts. Try later.' }
});

export const userLimiter = createLimiter({
  windowMs: 15 * 60 * 1000, 
  max: 50, 
  keyGenerator: (req) => req.user?.id || req.ip,
  message: { message: 'Action frequency limit exceeded.' }
});

export const adminLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'High-frequency administrative load detected.' }
});
