import express from 'express';
import { followUser, unfollowUser, getFollowers, getFollowing, discoverUsers } from '../controllers/followController.js';
import { protect, optionalProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/discover', optionalProtect, discoverUsers);

router.post('/:userId', protect, followUser);
router.delete('/:userId', protect, unfollowUser);
router.get('/:userId/followers', protect, getFollowers);
router.get('/:userId/following', protect, getFollowing);

export default router;
