import express from 'express';
import questionController from '../controllers/question.controller.js';
import { authenticate, optionalAuth } from '../../auth/middleware/auth.middleware.js';
import { validateQuestion } from '../validations/question.validation.js';

const router = express.Router();

// Public routes
router.get('/', optionalAuth, questionController.getQuestions);
router.get('/:id', optionalAuth, questionController.getQuestionById);

// Authenticated routes
router.post('/', authenticate, validateQuestion, questionController.createQuestion);
router.put('/:id', authenticate, questionController.updateQuestion);
router.delete('/:id', authenticate, questionController.deleteQuestion);

export default router;