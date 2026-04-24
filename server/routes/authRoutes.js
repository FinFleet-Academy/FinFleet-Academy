import express from 'express';
import { registerUser, loginUser, refreshAccessToken, logoutUser } from '../controllers/authController.js';
import { validate, signupSchema, loginSchema } from '../middleware/validate.js';

const router = express.Router();

router.post('/register', validate(signupSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);
router.post('/refresh', refreshAccessToken);
router.post('/logout', logoutUser);

export default router;
