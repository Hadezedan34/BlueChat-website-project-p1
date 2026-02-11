import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function POST(req: Request, { params }: { params: any }) {
  try {
    const { image } = await req.json(); // هاد هو رابط الـ secure_url اللي جايك من الفرونت
    const { id } = await params;

    await dbConnect();
    
    // تحديث الداتابيز مباشرة بالرابط
    const updatedUser = await User.findByIdAndUpdate(
      id, 
      { image: image }, // تخزين الرابط مباشرة
      { new: true }
    );

    if (!updatedUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json(updatedUser);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}