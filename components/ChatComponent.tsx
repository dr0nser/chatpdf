"use client";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DrizzleChat } from "@/lib/db/schema";
import { useQuery } from "@tanstack/react-query";
import { Message, useChat } from "ai/react";
import axios from "axios";
import { ArrowUp } from "lucide-react";
import MessageList from "./MessageList";
import { Input } from "./ui/input";
import { RainbowButton } from "./ui/rainbow-button";

type Props = {
  chat: DrizzleChat;
};

const ChatComponent = ({ chat }: Props) => {
  const { data, isLoading } = useQuery({
    queryKey: ["chat", chat.id],
    queryFn: async () => {
      const response = await axios.post<Message[]>("/api/get-messages", { chatId: chat.id });
      return response.data;
    },
  });

  const { input, handleInputChange, handleSubmit, messages } = useChat({
    api: "/api/chats",
    body: {
      chatId: chat.id,
    },
    initialMessages: data || [],
  });

  return (
    <div className="relative h-screen bg-neutral-900">
      <div className="max-w-4/5 truncate sticky top-0 inset-x-0 bg-white dark:bg-neutral-900 h-12 text-center py-3">
        <h3 className="text-xl font-bold text-black dark:text-gray-200">{chat.pdfName}</h3>
      </div>
      <MessageList messages={messages} isLoading={isLoading} />

      <form onSubmit={handleSubmit} className="sticky bottom-0 inset-x-0 px-6 py-4">
        <div className="z-50 w-full h-14 flex items-center bg-neutral-700 rounded-full px-3">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask any question..."
            className="w-full border-0 focus-visible:ring-0 placeholder:text-neutral-300 text-base"
          />
          {input.length > 0 ? (
            <RainbowButton className="h-8 w-8 rounded-full p-0 group">
              <ArrowUp className="w-5 h-5 dark:text-neutral-900 group-hover:-translate-y-[2px] transition-all duration-200" />
            </RainbowButton>
          ) : (
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="h-8 w-8 bg-neutral-500 rounded-full flex items-center justify-center">
                    <ArrowUp className="w-5 h-5 dark:text-neutral-700" />
                  </button>
                </TooltipTrigger>
                <TooltipContent sideOffset={10} className="dark:bg-neutral-600 dark:text-white">
                  <p>Message is empty</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </form>
    </div>
  );
};

export default ChatComponent;
