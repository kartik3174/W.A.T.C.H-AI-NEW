"use client"

import { useRef, useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Video, VideoOff, AlertTriangle, Leaf, BellOff, Volume2, Camera, CameraOff, Thermometer } from "lucide-react"
import { IntruderAlert } from "@/components/tracking/intruder-alert"
import { Progress } from "@/components/ui/progress"
import { LeafDecoration } from "@/components/leaf-decoration"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Create a simple audio alert utility using the Web Audio API
const AudioAlert = {
  context: null as AudioContext | null,
  oscillator: null as OscillatorNode | null,
  gainNode: null as GainNode | null,
  isPlaying: false,

  init() {
    try {
      if (typeof window !== "undefined" && !this.context) {
        this.context = new (window.AudioContext || (window as any).webkitAudioContext)()
      }
    } catch (e) {
      console.error("Web Audio API is not supported in this browser")
    }
  },

  playAlertPattern(count = 3, interval = 500) {
    if (count <= 0 || this.isPlaying) return

    this.playBeep(0.5)

    setTimeout(() => {
      this.playAlertPattern(count - 1, interval)
    }, interval)
  },

  playBeep(duration = 0.3) {
    if (!this.context || this.isPlaying) return

    try {
      this.isPlaying = true

      // Create oscillator and gain node
      this.oscillator = this.context.createOscillator()
      this.gainNode = this.context.createGain()

      // Connect nodes
      this.oscillator.connect(this.gainNode)
      this.gainNode.connect(this.context.destination)

      // Set properties
      this.oscillator.type = "sine"
      this.oscillator.frequency.value = 880 // A5
      this.gainNode.gain.value = 0.5

      // Start oscillator
      this.oscillator.start()

      // Stop after duration
      setTimeout(() => this.stop(), duration * 1000)
    } catch (e) {
      console.error("Error playing alert sound:", e)
      this.isPlaying = false
    }
  },

  stop() {
    if (!this.context || !this.isPlaying) return

    try {
      if (this.oscillator) {
        this.oscillator.stop()
        this.oscillator.disconnect()
        this.oscillator = null
      }

      if (this.gainNode) {
        this.gainNode.disconnect()
        this.gainNode = null
      }

      this.isPlaying = false
    } catch (e) {
      console.error("Error stopping alert sound:", e)
    }
  },
}

