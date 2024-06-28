import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const MONGO_URL = process.env.MONGO_URL;

// Connect Database
export const connectDB = async () => {
  mongoose.set("strictQuery", false);
  await mongoose
    .connect(MONGO_URL)
    .then(() => {
      console.log("DB Connection : Success");
    })
    .catch((err) => {
      console.log("DB Connection : Fail");
      console.log(err);
      process.exit(1);
    });
};
export default connectDB;
