import { Worker } from 'bullmq';
import nodemailer from 'nodemailer';
import logger from '../utils/logger.js';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const emailWorker = new Worker('email', async (job) => {
  const { to, subject, html, text } = job.data;
  
  logger.info(`Processing email to: ${to}`, { jobId: job.id });

  try {
    const info = await transporter.sendMail({
      from: `"FinFleet Academy" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
    
    logger.info(`Email sent successfully: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error('Email Worker Failed:', error);
    throw error; // Trigger retry
  }
}, {
  connection: { url: REDIS_URL },
  concurrency: 5,
});

emailWorker.on('completed', (job) => {
  logger.info(`Email job ${job.id} completed`);
});

emailWorker.on('failed', (job, err) => {
  logger.error(`Email job ${job.id} failed:`, err);
});

export default emailWorker;
