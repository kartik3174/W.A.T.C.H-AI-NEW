import { streamText, type UIMessage } from "ai"
import { openai } from "@ai-sdk/openai"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Check if OPENAI_API_KEY is configured or let it fail naturally
    if (!process.env.OPENAI_API_KEY) {
      return new Response(
        "OpenAI API key is missing. Add OPENAI_API_KEY to your .env file to enable the W.A.T.C.H AI Assistant.", 
        { status: 500 }
      );
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
