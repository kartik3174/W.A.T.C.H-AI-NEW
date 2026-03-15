"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"

export function AIMonitoringClient() {

  const [AIMonitoringDashboard, setAIMonitoringDashboard] =
    useState<React.ComponentType | null>(null)

  const [loading, setLoading] = useState(true)

  const [detections, setDetections] = useState<any[]>([])
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    const loadComponent = async () => {
      try {
        const module = await import(
          "@/components/ai-monitoring/ai-monitoring-dashboard"
        )
        setAIMonitoringDashboard(() => module.default)
      } catch (error) {
        console.error("Failed to load AI monitoring dashboard:", error)
      } finally {
        setLoading(false)
      }
    }

    loadComponent()
  }, [])

  async function detectAnimal(file: File) {

    const formData = new FormData()
    formData.append("file", file)

    const res = await fetch("/api/detect", {
      method: "POST",
      body: formData
    })

    const data = await res.json()

    console.log("AI Result:", data)

    setDetections(data.detections || [])
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {

    const file = e.target.files?.[0]

    if (!file) return

    const preview = URL.createObjectURL(file)
    setImagePreview(preview)

    await detectAnimal(file)
  }

  if (loading) {
    return (
      <Card className="w-full p-8">
        <CardContent className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">
              Loading AI monitoring dashboard...
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!AIMonitoringDashboard) {
    return (
      <Card className="w-full p-8">
        <CardContent className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-muted-foreground">
              Failed to load AI monitoring dashboard.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">

      {/* Upload Section */}
      <Card className="p-6">
        <CardContent className="space-y-4">

          <h2 className="text-xl font-semibold">
            Wildlife AI Detection
          </h2>

          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="border p-2 rounded"
          />

          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="max-w-md rounded border"
            />
          )}

          {detections.length > 0 && (
            <div className="mt-4 space-y-2">
              {detections.map((d, i) => (
                <div key={i} className="p-2 border rounded bg-muted">
                  <b>Animal:</b> {d.label} <br />
                  <b>Confidence:</b>{" "}
                  {(d.confidence * 100).toFixed(2)}%
                </div>
              ))}
            </div>
          )}

        </CardContent>
      </Card>

      {/* Existing Dashboard */}
      <AIMonitoringDashboard />

    </div>
  )
}