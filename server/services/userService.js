import User from '../models/User.js';
import cacheService from './cacheService.js';

class UserService {
  async getAllUsers(search = '', page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const query = {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    };

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    return { users, total, page, pages: Math.ceil(total / limit) };
  }

  async upgradePlan(userId, plan) {
    const user = await User.findByIdAndUpdate(userId, { plan }, { new: true });
    // Invalidate user-specific cache if implemented
    return user;
  }
}

export default new UserService();
