import mongoose from "mongoose";
import validator from "validator";

const donationSchema = new mongoose.Schema({
  dateTime: {
    type: Date,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: validator.isMobilePhone,
      message: "Invalid phone number format",

    },

    optional: true
  },
  age: {
    type: Number,
    required: true,
    min: [18, "Age must be at least 18"], 
  },
  driveLocation: {
    type: String,
    required: true,
  },
  rapidPass: {
    type: Boolean,
    default: false,
  },
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",  
  }
});

export default mongoose.model("Donation", donationSchema);

