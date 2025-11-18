import { NextRequest } from "next/server";
import { googleAi } from "@/lib/ai";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { availableTools, functionDeclarations, toolNameMapper } from "@/lib/ai/tools";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const chatId = searchParams.get("chatId") || "";
  const userMessage = searchParams.get("q") || "";

  const contents = [
    { role: "user", parts: [{ text: decodeURIComponent(userMessage) }] },
  ];

  // Save user message 
  await prisma.message.create({
    data: {
      chatId,
      role: "USER",
      content: decodeURIComponent(userMessage),
    },
  });

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(encoder.encode(`event: status\ndata: generating\n\n`));

      try {
        let continueStreaming = true;
        let fullResponse = "";

        while (continueStreaming) {
          const response = await googleAi.models.generateContentStream({
            model: "gemini-2.0-flash",
            contents,
            config: {
              systemInstruction: [
                "You are a helpful assistant who can call tools when needed.",
                "Return markdown responses when possible.",
              ],
              tools: [{ functionDeclarations }],
            },
          });

          
          let toolCalled = false;

          for await (const chunk of response) {
            if (chunk.functionCalls && chunk.functionCalls.length > 0) {
              toolCalled = true;

              const functionCall = chunk.functionCalls[0];
              const toolName =
                (functionCall.name && toolNameMapper[functionCall.name]) ||
                "Calling tool";

              controller.enqueue(
                encoder.encode(
                     `event: tool_call\ndata: ${JSON.stringify({ tool: toolName })}\n\n`
                        )
                );

              const fn = availableTools[functionCall.name];
              const args = Object.values(functionCall.args);
              const fnResponse = await fn(...args);

              // Update context for next model call
              contents.push({ role: "model", parts: [{ functionCall }] });
              contents.push({
                role: "user",
                parts: [
                  {
                    functionResponse: {
                      name: functionCall.name,
                      response: fnResponse,
                    },
                  },
                ],
              });
            } else if (chunk.text) {
              // Normal text streaming
              fullResponse += chunk.text;
              controller.enqueue(
                encoder.encode(
                  `event: token\ndata: ${JSON.stringify(chunk.text)}\n\n`
                )
              );
            }
          }

          // If a tool was called, loop again (model re-run with updated context)
          if (!toolCalled) {
            continueStreaming = false;
          } else {
            toolCalled = false;
          }
        }

        controller.enqueue(encoder.encode(`event: done\ndata: end\n\n`));
        controller.close();

        // Optional: Save final assistant response
        await prisma.message.create({
          data: { chatId, role: "ASSISTANT", content: fullResponse },
        });
      } catch (err) {
        console.error("SSE error:", err);
        controller.enqueue(
          encoder.encode(`event: error\ndata: ${err.message}\n\n`)
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
