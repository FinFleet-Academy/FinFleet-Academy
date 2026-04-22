import express from 'express';
import { getUserProfile, incrementChatCount, updateUserProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.put('/chat', protect, incrementChatCount);

export default router;
