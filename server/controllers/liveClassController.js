import liveClassService from '../services/liveClassService.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import logger from '../utils/logger.js';
import LiveClass from '../models/LiveClass.js';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_mock_secret',
});

// Admin: Create Live Class
export const createLiveClass = async (req, res) => {
  try {
    const { title, description, instructor, scheduledTime, duration, platform, classType, price, meetingLink } = req.body;
    const newClass = await liveClassService.createClass({
      title, description, instructor, scheduledTime, duration, platform, classType, 
      price: classType === 'paid' ? price : 0, meetingLink
    });
    res.status(201).json(newClass);
  } catch (error) {
    logger.error('Error creating live class:', error);
    res.status(500).json({ message: error.message });
  }
};

// User: Get All Live Classes
export const getLiveClasses = async (req, res) => {
  try {
    const classes = await liveClassService.getAllClasses();
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// User: Join Live Class (Secure Gate)
export const joinLiveClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { allowed, liveClass, message, requiresPayment } = await liveClassService.checkAccess(req.user._id, id);

    if (!allowed) {
      return res.status(requiresPayment ? 403 : 404).json({ message, requiresPayment, price: liveClass?.price });
    }

    // Generate Secure Session Token for the join link
    const { token } = liveClassService.generateJoinToken(req.user._id, id, req.ip);

    res.json({ 
      platform: liveClass.platform, 
      joinUrl: `${liveClass.meetingLink}?session_token=${token}`,
      expiresIn: '10m'
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// User: Create Payment Order
export const createPaymentOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const liveClass = await LiveClass.findById(id);

    if (!liveClass || liveClass.classType !== 'paid') {
      return res.status(400).json({ message: 'Invalid class for payment' });
    }

    const options = {
      amount: liveClass.price * 100, // in paisa
      currency: 'INR',
      receipt: `receipt_live_${id}_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    
    // Create pending enrollment
    await Enrollment.findOneAndUpdate(
      { user: req.user._id, class: id },
      { orderId: order.id, paymentStatus: 'pending' },
      { upsert: true, new: true }
    );

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
