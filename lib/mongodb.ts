import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("فشل الاتصال - الرابط المستخدم هو:", process.env.MONGODB_URI?.substring(0, 15) + "...");
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