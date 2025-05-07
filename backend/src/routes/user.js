import express from "express";
import {
  getUsers,
  updateUser,
  deleteUser,
  getUserBookings
} from "../controllers/user.controller.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);
router.get("/bookings", getUserBookings);
router.route("/:id").put(updateUser)

router.use(admin)
router.route("/").get(getUsers);

router.route("/:id").delete(deleteUser);

export default router;
