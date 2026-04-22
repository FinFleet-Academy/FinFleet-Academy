import express from 'express';
import { getAllNews, getNewsBySlug, getTrendingNews, explainNews } from '../controllers/newsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/explain', protect, explainNews);
router.get('/', getAllNews);
router.get('/trending', getTrendingNews);
router.get('/:slug', getNewsBySlug);

export default router;
