import express from 'express';
import { getMessages, postMessage } from '../controllers/communityChatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getMessages)
  .post(protect, postMessage);

export default router;
