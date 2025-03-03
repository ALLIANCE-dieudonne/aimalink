import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    validate: [validator.isEmail, "Invalid email format"],
  },
  fullNames: {
    type: String,
    required: [true, "Full names are required"],
    minlength: [3, "Full names must be at least 3 characters long"],
  },
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    minlength: [3, "Username must be at least 3 characters long"],
    match: [
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores",
    ],
  },
  location: {
    latitude: {
      type: Number,
      required: [true, "Latitude is required"],
      min: [-90, "Latitude must be between -90 and 90"],
      max: [90, "Latitude must be between -90 and 90"],
    },
    longitude: {
      type: Number,
      required: [true, "Longitude is required"],
      min: [-180, "Longitude must be between -180 and 180"],
      max: [180, "Longitude must be between -180 and 180"],
    },
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters long"],
  },
  phoneNumber: {
    type: String,
    required: [true, "Phone number is required"],
    validate: {
      validator: function (value) {
        return validator.isMobilePhone(value, "any");
      },
      message: "Invalid phone number format",
    },
  },
  birthDate: {
    type: Date,
    required: [true, "Birth date is required"],
    validate: {
      validator: function (value) {
        const today = new Date();
        const minAge = 18;
        const birthDateLimit = new Date(
          today.getFullYear() - minAge,
          today.getMonth(),
          today.getDate()
        );
        return value <= birthDateLimit;
      },
      message: "You must be at least 18 years old",
    },
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  bloodGroup: {
    type: String,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: [true, "Gender is required"],
  },
  rememberMe: {
    type: Boolean,
    default: false,
  },
  didRapidPass: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("User", userSchema);