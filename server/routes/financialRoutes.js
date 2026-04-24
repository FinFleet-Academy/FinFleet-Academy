import express from 'express';
const router = express.Router();
import * as financialController from '../controllers/financialController.js';
import { protect } from '../middleware/authMiddleware.js';
import rateLimit from 'express-rate-limit';

const eligibilityLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10,
  message: "Too many eligibility checks, please try again after 15 minutes."
});

router.get('/cards', protect, financialController.getCreditCards);
router.post('/eligibility', protect, eligibilityLimiter, financialController.checkEligibility);
router.get('/offers', protect, financialController.getOffers);
router.post('/track-click', protect, financialController.logAffiliateClick);

export default router;
