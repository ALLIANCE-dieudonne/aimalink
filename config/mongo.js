import mongoose from "mongoose";

const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("Connected to db online...");
  });

  await mongoose.connect(`${process.env.MONGO_URL}/users`).catch((err) => console.log(err));
};


export default connectDB;