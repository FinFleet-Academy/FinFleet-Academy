import express from 'express';
import { getCourses, getCourseById, createCourse } from '../controllers/courseController.js';

const router = express.Router();

router.get('/', getCourses);
router.get('/:id', getCourseById);
router.post('/', createCourse);

export default router;
