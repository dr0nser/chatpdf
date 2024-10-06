import { GetObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import process from "process";
import { s3Client } from "./s3";

export async function downloadFileFromS3(fileKey: string): Promise<string | null> {
  const command = new GetObjectCommand({
    Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME!,
    Key: "uploads/" + fileKey,
  });
  try {
    const response = await s3Client.send(command);
    if (!response.Body) {
      throw new Error("No content in response body");
    }
    const fileName = process.cwd() + `/tmp/pdf-${Date.now()}.pdf`;
    const arr = await response.Body.transformToByteArray();
    fs.writeFileSync(fileName, arr as Buffer);
    return fileName;
  } catch (error) {
    console.error({ message: "Error downloading file from S3:", error });
    return null;
  }
}
