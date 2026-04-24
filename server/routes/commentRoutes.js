import express from 'express';
import { getComments, addComment, deleteComment, editComment } from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:targetId', protect, getComments);      // ?targetType=course|news|announcement
router.post('/', protect, addComment);
router.put('/:id', protect, editComment);
router.delete('/:id', protect, deleteComment);

export default router;
