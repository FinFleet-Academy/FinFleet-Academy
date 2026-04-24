import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5007;
const REDIS_URL = process.env.REDIS_URL;
let connection = null;

if (REDIS_URL) {
  connection = new IORedis(REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    retryStrategy: (times) => Math.min(times * 100, 10000)
  });

  connection.on('error', (err) => {
    if (err.code === 'ECONNREFUSED') return;
    console.error('Notification Service Redis Error:', err.message);
  });
} else {
  console.warn('🔔 Notification Service: REDIS_URL not set. Queue processing disabled.');
}

// Email Transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Notification Queue
const notificationQueue = new Queue('notifications', { connection });

// Notification Worker
const notificationWorker = new Worker('notifications', async (job) => {
  const { to, subject, html, text, type } = job.data;
  
  console.log(`Processing notification: ${type} to ${to}`);

  try {
    if (type === 'email') {
      await transporter.sendMail({
        from: `"FinFleet Academy" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
        html,
      });
    }
    // Add SMS / Push logic here in future
    return { success: true };
  } catch (error) {
    console.error('Notification Worker Failed:', error);
    throw error;
  }
}, { connection, concurrency: 5 });

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.post('/api/notifications/send', async (req, res) => {
  try {
    const { to, subject, html, text, type = 'email' } = req.body;
    const job = await notificationQueue.add('send_notification', { to, subject, html, text, type });
    res.json({ message: 'Notification queued', jobId: job.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ service: 'Notification Service', status: 'Healthy' });
});

app.listen(PORT, () => {
  console.log(`🔔 Notification Service running on port ${PORT}`);
});
