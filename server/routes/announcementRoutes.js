import express from 'express';
import { getAnnouncements, createAnnouncement, deleteAnnouncement } from '../controllers/announcementController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAnnouncements);
router.post('/', protect, admin, createAnnouncement);
router.delete('/:id', protect, admin, deleteAnnouncement);

export default router;
