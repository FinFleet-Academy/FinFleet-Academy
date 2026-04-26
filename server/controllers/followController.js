import Follow from '../models/Follow.js';
import User from '../models/User.js';

// Follow a user
import Notification from '../models/Notification.js';
import { sendRealTimeNotification } from '../socket/notificationSocket.js';

export const followUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (userId === req.user.id) return res.status(400).json({ message: "You cannot follow yourself" });

    const existing = await Follow.findOne({ follower: req.user.id, following: userId });
    if (existing) return res.status(400).json({ message: "Already following" });

    await Follow.create({ follower: req.user.id, following: userId });

    // Create Notification
    const followerUser = await User.findById(req.user.id).select('name');
    const notification = await Notification.create({
      userId,
      senderId: req.user.id,
      title: 'New Follower',
      message: `${followerUser.name} started following you`,
      type: 'social',
      link: `/user/${req.user.id}`
    });

    // Real-time push
    sendRealTimeNotification(userId, notification);

    res.status(201).json({ message: "Followed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Unfollow a user
export const unfollowUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await Follow.findOneAndDelete({ follower: req.user.id, following: userId });
    res.json({ message: "Unfollowed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get followers of a user
export const getFollowers = async (req, res) => {
  try {
    const { userId } = req.params;
    const followers = await Follow.find({ following: userId }).populate('follower', 'name email profileImage');
    res.json(followers.map(f => f.follower));
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get users this user is following
export const getFollowing = async (req, res) => {
  try {
    const { userId } = req.params;
    const following = await Follow.find({ follower: userId }).populate('following', 'name email profileImage');
    res.json(following.map(f => f.following));
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Discover users (search + suggestions)
export const discoverUsers = async (req, res) => {
  try {
    const { search } = req.query;
    let followingIds = [];
    let userId = req.user?.id;

    if (userId) {
      const myFollowing = await Follow.find({ follower: userId }).select('following');
      followingIds = myFollowing.map(f => f.following.toString());
    }

    let query = userId ? { _id: { $ne: userId } } : {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const users = await User.find(query).select('name email profileImage plan').limit(20);
    const usersWithStatus = users.map(u => ({
      ...u.toObject(),
      isFollowing: followingIds.includes(u._id.toString()),
    }));

    res.json(usersWithStatus);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get current user's social data (followers & following)
export const getMySocial = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const [followers, following] = await Promise.all([
      Follow.find({ following: userId }).populate('follower', 'name email profileImage plan').lean(),
      Follow.find({ follower: userId }).populate('following', 'name email profileImage plan').lean()
    ]);

    res.json({
      followers: followers.map(f => f.follower),
      following: following.map(f => f.following)
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
