import User from '../models/User.js';
import Follow from '../models/Follow.js';
import Certificate from '../models/Certificate.js';
import mongoose from 'mongoose';

/**
 * 🔒 Privacy Filtering Engine
 * Filters user fields based on viewer relationship.
 */
const filterProfileByPrivacy = (user, viewerId) => {
  const isOwner = viewerId && viewerId.toString() === user._id.toString();
  const isFollower = user.isFollowedByViewer; // Assume this is pre-calculated

  const filtered = user.toObject ? user.toObject() : { ...user };
  const fields = ['email', 'mobile', 'social', 'stats', 'certificates'];

  fields.forEach(field => {
    const visibility = user.privacy?.[field] || 'PRIVATE';
    
    if (isOwner) return; // Owner sees everything

    if (visibility === 'PRIVATE') {
      delete filtered[field];
      if (field === 'social') delete filtered.socialLinks;
    } else if (visibility === 'FOLLOWERS' && !isFollower) {
      delete filtered[field];
      if (field === 'social') delete filtered.socialLinks;
    }
  });

  // Always remove sensitive internal fields
  delete filtered.password;
  delete filtered.refreshTokens;
  
  return filtered;
};

// --- Profile Controllers ---

export const getProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const viewerId = req.user?.id;

    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) return res.status(404).json({ message: 'Identity not found' });

    // Check if viewer follows this user
    let isFollowed = false;
    if (viewerId) {
      const follow = await Follow.findOne({ follower: viewerId, following: user._id });
      isFollowed = !!follow;
    }

    user.isFollowedByViewer = isFollowed;
    const filteredProfile = filterProfileByPrivacy(user, viewerId);

    // Fetch public certificates if allowed
    let certs = [];
    if (filteredProfile.certificates) {
      certs = await Certificate.find({ userId: user._id, verificationStatus: 'VERIFIED' });
    }

    res.json({
      profile: filteredProfile,
      isFollowing: isFollowed,
      certificates: certs
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const allowedUpdates = ['name', 'bio', 'profileImage', 'socialLinks', 'themePreference', 'username'];
    const updates = {};
    
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    if (updates.username) updates.username = updates.username.toLowerCase();

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updatePrivacy = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { privacy: req.body } },
      { new: true }
    );
    res.json(user.privacy);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// --- Social Graph Controllers ---

export const followUser = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const targetId = req.params.id;
    const followerId = req.user.id;

    if (targetId === followerId) throw new Error("You cannot follow your own shadow");

    const existing = await Follow.findOne({ follower: followerId, following: targetId });
    if (existing) return res.status(400).json({ message: 'Already following' });

    await Follow.create([{ follower: followerId, following: targetId }], { session });

    // Atomic stats update
    await User.findByIdAndUpdate(followerId, { $inc: { 'stats.following': 1 } }, { session });
    await User.findByIdAndUpdate(targetId, { $inc: { 'stats.followers': 1 } }, { session });

    await session.commitTransaction();
    res.json({ success: true });
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ message: error.message });
  } finally {
    session.endSession();
  }
};

export const unfollowUser = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const targetId = req.params.id;
    const followerId = req.user.id;

    const result = await Follow.findOneAndDelete({ follower: followerId, following: targetId }, { session });
    if (!result) return res.status(400).json({ message: 'Not following' });

    await User.findByIdAndUpdate(followerId, { $inc: { 'stats.following': -1 } }, { session });
    await User.findByIdAndUpdate(targetId, { $inc: { 'stats.followers': -1 } }, { session });

    await session.commitTransaction();
    res.json({ success: true });
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ message: error.message });
  } finally {
    session.endSession();
  }
};
