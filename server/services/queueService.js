import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import logger from '../utils/logger.js';

const REDIS_URL = process.env.REDIS_URL;
let connection = null;

if (REDIS_URL) {
  connection = new IORedis(REDIS_URL, {
    maxRetriesPerRequest: null, // Required by BullMQ
    enableReadyCheck: false,
    retryStrategy: (times) => Math.min(times * 100, 10000)
  });

  connection.on('error', (err) => {
    if (err.code === 'ECONNREFUSED') return;
    logger.error('Redis Queue Connection Error:', err.message);
  });
} else {
  logger.warn('QueueService: REDIS_URL not set. Queues will not be functional.');
}

// Initialize Queues — only if connection is available
export const emailQueue = connection ? new Queue('email', { connection }) : null;
export const paymentQueue = connection ? new Queue('payments', { connection }) : null;
export const analyticsQueue = connection ? new Queue('analytics', { connection }) : null;
export const notificationQueue = connection ? new Queue('notifications', { connection }) : null;

/**
 * Add job to queue with consistent error handling
 */
export const addJob = async (queue, name, data, opts = {}) => {
  if (!queue) {
    logger.warn(`Skipping job '${name}': Queue is disabled (No Redis)`);
    return null;
  }
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
