import express from 'express';
import { toggleLike, getLikeStatus, getBulkLikeStatus } from '../controllers/likeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/toggle', protect, toggleLike);
router.get('/status', protect, getLikeStatus);
router.post('/bulk-status', protect, getBulkLikeStatus);

export default router;
