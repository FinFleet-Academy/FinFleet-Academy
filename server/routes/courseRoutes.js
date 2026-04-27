import express from 'express';
import { 
  getCourses, 
  getCourseDetails, 
  getLessonContent, 
  enrollInCourse, 
  updateProgress,
  createCourse,
  addLesson,
  updateLesson,
  deleteCourse
} from '../controllers/courseController.js';
import { protect, admin, optionalProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Routes
router.get('/', optionalProtect, getCourses);
router.get('/:id', optionalProtect, getCourseDetails);

// User Routes (Protected)
router.post('/:courseId/enroll', protect, enrollInCourse);
router.get('/lesson/:lessonId', protect, getLessonContent);
router.put('/:id/progress', protect, updateProgress);

// Admin Routes
router.post('/', protect, admin, createCourse);
router.post('/:courseId/lessons', protect, admin, addLesson);
router.put('/lessons/:id', protect, admin, updateLesson);
router.delete('/:id', protect, admin, deleteCourse);

export default router;
