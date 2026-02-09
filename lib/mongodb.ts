import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  
  try {
    await mongoose.connect(MONGODB_URI as string);
    console.log("تم الاتصال بـ MongoDB بنجاح! ✅");
  } catch (error) {
    console.error("فشل الاتصال بالقاعدة: ❌", error);
  }
};

export default connectDB;