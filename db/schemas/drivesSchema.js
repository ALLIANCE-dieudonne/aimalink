import mongoose from "mongoose";

const drivesScema = new mongoose.Schema({
  name: { type: String, required: true },
  Location: { type: String, required: true },
  Latitude: { type: String, required: true },
  Longitude: { type: String, required: true },
  AvailableDonations: {type: Number, required: true},
});

export default mongoose.model("Drives", drivesScema);
