import express from "express";
import {
  createComment,
  deleteCommentByPostAuthor,
  updateCommentByPostAuthor,
} from "../controllers/comment.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/:postId", authenticate, createComment);
router.delete(
  "/:postId/comment/:commentId",
  authenticate,
  deleteCommentByPostAuthor
);
router.put(
  "/:postId/comment/:commentId",
  authenticate,
  updateCommentByPostAuthor
);

export default router;
