import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import Course from '../models/Course.js';
import Subscriber from '../models/Subscriber.js';
import cacheService from './cacheService.js';
import logger from '../utils/logger.js';

class AdminService {
  async getDashboardStats() {
    const cached = await cacheService.get('analytics:dashboard');
    if (cached) return cached;

    const [totalUsers, totalSubscribers, totalCourses, revenueData] = await Promise.all([
      User.countDocuments(),
      Subscriber.countDocuments(),
      Course.countDocuments(),
      Transaction.aggregate([
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ])
    ]);

    const totalRevenue = revenueData[0]?.total || 0;
    
    const stats = {
      summary: {
        totalUsers,
        totalSubscribers,
        totalCourses,
        totalRevenue
      }
    };

    await cacheService.set('analytics:dashboard', stats, 300); // 5 min TTL
    return stats;
  }

  async getPaginatedUsers(query = {}, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      User.find(query).select('-password').sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(query)
    ]);

    return {
      users,
      total,
      page,
      pages: Math.ceil(total / limit)
    };
  }

  async getPaginatedTransactions(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [transactions, total] = await Promise.all([
      Transaction.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('user', 'name email'),
      Transaction.countDocuments()
    ]);

    return {
      transactions,
      total,
      page,
      pages: Math.ceil(total / limit)
    };
  }
}

export default new AdminService();
