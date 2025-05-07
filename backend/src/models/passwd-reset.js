import mongoose from "mongoose";

const passwdResetSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  code: {
    type: Number,
    required: true,
  },
  createdAt: { type: Date, default: Date.now, expires: 900 },
});

export const PasswdReset = mongoose.model("PasswdReset", passwdResetSchema);
