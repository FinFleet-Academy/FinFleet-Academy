import express from 'express';
import { 
  getAllUsers, 
  updateUserPlan, 
  getCoupons, 
  createCoupon, 
  deleteCoupon,
  broadcastNotification,
  getAllSubscribers,
  getAdminStats
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Stats
router.get('/stats', protect, admin, getAdminStats);

// User Management
router.get('/users', protect, admin, getAllUsers);
router.get('/subscribers', protect, admin, getAllSubscribers);
router.put('/users/:id/plan', protect, admin, updateUserPlan);

// Coupon Management
router.get('/coupons', protect, admin, getCoupons);
router.post('/coupons', protect, admin, createCoupon);
router.delete('/coupons/:id', protect, admin, deleteCoupon);

// Notifications
router.post('/notify', protect, admin, broadcastNotification);

export default router;
