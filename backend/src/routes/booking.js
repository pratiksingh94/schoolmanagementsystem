import express from 'express';
import { createBooking, getBookings, updateBooking, deleteBooking } from '../controllers/booking.controller.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', createBooking);
router.delete('/:id', deleteBooking)

router.use(protect);

router.get('/', admin, getBookings);
router.put('/:id', admin, updateBooking);


export default router;