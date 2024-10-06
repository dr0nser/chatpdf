import { Configuration, OpenAIApi } from "openai-edge";
export const runtime = "edge";
import { openai } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText } from "ai";

// const config = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });
// const openaiapi = new OpenAIApi(config);

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    // const response = await openaiapi.createChatCompletion({
    //   model: "gpt-4o",
    //   messages,
    //   stream: true,
    // });
    const response = await streamText({
      model: openai("gpt-4o"),
      messages: convertToCoreMessages(messages),
    });
    return response.toDataStreamResponse();
  } catch (error) {
    console.log(error);
  }
}
