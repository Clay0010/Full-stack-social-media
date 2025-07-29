import express from "express";
import {
  getAllUsers,
  getUser,
  getMe,
  followUser,
  unfollowUser,
  updateUser,
  getUserFollowers,
  getUserFollowing,
  getSuggestion,
} from "../controllers/user.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("", authenticate, getAllUsers);
router.get("/me", authenticate, getMe);
router.patch("/me", authenticate, updateUser);
router.get("/suggestions", authenticate, getSuggestion);

router.get("/:id", authenticate, getUser);
router.get("/:id/followers", authenticate, getUserFollowers);
router.get("/:id/following", authenticate, getUserFollowing);
router.post("/:id/follow", authenticate, followUser);
router.post("/:id/unfollow", authenticate, unfollowUser);

export default router;
