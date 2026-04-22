import User from '../models/User.js';

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
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
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
