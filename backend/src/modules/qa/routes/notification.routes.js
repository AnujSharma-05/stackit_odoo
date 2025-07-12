import express from 'express';
import notificationController from '../controllers/notification.controller.js';
import { authenticate } from '../../auth/middleware/auth.middleware.js';

const router = express.Router();

// All notification routes require authentication
router.get('/', authenticate, notificationController.getNotifications);
router.get('/unread-count', authenticate, notificationController.getUnreadCount);
router.put('/:id/read', authenticate, notificationController.markAsRead);
router.put('/mark-all-read', authenticate, notificationController.markAllAsRead);
router.delete('/:id', authenticate, notificationController.deleteNotification);

export default router;
