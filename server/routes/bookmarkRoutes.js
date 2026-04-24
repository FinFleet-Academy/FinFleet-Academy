import express from 'express';
import { saveBookmark, getBookmarks, deleteBookmark } from '../controllers/bookmarkController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, saveBookmark)
  .get(protect, getBookmarks);

router.route('/:id')
  .delete(protect, deleteBookmark);

export default router;
