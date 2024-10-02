"use client";

import { uploadPDFToS3 } from "@/lib/db/s3";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Inbox, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";

type Props = {};

const FileUpload = (props: Props) => {
  const [isUploading, setIsUploading] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ fileKey, fileName }: { fileKey: string; fileName: string }) => {
      const res = await axios.post("/api/create-chat", { fileKey, fileName });
      return res.data;
    },
    onSuccess: (data) => {
      // toast.success(data.message);
    },
    onError: () => {
      toast.error("Error creating chat");
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      setIsUploading(true);
      const file = acceptedFiles[0];
      if (file.size > 10 * 1024 * 1024) {
        // file larger than 10MB
        toast.error("File too large");
        return;
      }
      try {
        const data = await uploadPDFToS3(file);
        if (!data.fileKey || !data.fileName) {
          toast.error("Something went wrong");
          return;
        }
        toast.success("File uploaded successfully");
        mutate(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsUploading(false);
      }
    },
  });

  return (
    <div className="p-2 bg-white rounded-xl">
      <div
        {...getRootProps({
          className:
            "border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col",
        })}
      >
        <input {...getInputProps()} />
        {isUploading || isPending ? (
          <>
            <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
            <p className="mt-2 text-sm text-slate-400">Spilling tea to GPT...</p>
          </>
        ) : (
          <>
            <Inbox className="w-10 h-10 text-blue-500" />
            <p className="mt-2 text-sm text-slate-400">Drop PDF here</p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
