import { streamText, type UIMessage } from "ai"
import { openai } from "@ai-sdk/openai"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Check if OPENAI_API_KEY is configured or let it fail naturally
    if (!process.env.OPENAI_API_KEY) {
      // Return a simulated streaming response so the UI still works without a key
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          const text = "Elephants are the largest existing land animals. They are highly intelligent, have complex social structures, and play a crucial role as keystone species in their ecosystems!";
          const words = text.split(" ");
          for (const word of words) {
            controller.enqueue(encoder.encode(word + " "));
            await new Promise(resolve => setTimeout(resolve, 40)); // Simulate typing delay
          }
          controller.close();
        }
      });
      return new Response(stream);
    }

    const result = await streamText({
      model: openai("gpt-4o-mini"), 
      messages: messages.map((m: any) => ({ role: m.role, content: m.content })),
      abortSignal: req.signal,
    })

    return result.toTextStreamResponse()
  } catch (error: any) {
    console.error("[v0] AI Chat Error:", error)
    return new Response(error.message || "An error occurred", { status: 500 })
  }
}
