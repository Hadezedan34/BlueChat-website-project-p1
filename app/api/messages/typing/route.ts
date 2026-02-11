import { NextResponse } from 'next/server';
import { pusherServer } from "@/lib/pusher";

export async function POST(req: Request) {
  const { sender, receiver } = await req.json();
  
  // منبعت إشارة لحظية بدون داتابيس (عشان السرعة)
  await pusherServer.trigger(`user-${receiver}`, "typing", { sender });
  
  return NextResponse.json({ success: true });
}