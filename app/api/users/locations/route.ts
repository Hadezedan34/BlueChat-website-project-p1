import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/User";

export async function GET() {
  try {
    await dbConnect();

    // جلب المستخدمين اللي عندهم إحداثيات فقط
    // بنعمل Select فقط للحقول الضرورية للخريطة (للأمان والسرعة)
    const explorers = await User.find({
      "location.lat": { $exists: true }
    }).select("username image location");

    return NextResponse.json(explorers);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch explorers" }, { status: 500 });
  }
}