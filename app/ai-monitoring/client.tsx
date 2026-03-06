"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"

// Instead of using dynamic import with Suspense, let's use a simpler approach
export function AIMonitoringClient() {
  const [AIMonitoringDashboard, setAIMonitoringDashboard] = useState<React.ComponentType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Import the component on the client side
    const loadComponent = async () => {
      try {
        const module = await import("@/components/ai-monitoring/ai-monitoring-dashboard")
        setAIMonitoringDashboard(() => module.default)
      } catch (error) {
        console.error("Failed to load AI monitoring dashboard:", error)
      } finally {
        setLoading(false)
      }
    }

    loadComponent()
  }, [])

  if (loading) {
    return (
      <Card className="w-full p-8">
        <CardContent className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading AI monitoring dashboard...</p>
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
            <p className="text-muted-foreground">Failed to load AI monitoring dashboard.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return <AIMonitoringDashboard />
}
