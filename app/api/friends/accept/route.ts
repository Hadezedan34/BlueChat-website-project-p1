import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { userId, friendId } = await req.json();

    // السحر هون في استخدام $addToSet
    // هي العملية بتضيف الـ ID فقط إذا ما كان موجود أصلاً
    await User.findByIdAndUpdate(userId, {
      $addToSet: { friends: friendId }, 
      $pull: { friendRequests: friendId } // منشيل الطلب بعد القبول
    });

    await User.findByIdAndUpdate(friendId, {
      $addToSet: { friends: userId }
    });

    return NextResponse.json({ message: 'Success' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}