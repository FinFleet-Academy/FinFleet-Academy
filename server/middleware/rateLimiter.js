import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import IORedis from 'ioredis';

const redisClient = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379');

// Helper to create a Redis-backed limiter
const createLimiter = (options) => rateLimit({
  ...options,
  store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  }),
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
