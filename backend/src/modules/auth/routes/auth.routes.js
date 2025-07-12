import express from 'express';
import authController from '../controllers/auth.controller.js';
import { validateRegister, validateLogin, validateReset } from '../validations/auth.validation.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public Routes
router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', validateReset, authController.resetPassword);

// Authenticated Routes
router.post('/change-password', authenticate, authController.changePassword);

export default router;
