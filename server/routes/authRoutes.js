import express from 'express';
import { registerUser, loginUser, refreshAccessToken, logoutUser } from '../controllers/authController.js';
import { validateLogin } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', validateLogin, loginUser);
router.post('/refresh', refreshAccessToken);
router.post('/logout', logoutUser);

export default router;
