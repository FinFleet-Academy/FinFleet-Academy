import mongoose from 'mongoose';
import Like from '../models/Like.js';

// Toggle like — returns new count and whether user now likes it
export const toggleLike = async (req, res) => {
  try {
    const { targetId, targetType } = req.body;
    if (!targetId || !targetType) return res.status(400).json({ message: 'targetId and targetType required' });

    const existing = await Like.findOne({ user: req.user.id, targetId, targetType });

    if (existing) {
      await existing.deleteOne();
      const count = await Like.countDocuments({ targetId, targetType });
      return res.json({ liked: false, count });
    }

    await Like.create({ user: req.user.id, targetId, targetType });
    const count = await Like.countDocuments({ targetId, targetType });
    return res.status(201).json({ liked: true, count });
  } catch (error) {
    if (error.code === 11000) {
      // Race condition duplicate — still return liked state
      const count = await Like.countDocuments({ targetId: req.body.targetId, targetType: req.body.targetType });
      return res.json({ liked: true, count });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Get like status + count for one target
export const getLikeStatus = async (req, res) => {
  try {
    const { targetId, targetType } = req.query;
    const [count, userLike] = await Promise.all([
      Like.countDocuments({ targetId, targetType }),
      Like.findOne({ user: req.user.id, targetId, targetType }),
    ]);
    res.json({ liked: !!userLike, count });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Bulk status check (for rendering lists efficiently)
export const getBulkLikeStatus = async (req, res) => {
  try {
    const { targetIds, targetType } = req.body;
    if (!Array.isArray(targetIds)) return res.status(400).json({ message: 'targetIds must be array' });

    // Convert string IDs to ObjectIds for the aggregation match
    const objectIds = targetIds.map(id => new mongoose.Types.ObjectId(id));

    const [counts, userLikes] = await Promise.all([
      Like.aggregate([
        { $match: { targetId: { $in: objectIds }, targetType } },
        { $group: { _id: '$targetId', count: { $sum: 1 } } }
      ]),
      Like.find({ user: req.user.id, targetId: { $in: targetIds }, targetType }).select('targetId'),
    ]);

    const likedSet = new Set(userLikes.map(l => l.targetId.toString()));
    const countMap = Object.fromEntries(counts.map(c => [c._id.toString(), c.count]));

    const result = targetIds.reduce((acc, id) => {
      acc[id] = { liked: likedSet.has(id), count: countMap[id] || 0 };
      return acc;
    }, {});

    res.json(result);
  } catch (error) {
    console.error('Bulk Like Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
