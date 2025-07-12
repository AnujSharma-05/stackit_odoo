import express from 'express';
import voteController from '../controllers/vote.controller.js';
import { authenticate } from '../../auth/middleware/auth.middleware.js';
// import { validateVote } from '../validations/vote.validation.js';

const router = express.Router();

router.post('/', authenticate, voteController.vote);
router.delete('/:targetId/:targetType', authenticate, voteController.removeVote);

export default router;