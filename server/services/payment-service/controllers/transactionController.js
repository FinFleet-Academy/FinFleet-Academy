import Transaction from '../models/Transaction.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import axios from 'axios';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', classId } = req.body;
    const userId = req.headers['x-user-id'];

    const options = {
      amount: amount * 100, // in paise
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    await Transaction.create({
      user: userId,
      amount,
      currency,
      orderId: order.id,
      classId,
      status: 'pending'
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const userId = req.headers['x-user-id'];

    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest('hex');

    if (generated_signature === razorpay_signature) {
      const transaction = await Transaction.findOneAndUpdate(
        { orderId: razorpay_order_id },
        { status: 'completed', paymentId: razorpay_payment_id, signature: razorpay_signature },
        { new: true }
      );

      // EMIT EVENT: Notify other services (Enrollment, Analytics)
      // For now, we'll use a placeholder for the Event Bus call
      console.log(`Payment Verified for ${userId}. Emitting EVENT: PAYMENT_COMPLETED`);
      
      // In a real K8s setup, this would go to a Redis/Kafka bus.
      // placeholder: notify user-service to update plan/enrollment
      await axios.post(`${process.env.USER_SERVICE_URL || 'http://user-service:5002'}/api/users/internal/enroll`, {
        userId,
        classId: transaction.classId,
        transactionId: transaction._id
      }).catch(err => console.error('Failed to notify User Service:', err.message));

      res.json({ status: 'success', transaction });
    } else {
      res.status(400).json({ status: 'failure', message: 'Invalid signature' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  createOrder,
  verifyPayment
};
