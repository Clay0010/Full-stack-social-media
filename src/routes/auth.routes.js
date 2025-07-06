import express from "express";
import {
  login,
  register,
  logout,
  getCurrentUser,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use("/login", login);
router.use("/register", register);
router.use("/logout", logout);
router.get("/me", authenticate, getCurrentUser);

export default router;
