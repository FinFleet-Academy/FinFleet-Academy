/**
 * 🔐 FinFleet Privacy Middleware
 * Enterprise-grade data masking and field protection.
 */

const SENSITIVE_FIELDS = ['password', 'refreshTokens', 'signature', 'paymentId'];

export const privacyGuard = (req, res, next) => {
  const originalJson = res.json;

  res.json = function (data) {
    if (data && typeof data === 'object') {
      const maskData = (obj) => {
        if (Array.isArray(obj)) return obj.map(maskData);
        if (obj !== null && typeof obj === 'object') {
          return Object.keys(obj).reduce((acc, key) => {
            if (SENSITIVE_FIELDS.includes(key)) {
              acc[key] = '[PROTECTED]';
            } else {
              acc[key] = maskData(obj[key]);
            }
            return acc;
          }, {});
        }
        return obj;
      };

      // Only mask if it's a production log or specific debug flag
      // In this SaaS context, we always mask for the frontend to prevent accidental leaks
      data = maskData(data);
    }
    return originalJson.call(this, data);
  };

  next();
};

export default privacyGuard;
