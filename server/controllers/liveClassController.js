import LiveClass from '../models/LiveClass.js';
import Enrollment from '../models/Enrollment.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import logger from '../utils/logger.js';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_mock_secret',
});

// Admin: Create Live Class
export const createLiveClass = async (req, res) => {
  try {
    const { title, description, instructor, scheduledTime, duration, platform, classType, price, meetingLink } = req.body;
    
    const newClass = await LiveClass.create({
      title,
      description,
      instructor,
      scheduledTime,
      duration,
      platform,
      classType,
      price: classType === 'paid' ? price : 0,
      meetingLink,
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
    const classes = await LiveClass.find({ status: { $ne: 'cancelled' } })
      .sort({ scheduledTime: 1 })
      .select('-meetingLink'); // Hide link initially
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// User: Join Live Class (Secure Gate)
export const joinLiveClass = async (req, res) => {
  try {
    const { id } = req.params;
    const liveClass = await LiveClass.findById(id);

    if (!liveClass) return res.status(404).json({ message: 'Class not found' });

    // 1. If Free, anyone can join
    if (liveClass.classType === 'free') {
      return res.json({ 
        platform: liveClass.platform, 
        joinUrl: liveClass.meetingLink 
      });
    }

    // 2. If Paid, check enrollment
    const enrollment = await Enrollment.findOne({ 
      user: req.user._id, 
      class: id, 
      paymentStatus: 'completed' 
    });

    if (!enrollment) {
      return res.status(403).json({ 
        message: 'Payment required to join this class', 
        requiresPayment: true,
        price: liveClass.price 
      });
    }

    // Mark Attendance
    enrollment.attendanceStatus = 'present';
    await enrollment.save();

    res.json({ 
      platform: liveClass.platform, 
      joinUrl: liveClass.meetingLink 
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
