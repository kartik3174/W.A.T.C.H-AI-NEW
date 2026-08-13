import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get("file")

  const aiForm = new FormData()
  aiForm.append("file", file as Blob)

  const response = await fetch("http://127.0.0.1:8000/detect", {
    method: "POST",
    body: aiForm
  })

  const data = await response.json()

  return NextResponse.json(data)
}