import jwt from 'jsonwebtoken';

/**
 * 🔐 FinFleet Distributed Auth Middleware
 * Optimized for Microservices: Prioritizes Gateway-injected headers to reduce DB load.
 */
export const protect = async (req, res, next) => {
  // 1. Check for Gateway Headers (Injected by API Gateway after JWT verification)
  const gatewayUserId = req.headers['x-user-id'];
  const gatewayUserRole = req.headers['x-user-role'];

  if (gatewayUserId) {
    req.user = { id: gatewayUserId, _id: gatewayUserId, role: gatewayUserRole, isAdmin: gatewayUserRole === 'admin' };
    return next();
  }

  // 2. Fallback: Direct JWT verification (for local development or direct service access)
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'finfleet_super_secret_key_123!');
      
      // Note: In a true microservice, we avoid importing models from other services.
      // We assume the user info is either in the JWT or the Gateway headers.
      req.user = { id: decoded.id, _id: decoded.id, role: decoded.role, isAdmin: decoded.role === 'admin' };
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Session expired or invalid' });
    }
  }

  return res.status(401).json({ message: 'Authentication required' });
};

export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Administrator privileges required' });
  }
};

/**
 * 🔓 Optional Auth Middleware
 * Attaches user context if present, but allows guest access.
 */
export const optionalProtect = async (req, res, next) => {
  const gatewayUserId = req.headers['x-user-id'];
  const gatewayUserRole = req.headers['x-user-role'];

  if (gatewayUserId) {
    req.user = { id: gatewayUserId, _id: gatewayUserId, role: gatewayUserRole, isAdmin: gatewayUserRole === 'admin' };
    return next();
  }

  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'finfleet_super_secret_key_123!');
      req.user = { id: decoded.id, _id: decoded.id, role: decoded.role, isAdmin: decoded.role === 'admin' };
    } catch (error) {
      // Ignore errors for optional auth
    }
  }
  
  next();
};
