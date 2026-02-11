import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;

    if (!id) return NextResponse.json({ error: 'No ID provided' }, { status: 400 });

    const user = await User.findById(id)
      .populate('friends', 'username image') 
      .populate('friendRequests', 'username image');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // تأكدنا إنه عم يرجع JSON حقيقي
    return NextResponse.json(user, { status: 200 });
    
  } catch (error) {
    console.error("Critical API Error:", error);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

// أضف دالة POST فارغة أو الكود السابق لو بدك، المهم الـ GET تكون مضبوطة