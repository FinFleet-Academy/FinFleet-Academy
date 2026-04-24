import express from 'express';
import { createOrder, verifyPayment } from '../controllers/transactionController.js';

const router = express.Router();

router.post('/order', createOrder);
router.post('/verify', verifyPayment);

export default router;
