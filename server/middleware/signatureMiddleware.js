import crypto from 'crypto';
import logger from '../utils/logger.js';

/**
 * Request Signature Validation Middleware
 * Ensures sensitive admin mutations (delete, upgrade, broadcast)
 * carry a valid cryptographic signature to prevent MITM and replay attacks.
 */
export const validateSignature = (req, res, next) => {
  // Skip for non-mutating requests or development
  if (req.method === 'GET' || process.env.NODE_ENV === 'development') return next();

  const signature = req.headers['x-finfleet-signature'];
  const timestamp = req.headers['x-finfleet-timestamp'];

  if (!signature || !timestamp) {
    logger.warn('Security: Missing request signature or timestamp', { requestId: req.requestId });
    return res.status(401).json({ message: 'Security validation failed: Missing signature' });
  }

  // Prevent Replay Attacks (5 min window)
  const now = Date.now();
  if (Math.abs(now - parseInt(timestamp)) > 5 * 60 * 1000) {
    logger.warn('Security: Signature expired (Replay Attack?)', { requestId: req.requestId });
    return res.status(401).json({ message: 'Security validation failed: Signature expired' });
  }

  const secret = process.env.ADMIN_SIGNATURE_SECRET || 'dev_secret_do_not_use_in_prod';
  const bodyString = JSON.stringify(req.body);
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${timestamp}.${bodyString}`)
    .digest('hex');

  if (signature !== expectedSignature) {
    logger.error('Security: Invalid request signature!', { 
      requestId: req.requestId,
      ip: req.ip,
      path: req.path
    });
    return res.status(401).json({ message: 'Security validation failed: Invalid signature' });
  }

  next();
};
