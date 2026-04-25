import express from 'express';
import { 
  getProfile, 
  updateProfile, 
  updatePrivacy, 
  followUser, 
  unfollowUser 
} from '../controllers/socialController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Profile Access (Middleware handles internal privacy)
router.get('/profile/:username', getProfile);

// Authenticated Actions
router.put('/profile/update', protect, updateProfile);
router.put('/privacy/update', protect, updatePrivacy);
router.post('/follow/:id', protect, followUser);
router.post('/unfollow/:id', protect, unfollowUser);

export default router;
