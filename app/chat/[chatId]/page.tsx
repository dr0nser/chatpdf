import ChatComponent from "@/components/ChatComponent";
import ChatSidebar from "@/components/ChatSidebar";
import PDFViewer from "@/components/PDFViewer";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    chatId: string;
  };
};

const ChatPage = async ({ params: { chatId } }: Props) => {
  const { userId } = auth();

  if (!userId) return redirect("/sign-in");

  const loggedInUserChats = await db.select().from(chats).where(eq(chats.userId, userId));

  if (!loggedInUserChats || !loggedInUserChats.find((chat) => chat.id === parseInt(chatId)))
    return redirect("/");

  const activeChat = loggedInUserChats.find((chat) => chat.id === parseInt(chatId));

  return (
    <div className="flex max-h-screen overflow-y-scroll">
      <div className="flex w-full max-h-screen overflow-y-scroll">
        {/* chat sidebar */}
        <div className="flex-1 max-w-xs">
          <ChatSidebar chats={loggedInUserChats} chatId={parseInt(chatId)} />
        </div>
        {/* pdf viewer */}
        <div className="max-h-screen p-4 overflow-y-scroll flex-[5]">
          <PDFViewer pdfUrl={activeChat?.pdfUrl as string} />
        </div>
        {/* chat component */}
        <div className="flex-[3] border-l-4 border-l-slate-200">
          <ChatComponent chatId={parseInt(chatId)} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
