import { User } from "../models/user.js";
import { Booking } from "../models/booking.js"

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } catch (error) {
    //console.log(error)
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error("user not found");
    }

    await user.deleteOne();
    res.json({ message: "user removed" });
  } catch (error) {
    next(error);
  }
};

export const getUserBookings = async (req, res, next) => {
  try {
    const userID = req.user && req.user._id;
    if (!userID) {
      res.status(401);
      throw new Error('Not authenticated');
    }

    const bookings = await Booking.find({ user: userID })
      .sort({ createdAt: -1 })
      .lean();

    //console.log(bookings)
    res.status(200).json({ bookings: bookings });
  } catch (err) {
    next(err);
  }
};
