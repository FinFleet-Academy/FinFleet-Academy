import metricsService from '../monitoring/metricsService.js';
import { emailQueue, paymentQueue, analyticsQueue } from '../services/queueService.js';
import logger from '../utils/logger.js';

/**
 * Get Platform Health Metrics
 */
export const getPlatformHealth = async (req, res) => {
  try {
    const [metrics, emailJobs, paymentJobs, analyticsJobs] = await Promise.all([
      metricsService.getSystemHealth(),
      emailQueue.getJobCounts('wait', 'active', 'failed'),
      paymentQueue.getJobCounts('wait', 'active', 'failed'),
      analyticsQueue.getJobCounts('wait', 'active', 'failed'),
    ]);

    res.json({
      metrics,
      queues: {
        email: emailJobs,
        payments: paymentJobs,
        analytics: analyticsJobs
      },
      system: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        nodeVersion: process.version
      }
    });
  } catch (error) {
    logger.error('Health Controller Error:', error);
    res.status(500).json({ message: 'Failed to fetch health metrics' });
  }
};
