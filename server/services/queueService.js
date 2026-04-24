import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import logger from '../utils/logger.js';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const connection = new IORedis(REDIS_URL, {
  maxRetriesPerRequest: null, // Required by BullMQ
});

connection.on('error', (err) => {
  logger.error('Redis Queue Connection Error:', err);
});

// Initialize Queues
export const emailQueue = new Queue('email', { connection });
export const paymentQueue = new Queue('payments', { connection });
export const analyticsQueue = new Queue('analytics', { connection });
export const notificationQueue = new Queue('notifications', { connection });

/**
 * Add job to queue with consistent error handling
 */
export const addJob = async (queue, name, data, opts = {}) => {
  try {
    const job = await queue.add(name, data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
      ...opts,
    });
    logger.info(`Job added to ${queue.name} queue: ${name}`, { jobId: job.id });
    return job;
  } catch (error) {
    logger.error(`Failed to add job to ${queue.name} queue:`, error);
    throw error;
  }
};

export default {
  emailQueue,
  paymentQueue,
  analyticsQueue,
  notificationQueue,
  addJob,
};
