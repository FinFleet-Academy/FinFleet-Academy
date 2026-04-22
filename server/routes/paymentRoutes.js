import express from 'express';
import { createOrder, verifyPayment } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

import { validatePayment } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.post('/create-order', protect, validatePayment, createOrder);
router.post('/verify-payment', protect, verifyPayment);

export default router;
