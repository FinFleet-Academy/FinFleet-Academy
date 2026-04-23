import express from 'express';
import User from '../models/User.js';
import Trade from '../models/Trade.js';
import UserActivity from '../models/UserActivity.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/dashboard', protect, admin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTrades = await Trade.countDocuments();
    
    // Active users in last 24h
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const activeUsers = await UserActivity.distinct('user', { createdAt: { $gte: yesterday } });

    // Most active users by trade count
    const topTraders = await Trade.aggregate([
      { $group: { _id: '$user', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const populatedTopTraders = await User.populate(topTraders, { path: '_id', select: 'name email' });

    res.json({
      totalUsers,
      activeUsers: activeUsers.length,
      totalTrades,
      topTraders: populatedTopTraders.map(t => ({ user: t._id, count: t.count }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/user-insight/:userId', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('name email virtualBalance points lastMessageAt');
    const trades = await Trade.find({ user: req.params.userId }).sort({ createdAt: -1 }).limit(10);
    const activities = await UserActivity.find({ user: req.params.userId }).sort({ createdAt: -1 }).limit(10);
    
    res.json({ user, trades, activities });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/log-activity', protect, async (req, res) => {
  try {
    const { action, metadata } = req.body;
    await UserActivity.create({
      user: req.user._id,
      action,
      metadata
    });
    res.status(201).json({ success: true });
  } catch (error) {
    // Fail silently for activity logging
    res.status(200).json({ success: false });
  }
});

export default router;
