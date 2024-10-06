"use client";

import { DrizzleChat } from "@/lib/db/schema";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { Home, MessageCircle, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  chats: DrizzleChat[];
  chatId: number;
};

const ChatSidebar = ({ chats, chatId }: Props) => {
  return (
    <div className="w-full h-screen p-4 text-gray-200 bg-gray-900">
      <Link href="/">
        <Button className="w-full border-dashed border-white border">
          <PlusCircle className="mr-2 w-4 h-4" />
          New Chat
        </Button>
      </Link>
      <div className="flex flex-col gap-2 mt-4">
        {chats.map((chat) => (
          <Link key={chat.id} href={`/chat/${chat.id}`}>
            <div
              className={cn("rounded-lg my-1 px-3 py-2 text-slate-300 flex items-center", {
                "bg-violet-600 text-white": chat.id === chatId,
                "hover:text-white": chat.id !== chatId,
              })}
            >
              <MessageCircle className="mr-2 w-5 h-5" />
              <p className="w-full overflow-hidden text-sm truncate">{chat.pdfName}</p>
            </div>
          </Link>
        ))}
      </div>
      <div className="absolute bottom-4 left-4">
        <div className="flex flex-col items-center gap-2 text-sm text-slate-500 flex-wrap">
          <Link href="/" className="flex items-center my-1 px-3 py-2 hover:text-white">
            <Home className="mr-2 w-5 h-5" /> Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
