import Razorpay from 'razorpay';
import crypto from 'crypto';
import User from '../models/User.js';

const PLAN_PRICES = {
  'PRO': 19900,         // ₹199 in paise
  'ELITE': 69900,       // ₹699 in paise
  'ELITE PRIME': 199900 // ₹1999 in paise
};

export const createOrder = async (req, res) => {
  try {
    const { plan } = req.body;
    const amount = PLAN_PRICES[plan];

    if (!amount) {
      return res.status(400).json({ message: 'Invalid plan selected' });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);

  } catch (error) {
    console.error('Razorpay Order Error:', error);
    res.status(500).json({ message: 'Failed to create payment order' });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      plan 
    } = req.body;

    const userId = req.user.id;

    // Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment successful - Update user plan
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      user.plan = plan;
      // You could also save payment_id here for tracking
      await user.save();

      res.json({ 
        success: true, 
        message: 'Payment verified successfully! Plan upgraded.',
        plan: user.plan
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

  } catch (error) {
    console.error('Razorpay Verification Error:', error);
    res.status(500).json({ message: 'Failed to verify payment' });
  }
};
