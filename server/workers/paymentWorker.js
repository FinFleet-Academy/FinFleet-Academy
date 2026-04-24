import { Worker } from 'bullmq';
import Enrollment from '../models/Enrollment.js';
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';
import { emailQueue, addJob } from '../services/queueService.js';
import cacheInvalidationService from '../services/cacheInvalidationService.js';
import logger from '../utils/logger.js';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

const paymentWorker = new Worker('payments', async (job) => {
  const { transactionId, userId, classId, amount, status } = job.data;
  
  logger.info(`Processing payment for transaction: ${transactionId}`, { jobId: job.id });

  try {
    if (status === 'completed') {
      // 1. Update Transaction
      await Transaction.findOneAndUpdate(
        { transactionId },
        { status: 'completed', amount },
        { upsert: true }
      );

      // 2. Create/Update Enrollment
      await Enrollment.findOneAndUpdate(
        { user: userId, class: classId },
        { paymentStatus: 'completed', enrolledAt: new Date() },
        { upsert: true }
      );

      // 3. Update User Plan if applicable
      const user = await User.findById(userId);
      if (user && amount >= 999) { // Threshold for Prime
        user.plan = 'prime';
        await user.save();
      }

      // 4. Invalidate Cache
      await cacheInvalidationService.invalidateByEvent('PAYMENT_COMPLETED', { userId, classId });

      // 5. Queue Receipt Email
      await addJob(emailQueue, 'send_receipt', {
        to: user.email,
        subject: 'Payment Successful - FinFleet Academy',
        html: `<h1>Thank you for your purchase!</h1><p>You are now enrolled in the class.</p>`
      });

    }
    
    return { success: true };
  } catch (error) {
    logger.error('Payment Worker Failed:', error);
    throw error;
  }
}, {
  connection: { url: REDIS_URL },
  concurrency: 2, // Keep low for DB consistency
});

export default paymentWorker;
