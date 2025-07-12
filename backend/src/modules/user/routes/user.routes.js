import express from "express";
import userController from "../controllers/user.controller.js";
import { authenticate } from "../../auth/middleware/auth.middleware.js";
import { validateUpdateProfile } from '../validations/user.validation.js';

const router = express.Router();

router.get("/me", authenticate, userController.getCurrentUser);
router.put("/me", authenticate, validateUpdateProfile, userController.updateProfile);
router.get("/profile/:username", userController.getPublicProfile);
router.get("/leaderboard", userController.getLeaderboard);
router.delete("/me", authenticate, userController.deactivateAccount);

export default router;