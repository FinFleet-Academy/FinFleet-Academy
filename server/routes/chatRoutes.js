import express from 'express';
import { handleChat } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

import { validateChat } from '../middleware/validationMiddleware.js';

const router = express.Router();

// Route: POST /api/chat
// Description: Handle AI chat messages with subscription limits
// Access: Private
router.post('/', protect, validateChat, handleChat);

export default router;
