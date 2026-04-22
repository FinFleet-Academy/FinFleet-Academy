import express from 'express';
import { getAllNews, getNewsBySlug, getTrendingNews } from '../controllers/newsController.js';

const router = express.Router();

router.get('/', getAllNews);
router.get('/trending', getTrendingNews);
router.get('/:slug', getNewsBySlug);

export default router;
