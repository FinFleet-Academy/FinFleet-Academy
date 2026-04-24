import express from 'express';
import { getProfile, updateProfile, getPublicProfile } from '../controllers/userController.js';

const router = express.Router();

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/public/:userId', getPublicProfile);

export default router;
