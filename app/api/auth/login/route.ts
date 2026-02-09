import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    // 1. البحث عن المستخدم عن طريق الإيميل
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "هذا الحساب غير موجود" }, { status: 401 });
    }

    // 2. مقارنة كلمة المرور المشفرة
    // كلمة المرور اللي كتبها هادي (password) vs اللي بالداتابيز (user.password)
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return NextResponse.json({ message: "كلمة السر غير صحيحة" }, { status: 401 });
    }

    // 3. إذا كل شي تمام، بنرجع بيانات اليوزر (بدون الباسورد)
    return NextResponse.json({
      message: "تم تسجيل الدخول بنجاح",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        friends: user.friends
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error("LOGIN_ERROR: ", error.message);
    return NextResponse.json({ message: "حدث خطأ في السيرفر" }, { status: 500 });
  }
}