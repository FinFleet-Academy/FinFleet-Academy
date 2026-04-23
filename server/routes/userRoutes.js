import express from 'express';
import {
  getUserProfile,
  incrementChatCount,
  updateUserProfile,
  updatePrivacySettings,
  updateCertificateVisibility,
  getPublicProfile,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Own profile
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.put('/chat', protect, incrementChatCount);

// Privacy
router.put('/privacy', protect, updatePrivacySettings);
router.put('/certificate-visibility', protect, updateCertificateVisibility);

// Public profile view (auth required to enforce follower-check)
router.get('/profile/:userId', protect, getPublicProfile);

export default router;
