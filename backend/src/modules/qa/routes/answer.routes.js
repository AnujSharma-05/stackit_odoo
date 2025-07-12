import express from 'express';
import answerController from '../controllers/answer.controller.js';
import { authenticate } from '../../auth/middleware/auth.middleware.js';
import { validateAnswer } from '../validations/answer.validation.js';

const router = express.Router();

router.get('/question/:questionId', answerController.getAnswersByQuestion);
router.post('/', authenticate, validateAnswer, answerController.createAnswer);
router.put('/:id', authenticate, answerController.updateAnswer);
router.delete('/:id', authenticate, answerController.deleteAnswer);
router.post('/:id/accept', authenticate, answerController.acceptAnswer);

export default router;