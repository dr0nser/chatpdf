import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Document, RecursiveCharacterTextSplitter } from "@pinecone-database/doc-splitter";
import { Pinecone, PineconeRecord, RecordMetadata } from "@pinecone-database/pinecone";
import { Vector } from "@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/data";
import md5 from "md5";
import { getEmbeddings } from "../embeddings";
import { downloadFileFromS3 } from "./s3-server";

type PDFPage = {
  pageContent: string;
  metadata: {
    loc: {
      pageNumber: number;
    };
  };
};

export const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

export async function loadFileFromS3IntoPinecone(fileKey: string) {
  //* 1. get PDF from S3 and get the content of each pages into pages array
  const fileName = await downloadFileFromS3(fileKey);
  if (!fileName) {
    throw new Error("Unable to download file from S3");
  }
  const pdfLoader = new PDFLoader(fileName);
  const pdfPages = (await pdfLoader.load()) as PDFPage[];

  //* 2. split and segment the pages into smaller chunks
  const docs = await Promise.all(pdfPages.map((page) => prepareDocument(page)));

  //* 3. vectorize and embed individual documents
  const vectors = await Promise.all(docs.flat().map(embedDocument));

  //* 4. Upload vectors to pinecone
  const pineconeIndex = pinecone.Index("chatpdf");
  await pineconeIndex.namespace("chatpdf").upsert(vectors as PineconeRecord<RecordMetadata>[]);

  return docs[0];
}

export async function embedDocument(doc: Document) {
  try {
    const embeddings = await getEmbeddings(doc.pageContent);
    const hash = md5(doc.pageContent);
    return {
      id: hash,
      values: embeddings,
      metadata: {
        text: doc.metadata.text,
        pageNumber: doc.metadata.pageNumber,
      },
    } as Vector;
  } catch (error) {
    console.log("Error embedding document", error);
    throw error;
  }
}

export function truncateStringByBytes(str: string, bytes: number) {
  const encoder = new TextEncoder();
  return new TextDecoder("utf-8").decode(encoder.encode(str).slice(0, bytes));
}

async function prepareDocument(page: PDFPage) {
  let { pageContent, metadata } = page;
  const splitter = new RecursiveCharacterTextSplitter();
  const docs = await splitter.splitDocuments([
    new Document({
      pageContent: cleanLangchainPdfContent(pageContent),
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        text: truncateStringByBytes(pageContent, 36000),
      },
    }),
  ]);
  return docs;
}

const cleanLangchainPdfContent = (content: string): string => {
  //* Remove single quotes and plus symbols
  let cleanedContent = content.replace(/'/g, "").replace(/\+/g, " ");
  //* Replace '\n' with a space
  cleanedContent = cleanedContent.replace(/\\n/g, " ");
  //* Remove extra whitespace
  cleanedContent = cleanedContent.replace(/\s+/g, " ").trim();
  return cleanedContent;
};
