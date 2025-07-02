import express from "express";
import { login, register, logout } from "../controllers/auth.controller.js";

const router = express.Router();

router.use("/login", login);
router.use("/register", register);
router.use("/logout", logout);

router.get("/me", (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user
    })
})

export default router;