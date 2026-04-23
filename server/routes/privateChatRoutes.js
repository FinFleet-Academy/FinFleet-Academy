import express from 'express';
import { getConversations, getMessages, sendMessage } from '../controllers/privateChatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/conversations', protect, getConversations);
router.get('/:partnerId', protect, getMessages);
router.post('/', protect, sendMessage);

export default router;
