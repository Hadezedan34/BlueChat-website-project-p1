import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Message from '@/lib/models/message';
import { pusherServer } from '@/lib/pusher';

// 1. جلب الرسائل (الكود تبعك)
export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const sender = searchParams.get('sender');
    const receiver = searchParams.get('receiver');

    if (!sender || !receiver) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const messages = await Message.find({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender }
      ]
    }).sort({ createdAt: 1 });

    return NextResponse.json(messages);
  } catch (err) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

// 2. إرسال وحفظ رسالة جديدة (الحل لخطأ 405)
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { sender, receiver, text } = body;

    if (!sender || !receiver || !text) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const newMessage = await Message.create({
      sender,
      receiver,
      text,
      createdAt: new Date()
    });
 await pusherServer.trigger(`user-${receiver}`, "new-message", { 
        sender: sender.toString()
    });
    return NextResponse.json(newMessage);
  } catch (err) {
    console.error("POST Error:", err);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}