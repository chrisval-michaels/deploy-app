// db.js
import mongoose from 'mongoose';

const MONGO_URI = 'mongodb+srv://backend-user:backend4040@backend.9pm5ex2.mongodb.net/backend-data?appName=Backend';

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected (Albums API)");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
    process.exit(1); // Exit if DB fails
  }
};
