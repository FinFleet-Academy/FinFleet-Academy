import express from 'express';
import { createTicket, getUserTickets, getAllTickets, updateTicketStatus } from '../controllers/helpController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createTicket);
router.get('/my-tickets', protect, getUserTickets);
router.get('/admin', protect, admin, getAllTickets);
router.put('/admin/:id', protect, admin, updateTicketStatus);

export default router;
