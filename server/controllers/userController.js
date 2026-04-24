import User from '../models/User.js';
import Follow from '../models/Follow.js';
import Progress from '../models/Progress.js';

// ─── Own Profile ─────────────────────────────────────────────────────────────
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const incrementChatCount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.chatCount += 1;
    await user.save();
    res.json({ chatCount: user.chatCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { name, mobile, bio, profileImage } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (mobile !== undefined) user.mobile = mobile;
    if (bio !== undefined) user.bio = bio;
    if (profileImage !== undefined) user.profileImage = profileImage;

    const updated = await user.save();
    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      mobile: updated.mobile,
      bio: updated.bio,
      profileImage: updated.profileImage,
      plan: updated.plan,
      isAdmin: updated.isAdmin,
      privacy: updated.privacy,
      certificates: updated.certificates,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Update Privacy Settings ──────────────────────────────────────────────────
export const updatePrivacySettings = async (req, res) => {
  try {
    const { privacy } = req.body;
    const user = await User.findById(req.user._id);
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
    const user = await User.findById(req.user._id);
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

// ─── PUBLIC Profile (privacy-enforced) ───────────────────────────────────────
export const getPublicProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const viewerId = req.user?.id;

    const target = await User.findById(userId).select('-password -chatCount -lastChatReset -lastMessageAt -referredUsers');
    if (!target) return res.status(404).json({ message: 'User not found' });

    // Check follow relationship
    let isFollowing = false;
    if (viewerId && viewerId !== userId) {
      isFollowing = !!(await Follow.findOne({ follower: viewerId, following: userId }));
    }
    const isSelf = viewerId === userId;

    const privacy = target.privacy || {};

    // Helper: resolve field based on privacy level
    const resolve = (level, value) => {
      if (isSelf) return value;
      if (level === 'public') return value;
      if (level === 'followers' && isFollowing) return value;
      return null; // hidden
    };

    // Build safe profile
    const [followerCount, followingCount] = await Promise.all([
      Follow.countDocuments({ following: userId }),
      Follow.countDocuments({ follower: userId }),
    ]);

    const profile = {
      _id: target._id,
      name: target.name,
      plan: target.plan,
      profileImage: target.profileImage,
      createdAt: target.createdAt,
      followerCount,
      followingCount,
      isFollowing,
      isSelf,
      // Privacy-gated fields
      bio: resolve(privacy.bio || 'public', target.bio),
      email: resolve(privacy.email || 'private', target.email),
      mobile: resolve(privacy.mobile || 'private', target.mobile),
    };

    // Followers/following lists
    if (isSelf || privacy.followersList !== 'private') {
      const followers = await Follow.find({ following: userId }).populate('follower', 'name profileImage plan').limit(50);
      profile.followers = followers.map(f => f.follower);
    }
    if (isSelf || privacy.followingList !== 'private') {
      const following = await Follow.find({ follower: userId }).populate('following', 'name profileImage plan').limit(50);
      profile.following = following.map(f => f.following);
    }

    // Certificates
    const certLevel = privacy.certificates || 'public';
    if (isSelf || certLevel === 'public' || (certLevel === 'followers' && isFollowing)) {
      profile.certificates = (target.certificates || []).filter(c => isSelf || c.isVisible);
    } else {
      profile.certificates = [];
      profile.certificatesHidden = true;
    }

    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
