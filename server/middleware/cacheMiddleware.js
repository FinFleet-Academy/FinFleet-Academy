import cacheService, { TTL } from '../services/cacheService.js';

/**
 * Selective Cache Middleware
 * ONLY applies to: analytics, live-classes listings, market snapshots
 * NEVER caches: auth, payments, join class, admin mutations
 */
const CACHEABLE_ROUTES = [
  { pattern: /^\/api\/analytics\/dashboard$/, key: 'analytics:dashboard', ttl: TTL.ANALYTICS },
  { pattern: /^\/api\/live-classes$/, key: 'live_classes:list', ttl: TTL.LIVE_CLASSES },
  { pattern: /^\/api\/stocks\/snapshot/, key: 'market:snapshot', ttl: TTL.MARKET_SNAPSHOT },
];

export const cacheMiddleware = async (req, res, next) => {
  // Only cache GET requests
  if (req.method !== 'GET') return next();

  const match = CACHEABLE_ROUTES.find(r => r.pattern.test(req.path));
  if (!match) return next();

  const cached = await cacheService.get(match.key);
  if (cached) {
    res.setHeader('X-Cache', 'HIT');
    return res.json(cached);
  }

  // Intercept res.json to store response in cache
  const originalJson = res.json.bind(res);
  res.json = async (data) => {
    res.setHeader('X-Cache', 'MISS');
    await cacheService.set(match.key, data, match.ttl);
    return originalJson(data);
  };

  next();
};
