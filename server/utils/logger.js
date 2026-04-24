import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Middleware for logging response time
export const logResponseTime = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (duration > 500) {
      logger.warn(`Slow Request: ${req.method} ${req.originalUrl} - ${duration}ms`, {
        method: req.method,
        url: req.originalUrl,
        duration,
        status: res.statusCode
      });
    } else {
      logger.info(`${req.method} ${req.originalUrl} - ${duration}ms`, {
        method: req.method,
        url: req.originalUrl,
        duration,
        status: res.statusCode
      });
    }
  });
  next();
};

export default logger;
