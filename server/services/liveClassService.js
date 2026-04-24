import LiveClass from '../models/LiveClass.js';
import Enrollment from '../models/Enrollment.js';
import cacheService from './cacheService.js';
import crypto from 'crypto';
import logger from '../utils/logger.js';

class LiveClassService {
  /**
   * Secure Token Generation with Expiry and IP Binding
   * TTL: 10 minutes
   */
  generateJoinToken(userId, classId, userIp) {
    const payload = {
      u: userId,
      c: classId,
      ip: userIp,
      exp: Date.now() + (10 * 60 * 1000) // 10 min expiry
    };
    
    const secret = process.env.JWT_SECRET || 'fallback_secret';
    const token = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(payload))
      .digest('hex');
      
    // Store metadata for validation
    return { token, payload };
  }

  async getAllClasses() {
    const cached = await cacheService.get('live_classes:list');
    if (cached) return cached;

    const classes = await LiveClass.find({ status: { $ne: 'cancelled' } })
      .sort({ scheduledTime: 1 })
      .select('-meetingLink');

    await cacheService.set('live_classes:list', classes, 60);
    return classes;
  }

  async createClass(data) {
    const newClass = await LiveClass.create(data);
    await cacheService.invalidate('live_classes:list');
    return newClass;
  }

  async deleteClass(id) {
    await LiveClass.findByIdAndDelete(id);
    await cacheService.invalidate('live_classes:list');
  }

  async checkAccess(userId, classId) {
    const liveClass = await LiveClass.findById(classId);
    if (!liveClass) return { allowed: false, message: 'Class not found' };

    if (liveClass.classType === 'free') return { allowed: true, liveClass };

    const enrollment = await Enrollment.findOne({ 
      user: userId, 
      class: classId, 
      paymentStatus: 'completed' 
    });

    if (!enrollment) return { allowed: false, message: 'Payment required', requiresPayment: true };

    return { allowed: true, liveClass };
  }
}

export default new LiveClassService();
