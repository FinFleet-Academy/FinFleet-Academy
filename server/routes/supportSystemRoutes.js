import express from 'express';
import { 
  submitContactForm, 
  getAdminSupportMessages,
  getHelpArticles,
  createHelpArticle,
  subscribeNewsletter
} from '../controllers/supportController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Support & Contact
router.post('/contact', submitContactForm);
router.get('/admin/messages', protect, admin, getAdminSupportMessages);

// Help Articles
router.get('/articles', getHelpArticles);
router.post('/admin/articles', protect, admin, createHelpArticle);

// Newsletter
router.post('/newsletter/subscribe', subscribeNewsletter);

export default router;
