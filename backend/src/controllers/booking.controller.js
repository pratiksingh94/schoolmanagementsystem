import { Booking } from "../models/booking.js";

import emailjs from "@emailjs/nodejs";

export const createBooking = async (req, res, next) => {
  try {
    const booking = await Booking.create(req.body);
    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
};

export const getBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({}).sort("-createdAt");
    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

export const updateBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404);
      throw new Error("booking not found 404");
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true },
    );

    res.json(updatedBooking);
  } catch (error) {
    next(error);
  }
};

export const deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      res.status(404);
      throw new Error("Booking not found");
    }

    await Booking.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const SERVICE_ID = "service_gquo3ua";
export const notifyBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      res.status(404);
      throw new Error("Booking not found");
    }

    const { name, email } = booking;
    const message = `
    Hello ${booking.name},
    Your booking of school management system has been completed.
    Contact us on our number +91 1234567890 for further steps and how to set it up.

    Best regards,
    Pratik
    `;

    emailjs
      .send(SERVICE_ID, "template_0rvgpqq", {
        name,
        email,
        date: Date(),
        message,
      })
      .then(
        (resp) => {
          res.status(200).json({ message: "Booking notified successfully" });
          console.log("email sent: ", resp.status, resp.text);
        },
        (error) => {
          res
            .status(500)
            .json({ message: "Booking notification failed", error });
          console.log("email sending failed", error);
        },
      );

    //res.status(200).json({ message: 'Booking notified successfully' });
  } catch (error) {
    next(error);
  }
};
