import User from '../models/User.js';
import Coupon from '../models/Coupon.js';
import Notification from '../models/Notification.js';
import Subscriber from '../models/Subscriber.js';
import Course from '../models/Course.js';
import Transaction from '../models/Transaction.js';

// ... (other controllers)

export const broadcastNotification = async (req, res) => {
  const { userEmail, message } = req.body;
  try {
    const notification = await Notification.create({ userEmail, message });
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find({}).sort({ createdAt: -1 });
    res.json(subscribers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserPlan = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.plan = req.body.plan || user.plan;
    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Coupon Management
export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({});
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCoupon = async (req, res) => {
  const { code, discountPercent } = req.body;
  try {
    const couponExists = await Coupon.findOne({ code });
    if (couponExists) return res.status(400).json({ message: 'Coupon already exists' });

    const coupon = await Coupon.create({ code, discountPercent });
    res.status(201).json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    res.json({ message: 'Coupon deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getAdminStats = async (req, res) => {
  try {
    const [
      userCount,
      subscriberCount,
      courseCount,
      transactions,
      recentUsers,
      recentNotifications
    ] = await Promise.all([
      User.countDocuments(),
      Subscriber.countDocuments(),
      Course.countDocuments(),
      Transaction.find({}),
      User.find({}).sort({ createdAt: -1 }).limit(5).select('-password'),
      Notification.find({}).sort({ createdAt: -1 }).limit(5)
    ]);

    const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);

    res.json({
      summary: {
        totalUsers: userCount,
        totalSubscribers: subscriberCount,
        totalCourses: courseCount,
        totalRevenue: totalRevenue
      },
      recentActivity: {
        users: recentUsers,
        notifications: recentNotifications
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
