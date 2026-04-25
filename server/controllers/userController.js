import mongoose from 'mongoose';
import User from '../models/User.js';
import Follow from '../models/Follow.js';
import Progress from '../models/Progress.js';

// ... (other controllers)

export const getPublicProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const viewerId = req.user?.id;

    // Support both ID and Username lookup
    const query = mongoose.Types.ObjectId.isValid(username) 
      ? { _id: username } 
      : { username: username.toLowerCase() };

    const target = await User.findOne(query).select('-password -refreshTokens');
    if (!target) return res.status(404).json({ message: 'Identity not found' });

    // Check if viewer follows target
    let isFollowing = false;
    if (viewerId) {
      const follow = await Follow.findOne({ follower: viewerId, following: target._id });
      isFollowing = !!follow;
    }

    const filtered = target.toObject();
    const privacy = target.privacy || {};

    // 🛡️ Advanced Privacy Enforcement Engine
    const checkVisibility = (level) => {
      if (!level || level === 'PUBLIC') return true;
      if (level === 'FOLLOWERS' && isFollowing) return true;
      if (viewerId && viewerId.toString() === target._id.toString()) return true;
      return false;
    };

    // Filter global fields
    if (!checkVisibility(privacy.email)) delete filtered.email;
    if (!checkVisibility(privacy.mobile)) delete filtered.mobile;
    if (!checkVisibility(privacy.stats)) delete filtered.stats;
    if (!checkVisibility(privacy.certificates)) delete filtered.certificates;

    // Filter social links individually (Bloomberg-grade requirement)
    if (filtered.socialLinks) {
      Object.keys(filtered.socialLinks).forEach(platform => {
        const link = filtered.socialLinks[platform];
        if (!checkVisibility(link.visibility)) {
          // If restricted but follower-only, we might return a 'LOCKED' flag for UI
          if (link.visibility === 'FOLLOWERS' && !isFollowing) {
            filtered.socialLinks[platform] = { url: 'LOCKED', visibility: 'FOLLOWERS' };
          } else {
            delete filtered.socialLinks[platform];
          }
        }
      });
    }
    
    res.json({
      profile: filtered,
      isFollowing
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Own Profile ─────────────────────────────────────────────────────────────
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const incrementChatCount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.chatCount += 1;
    await user.save();
    res.json({ chatCount: user.chatCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { name, mobile, bio, profileImage, username, socialLinks, themePreference } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (mobile !== undefined) user.mobile = mobile;
    if (bio !== undefined) user.bio = bio;
    if (profileImage !== undefined) user.profileImage = profileImage;
    if (themePreference !== undefined) user.themePreference = themePreference;
    
    if (username) {
      user.username = username.toLowerCase().replace(/\s+/g, '');
    }

    if (socialLinks) {
      user.socialLinks = { ...user.socialLinks, ...socialLinks };
    }

    const updated = await user.save();
    res.json(updated);
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ message: 'Username already taken' });
    res.status(500).json({ message: error.message });
  }
};

// ─── Update Privacy Settings ──────────────────────────────────────────────────
export const updatePrivacySettings = async (req, res) => {
  try {
    const { privacy } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const allowed = ['email', 'mobile', 'bio', 'followersList', 'followingList', 'certificates'];
    allowed.forEach(field => {
      if (privacy?.[field] !== undefined) {
        user.privacy[field] = privacy[field];
      }
    });

    await user.save();
    res.json({ privacy: user.privacy });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Update Certificate Visibility ───────────────────────────────────────────
export const updateCertificateVisibility = async (req, res) => {
  try {
    const { certId, isVisible } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const cert = user.certificates.id(certId);
    if (!cert) return res.status(404).json({ message: 'Certificate not found' });

    cert.isVisible = isVisible;
    await user.save();
    res.json({ message: 'Updated', certificates: user.certificates });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

