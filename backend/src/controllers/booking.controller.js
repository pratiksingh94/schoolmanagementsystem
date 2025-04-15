import { Booking } from '../models/booking.js'

export const createBooking = async (req, res, next) => {
  try {
    const booking = await Booking.create(req.body);
    res.status(201).json(booking);
  } catch (error) {
    next(error)
  }
};

export const getBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({}).sort('-createdAt')
    res.json(bookings)
  } catch (error) {
    next(error)
  }
};

export const updateBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)

    if (!booking) {
      res.status(404)
      throw new Error('booking not found 404');
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.json(updatedBooking)
  } catch (error) {
    next(error)
  }
}


export const deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    
    await Booking.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    next(error);
  }
};