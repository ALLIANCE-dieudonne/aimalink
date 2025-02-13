import mongoose from "mongoose";

const userOTPVericicationSchema = new mongoose.Schema({
  userId: String,
  otp: String,
  createdAt: Date,
  expiresAt: Date,
});



export default mongoose.model("UserOTP", userOTPVericicationSchema);