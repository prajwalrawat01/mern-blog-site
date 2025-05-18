import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDb = async () => {
  try {
    console.log(process.env.MONGO_URI);
    const connection = await mongoose.connect('mongodb://localhost:27017/mern-blog');
    console.log("Database connection was successfull !!!");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDb;
