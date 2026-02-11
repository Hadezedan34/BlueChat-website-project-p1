import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb"; // تأكد من مسار ملف الاتصال بالداتابيز
import User from "@/lib/models/User"; // تأكد من مسار الموديل

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { userId, lat, lng } = await req.json();

    if (!userId || !lat || !lng) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    // تحديث إحداثيات المستخدم ووقت آخر ظهور
    await User.findByIdAndUpdate(userId, {
      location: {
        lat,
        lng,
        lastSeen: new Date()
      }
    });

    return NextResponse.json({ success: true, message: "Satellite Link Updated" });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}