import express from 'express';
import {
  getAnnouncements, createAnnouncement, deleteAnnouncement,
  toggleLike, addComment, deleteComment, toggleCommentLike
} from '../controllers/announcementController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getAnnouncements);
router.post('/', protect, admin, createAnnouncement);
router.delete('/:id', protect, admin, deleteAnnouncement);

router.post('/:id/like', protect, toggleLike);
router.post('/:id/comments', protect, addComment);
router.delete('/:id/comments/:commentId', protect, deleteComment);
router.post('/:id/comments/:commentId/like', protect, toggleCommentLike);

export default router;
