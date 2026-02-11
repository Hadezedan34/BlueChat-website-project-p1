import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';


export async function PATCH(request: Request) {
  try {
    console.log("--- 🛰️ SYNC START ---");
    await dbConnect();
    
    const body = await request.json();
    console.log("Request Body:", body); // هاد رح يفرجينا الـ ID بالـ Terminal

    const { userId, isGhostMode } = body;

    if (!userId) {
      console.log("❌ Error: No UserId");
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }

    // ملاحظة: تأكد من أن الموديل User يدعم حقل isGhostMode
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isGhostMode: isGhostMode },
      { new: true }
    );

    if (!updatedUser) {
        console.log("❌ Error: User not found in DB");
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log("✅ Sync Success for:", updatedUser.username);
    return NextResponse.json({ success: true, isGhostMode: updatedUser.isGhostMode });

  } catch (error: any) {
    console.error("❌ CRITICAL API ERROR:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}