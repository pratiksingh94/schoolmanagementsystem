import express from "express";
import {
  createBooking,
  getBookings,
  updateBooking,
  deleteBooking,
  notifyBooking,
} from "../controllers/booking.controller.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

router.post("/", createBooking);

router.use(protect);

router.get("/", admin, getBookings);
router.put("/:id", admin, updateBooking);
router.delete("/:id", deleteBooking);
router.post("/:id/notify", admin, notifyBooking);

export default router;
