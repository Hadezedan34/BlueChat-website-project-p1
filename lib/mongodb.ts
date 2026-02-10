import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

export const dbConnect = async () => {
  try {
    if (!MONGODB_URI) {
      console.error("❌ MONGODB_URI is undefined!");
      return;
    }

    // تنظيف الرابط من أي مسافات أو أسطر جديدة قد يضيفها Render
    const cleanUri = MONGODB_URI.replace(/\s/g, "");

    if (mongoose.connection.readyState >= 1) return;

    await mongoose.connect(cleanUri);
    console.log("✅ Connected to MongoDB successfully on Render!");
  } catch (error: any) {
    console.error("❌ فشل الاتصال بالقاعدة:", error.message);
    // هاد السطر رح يطبع لنا أول 10 أحرف من الرابط بالـ Logs عشان نتأكد إنه صح
    console.log("Start of URI:", MONGODB_URI?.substring(0, 15));
  }
};
export default dbConnect;