"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"

interface ResponsiveChartProps {
  title: string
  description?: string
  children: React.ReactNode
  height?: number
  className?: string
}

export function ResponsiveChart({ title, description, children, height = 300, className }: ResponsiveChartProps) {
  const [chartWidth, setChartWidth] = useState<number | undefined>(undefined)
  const [chartRef, setChartRef] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!chartRef) return

    const updateWidth = () => {
      setChartWidth(chartRef.clientWidth)
    }

    // Initial width
    updateWidth()

    // Update width on resize
    const resizeObserver = new ResizeObserver(updateWidth)
    resizeObserver.observe(chartRef)

    return () => {
      resizeObserver.disconnect()
    }
  }, [chartRef])

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div ref={setChartRef} className="w-full">
          <ChartContainer className={`h-[${height}px]`}>{children}</ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
