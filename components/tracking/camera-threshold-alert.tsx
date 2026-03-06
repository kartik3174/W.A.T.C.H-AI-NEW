"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Bell, Camera, VideoOff } from "lucide-react"
import { IntruderAlert } from "./intruder-alert"
import { useViewport } from "@/contexts/viewport-context"

export function CameraThresholdAlert() {
  const [threshold, setThreshold] = useState(50)
  const [activityLevel, setActivityLevel] = useState(0)
  const [isAlertActive, setIsAlertActive] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [isSimulating, setIsSimulating] = useState(false)
  const [showHeatmap, setShowHeatmap] = useState(true)
  const [isCameraOn, setIsCameraOn] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const lastMotionTime = useRef<number>(0)
  const { isMobile } = useViewport()

  // Audio context for alert sounds
  const audioContextRef = useRef<AudioContext | null>(null)
  const oscillatorRef = useRef<OscillatorNode | null>(null)

  // Motion detection variables
  const [motionDetected, setMotionDetected] = useState(false)
  const [motionHistory, setMotionHistory] = useState<number[]>([])
  const [cameraError, setCameraError] = useState<string | null>(null)

  // Initialize audio context
  useEffect(() => {
    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    } catch (error) {
      console.error("Web Audio API is not supported in this browser")
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  // Play alert sound
  const playAlertSound = () => {
    if (!audioContextRef.current) return

    try {
      // Stop previous sound if playing
      if (oscillatorRef.current) {
        oscillatorRef.current.stop()
        oscillatorRef.current.disconnect()
      }

      // Create oscillator
      const oscillator = audioContextRef.current.createOscillator()
      const gainNode = audioContextRef.current.createGain()

      oscillator.type = "sine"
      oscillator.frequency.setValueAtTime(880, audioContextRef.current.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(440, audioContextRef.current.currentTime + 0.5)

      gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.5)

      oscillator.connect(gainNode)
      gainNode.connect(audioContextRef.current.destination)

      oscillator.start()
      oscillator.stop(audioContextRef.current.currentTime + 0.5)

      oscillatorRef.current = oscillator
    } catch (error) {
      console.error("Error playing alert sound:", error)
    }
  }

  // Initialize camera
  useEffect(() => {
    if (!isCameraOn) {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => track.stop())
        videoRef.current.srcObject = null
      }
      return
    }

    const startCamera = async () => {
      try {
        const constraints = {
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: "environment",
          },
        }

        const stream = await navigator.mediaDevices.getUserMedia(constraints)
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
        setCameraError(null)
      } catch (error) {
        console.error("Error accessing camera:", error)
        setCameraError("Camera access denied or not available. Using simulation mode.")
        setIsSimulating(true)
      }
    }

    startCamera()

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => track.stop())
      }
    }
  }, [isCameraOn])

  // Motion detection algorithm
  const detectMotion = () => {
    const video = videoRef.current
    const canvas = canvasRef.current

    if (!video || !canvas || video.readyState !== 4) {
      return
    }

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480

    // Draw current video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Get image data
    const currentFrame = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const currentData = currentFrame.data

    // Simulate motion for demo purposes if real camera is not available
    if (isSimulating) {
      // Generate random motion level with occasional spikes
      const randomMotion = Math.random() * 100
      const spikeChance = Math.random() > 0.95
      const newLevel = spikeChance ? Math.min(randomMotion * 3, 100) : randomMotion

      setActivityLevel(newLevel)
      setMotionDetected(newLevel > threshold)

      // Update motion history
      setMotionHistory((prev) => {
        const updated = [...prev, newLevel]
        return updated.length > 20 ? updated.slice(-20) : updated
      })

      // Trigger alert if threshold exceeded
      if (newLevel > threshold && isAlertActive) {
        lastMotionTime.current = Date.now()
        if (!showAlert) {
          setShowAlert(true)
          playAlertSound()
        }
      }

      // Apply visual effect to canvas for simulation
      if (newLevel > threshold) {
        // Add red tint to the canvas when motion detected
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.min(255, data[i] + 50) // Increase red
          data[i + 1] = Math.max(0, data[i + 1] - 30) // Decrease green
          data[i + 2] = Math.max(0, data[i + 2] - 30) // Decrease blue
        }
        ctx.putImageData(imageData, 0, 0)
      }

      // Draw heatmap if enabled
      if (showHeatmap) {
        drawHeatmap(ctx, canvas.width, canvas.height, newLevel)
      }

      animationRef.current = requestAnimationFrame(detectMotion)
      return
    }

    // Real motion detection logic
    // This is a simplified implementation that detects changes between frames
    if (window.previousFrame) {
      const previousData = window.previousFrame.data
      let motionScore = 0
      const sampleSize = 10 // Sample every Nth pixel for performance
      const threshold = 30 // Minimum difference to count as motion
      const pixelsToCheck = currentData.length / 4 / sampleSize

      for (let i = 0; i < currentData.length; i += 4 * sampleSize) {
        const rDiff = Math.abs(currentData[i] - previousData[i])
        const gDiff = Math.abs(currentData[i + 1] - previousData[i + 1])
        const bDiff = Math.abs(currentData[i + 2] - previousData[i + 2])

        const pixelDiff = (rDiff + gDiff + bDiff) / 3

        if (pixelDiff > threshold) {
          motionScore++

          // If heatmap is enabled, highlight motion areas
          if (showHeatmap) {
            const pixelIndex = i / 4
            const x = pixelIndex % canvas.width
            const y = Math.floor(pixelIndex / canvas.width)

            ctx.fillStyle = `rgba(255, 0, 0, ${pixelDiff / 255})`
            ctx.fillRect(x, y, sampleSize, sampleSize)
          }
        }
      }

      // Calculate motion percentage (0-100)
      const motionPercentage = (motionScore / pixelsToCheck) * 100 * 5 // Amplify for better visibility
      const normalizedMotion = Math.min(100, motionPercentage)

      setActivityLevel(normalizedMotion)
      setMotionDetected(normalizedMotion > threshold)

      // Update motion history
      setMotionHistory((prev) => {
        const updated = [...prev, normalizedMotion]
        return updated.length > 20 ? updated.slice(-20) : updated
      })

      // Apply red overlay effect when motion is detected
      if (normalizedMotion > threshold) {
        ctx.fillStyle = "rgba(255, 0, 0, 0.3)"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Add red border
        ctx.strokeStyle = "rgba(255, 0, 0, 0.8)"
        ctx.lineWidth = 10
        ctx.strokeRect(0, 0, canvas.width, canvas.height)
      }

      // Trigger alert if threshold exceeded
      if (normalizedMotion > threshold && isAlertActive) {
        lastMotionTime.current = Date.now()
        if (!showAlert) {
          setShowAlert(true)
          playAlertSound()
        }
      }
    }

    // Store current frame for next comparison
    window.previousFrame = currentFrame

    // Continue detection loop
    animationRef.current = requestAnimationFrame(detectMotion)
  }

  // Draw heatmap visualization
  const drawHeatmap = (ctx: CanvasRenderingContext2D, width: number, height: number, intensity: number) => {
    if (intensity <= threshold) return

    const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width / 2)

    const alpha = Math.min(0.7, intensity / 100)
    gradient.addColorStop(0, `rgba(255, 0, 0, ${alpha})`)
    gradient.addColorStop(0.7, `rgba(255, 165, 0, ${alpha * 0.7})`)
    gradient.addColorStop(1, "rgba(255, 255, 0, 0)")

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
  }

  // Start/stop motion detection
  useEffect(() => {
    if (videoRef.current && canvasRef.current) {
      if (isCameraOn) {
        videoRef.current.onloadedmetadata = () => {
          detectMotion()
        }
      } else {
        cancelAnimationFrame(animationRef.current)
      }
    }

    return () => {
      cancelAnimationFrame(animationRef.current)
    }
  }, [isCameraOn, isSimulating, showHeatmap, threshold])

  // Reset alert after 5 seconds of no motion
  useEffect(() => {
    if (!motionDetected && showAlert) {
      const timeSinceLastMotion = Date.now() - lastMotionTime.current
      if (timeSinceLastMotion > 5000) {
        setShowAlert(false)
      }
    }

    const checkAlertTimeout = setInterval(() => {
      if (showAlert) {
        const timeSinceLastMotion = Date.now() - lastMotionTime.current
        if (timeSinceLastMotion > 5000) {
          setShowAlert(false)
        }
      }
    }, 1000)

    return () => {
      clearInterval(checkAlertTimeout)
    }
  }, [motionDetected, showAlert])

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle>Camera Motion Detection</CardTitle>
            <CardDescription>Detects motion and triggers alerts when threshold is exceeded</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm mr-1">Camera</span>
            <Switch checked={isCameraOn} onCheckedChange={setIsCameraOn} aria-label="Toggle camera" />
            {isCameraOn ? (
              <Camera className="h-5 w-5 text-green-500" />
            ) : (
              <VideoOff className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {cameraError && (
          <div className="bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200 p-3 rounded-md text-sm mb-4">
            {cameraError}
          </div>
        )}

        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          {isCameraOn ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`absolute inset-0 w-full h-full object-cover ${
                  motionDetected ? "border-4 border-red-500 animate-pulse-border" : ""
                }`}
              />
              <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />

              {/* Motion indicator overlay */}
              {motionDetected && <div className="absolute inset-0 bg-red-500/20 animate-pulse pointer-events-none" />}

              {/* Status badges */}
              <div className="absolute top-2 right-2 flex flex-col gap-2">
                <Badge variant={motionDetected ? "destructive" : "outline"} className="animate-pulse">
                  {motionDetected ? "Motion Detected" : "No Motion"}
                </Badge>

                {isSimulating && <Badge variant="secondary">Simulation Mode</Badge>}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <VideoOff className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">Camera is turned off</p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Motion Level</span>
              <span
                className={`text-sm font-bold ${activityLevel > threshold ? "text-red-500" : "text-muted-foreground"}`}
              >
                {Math.round(activityLevel)}%
              </span>
            </div>
            <Progress
              value={activityLevel}
              className={`h-2 ${activityLevel > threshold ? "bg-red-200" : ""}`}
              indicatorClassName={activityLevel > threshold ? "bg-red-500" : undefined}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Alert Threshold</span>
              <span className="text-sm font-medium text-muted-foreground">{threshold}%</span>
            </div>
            <Slider
              value={[threshold]}
              min={10}
              max={90}
              step={5}
              onValueChange={(value) => setThreshold(value[0])}
              className="py-2"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Switch id="alert-active" checked={isAlertActive} onCheckedChange={setIsAlertActive} />
              <label htmlFor="alert-active" className="text-sm font-medium cursor-pointer">
                Alert Active
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="heatmap" checked={showHeatmap} onCheckedChange={setShowHeatmap} />
              <label htmlFor="heatmap" className="text-sm font-medium cursor-pointer">
                Show Heatmap
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="simulation" checked={isSimulating} onCheckedChange={setIsSimulating} />
              <label htmlFor="simulation" className="text-sm font-medium cursor-pointer">
                Simulation Mode
              </label>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2 justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setIsSimulating(!isSimulating)
          }}
        >
          {isSimulating ? "Use Real Camera" : "Use Simulation"}
        </Button>
        <Button
          variant={isAlertActive ? "default" : "outline"}
          size="sm"
          onClick={() => setIsAlertActive(!isAlertActive)}
        >
          <Bell className="mr-2 h-4 w-4" />
          {isAlertActive ? "Alerts Enabled" : "Alerts Disabled"}
        </Button>
      </CardFooter>

      {/* Intruder Alert Modal */}
      {showAlert && (
        <IntruderAlert
          onClose={() => setShowAlert(false)}
          timestamp={new Date().toISOString()}
          location="Main Entrance"
          activityLevel={activityLevel}
        />
      )}
    </Card>
  )
}

// Add this to the window object for TypeScript
declare global {
  interface Window {
    previousFrame?: ImageData
  }
}
