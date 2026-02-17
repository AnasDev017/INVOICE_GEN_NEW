import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log("Using existing MongoDB connection");
    return;
  }

  try {
    console.log("Connecting to MongoDB...");
    const db = await mongoose.connect(process.env.DATA_BASE_URL, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000, 
    });

    isConnected = db.connections[0].readyState === 1;
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    // Log masked URL for safety but to check if it's being read
    const maskedUrl = process.env.DATA_BASE_URL ? process.env.DATA_BASE_URL.replace(/:([^@]+)@/, ":****@") : "undefined";
    console.log("Attempted URL:", maskedUrl);
    throw error;
  }
};

export default connectDB;
