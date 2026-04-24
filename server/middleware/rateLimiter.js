import rateLimit from 'express-rate-limit';

// Standard API limiter (Per IP)
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 200, 
  standardHeaders: true,
  legacyHeaders: false,
  validate: { default: false },
  message: {
    message: 'Too many requests from this IP, please try again later.'
  }
});

// Strict limiter for authentication (Login/Signup - Per IP)
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, 
  max: 15, 
  standardHeaders: true,
  legacyHeaders: false,
  validate: { default: false },
  message: {
    message: 'Too many authentication attempts, please try again after an hour.'
  },
  skipSuccessfulRequests: false
});

// Per-User Limiter (Sensitive Actions)
export const userLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 50, 
  validate: { default: false },
  keyGenerator: (req) => req.user?.id || req.ip, 
  message: {
    message: 'Action frequency limit exceeded for your account.'
  }
});

// Specialized limiter for Admin actions
export const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  validate: { default: false },
  message: {
    message: 'Excessive admin actions detected.'
  }
});
