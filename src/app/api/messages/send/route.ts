import { NextRequest } from "next/server";
import { googleAi } from "@/lib/ai";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic"; // For edge streaming

export async function POST(req: NextRequest) {
  const { chatId, userMessage } = await req.json();

  // Save user message to DB
  await prisma.message.create({
    data: {
      chatId,
      role: "USER",
      content: userMessage,
    },
  });

  // Start streaming Gemini response
  const response = await googleAi.models.generateContentStream({
    model: "gemini-2.0-flash",
    contents: userMessage,
    config: {
      systemInstruction: [
        "You are a helpful assistant",
        "Give all your responses in the form of markdown. Do not use new lines in markdown",
      ],
    },
  });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      let fullResponse = "";

      for await (const chunk of response) {
        controller.enqueue(encoder.encode(chunk.text));
        fullResponse += chunk.text;
      }

      controller.close();

      // Save assistant message after streaming finishes
      await prisma.message.create({
        data: {
          chatId,
          role: "ASSISTANT",
          content: fullResponse,
        },
      });
    },
  });

  return new Response(stream);
}
