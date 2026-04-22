import express from 'express';
import { getComments, addComment, deleteComment } from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, addComment);

router.route('/:targetId')
  .get(getComments); // Anyone can read comments

router.route('/:id')
  .delete(protect, deleteComment);

export default router;
