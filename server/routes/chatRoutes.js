import express from 'express';
import { handleChat } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route: POST /api/chat
// Description: Handle AI chat messages with subscription limits
// Access: Private
router.post('/', protect, handleChat);

export default router;
