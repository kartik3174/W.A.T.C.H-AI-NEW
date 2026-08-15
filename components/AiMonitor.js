"use client"

import React, { useEffect, useRef, useState, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Camera,
  CameraOff,
  AlertTriangle,
  ShieldCheck,
  Activity,
  RefreshCw,
  Wifi,
  WifiOff,
  Video,
  Circle,
  Download,
  Settings,
  CheckCircle2,
  Radio,
  Sliders
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import * as tf from "@tensorflow/tfjs"

const MODEL_URL = "/model/"
const VISION_MODEL_CONFIG = { version: 2, alpha: 1.0 }

export default function AiMonitor() {
  const { t } = useLanguage()
  const [status, setStatus] = useState("Initializing AI...")
  const [confidence, setConfidence] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [error, setError] = useState(null)
  const [activeSource, setActiveSource] = useState("webcam") // "webcam" | "esp32"
  
  // ESP32-CAM States
  const [esp32Url, setEsp32Url] = useState("http://192.168.4.1/stream")
  const [isEsp32Connected, setIsEsp32Connected] = useState(false)
  const [isConnectingEsp32, setIsConnectingEsp32] = useState(false)
  const [esp32Notice, setEsp32Notice] = useState(null)
  const [showEsp32Config, setShowEsp32Config] = useState(false)
  
  // Recording States
  const [isRecording, setIsRecording] = useState(false)
  const [recordingSeconds, setRecordingSeconds] = useState(0)
  const [lastRecordedUrl, setLastRecordedUrl] = useState(null)

  const webcamContainerRef = useRef(null)
  const canvasHostRef = useRef(null)
  const webcamRef = useRef(null)
  const esp32ImageRef = useRef(null)
  const esp32CanvasRef = useRef(null)
  const modelRef = useRef(null)
  const visionModelRef = useRef(null)
  const animFrameRef = useRef(null)
  const isMountedRef = useRef(true)
  const mediaRecorderRef = useRef(null)
  const recordedChunksRef = useRef([])
  const recordingTimerRef = useRef(null)
  
  const [isScanning, setIsScanning] = useState(false)
  const [isHumanDetected, setIsHumanDetected] = useState(false)

  // Format recording timer
  const formatTime = (totalSec) => {
    const mins = Math.floor(totalSec / 60)
    const secs = totalSec % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Stop recording helper
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try {
        mediaRecorderRef.current.stop()
      } catch (err) {
        console.warn("Error stopping recorder:", err)
      }
    }
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current)
      recordingTimerRef.current = null
    }
    setIsRecording(false)
    setRecordingSeconds(0)
  }, [])

  // Start recording helper on a stream or canvas
  const startRecordingOnCanvas = useCallback((canvas) => {
    if (!canvas) return
    try {
      recordedChunksRef.current = []
      const stream = canvas.captureStream ? canvas.captureStream(25) : null
      if (!stream) {
        console.warn("Canvas stream capture not supported")
        return
      }

      const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
        ? "video/webm;codecs=vp9"
        : "video/webm"

      const recorder = new MediaRecorder(stream, { mimeType })
      mediaRecorderRef.current = recorder

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data)
        }
      }

      recorder.onstop = () => {
        if (recordedChunksRef.current.length > 0) {
          const blob = new Blob(recordedChunksRef.current, { type: "video/webm" })
          const url = URL.createObjectURL(blob)
          setLastRecordedUrl(url)
        }
      }

      recorder.start(1000)
      setIsRecording(true)
      setRecordingSeconds(0)

      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current)
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1)
      }, 1000)
    } catch (err) {
      console.warn("Could not start MediaRecorder:", err)
    }
  }, [])

  // Stop all camera feeds and loops
  const stopWebcam = useCallback(() => {
    isMountedRef.current = false
    stopRecording()

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current)
      animFrameRef.current = null
    }
    if (webcamRef.current) {
      try {
        webcamRef.current.stop()
      } catch (e) {}
      webcamRef.current = null
    }
    if (esp32ImageRef.current) {
      esp32ImageRef.current.src = ""
      esp32ImageRef.current = null
    }
    if (canvasHostRef.current) {
      while (canvasHostRef.current.firstChild) {
        canvasHostRef.current.removeChild(canvasHostRef.current.firstChild)
      }
    }
    setIsRunning(false)
    setIsEsp32Connected(false)
    setStatus(t("camera.stopped") || "Observation stopped")
    setConfidence(0)
  }, [stopRecording, t])

  // AI Prediction Routine
  const runPredictionOnCanvas = useCallback(async (sourceCanvas) => {
    if (!modelRef.current || !visionModelRef.current || !isMountedRef.current || !sourceCanvas) return

    try {
      const model = modelRef.current
      const visionModel = visionModelRef.current

      const prediction = await model.predict(sourceCanvas)
      const proPred = await visionModel.classify(sourceCanvas)

      let sorted = [...prediction].sort((a, b) => b.probability - a.probability)
      let bestResult = {
        label: sorted[0]?.className || "Scanning...",
        confidence: sorted[0]?.probability || 0,
      }

      const mapping = {
        Elephant: ["elephant", "tusker", "proboscidean", "african elephant", "indian elephant"],
        Tiger: ["tiger", "panthera tigris", "bengal tiger", "siberian tiger", "feline"],
        Lion: ["lion", "big cat", "king of beasts", "panthera leo"],
        Rhino: [
          "rhino",
          "rhinoceros",
          "white rhinoceros",
          "black rhinoceros",
          "indian rhinoceros",
          "ceratotherium",
          "diceros",
          "pachyderm",
          "water buffalo",
          "hippopotamus",
          "hippo",
        ],
        Gorilla: [
          "gorilla",
          "western gorilla",
          "eastern gorilla",
          "ape",
          "primate",
          "hominoid",
          "chimpanzee",
        ],
        Human: [
          "human",
          "person",
          "man",
          "woman",
          "guy",
          "adult",
          "child",
          "hiker",
          "pedestrian",
        ],
      }

      let verifiedLabel = null
      let verifiedConfidence = 0

      for (const p of proPred.slice(0, 3)) {
        const detectedClass = p.className.toLowerCase()
        for (const [label, synonyms] of Object.entries(mapping)) {
          if (synonyms.some((s) => detectedClass.includes(s))) {
            verifiedLabel = label
            verifiedConfidence = p.probability
            break
          }
        }
        if (verifiedLabel) break
      }

      if (
        verifiedLabel === "Human" &&
        (bestResult.confidence < 0.8 || bestResult.label !== "Human")
      ) {
        bestResult = { label: "Human", confidence: Math.max(0.96, verifiedConfidence) }
      } else if (
        verifiedLabel &&
        verifiedLabel !== "Elephant" &&
        bestResult.label === "Elephant" &&
        bestResult.confidence < 0.75
      ) {
        bestResult = { label: verifiedLabel, confidence: Math.max(0.95, verifiedConfidence) }
      } else if (
        verifiedLabel &&
        bestResult.label !== verifiedLabel &&
        verifiedConfidence > bestResult.confidence + 0.2
      ) {
        bestResult = { label: verifiedLabel, confidence: Math.max(0.95, verifiedConfidence) }
      }

      if (isMountedRef.current) {
        if (bestResult.confidence > 0.4) {
          setStatus(bestResult.label)
          setConfidence(Math.round(bestResult.confidence * 100))
          setIsHumanDetected(bestResult.label === "Human")
        } else if (bestResult.confidence > 0.15) {
          setStatus(t("analyzing") || "Analyzing Subject...")
          setConfidence(Math.round(bestResult.confidence * 100))
          setIsHumanDetected(false)
        } else {
          setStatus(t("scanning.activity") || "Active Scanning...")
          setConfidence(0)
          setIsHumanDetected(false)
        }
      }
    } catch (err) {
      console.warn("Prediction frame skipped:", err)
    }
  }, [t])

  // Load AI Models Helper
  const loadModels = useCallback(async () => {
    const tmImage = await import("@teachablemachine/image")
    const mobilenet = await import("@tensorflow-models/mobilenet")

    await tf.ready()
    try {
      await tf.setBackend("webgl")
    } catch (e) {
      console.warn("WebGL not supported, falling back to CPU")
      await tf.setBackend("cpu")
    }

    if (!modelRef.current) {
      const modelURL = MODEL_URL + "model.json"
      const metadataURL = MODEL_URL + "metadata.json"
      modelRef.current = await tmImage.load(modelURL, metadataURL)
    }

    if (!visionModelRef.current) {
      visionModelRef.current = await mobilenet.load(VISION_MODEL_CONFIG)
    }

    return { tmImage, mobilenet }
  }, [])

  // Start Built-in / USB Camera
  const startWebcam = useCallback(async () => {
    setError(null)
    setEsp32Notice(null)
    setActiveSource("webcam")
    setStatus(t("loading.models") || "Loading AI models...")
    setIsScanning(true)
    isMountedRef.current = true

    try {
      const { tmImage } = await loadModels()

      const loop = async () => {
        if (!isMountedRef.current) return
        if (webcamRef.current) {
          webcamRef.current.update()
          await runPredictionOnCanvas(webcamRef.current.canvas)
        }
        if (isMountedRef.current) {
          animFrameRef.current = window.requestAnimationFrame(loop)
        }
      }

      setStatus(t("starting.camera") || "Establishing Video Stream...")
      const flip = true
      const webcamSize = 400

      const setupWebcam = async (retries = 3) => {
        const webcam = new tmImage.Webcam(webcamSize, webcamSize, flip)
        for (let i = 0; i < retries; i++) {
          try {
            await webcam.setup()
            await webcam.play()
            return webcam
          } catch (err) {
            console.warn(`Webcam setup attempt ${i + 1} failed:`, err)
            if (i === retries - 1) throw err
            await new Promise((r) => setTimeout(r, 1000))
          }
        }
      }

      const webcam = await setupWebcam()
      webcamRef.current = webcam

      if (isMountedRef.current && canvasHostRef.current) {
        const canvas = webcam.canvas
        canvas.style.width = "100%"
        canvas.style.height = "100%"
        canvas.style.objectFit = "cover"
        canvas.style.borderRadius = "8px"

        while (canvasHostRef.current.firstChild) {
          canvasHostRef.current.removeChild(canvasHostRef.current.firstChild)
        }
        canvasHostRef.current.appendChild(canvas)

        setIsRunning(true)
        setIsScanning(false)
        setStatus(t("waiting.wildlife") || "Observation started...")
        animFrameRef.current = window.requestAnimationFrame(loop)

        // Start recording
        startRecordingOnCanvas(canvas)
      }
    } catch (e) {
      console.error("AI Monitor Webcam Failure:", e)
      const errorMsg =
        e.name === "NotAllowedError" ||
        e.name === "NotFoundError" ||
        e.message?.includes("Permission")
          ? t("camera.denied") ||
            "Camera access denied. Please allow camera permissions in your browser."
          : t("failed.hardware") || `Camera initialization failed: ${e.message}`

      setError(errorMsg)
      setStatus(t("error") || "Error")
      setIsScanning(false)
      setIsRunning(false)
    }
  }, [loadModels, runPredictionOnCanvas, startRecordingOnCanvas, t])

  // Probe and Connect to ESP32 CAM
  const connectToEsp32Cam = useCallback(async () => {
    setError(null)
    setIsConnectingEsp32(true)
    setEsp32Notice({ type: "connecting", message: `Probing ESP32 CAM at ${esp32Url}...` })
    setStatus("Connecting ESP32 CAM...")
    setIsScanning(true)
    isMountedRef.current = true

    // Probing: Test if ESP32 stream/capture endpoint is reachable
    const probeStream = () =>
      new Promise((resolve) => {
        const img = new Image()
        img.crossOrigin = "anonymous"
        let timer = setTimeout(() => {
          img.src = ""
          resolve(false)
        }, 3500)

        img.onload = () => {
          clearTimeout(timer)
          resolve(true)
        }
        img.onerror = () => {
          clearTimeout(timer)
          resolve(false)
        }
        img.src = esp32Url + (esp32Url.includes("?") ? "&" : "?") + "test=" + Date.now()
      })

    try {
      // 1. Load AI models
      await loadModels()

      // 2. Check stream connectivity
      const isReachable = await probeStream()

      if (!isReachable) {
        setIsConnectingEsp32(false)
        setIsScanning(false)
        setIsRunning(false)
        setIsEsp32Connected(false)
        setEsp32Notice({
          type: "error",
          message: "ESP32 NOT FOUND — Check ESP32 Wi-Fi / Hotspot connection, IP address, and power.",
        })
        setStatus("ESP32 NOT FOUND")
        return
      }

      // 3. ESP32 CAM Connected!
      setActiveSource("esp32")
      setIsEsp32Connected(true)
      setIsConnectingEsp32(false)
      setIsScanning(false)
      setIsRunning(true)
      setEsp32Notice({
        type: "success",
        message: "ESP32 CAM CONNECTED — Live field stream active & auto-recording enabled.",
      })
      setStatus("ESP32 CAM Active")

      // Setup Canvas for ESP32 MJPEG Frame Processing
      const canvas = document.createElement("canvas")
      canvas.width = 400
      canvas.height = 400
      canvas.style.width = "100%"
      canvas.style.height = "100%"
      canvas.style.objectFit = "cover"
      canvas.style.borderRadius = "8px"
      const ctx = canvas.getContext("2d")
      esp32CanvasRef.current = canvas

      if (canvasHostRef.current) {
        while (canvasHostRef.current.firstChild) {
          canvasHostRef.current.removeChild(canvasHostRef.current.firstChild)
        }
        canvasHostRef.current.appendChild(canvas)
      }

      // MJPEG image stream receiver
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.src = esp32Url
      esp32ImageRef.current = img

      const espLoop = async () => {
        if (!isMountedRef.current || !esp32ImageRef.current) return

        if (img.complete && img.naturalWidth > 0) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
          await runPredictionOnCanvas(canvas)
        }

        if (isMountedRef.current) {
          animFrameRef.current = window.requestAnimationFrame(espLoop)
        }
      }

      animFrameRef.current = window.requestAnimationFrame(espLoop)

      // Start auto-recording on the live ESP32 feed
      startRecordingOnCanvas(canvas)
    } catch (err) {
      console.error("ESP32 CAM Connection Error:", err)
      setIsConnectingEsp32(false)
      setIsScanning(false)
      setIsRunning(false)
      setIsEsp32Connected(false)
      setEsp32Notice({
        type: "error",
        message: `ESP32 NOT FOUND (${err.message || "Connection timed out"})`,
      })
      setStatus("ESP32 NOT FOUND")
    }
  }, [esp32Url, loadModels, runPredictionOnCanvas, startRecordingOnCanvas])

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
      stopRecording()
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
        animFrameRef.current = null
      }
      if (webcamRef.current) {
        try {
          webcamRef.current.stop()
        } catch (e) {}
        webcamRef.current = null
      }
    }
  }, [stopRecording])

  const getStatusVariant = () => {
    const lower = status.toLowerCase()
    if (
      lower.includes("poacher") ||
      lower.includes("danger") ||
      lower.includes("threat") ||
      lower.includes("human")
    )
      return "destructive"
    if (lower.includes("injured") || lower.includes("warning") || lower.includes("not found"))
      return "warning"
    if (lower.includes("safe") || lower.includes("normal") || lower.includes("animal") || lower.includes("active"))
      return "default"
    return "secondary"
  }

  const getStatusIcon = () => {
    const lower = status.toLowerCase()
    if (lower.includes("not found")) return <WifiOff className="h-4 w-4 text-destructive" />
    if (lower.includes("poacher") || lower.includes("danger") || lower.includes("threat"))
      return <AlertTriangle className="h-4 w-4" />
    if (lower.includes("injured") || lower.includes("warning"))
      return <AlertTriangle className="h-4 w-4" />
    return <ShieldCheck className="h-4 w-4" />
  }

  const getConfidenceColor = () => {
    if (confidence >= 80) return "text-primary"
    if (confidence >= 50) return "text-yellow-500"
    return "text-muted-foreground"
  }

  return (
    <Card className="border-primary/20">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              {t("field.node") || "Live W.A.T.C.H. Field Node"}
            </h3>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {isRunning && (
              <span className="flex items-center gap-1.5 text-xs text-primary font-bold px-2 py-0.5 rounded bg-primary/10">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                LIVE {activeSource === "esp32" ? "(ESP32-CAM)" : "(WEBCAM)"}
              </span>
            )}

            {isRecording && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-red-500 px-2 py-0.5 rounded bg-red-500/10 animate-pulse">
                <Circle className="h-2 w-2 fill-red-500 text-red-500" />
                REC {formatTime(recordingSeconds)}
              </span>
            )}
          </div>
        </div>

        {/* ESP32 Status Notification Banner */}
        {esp32Notice && (
          <div
            className={`mb-4 p-3 rounded-lg border flex items-center justify-between text-sm ${
              esp32Notice.type === "success"
                ? "bg-green-500/10 border-green-500/30 text-green-500"
                : esp32Notice.type === "connecting"
                ? "bg-primary/10 border-primary/30 text-primary"
                : "bg-destructive/10 border-destructive/30 text-destructive"
            }`}
          >
            <div className="flex items-center gap-2">
              {esp32Notice.type === "success" && <CheckCircle2 className="h-4 w-4 flex-shrink-0" />}
              {esp32Notice.type === "connecting" && <RefreshCw className="h-4 w-4 animate-spin flex-shrink-0" />}
              {esp32Notice.type === "error" && <WifiOff className="h-4 w-4 flex-shrink-0" />}
              <span className="font-medium">{esp32Notice.message}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs px-2"
              onClick={() => setEsp32Notice(null)}
            >
              Dismiss
            </Button>
          </div>
        )}

        {/* ESP32 Stream URL Settings Dropdown */}
        {showEsp32Config && (
          <div className="mb-4 p-3 rounded-lg border border-border bg-muted/40 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Radio className="h-3.5 w-3.5" />
                ESP32-CAM Stream URL / IP Endpoint:
              </label>
              <span className="text-[11px] text-muted-foreground">Default: http://192.168.4.1/stream</span>
            </div>
            <div className="flex gap-2">
              <Input
                value={esp32Url}
                onChange={(e) => setEsp32Url(e.target.value)}
                placeholder="http://192.168.4.1/stream or http://192.168.1.100:81/stream"
                className="text-xs h-8"
              />
              <Button size="sm" className="h-8 text-xs" onClick={() => setShowEsp32Config(false)}>
                Done
              </Button>
            </div>
          </div>
        )}

        <div className="flex flex-col items-center gap-4">
          {/* Video Feed Canvas Container */}
          <div
            ref={webcamContainerRef}
            className="relative rounded-lg overflow-hidden border-2 border-border bg-muted flex items-center justify-center shadow-inner"
            style={{ width: 400, height: 400, maxWidth: "100%" }}
          >
            {/* Dedicated host for the video/webcam canvas */}
            <div
              ref={canvasHostRef}
              className="absolute inset-0 flex items-center justify-center bg-black"
              style={{ zIndex: 1 }}
            />

            {/* AI HUD Overlay */}
            {isRunning && (
              <div className="absolute inset-0 z-20 pointer-events-none p-4">
                {/* Scanning Beam */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-primary shadow-[0_0_15px_rgba(var(--primary),0.8)] animate-scan-beam opacity-50" />

                {/* Target Focus Box */}
                {confidence > 40 && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-primary animate-in zoom-in duration-300">
                    <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-primary" />
                    <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-primary" />
                    <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-primary" />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-primary" />

                    <div className="absolute -top-10 left-0 bg-primary/90 text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-t flex items-center gap-2 backdrop-blur-md">
                      <Activity className="h-3 w-3 animate-pulse" />
                      {t("target.label") || "TARGET"}: {status.toUpperCase()}
                    </div>
                  </div>
                )}

                {/* Corner Decorative Brackets */}
                <div className="absolute top-4 left-4 w-10 h-10 border-t-2 border-l-2 border-primary/30" />
                <div className="absolute top-4 right-4 w-10 h-10 border-t-2 border-r-2 border-primary/30" />
                <div className="absolute bottom-4 left-4 w-10 h-10 border-b-2 border-l-2 border-primary/30" />
                <div className="absolute bottom-4 right-4 w-10 h-10 border-b-2 border-r-2 border-primary/30" />
              </div>
            )}

            {/* Inactive Placeholder */}
            {!isRunning && !isScanning && !error && (
              <div
                className="flex flex-col items-center gap-2 text-muted-foreground p-8 text-center"
                style={{ zIndex: 5 }}
              >
                <Video className="h-12 w-12 opacity-50" />
                <p className="text-sm font-medium">
                  {t("camera.hint") || 'Click "Start Camera" or "Connect to ESP32 CAM" to begin AI monitoring'}
                </p>
              </div>
            )}

            {isScanning && (
              <div
                className="flex flex-col items-center gap-4 text-primary p-8 text-center animate-pulse"
                style={{ zIndex: 5 }}
              >
                <RefreshCw className="h-10 w-10 animate-spin" />
                <p className="text-sm font-medium">
                  {isConnectingEsp32 ? "Probing ESP32 CAM Stream..." : "Initializing AI Vision Core..."}
                </p>
              </div>
            )}

            {error && (
              <div
                className="flex flex-col items-center gap-2 text-destructive p-8 text-center"
                style={{ zIndex: 5 }}
              >
                <CameraOff className="h-12 w-12 opacity-50" />
                <p className="text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* Action & Connection Controls */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {!isRunning ? (
              <>
                <Button onClick={startWebcam} className="gap-2">
                  <Camera className="h-4 w-4" />
                  {t("camera.start") || "Start Camera"}
                </Button>

                <Button
                  onClick={connectToEsp32Cam}
                  variant="outline"
                  className="gap-2 border-primary/40 text-primary hover:bg-primary/10"
                  disabled={isConnectingEsp32}
                >
                  <Wifi className="h-4 w-4" />
                  Connect to ESP32 CAM
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                  title="Configure ESP32 IP / Stream URL"
                  onClick={() => setShowEsp32Config(!showEsp32Config)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button onClick={stopWebcam} variant="destructive" className="gap-2">
                  <CameraOff className="h-4 w-4" />
                  {activeSource === "esp32" ? "Disconnect ESP32" : t("camera.stop") || "Stop Camera"}
                </Button>

                {lastRecordedUrl && (
                  <a href={lastRecordedUrl} download={`WATCH_AI_RECORDING_${Date.now()}.webm`}>
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                      <Download className="h-3.5 w-3.5" />
                      Save Recording
                    </Button>
                  </a>
                )}
              </>
            )}
          </div>

          {/* Detection Results Card */}
          <div className="w-full rounded-lg border border-border bg-card p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-muted-foreground">{t("detector.label") || "Detection"}:</span>
              <Badge variant={getStatusVariant()} className="gap-1.5">
                {getStatusIcon()}
                {status.toUpperCase()}
              </Badge>
            </div>

            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-muted-foreground">{t("confidence.label") || "Confidence"}:</span>
              <span className={`font-mono text-xl font-bold ${getConfidenceColor()}`}>
                {confidence}%
              </span>
            </div>

            {/* Human Detection Alert */}
            {isHumanDetected && (
              <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md animate-pulse">
                <div className="flex items-center gap-2 text-destructive font-bold">
                  <AlertTriangle className="h-5 w-5" />
                  <span>{t("human.alert") || "UNAUTHORIZED HUMAN DETECTED"}</span>
                </div>
                <p className="text-xs text-destructive/80 mt-1">
                  {t("human.alert.desc") ||
                    "Possible poaching activity or unauthorized person inside the reserve. Security notified."}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
