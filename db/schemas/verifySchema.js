import mongoose, { mongo } from "mongoose";

const verifySchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  faceEmbedding: { type: Array, default: [] }, // Store face embedding
});

export default mongoose.model("VerifySchema", verifySchema);
