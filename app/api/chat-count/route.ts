import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = auth();
  const _chats = await db
    .select()
    .from(chats)
    .where(eq(chats.userId, userId as string));

  if (_chats.length === 0) return NextResponse.json({ chats: _chats.length });

  return NextResponse.json({ chats: _chats.length, recentChatId: _chats[0].id });
}
