import mongoose from "mongoose";
import validator from "validator";

const DonationSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    require: true,
  },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: validator.isMobilePhone,
      message: "Invalid phone number format",
    },

    optional: true,
  },
  age: {
    type: Number,
    required: true,
    min: [18, "Age must be at least 18"],
  },
  driveId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"Drives",
    required: true,
  },
  rapidPass: {
    type: Boolean,
    default: false,
  },
  eligibilityCriteria: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

export default mongoose.model("Donation", DonationSchema);
