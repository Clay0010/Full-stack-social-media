import express from "express";
import {
  getAllUsers,
  getUser,
  getMe,
  getUserPosts,
  createPost,
  likePost,
  followUser,
  unfollowUser,
  createComment,
  updateUser,
  getUserFollowers,
  getUserFollowing,

  //   getUserFollowers,
  //   followUser,
} from "../controllers/user.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("", authenticate, getAllUsers);
router.get("/me", authenticate, getMe);
router.patch("/me", authenticate, updateUser);
router.get("/:id", authenticate, getUser);
router.get("/:id/followers", authenticate, getUserFollowers);
router.get("/:id/following", authenticate, getUserFollowing);
router.post("/:id/follow", authenticate, followUser);
router.post("/:id/unfollow", authenticate, unfollowUser);

router.get("/:id/posts", authenticate, getUserPosts);
router.post("/posts", authenticate, createPost);
router.post("/likes", authenticate, likePost);
router.post("/posts/:id/comments", authenticate, createComment);
// router.get("/:id/following", getUserFollowing);
// router.get("/:id/followers", getUserFollowers);
// router.post("/:id/follow", followUser);

export default router;
