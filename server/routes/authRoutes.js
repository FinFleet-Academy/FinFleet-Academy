import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';

import { validateLogin } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', validateLogin, loginUser);

export default router;
