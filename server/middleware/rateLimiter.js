import rateLimit from 'express-rate-limit';

// Standard API limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many requests from this IP, please try again after 15 minutes'
  }
});

// Strict limiter for authentication (Login/Signup)
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 login/signup attempts per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many authentication attempts, please try again after an hour'
  },
  skipSuccessfulRequests: true // Don't count successful logins
});

// Specialized limiter for Admin actions
export const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: {
    message: 'Excessive admin actions detected'
  }
});
