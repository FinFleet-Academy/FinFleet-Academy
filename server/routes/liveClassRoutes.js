import express from 'express';
import { 
  createLiveClass, 
  getLiveClasses, 
  joinLiveClass, 
  createPaymentOrder 
} from '../controllers/liveClassController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { z } from 'zod';

const router = express.Router();

// Validation Schemas
const createClassSchema = z.object({
  body: z.object({
    title: z.string().min(5),
    description: z.string().min(10),
    instructor: z.string(),
    scheduledTime: z.string(),
    duration: z.number().optional(),
    platform: z.enum(['google_meet', 'zoom']),
    classType: z.enum(['free', 'paid']),
    price: z.number().nonnegative(),
    meetingLink: z.string().url(),
  }),
});

// Admin Routes
router.post('/', protect, admin, validate(createClassSchema), createLiveClass);

// Public/User Routes
router.get('/', getLiveClasses);
router.post('/:id/join', protect, joinLiveClass);
router.post('/:id/pay', protect, createPaymentOrder);

export default router;
