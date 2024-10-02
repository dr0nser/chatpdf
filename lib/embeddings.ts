import { Configuration, OpenAIApi } from "openai-edge";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

// converts text to vector
export async function getEmbeddings(text: string) {
  try {
    const response = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: text,
    });
    const data = await response.json();
    return data.data[0].embedding as number[];
  } catch (error) {
    console.log("Error calling OpenAI embeddings API", error);
    throw error;
  }
}
