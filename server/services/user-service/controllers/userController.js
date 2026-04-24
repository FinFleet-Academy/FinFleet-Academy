import User from '../models/User.js';

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.headers['x-user-id']).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.headers['x-user-id']);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const fieldsToUpdate = ['name', 'bio', 'mobile', 'profileImage', 'privacy'];
    fieldsToUpdate.forEach(field => {
      if (req.body[field] !== undefined) user[field] = req.body[field];
    });

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPublicProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('name bio profileImage certificates privacy');
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Filter private fields
    const filteredUser = user.toObject();
    if (user.privacy?.bio === 'private') delete filteredUser.bio;
    
    res.json(filteredUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  getProfile,
  updateProfile,
  getPublicProfile
};
