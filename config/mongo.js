import mongoose from "mongoose";

const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("Connected to db online...");
  });

  await mongoose.connect(`${process.env.MONGO_URL}/users`, {
    serverSelectionTimeoutMS: 30000, // 30 seconds
    socketTimeoutMS: 45000, // 45 seconds
  }).catch((err) => console.log(err));
};


export default connectDB;