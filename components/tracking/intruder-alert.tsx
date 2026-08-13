"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, X, Camera, MapPin, Clock, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useViewport } from "@/contexts/viewport-context"

interface IntruderAlertProps {
  onDismiss: () => void
  timestamp: string
  location: string
  motionLevel: number
  severity: string
  capturedImage?: string | null
}

export function IntruderAlert({
  onDismiss,
  timestamp,
  location,
  motionLevel,
  severity,
  capturedImage,
}: IntruderAlertProps) {
  const [isVisible, setIsVisible] = useState(false)
  const { isMobile } = useViewport()

  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp)
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "Invalid Date"
      }
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    } catch (e) {
      return "Invalid Date"
    }
  }

  useEffect(() => {
    // Animation timing
    setTimeout(() => setIsVisible(true), 100)

    // Audio not supported in v0 preview environment

    // Auto-close after 30 seconds
    const timeout = setTimeout(() => {
      handleClose()
    }, 30000)

    return () => {
      clearTimeout(timeout)
    }
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    // Wait for animation to complete before dismissing
    setTimeout(onDismiss, 300)
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={handleClose}
    >
      <div
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      <div
        className={`relative bg-card border-2 border-red-500 rounded-lg shadow-lg w-full max-w-lg transform transition-all duration-300 ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Alert header */}
        <div className="flex items-center justify-between bg-red-500 text-white p-4 rounded-t-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 animate-pulse" />
            <h2 className="text-lg font-bold">Intruder Alert</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={handleClose} className="text-white hover:bg-red-600">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Alert content */}
        <div className="p-4 space-y-4">
          {/* Alert image */}
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden border border-muted">
            <div className="absolute inset-0 flex items-center justify-center">
              {capturedImage ? (
                <img
                  src={capturedImage || "/placeholder.svg"}
                  alt="Alert capture"
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src="/placeholder.svg?height=300&width=400"
                  alt="Alert capture"
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-red-500/20 animate-pulse" />
            </div>

            <div className="absolute top-2 right-2">
              <Badge variant="destructive" className="animate-pulse">
                LIVE
              </Badge>
            </div>

            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/70 text-white text-xs px-2 py-1 rounded">
              <Camera className="h-3 w-3" />
              <span>Camera Feed</span>
            </div>
          </div>

          {/* Alert details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-red-500" />
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">{location}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-red-500" />
                <div>
                  <p className="text-sm font-medium">Time Detected</p>
                  <p className="text-sm text-muted-foreground">{formatTime(timestamp)}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-red-500" />
                <div>
                  <p className="text-sm font-medium">Activity Level</p>
                  <p className="text-sm text-muted-foreground">
                    {isNaN(motionLevel) ? "N/A" : `${Math.round(motionLevel)}%`} (High)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <div>
                  <p className="text-sm font-medium">Threat Level</p>
                  <p className="text-sm text-muted-foreground">Potential Intruder</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alert actions */}
        <div className="flex flex-col sm:flex-row gap-2 p-4 border-t">
          <Button variant="destructive" className="flex-1">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Dispatch Security
          </Button>
          <Button variant="outline" className="flex-1 bg-transparent" onClick={handleClose}>
            Dismiss Alert
          </Button>
        </div>
      </div>
    </div>
  )
}
