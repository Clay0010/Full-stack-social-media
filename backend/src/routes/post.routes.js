import express from "express";
import {
  getAllPosts,
  getFollowingPosts,
  getUserPosts,
  getSinglePost,
  createPost,
  likePost,
  deletePost,
  updatePost,
} from "../controllers/post.controller.js";

const router = express.Router();
import { authenticate } from "../middleware/auth.middleware.js";

router.get("/", getAllPosts);
router.get("/following/:id", getFollowingPosts);
router.get("/:id", authenticate, getSinglePost);
router.get("/user/:id", authenticate, getUserPosts);
router.post("/", authenticate, createPost);
router.post("/:id/like", authenticate, likePost);
router.delete("/:id", authenticate, deletePost);
router.patch("/:id", authenticate, updatePost);

export default router;
