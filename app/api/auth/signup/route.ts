import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs"; // تأكد من تنصيب المكتبة: npm install bcryptjs

export async function POST(req: Request) {
  try {
    // 1. الاتصال بالداتابيز
    await connectDB();

    // 2. استقبال البيانات من الطلب
    const { username, email, password } = await req.json();

    // 3. التحقق من وجود المستخدم مسبقاً
    const userExists = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (userExists) {
      return NextResponse.json(
        { message: "المستخدم أو البريد الإلكتروني موجود مسبقاً" },
        { status: 400 }
      );
    }

    // 4. تشفير كلمة المرور (Security First)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. إنشاء المستخدم الجديد بناءً على الـ Model المحدث
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      friends: [], // تهيئة مصفوفة الأصدقاء
    });

    // 6. حفظ في MongoDB
    await newUser.save();

    return NextResponse.json(
      { message: "تم إنشاء الحساب بنجاح" },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("SIGNUP_ERROR: ", error.message);
    return NextResponse.json(
      { message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}