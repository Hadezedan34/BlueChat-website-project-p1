import { NextResponse } from 'next/server';
import connectDB from "@/lib/mongodb"; 
import User from "@/lib/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { senderId, receiverId } = await req.json();

    if (!senderId || !receiverId) {
      return NextResponse.json({ error: 'Missing IDs' }, { status: 400 });
    }

    // 1. إضافة طلب الصداقة للمستلم (Receiver)
  
    await User.findByIdAndUpdate(receiverId, {
      $addToSet: { friendRequests: senderId }
    });

    return NextResponse.json({ message: 'Request sent successfully' }, { status: 200 });
  } catch (error: any) {
    console.error("Error in friend request:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}