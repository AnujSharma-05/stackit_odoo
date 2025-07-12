import express from 'express';
import StatsController from '../controllers/stats.controller.js';
import { authenticate } from '../../auth/middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/community', StatsController.getCommunityStats);

// Protected routes
router.get('/dashboard', authenticate, StatsController.getDashboardStats);

export default router;
