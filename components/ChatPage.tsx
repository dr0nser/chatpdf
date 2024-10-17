"use client";
import { DrizzleChat } from "@/lib/db/schema";
import { cn } from "@/lib/utils";
import { Home, MessageCircle } from "lucide-react";
import { Sidebar, SidebarBody, SidebarLink } from "./aceternity/sidebar";
import ChatComponent from "./ChatComponent";
import PDFViewer from "./PDFViewer";

type Props = {
  chats: DrizzleChat[];
  activeChat: DrizzleChat;
};

export function ChatPage({ chats, activeChat }: Props) {
  return (
    <div className="w-screen h-screen rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden">
      <Sidebar animate={false}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <div className="h-full overflow-y-auto scrollbar-thin flex flex-col gap-2">
              {chats.map((chat) => (
                <SidebarLink
                  key={chat.id}
                  className={cn({
                    "bg-gradient-to-r from-indigo-300 to-purple-300 dark:from-indigo-500 dark:to-purple-500":
                      chat.id === activeChat.id,
                  })}
                  link={{
                    label: chat.pdfName,
                    href: `/chats/${chat.id}`,
                    icon: <MessageCircle className="mr-2 w-5 h-5" />,
                  }}
                />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "Home",
                href: "/",
                icon: <Home className="mr-2 w-5 h-5" />,
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="w-full grid grid-cols-2">
        <PDFViewer pdfUrl={activeChat.pdfUrl as string} />
        <ChatComponent chat={activeChat} />
      </div>
    </div>
  );
}
