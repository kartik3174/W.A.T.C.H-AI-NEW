import { NextResponse } from "next/server"

const YOLO_SERVER_URL = process.env.YOLO_SERVER_URL || "http://127.0.0.1:8000"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file")

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No image file provided" },
        { status: 400 }
      )
    }

    const aiForm = new FormData()
    aiForm.append("file", file as Blob)

    // Set a 4-second timeout for the Python AI server request
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 4000)

    try {
      const response = await fetch(`${YOLO_SERVER_URL}/detect`, {
        method: "POST",
        body: aiForm,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`AI server returned HTTP ${response.status}`)
      }

      const data = await response.json()
      return NextResponse.json(data)
    } catch (fetchError: any) {
      clearTimeout(timeoutId)

      // Graceful fallback when YOLO Python server is offline / unreachable
      console.warn(`[W.A.T.C.H AI] Python YOLO server unreachable at ${YOLO_SERVER_URL}: ${fetchError.message}`)

      return NextResponse.json({
        success: false,
        offline: true,
        message: "Python YOLO server is not running on port 8000. Using client-side TensorFlow.js model.",
        detections: [],
      })
    }
  } catch (error: any) {
    console.error("[W.A.T.C.H AI] Detection API Error:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process image detection" },
      { status: 500 }
    )
  }
}