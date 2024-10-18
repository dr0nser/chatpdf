"use client";
import { uploadPDFToS3 } from "@/lib/db/s3";
import { UserButton, useUser } from "@clerk/nextjs";
import axios from "axios";
import { motion } from "framer-motion";
import { ChevronRightIcon, LogIn } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { FileUpload } from "./aceternity/file-upload";
import { HeroHighlight, Highlight } from "./aceternity/hero-highlight";

export function HomePage() {
  const router = useRouter();
  const { isSignedIn } = useUser();
  const [, setFiles] = useState<File[]>([]);

  const createChat = async ({
    fileKey,
    fileName,
  }: {
    fileKey: string;
    fileName: string;
  }): Promise<{ chatId: string }> => {
    const response = await axios.post("/api/create-chat", { fileKey, fileName });
    return response.data;
  };

  const handleCreateChat = async (fileKey: string, fileName: string) => {
    try {
      const createdChat = await toast.promise(
        createChat({ fileKey, fileName }),
        {
          loading: "Creating chat...",
          success: "Chat created",
          error: "Could not create chat",
        },
        {
          loading: {
            duration: 5000,
          },
        }
      );
      router.push(`/chats/${createdChat.chatId}`);
    } catch (error) {
      console.error({ message: "Error creating chat", error });
    }
  };

  const canUploadMoreFiles = async (): Promise<boolean> => {
    const chatCountResponse = await axios.get("/api/chat-count");
    const chatCountData = await chatCountResponse.data;
    const chatCount = chatCountData.chats;
    if (chatCount === null || chatCount === undefined) return false;
    return chatCount < 5;
  };

  const handleFileUpload = async (files: File[]) => {
    const canUploadFile = await canUploadMoreFiles();
    console.log(canUploadFile);
    if (!canUploadFile) {
      toast.error("Sorry! We are processing limited files at the moment");
      return;
    } else {
      try {
        setFiles(files);
        const uploadedFile = files[0];
        if (uploadedFile.size > 10 * 1024 * 1024) {
          toast.error("Maximum 10MB file is allowed");
          return;
        }
        const uploadedFileData = await toast.promise(uploadPDFToS3(uploadedFile), {
          loading: "Uploading file...",
          success: "File uploaded",
          error: "Unable to upload file",
        });
        const { fileKey, fileName } = uploadedFileData;
        if (!fileKey || !fileName) {
          toast.error("Something went wrong");
          return;
        }
        handleCreateChat(fileKey, fileName);
      } catch (error) {
        console.error({ message: "Error uploading file", error });
      }
    }
  };

  const handleOpenChats = async () => {
    const response = await axios.get("/api/chat-count");
    const data = await response.data;
    const chatCount: number = data.chats;
    if (chatCount === 0)
      toast.error("Upload a file to continue", {
        style: {
          backgroundColor: "black",
          color: "white",
        },
      });
    else router.push(`/chats/${data.recentChatId}`);
  };

  return (
    <HeroHighlight>
      <motion.h1
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: [20, -5, 0],
        }}
        transition={{
          duration: 0.5,
          ease: [0.4, 0.0, 0.2, 1],
        }}
        className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto"
      >
        Start conversing seamlessly with documents using{" "}
        <Highlight className="text-black dark:text-white">ChatPDF</Highlight>
        <span className="ml-5">
          <UserButton />
        </span>
      </motion.h1>
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: [20, -5, 0],
        }}
        transition={{
          duration: 0.5,
          ease: [0.4, 0.0, 0.2, 1],
        }}
        className="w-full flex justify-center pt-10"
      >
        {isSignedIn ? (
          <motion.button
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: [20, -5, 0],
            }}
            transition={{
              duration: 0.5,
              ease: [0.4, 0.0, 0.2, 1],
            }}
            className="mx-auto p-[1.5px] relative group/btn"
            onClick={() => {
              const openChats = handleOpenChats();
              toast.promise(openChats, {
                loading: "Opening chats",
                success: "Opened chats",
                error: "Error opening chats",
              });
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
            <div className="px-8 py-2 bg-black rounded-[6px] relative transition duration-200 text-white hover:bg-transparent">
              <motion.span
                key="reaction"
                className="relative block font-semibold"
                initial={{ x: 0 }}
                exit={{ x: 50, transition: { duration: 0.1 } }}
              >
                <span className="inline-flex items-center">
                  Go to chats{" "}
                  <ChevronRightIcon className="ml-1 mt-[1px] size-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                </span>
              </motion.span>
            </div>
          </motion.button>
        ) : (
          <Link href="/sign-in">
            <button className="mx-auto p-[1.5px] relative group/btn">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
              <div className="px-8 py-2 bg-black rounded-[6px] relative transition duration-200 text-white hover:bg-transparent">
                <motion.span
                  key="reaction"
                  className="relative block font-semibold"
                  initial={{ x: 0 }}
                  exit={{ x: 50, transition: { duration: 0.1 } }}
                >
                  <span className="inline-flex items-center">
                    Sign in to continue{" "}
                    <LogIn className="ml-1 mt-[1px] size-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </span>
                </motion.span>
              </div>
            </button>
          </Link>
        )}
      </motion.div>
      {isSignedIn && (
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: [20, -5, 0],
          }}
          transition={{
            duration: 0.5,
            ease: [0.4, 0.0, 0.2, 1],
          }}
          className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto"
        >
          <div className="mt-10 w-full max-w-4xl mx-auto h-fit border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
            <FileUpload onChange={handleFileUpload} />
          </div>
        </motion.div>
      )}
    </HeroHighlight>
  );
}
