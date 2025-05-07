import express from "express";
import {
  register,
  login,
  getProfile,
  resetPasswdRequest,
  resetPasswd,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/reset-password-request", resetPasswdRequest);
router.post("/reset-password", resetPasswd);
router.get("/profile", protect, getProfile);

export default router;
