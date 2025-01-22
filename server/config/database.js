import mongoose from "mongoose";

const connectDB = (DB_URL) => {
  mongoose.connect(DB_URL);
};

export default connectDB;
