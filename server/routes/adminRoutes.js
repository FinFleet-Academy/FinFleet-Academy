import express from 'express';
import { 
  getAllUsers, 
  updateUserPlan, 
  getCoupons, 
  createCoupon, 
  deleteCoupon,
  broadcastNotification,
  getAllSubscribers,
  getAdminStats,
  createNews,
  deleteNews,
  updateNews,
  createCourse,
  deleteCourse,
  updateCourse,
  getAllContacts,
  deleteContact
} from '../controllers/adminController.js';
import { getPlatformHealth } from '../controllers/healthController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { validateSignature } from '../middleware/signatureMiddleware.js';

const router = express.Router();

// Apply signature validation to all mutating admin routes in production
router.use(['/users/:id/plan', '/coupons', '/notify', '/news', '/courses', '/contacts/:id'], (req, res, next) => {
  if (req.method !== 'GET') {
    return validateSignature(req, res, next);
  }
  next();
});

// Stats & Health
router.get('/stats', protect, admin, getAdminStats);
router.get('/health', protect, admin, getPlatformHealth);

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

// News Management
router.post('/news', protect, admin, createNews);
router.put('/news/:id', protect, admin, updateNews);
router.delete('/news/:id', protect, admin, deleteNews);

// Course Management
router.post('/courses', protect, admin, createCourse);
router.put('/courses/:id', protect, admin, updateCourse);
router.delete('/courses/:id', protect, admin, deleteCourse);

// Contact Messages
router.get('/contacts', protect, admin, getAllContacts);
router.delete('/contacts/:id', protect, admin, deleteContact);

export default router;
