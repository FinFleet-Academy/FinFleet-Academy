import express from 'express';
import { 
  getAllUsers, 
  updateUserPlan, 
  getCoupons, 
  createCoupon, 
  deleteCoupon,
  broadcastNotification,
  getAllSubscribers,
  createNews,
  deleteNews,
  createCourse,
  deleteCourse,
  getAllContacts,
  deleteContact
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

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
router.delete('/news/:id', protect, admin, deleteNews);

// Course Management
router.post('/courses', protect, admin, createCourse);
router.delete('/courses/:id', protect, admin, deleteCourse);

// Contact Messages
router.get('/contacts', protect, admin, getAllContacts);
router.delete('/contacts/:id', protect, admin, deleteContact);

export default router;
