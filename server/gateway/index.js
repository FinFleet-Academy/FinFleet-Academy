import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.GATEWAY_PORT || 5000;

// Security & Logging
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));

// Service Routes Mapping
const services = {
  auth: process.env.AUTH_SERVICE_URL || 'http://localhost:5001',
  user: process.env.USER_SERVICE_URL || 'http://localhost:5002',
  course: process.env.COURSE_SERVICE_URL || 'http://localhost:5003',
  payment: process.env.PAYMENT_SERVICE_URL || 'http://localhost:5004',
  market: process.env.MARKET_SERVICE_URL || 'http://localhost:5005',
  analytics: process.env.ANALYTICS_SERVICE_URL || 'http://localhost:5006',
  notifications: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:5007',
  live_classes: process.env.LIVE_CLASS_SERVICE_URL || 'http://localhost:5008',
};

// Proxy Middleware Setup
const createServiceProxy = (path, target) => {
  return app.use(path, createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: {
      [`^${path}`]: '', // Remove prefix when forwarding
    },
    onProxyReq: (proxyReq, req, res) => {
      if (req.user) {
        proxyReq.setHeader('x-user-id', req.user.id);
        proxyReq.setHeader('x-user-role', req.user.role);
      }
    },
    onProxyRes: (proxyRes, req, res) => {
      // 🔐 Global Privacy Guard: Mask sensitive fields in response
      const SENSITIVE_FIELDS = ['password', 'refreshTokens', 'signature', 'paymentId'];
      
      let body = [];
      proxyRes.on('data', (chunk) => body.push(chunk));
      proxyRes.on('end', () => {
        try {
          body = Buffer.concat(body).toString();
          if (body && proxyRes.headers['content-type']?.includes('application/json')) {
            const json = JSON.parse(body);
            const maskData = (obj) => {
              if (Array.isArray(obj)) return obj.map(maskData);
              if (obj !== null && typeof obj === 'object') {
                return Object.keys(obj).reduce((acc, key) => {
                  if (SENSITIVE_FIELDS.includes(key)) acc[key] = '[PROTECTED]';
                  else acc[key] = maskData(obj[key]);
                  return acc;
                }, {});
              }
              return obj;
            };
            res.send(JSON.stringify(maskData(json)));
          } else {
            res.send(body);
          }
        } catch (e) {
          res.end(body);
        }
      });
    }
  }));
};

// Route Requests to Services
createServiceProxy('/api/auth', services.auth);
createServiceProxy('/api/users', services.user);
createServiceProxy('/api/courses', services.course);
createServiceProxy('/api/payments', services.payment);
createServiceProxy('/api/market', services.market);
createServiceProxy('/api/analytics', services.analytics);
createServiceProxy('/api/notifications', services.notifications);
createServiceProxy('/api/live-classes', services.live_classes);

// Distributed Health Check
app.get('/api/admin/health', async (req, res) => {
  try {
    const checkService = async (name, url) => {
      try {
        const start = Date.now();
        const resp = await fetch(`${url}/health`);
        const duration = Date.now() - start;
        return { name, status: resp.ok ? 'Healthy' : 'Degraded', latency: duration };
      } catch (e) {
        return { name, status: 'Down', latency: 0 };
      }
    };

    const statuses = await Promise.all([
      checkService('Auth', services.auth),
      checkService('User', services.user),
      checkService('Course', services.course),
      checkService('Payment', services.payment),
      checkService('Market', services.market),
      checkService('Analytics', services.analytics),
      checkService('Notifications', services.notifications),
      checkService('Live Classes', services.live_classes),
    ]);

    res.json({
      gateway: 'Healthy',
      services: statuses,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({ message: 'Health check failed' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 FinFleet API Gateway running on port ${PORT}`);
});
