// app/api/users/search/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb"; // تأكد من مسار ملف الاتصال عندك
import User from "@/lib/models/User";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("search");

    if (!query) return NextResponse.json([], { status: 400 });

    await connectDB();

    // البحث عن مستخدم بالإيميل أو اليوزرنيم (مع استثناء الباسورد)
    const users = await User.find({
      $or: [
        { email: query },
        { username: query }
      ]
    }).select("-password");

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}