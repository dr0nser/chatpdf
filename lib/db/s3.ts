import { S3 } from "@aws-sdk/client-s3";

export async function uploadPDFToS3(file: File) {
  const s3 = new S3({
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY!,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
    },
    region: process.env.NEXT_PUBLIC_AWS_S3_REGION,
  });
  const fileKey = "uploads/" + Date.now().toString() + file.name.replace(/\s+/g, "-");
  const params = {
    Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME!,
    Key: fileKey,
    Body: file,
  };
  const uploadFileToS3 = (file: any): Promise<{ fileKey: string; fileName: string }> =>
    new Promise((resolve, reject) => {
      s3.putObject(params, (error: any) => {
        if (error) reject(error);
        resolve({ fileKey, fileName: file.name });
      });
    });
  return uploadFileToS3(file);
}

export function getS3Url(fileKey: string) {
  const url = `${process.env.NEXT_PUBLIC_AWS_S3_OBJECT_PREFIX_URL}/${fileKey}`;
  return url;
}
