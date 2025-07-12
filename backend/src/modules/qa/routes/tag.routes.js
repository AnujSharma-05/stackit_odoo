import express from 'express';
import tagController from '../controllers/tag.controller.js';
import { optionalAuth } from '../../auth/middleware/auth.middleware.js';

const router = express.Router();

router.get('/', optionalAuth, tagController.getTags);
router.get('/:id', optionalAuth, tagController.getTagById);

export default router;