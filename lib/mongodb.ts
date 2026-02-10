import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("يرجى تعريف متغير MONGODB_URI داخل Environment Variables");
}

export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) return;
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB ✅");
  } catch (error) {
    console.error("فشل الاتصال بالقاعدة: ❌", error);
    throw error;
  }
};

export default connectDB;