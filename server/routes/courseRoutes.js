import express from 'express';
import { getCourses, getCourseById, getProgress, markCompleted } from '../controllers/courseController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getCourses);
router.get('/progress', protect, getProgress);
router.post('/progress', protect, markCompleted);
router.get('/:id', getCourseById);

export default router;
