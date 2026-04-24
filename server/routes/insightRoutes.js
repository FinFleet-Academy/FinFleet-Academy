import express from 'express';
import { getTodayInsight, createInsight, getAllInsights } from '../controllers/insightController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/today').get(getTodayInsight);
router.route('/').get(protect, admin, getAllInsights).post(protect, admin, createInsight);

export default router;
