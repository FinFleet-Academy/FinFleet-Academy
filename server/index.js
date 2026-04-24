import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import dotenv from 'dotenv';
import compression from 'compression';
import path from 'path';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { initMarketSocket } from './socket/marketSocket.js';
import marketDataService from './services/marketDataService.js';
import { apiLimiter, authLimiter } from './middleware/rateLimiter.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import subscriberRoutes from './routes/subscriberRoutes.js';
import newsRoutes from './routes/newsRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import helpRoutes from './routes/helpRoutes.js';
import bookmarkRoutes from './routes/bookmarkRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import insightRoutes from './routes/insightRoutes.js';
import communityChatRoutes from './routes/communityChatRoutes.js';
import followRoutes from './routes/followRoutes.js';
import privateChatRoutes from './routes/privateChatRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';
import likeRoutes from './routes/likeRoutes.js';
import tradeRoutes from './routes/tradeRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import liveClassRoutes from './routes/liveClassRoutes.js';
import stockRoutes from './routes/stockRoutes.js';
import auditRoutes from './routes/auditRoutes.js';
import stockSimulator from './services/stockSimulator.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { logResponseTime } from './utils/logger.js';

dotenv.config();

const app = express();
app.use(logResponseTime);
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Trust proxy for Render/Cloudflare to get correct client IPs
app.set('trust proxy', 1);

// Enable Compression (Gzip/Brotli)
app.use(compression());
app.use(cookieParser());

const allowedOrigins = [
  'https://finfleetacademy.com',
  'https://www.finfleetacademy.com',
  'https://finfleet-academy.onrender.com',
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.error(`CORS Blocked for origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Security Hardening
app.use(helmet({
  contentSecurityPolicy: false, // Set to false if you're serving a React SPA from same domain
}));
app.use(mongoSanitize());
app.use(xss());

app.use(express.json({ limit: '10kb' }));

// Global API Limiter
app.use('/api', apiLimiter);

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
    memoryUsage: process.memoryUsage().heapUsed,
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/', (req, res) => {
  res.send('FinFleet Backend API is running...');
});

// Routes
app.use('/api/auth', authLimiter, authRoutes); // Apply strict limiter to auth
app.use('/api/user', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/subscribers', subscriberRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/help', helpRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/insights', insightRoutes);
app.use('/api/community-chat', communityChatRoutes);
app.use('/api/follow', followRoutes);
app.use('/api/private-chat', privateChatRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/trade', tradeRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/live-classes', liveClassRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/audit', auditRoutes);

// Static Asset Caching & Serving (Production)
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../dist');
  
  // Serve static assets with long-term caching
  app.use(express.static(distPath, {
    maxAge: '1y',
    etag: true,
    setHeaders: (res, path) => {
      if (path.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache'); // HTML should not be cached long-term
      }
    }
  }));

  // SPA fallback
  app.get('*', (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Error Handling
app.use(notFound);
app.use(errorHandler);

// MongoDB Connection
const httpServer = createServer(app);
initMarketSocket(httpServer);

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/finfleet')
  .then(() => {
    console.log('Connected to MongoDB');
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      // Start Simulation Engines
      stockSimulator.startSimulation();
      marketDataService.connect();
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
