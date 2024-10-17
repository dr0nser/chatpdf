import { cn } from "@/lib/utils";
import { Message } from "ai/react";
import { Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";

type Props = {
  messages: Message[];
  isLoading: boolean;
};

const MessageList = ({ messages, isLoading }: Props) => {
  const messageContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const messageContainer = messageContainerRef.current;
    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  if (isLoading)
    return (
      <div className="w-full h-full flex flex-1 justify-center items-center">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );

  if (!messages) return <></>;

  return (
    <div className="h-full pb-36 pl-6 pt-5 relative">
      <div
        className="h-full pr-6 flex flex-col gap-2 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-600"
        ref={messageContainerRef}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              {
                "justify-end": message.role === "user",
              },
              {
                "justify-start": ["system", "assistant"].includes(message.role),
              }
            )}
          >
            <div
              className={cn(
                "my-1 py-1 font-normal text-[16px] leading-relaxed px-3 shadow-sm border rounded-2xl subpixel-antialiased",
                {
                  "bg-neutral-700 text-neutral-200 rounded-br-sm max-w-2xl":
                    message.role === "user",
                  "w-5/6 text-neutral-200 border-0": ["system", "assistant"].includes(message.role),
                }
              )}
            >
              <p>{message.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageList;
