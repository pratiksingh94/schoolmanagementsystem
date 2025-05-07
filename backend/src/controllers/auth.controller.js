import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import { PasswdReset } from "../models/passwd-reset.js";
import emailjs from "@emailjs/nodejs";
import crypto from "crypto";

const generateResetCode = () => {
  return crypto.randomInt(100000, 1000000);
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// todo
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      res.status(401);
      throw new Error("invalid email or password");
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res) => {
  res.json(req.user);
};

const SERVICE_ID = "service_gquo3ua";
export const resetPasswdRequest = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401);
      throw new Error("User not found");
    }

    const passcode = generateResetCode();

    await PasswdReset.create({
      email,
      code: passcode,
    });

    emailjs.send(SERVICE_ID, "template_khp6yli", { passcode, email }).then(
      (resp) => {
        res.status(200).json({ message: "Passcode sent successfully" });
        console.log("email sent: ", resp.status, resp.text);
      },
      (error) => {
        res.status(500).json({ message: "Passcode sending failed", error });
        console.log("email sending failed", error);
      },
    );
  } catch (error) {
    next(error);
  }
};

export const resetPasswd = async (req, res, next) => {
  try {
    const { email, OTP, newPassword } = req.body;
    if (!email || !OTP || !newPassword) {
      res.status(400);
      throw new Error("Required fields: email, OTP, newPassword");
    }

    const resetReq = await PasswdReset.findOne({ email, code: OTP });
    if (!resetReq) {
      res.status(401);
      throw new Error("Invalid or expired OTP");
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    user.password = newPassword;

    await user.save();

    await PasswdReset.deleteOne({ _id: resetReq._id });

    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    next(err);
  }
};
