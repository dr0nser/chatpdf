import { ChatPage } from "@/components/ChatPage";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

type Props = {
  params: {
    chatId: string;
  };
};

const ChatsPage = async ({ params: { chatId } }: Props) => {
  const { userId } = auth();

  if (!userId) return redirect("/sign-in");

  const loggedInUserChats = await db
    .select()
    .from(chats)
    .orderBy(desc(chats.createdAt))
    .where(eq(chats.userId, userId));

  const activeChat = chatId
    ? loggedInUserChats.find((chat) => chat.id === parseInt(chatId))
    : loggedInUserChats[0];

  if (!activeChat)
    return (
      <div className="w-screen h-screen flex justify-center items-center pt-10 text-white">
        Create a chat to continue
      </div>
    );

  return <ChatPage chats={loggedInUserChats} activeChat={activeChat} />;
};

export default ChatsPage;
