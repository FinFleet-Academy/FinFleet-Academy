import winston from 'winston';

import { v4 as uuidv4 } from 'uuid';
import metricsService from '../monitoring/metricsService.js';

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'finfleet-api' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, requestId, ...meta }) => {
          return `${timestamp} [${requestId || 'SYSTEM'}] ${level}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
        })
      ),
    }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Middleware for request tracing and response time
export const requestTracer = (req, res, next) => {
  const requestId = req.headers['x-request-id'] || uuidv4();
  req.requestId = requestId;
  res.setHeader('X-Request-ID', requestId);

  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      requestId,
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip
    };

    if (duration > 500) {
      logger.warn(`Slow Request: ${req.method} ${req.originalUrl}`, logData);
    } else {
      logger.info(`${req.method} ${req.originalUrl}`, logData);
    }

    // Track metrics in background
    metricsService.trackRequest(req.method, req.originalUrl, res.statusCode, duration);
  });
  next();
};

export default logger;
