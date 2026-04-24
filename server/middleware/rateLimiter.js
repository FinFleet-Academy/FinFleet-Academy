import rateLimit from 'express-rate-limit';

// Standard API limiter (Per IP)
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many requests from this IP, please try again later.'
  }
});

// Strict limiter for authentication (Login/Signup - Per IP)
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 15, // Limit each IP to 15 attempts per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many authentication attempts, please try again after an hour.'
  },
  skipSuccessfulRequests: false // Security: count all attempts
});

// Per-User Limiter (Sensitive Actions)
export const userLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each user to 50 sensitive requests per 15 mins
  keyGenerator: (req) => req.user?.id || req.ip, // Use user ID if available, else IP
  message: {
    message: 'Action frequency limit exceeded for your account.'
  }
});

// Specialized limiter for Admin actions
export const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    message: 'Excessive admin actions detected.'
  }
});