export function WebcamDetector() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const diffCanvasRef = useRef<HTMLCanvasElement>(null)
  const heatCanvasRef = useRef<HTMLCanvasElement>(null)
  const [isActive, setIsActive] = useState(false)
  const [isDetecting, setIsDetecting] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [showAlert, setShowAlert] = useState(false)
  const [motionLevel, setMotionLevel] = useState(0)
  const [sensitivity, setSensitivity] = useState(15) // Lower default sensitivity to detect motion more easily
  const [lastFrameData, setLastFrameData] = useState<ImageData | null>(null)
  const requestRef = useRef<number | null>(null)
  const [debugMode, setDebugMode] = useState(false)
  const [consecutiveDetections, setConsecutiveDetections] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [currentMotionData, setCurrentMotionData] = useState(0)
  const [showHeatMap, setShowHeatMap] = useState(true) // Enable heat map by default
  const [cameraFacing, setCameraFacing] = useState<string>("environment")
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([])
  const [selectedCamera, setSelectedCamera] = useState<string>("")
  const [simulateMotion, setSimulateMotion] = useState(false) // For testing motion detection
  const [detectedObjects, setDetectedObjects] = useState<
    Array<{ x: number; y: number; width: number; height: number }>
  >([])

  // Get available cameras
  const getAvailableCameras = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = devices.filter((device) => device.kind === "videoinput")
      setAvailableCameras(videoDevices)

      if (videoDevices.length > 0 && !selectedCamera) {
        setSelectedCamera(videoDevices[0].deviceId)
      }
    } catch (err) {
      console.error("Error getting camera devices:", err)
    }
  }

  // Initialize camera list
  useEffect(() => {
    getAvailableCameras()
  }, [])

  // Start webcam with video file
  const startWebcam = async () => {
    try {
      if (videoRef.current) {
        // Clear any existing stream
        if (videoRef.current.srcObject) {
          const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
          tracks.forEach((track) => track.stop())
          videoRef.current.srcObject = null
        }

        // Load the wildlife video file
        videoRef.current.src = "/videos/wildlife.mp4"
        videoRef.current.autoplay = true
        videoRef.current.muted = true
        videoRef.current.loop = true
        videoRef.current.playsInline = true

        // Handle when video can be played
        videoRef.current.oncanplay = () => {
          if (videoRef.current) {
            videoRef.current.play().catch((err) => {
              console.error("[v0] Error playing video:", err)
            })
            setIsActive(true)
          }
        }

        // Handle loading errors
        videoRef.current.onerror = () => {
          console.log("[v0] Wildlife video file not found, enabling simulation mode")
          setSimulateMotion(true)
          setIsActive(true)
        }
      }
    } catch (err) {
      // Fallback to simulation mode if any error occurs
      console.log("[v0] Error loading video, enabling simulation mode:", err)
      setIsActive(true)
      setSimulateMotion(true)
    }
  }

  // Effect to restart webcam when camera selection changes
  useEffect(() => {
    if (isActive && selectedCamera) {
      startWebcam()
    }
  }, [selectedCamera, cameraFacing])

  // Stop webcam
  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
    setIsActive(false)
    setIsDetecting(false)
    setSimulateMotion(false)
    setShowAlert(false)
    setDetectedObjects([])
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current)
      requestRef.current = null
    }
  }

  // Toggle motion detection
  const toggleDetection = () => {
    if (!isActive) {
      startWebcam().then(() => {
        setIsDetecting(true)
      })
    } else {
      setIsDetecting(!isDetecting)
      if (!isDetecting) {
        // Starting detection
        setLastFrameData(null)
        setConsecutiveDetections(0)
        setShowAlert(false) // Clear any existing alerts when starting detection
      } else {
        // Stopping detection
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current)
          requestRef.current = null
        }
        setShowAlert(false) // Clear alerts when stopping detection
        setConsecutiveDetections(0)
      }
    }
  }

  // Capture current frame
  const captureFrame = () => {
    if (videoRef.current && canvasRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (context) {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth || 640
        canvas.height = video.videoHeight || 480

        // Draw current video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        // Get image data for motion detection
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height)

        return imageData
      }
    } else if (simulateMotion && canvasRef.current) {
      // Simulate a frame for testing
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (context) {
        canvas.width = 640
        canvas.height = 480

        // Fill with a color
        context.fillStyle = "#000000"
        context.fillRect(0, 0, canvas.width, canvas.height)

        // Draw some random shapes to simulate motion
        for (let i = 0; i < 20; i++) {
          context.fillStyle = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`
          context.fillRect(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            Math.random() * 50 + 10,
            Math.random() * 50 + 10,
          )
        }

        return context.getImageData(0, 0, canvas.width, canvas.height)
      }
    }
    return null
  }

  // Detect motion by comparing frames using frame difference method
  const detectMotion = (currentFrame: ImageData, previousFrame: ImageData) => {
    const data1 = currentFrame.data
    const data2 = previousFrame.data
    let diffCount = 0
    const width = currentFrame.width
    const height = currentFrame.height

    // Create a difference visualization if in debug mode
    const diffContext = diffCanvasRef.current?.getContext("2d")
    let diffImageData: ImageData | null = null

    if (diffContext && debugMode) {
      if (diffCanvasRef.current) {
        diffCanvasRef.current.width = width
        diffCanvasRef.current.height = height
      }
      diffImageData = diffContext.createImageData(width, height)
    }

    // Create heat map visualization
    const heatContext = heatCanvasRef.current?.getContext("2d")
    let heatImageData: ImageData | null = null

    if (heatContext && showHeatMap) {
      if (heatCanvasRef.current) {
        heatCanvasRef.current.width = width
        heatCanvasRef.current.height = height
      }
      heatImageData = heatContext.createImageData(width, height)
    }

    // Sample fewer pixels for performance (every 4th pixel)
    const sampleRate = 4
    const threshold = 25 // Lower pixel difference threshold to detect motion more easily

    // Compare pixels using frame difference method
    for (let y = 0; y < height; y += sampleRate) {
      for (let x = 0; x < width; x += sampleRate) {
        const i = (y * width + x) * 4

        // Compare RGB values (skip alpha)
        const diffR = Math.abs(data1[i] - data2[i])
        const diffG = Math.abs(data1[i + 1] - data2[i + 1])
        const diffB = Math.abs(data1[i + 2] - data2[i + 2])

        // Calculate weighted difference (human eye is more sensitive to green)
        const diff = diffR * 0.3 + diffG * 0.59 + diffB * 0.11

        // Visualize the difference if in debug mode
        if (diffImageData && diffContext && debugMode) {
          for (let sy = 0; sy < sampleRate && y + sy < height; sy++) {
            for (let sx = 0; sx < sampleRate && x + sx < width; sx++) {
              const di = ((y + sy) * width + (x + sx)) * 4
              if (diff > threshold) {
                // Mark changed pixels in red
                diffImageData.data[di] = 255
                diffImageData.data[di + 1] = 0
                diffImageData.data[di + 2] = 0
                diffImageData.data[di + 3] = 255
              } else {
                // Unchanged pixels in grayscale
                const gray = (data1[i] + data1[i + 1] + data1[i + 2]) / 3
                diffImageData.data[di] = gray
                diffImageData.data[di + 1] = gray
                diffImageData.data[di + 2] = gray
                diffImageData.data[di + 3] = 255
              }
            }
          }
        }

        // Create heat map visualization
        if (heatImageData && heatContext && showHeatMap) {
          for (let sy = 0; sy < sampleRate && y + sy < height; sy++) {
            for (let sx = 0; sx < sampleRate && x + sx < width; sx++) {
              const di = ((y + sy) * width + (x + sx)) * 4

              if (diff > threshold) {
                // Heat intensity based on difference
                const intensity = Math.min(255, diff * 2)

                // Red heat map with alpha based on intensity
                heatImageData.data[di] = 255 // R
                heatImageData.data[di + 1] = 0 // G
                heatImageData.data[di + 2] = 0 // B
                heatImageData.data[di + 3] = intensity // Alpha
              } else {
                // Transparent for unchanged areas
                heatImageData.data[di + 3] = 0
              }
            }
          }
        }

        if (diff > threshold) {
          diffCount++
        }
      }
    }

    // Draw the difference visualization if in debug mode
    if (diffImageData && diffContext && debugMode) {
      diffContext.putImageData(diffImageData, 0, 0)
    }

    // Draw the heat map visualization
    if (heatImageData && heatContext && showHeatMap) {
      heatContext.putImageData(heatImageData, 0, 0)
    }

    // Calculate percentage of changed pixels
    const sampledPixels = Math.floor((width * height) / (sampleRate * sampleRate))
    const changePercent = (diffCount / sampledPixels) * 100

    // If simulating motion, add some random motion
    const finalChangePercent = simulateMotion
      ? Math.min(100, changePercent + (Math.sin(Date.now() / 1000) + 1) * 25)
      : changePercent

    // Store the current motion data for the alert
    setCurrentMotionData(Math.round(finalChangePercent))

    // Update motion level with smoothing
    setMotionLevel((prev) => Math.round(prev * 0.7 + finalChangePercent * 0.3 * 3))

    // Trigger alert if motion exceeds sensitivity threshold
    // Use consecutive detections to avoid false positives
    if (finalChangePercent > sensitivity && isActive && isDetecting) {
      setConsecutiveDetections((prev) => prev + 1)

      if (consecutiveDetections > 2 && !showAlert) {
        setShowAlert(true)
        // Capture the image that triggered the alert
        if (canvasRef.current) {
          const imageUrl = canvasRef.current.toDataURL("image/png")
          setCapturedImage(imageUrl)
        }

        // Play alert sound if enabled (no audio file dependency)
        if (soundEnabled) {
          AudioAlert.playAlertPattern(3, 500)
        }
      }
    } else {
      setConsecutiveDetections(Math.max(0, consecutiveDetections - 1))
      if (consecutiveDetections === 0 && showAlert) {
        setShowAlert(false)
      }
    }

    return finalChangePercent
  }

  // Animation loop for motion detection
  const detectFrame = () => {
    const currentFrame = captureFrame()

    if (currentFrame) {
      if (lastFrameData) {
        detectMotion(currentFrame, lastFrameData)
      }
      setLastFrameData(currentFrame)
    } else if (simulateMotion) {
      // If we're simulating and don't have a real frame, simulate motion level changes
      const simulatedMotion = Math.abs(Math.sin(Date.now() / 1000) * 50) + 10
      setMotionLevel(Math.round(simulatedMotion))
      setCurrentMotionData(Math.round(simulatedMotion))

      // Randomly trigger alerts
      if (simulatedMotion > sensitivity && Math.random() > 0.99 && !showAlert) {
        setShowAlert(true)
        // Generate a simulated image
        if (canvasRef.current) {
          const canvas = canvasRef.current
          const ctx = canvas.getContext("2d")
          if (ctx) {
            canvas.width = 640
            canvas.height = 480
            ctx.fillStyle = "black"
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // Draw some shapes to simulate an image
            for (let i = 0; i < 30; i++) {
              ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.7)`
              ctx.beginPath()
              ctx.arc(
                Math.random() * canvas.width,
                Math.random() * canvas.height,
                Math.random() * 50 + 10,
                0,
                Math.PI * 2,
              )
              ctx.fill()
            }

            setCapturedImage(canvas.toDataURL("image/png"))
          }
        }
      }
    }

    if (isDetecting) {
      requestRef.current = requestAnimationFrame(detectFrame)
    }
  }

  // Start/stop detection based on isDetecting state
  useEffect(() => {
    if (isDetecting) {
      // Wait a moment for camera to stabilize before starting detection
      const timer = setTimeout(() => {
        requestRef.current = requestAnimationFrame(detectFrame)
      }, 500)

      return () => {
        clearTimeout(timer)
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current)
        }
      }
    } else if (requestRef.current) {
      cancelAnimationFrame(requestRef.current)
    }
  }, [isDetecting])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopWebcam()
      if (audioRef.current) {
        audioRef.current.pause()
      }
      AudioAlert.stop()
    }
  }, [])

  // Initialize audio alert system
  useEffect(() => {
    // Initialize the Web Audio API fallback
    AudioAlert.init()

    return () => {
      // Clean up
      AudioAlert.stop()
    }
  }, [])

  // Toggle sound
  const toggleSound = () => {
    setSoundEnabled(!soundEnabled)
    if (audioRef.current) {
      if (soundEnabled) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
    }
  }

  // Toggle camera facing mode
  const toggleCamera = () => {
    setCameraFacing((prev) => (prev === "environment" ? "user" : "environment"))
  }

  // Determine if motion is detected based on threshold
  const isMotionDetected = isActive && isDetecting && motionLevel > sensitivity

  return (
    <Card className="border-wildlife-green relative overflow-hidden">
      <LeafDecoration position="top-right" size="lg" opacity={0.1} className="z-0" />
      <LeafDecoration position="bottom-left" size="md" opacity={0.1} className="z-0" />

      <CardHeader className="bg-gradient-to-r from-wildlife-green/20 to-wildlife-green/5 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-wildlife-green" />
            <CardTitle>Wildlife Monitoring Camera</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSound}
              className={`p-1 rounded-full ${soundEnabled ? "text-wildlife-green" : "text-gray-400"}`}
              aria-label={soundEnabled ? "Disable sound alerts" : "Enable sound alerts"}
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setShowHeatMap(!showHeatMap)}
              className={`p-1 rounded-full ${showHeatMap ? "text-red-500" : "text-gray-400"}`}
              aria-label={showHeatMap ? "Hide heat detection" : "Show heat detection"}
            >
              <Thermometer className="h-4 w-4" />
            </button>
            <Label htmlFor="detection-toggle" className="text-sm">
              Detection
            </Label>
            <Switch
              id="detection-toggle"
              checked={isDetecting}
              onCheckedChange={toggleDetection}
              className="data-[state=checked]:bg-wildlife-green"
            />
          </div>
        </div>
        <CardDescription>
          {isActive
            ? isDetecting
              ? "Monitoring for motion and wildlife activity"
              : "Camera active - Enable detection to start monitoring"
            : "Start camera to begin monitoring"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 relative z-10">
        {/* Camera Selection */}
        {availableCameras.length > 1 && (
          <div className="flex items-center gap-2">
            <Label htmlFor="camera-select" className="text-sm">
              Camera:
            </Label>
            <Select value={selectedCamera} onValueChange={setSelectedCamera}>
              <SelectTrigger id="camera-select" className="w-[200px]">
                <SelectValue placeholder="Select camera" />
              </SelectTrigger>
              <SelectContent>
                {availableCameras.map((camera, idx) => (
                  <SelectItem key={camera.deviceId} value={camera.deviceId}>
                    {camera.label || `Camera ${idx + 1}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Video Display with Detection Overlay */}
        <div className="relative w-full aspect-video bg-black rounded-md overflow-hidden">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
            muted
            style={{ display: isActive ? "block" : "none" }}
          />

          {showHeatMap && isDetecting && isActive && (
            <canvas
              ref={heatCanvasRef}
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
              style={{ mixBlendMode: "screen", opacity: 0.7 }}
            />
          )}

          {isDetecting &&
            isActive &&
            detectedObjects.map((obj, idx) => (
              <div
                key={idx}
                className="absolute border-2 border-red-500 bg-red-500/20 pointer-events-none"
                style={{
                  left: `${(obj.x / 640) * 100}%`,
                  top: `${(obj.y / 480) * 100}%`,
                  width: `${(obj.width / 640) * 100}%`,
                  height: `${(obj.height / 480) * 100}%`,
                }}
              >
                <div className="absolute -top-6 left-0 bg-red-500 text-white text-xs px-2 py-1 rounded">
                  Motion Detected
                </div>
              </div>
            ))}

          {/* Debug mode visualization */}
          {debugMode && isDetecting && isActive && (
            <canvas
              ref={diffCanvasRef}
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
              style={{ opacity: 0.5 }}
            />
          )}

          {!isActive && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80">
              <div className="text-center">
                <CameraOff className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-400">Camera is off</p>
              </div>
            </div>
          )}

          {/* Hidden canvas for capture */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Motion Level Indicator */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-sm">Motion Level</Label>
            <span className="text-sm font-mono">{motionLevel}%</span>
          </div>
          <Progress value={Math.min(100, motionLevel)} className="h-2" />
          {isMotionDetected && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Motion detected above threshold
            </p>
          )}
        </div>

        {/* Sensitivity Control */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="sensitivity" className="text-sm">
              Sensitivity: {sensitivity}%
            </Label>
            <span className="text-xs text-muted-foreground">
              {sensitivity < 10 ? "Very High" : sensitivity < 20 ? "High" : sensitivity < 30 ? "Medium" : "Low"}
            </span>
          </div>
          <input
            id="sensitivity"
            type="range"
            min="5"
            max="50"
            value={sensitivity}
            onChange={(e) => setSensitivity(Number(e.target.value))}
            className="w-full"
            disabled={!isDetecting}
          />
          <p className="text-xs text-muted-foreground">
            Lower values increase sensitivity (more alerts), higher values decrease sensitivity (fewer alerts)
          </p>
        </div>

        {/* Debug Mode Toggle */}
        <div className="flex items-center justify-between">
          <Label htmlFor="debug-mode" className="text-sm">
            Debug Mode (Show Difference View)
          </Label>
          <Switch id="debug-mode" checked={debugMode} onCheckedChange={setDebugMode} />
        </div>

        {showAlert && isActive && isDetecting && (
          <IntruderAlert
            timestamp={new Date().toISOString()}
            location="Monitoring Zone Alpha"
            severity="high"
            motionLevel={currentMotionData}
            onDismiss={() => {
              setShowAlert(false)
              setConsecutiveDetections(0)
            }}
            capturedImage={capturedImage}
          />
        )}
      </CardContent>

      <CardFooter className="flex gap-2 relative z-10">
        <Button onClick={isActive ? stopWebcam : startWebcam} variant={isActive ? "destructive" : "default"}>
          {isActive ? (
            <>
              <VideoOff className="mr-2 h-4 w-4" />
              Stop Camera
            </>
          ) : (
            <>
              <Video className="mr-2 h-4 w-4" />
              Start Camera
            </>
          )}
        </Button>
        <Button onClick={toggleCamera} variant="outline" disabled={!isActive}>
          <Camera className="mr-2 h-4 w-4" />
          Switch Camera
        </Button>
      </CardFooter>
    </Card>
  )
}
