import { cn } from "@/lib/utils";
import { Message } from "ai/react";
import { Loader, Loader2 } from "lucide-react";
import React from "react";

type Props = {
  messages: Message[];
  isLoading: boolean;
};

const MessageList = ({ messages, isLoading }: Props) => {
  if (isLoading)
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );

  if (!messages) return <></>;

  return (
    <div className="flex flex-col gap-2 px-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex",
            {
              "justify-end": message.role === "user",
            },
            {
              "justify-start": message.role === "assistant",
            }
          )}
        >
          <div
            className={cn(
              "max-w-2xl rounded-lg px-3 py-1 text-sm shadow-sm border border-gray-100",
              {
                "bg-violet-600 text-white": message.role === "user",
              }
            )}
          >
            <p>{message.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
