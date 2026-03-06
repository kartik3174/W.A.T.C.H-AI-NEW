"use client"

import React, { useEffect, useRef, useState, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Camera, CameraOff, AlertTriangle, ShieldCheck, Activity } from "lucide-react"

const MODEL_URL = "https://teachablemachine.withgoogle.com/models/blSSjhpxx/"

export default function AiMonitor() {
  const [status, setStatus] = useState("Initializing AI...")
  const [confidence, setConfidence] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [error, setError] = useState(null)
  const [allPredictions, setAllPredictions] = useState([])
  const webcamContainerRef = useRef(null)
  const canvasHostRef = useRef(null)
  const webcamRef = useRef(null)
  const modelRef = useRef(null)
  const animFrameRef = useRef(null)
  const isMountedRef = useRef(true)

  const stopWebcam = useCallback(() => {
    isMountedRef.current = false
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current)
      animFrameRef.current = null
    }
    if (webcamRef.current) {
      webcamRef.current.stop()
      webcamRef.current = null
    }
    if (canvasHostRef.current) {
      while (canvasHostRef.current.firstChild) {
        canvasHostRef.current.removeChild(canvasHostRef.current.firstChild)
      }
    }
    setIsRunning(false)
    setStatus("Camera stopped")
    setConfidence(0)
    setAllPredictions([])
  }, [])

  const startWebcam = useCallback(async () => {
    setError(null)
    setStatus("Loading AI model...")

    try {
      const tmImage = await import("@teachablemachine/image")

      let model, webcam;
      isMountedRef.current = true;

      async function init() {
        const modelURL = MODEL_URL + "model.json";
        const metadataURL = MODEL_URL + "metadata.json";

        model = await tmImage.load(modelURL, metadataURL);
        modelRef.current = model;

        if (!isMountedRef.current) return;

        setStatus("Starting camera...");

        const flip = true;
        webcam = new tmImage.Webcam(400, 400, flip);
        await webcam.setup();
        await webcam.play();
        webcamRef.current = webcam;

        if (isMountedRef.current && canvasHostRef.current) {
          while (canvasHostRef.current.firstChild) {
            canvasHostRef.current.removeChild(canvasHostRef.current.firstChild);
          }
          canvasHostRef.current.appendChild(webcam.canvas);
          setIsRunning(true);
          setStatus("Scanning...");
          animFrameRef.current = window.requestAnimationFrame(loop);
        }
      }

      async function loop() {
        if (!isMountedRef.current) return;
        webcam.update();
        await predict();
        if (isMountedRef.current) {
          animFrameRef.current = window.requestAnimationFrame(loop);
        }
      }

      async function predict() {
        if (!model || !isMountedRef.current) return;
        const prediction = await model.predict(webcam.canvas);
        const sorted = [...prediction].sort((a, b) => b.probability - a.probability);
        const highest = sorted[0];

        if (isMountedRef.current) {
          setAllPredictions(
            sorted.map((p) => ({
              className: p.className,
              probability: Math.round(p.probability * 100),
            }))
          );
          setStatus(highest.className);
          setConfidence(Math.round(highest.probability * 100));
        }
      }

      init();

    } catch (err) {
      console.error("AI Monitor error:", err)
      setError(err.message || "Failed to initialize camera or model.")
      setStatus("Error")
      setIsRunning(false)
    }
  }, [])

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
        animFrameRef.current = null
      }
      if (webcamRef.current) {
        webcamRef.current.stop()
        webcamRef.current = null
      }
      if (canvasHostRef.current) {
        while (canvasHostRef.current.firstChild) {
          canvasHostRef.current.removeChild(canvasHostRef.current.firstChild)
        }
      }
    }
  }, [])

  const getStatusVariant = () => {
    const lower = status.toLowerCase()
    if (lower.includes("poacher") || lower.includes("danger") || lower.includes("threat")) return "destructive"
    if (lower.includes("injured") || lower.includes("warning")) return "warning"
    if (lower.includes("safe") || lower.includes("normal") || lower.includes("animal")) return "default"
    return "secondary"
  }

  const getStatusIcon = () => {
    const lower = status.toLowerCase()
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
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Live W.A.T.C.H. Field Node</h3>
          </div>
          <div className="flex items-center gap-2">
            {isRunning && (
              <span className="flex items-center gap-1.5 text-xs text-primary">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                LIVE
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          {/* Webcam Feed */}
          <div
            ref={webcamContainerRef}
            className="relative rounded-lg overflow-hidden border-2 border-border bg-muted flex items-center justify-center"
            style={{ width: 400, height: 400, maxWidth: "100%" }}
          >
            {/* Dedicated host for the webcam canvas - React won't touch this */}
            <div
              ref={canvasHostRef}
              className="absolute inset-0 flex items-center justify-center"
              style={{ zIndex: 1 }}
            />
            {/* React-managed placeholder content */}
            {!isRunning && !error && (
              <div className="flex flex-col items-center gap-2 text-muted-foreground p-8 text-center" style={{ zIndex: 0 }}>
                <Camera className="h-12 w-12 opacity-50" />
                <p className="text-sm">Click &quot;Start Camera&quot; to begin AI detection</p>
              </div>
            )}
            {error && (
              <div className="flex flex-col items-center gap-2 text-destructive p-8 text-center" style={{ zIndex: 0 }}>
                <CameraOff className="h-12 w-12 opacity-50" />
                <p className="text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            {!isRunning ? (
              <Button onClick={startWebcam} className="gap-2">
                <Camera className="h-4 w-4" />
                Start Camera
              </Button>
            ) : (
              <Button onClick={stopWebcam} variant="destructive" className="gap-2">
                <CameraOff className="h-4 w-4" />
                Stop Camera
              </Button>
            )}
          </div>

          {/* Detection Results */}
          <div className="w-full rounded-lg border border-border bg-card p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-muted-foreground">Detection:</span>
              <Badge variant={getStatusVariant()} className="gap-1.5">
                {getStatusIcon()}
                {status.toUpperCase()}
              </Badge>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-muted-foreground">Confidence:</span>
              <span className={`font-mono text-xl font-bold ${getConfidenceColor()}`}>{confidence}%</span>
            </div>

            {/* Confidence bars for all classes */}
            {allPredictions.length > 0 && (
              <div className="mt-4 pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2 font-medium">All Classes</p>
                <div className="flex flex-col gap-2">
                  {allPredictions.map((pred) => (
                    <div key={pred.className} className="flex items-center gap-2">
                      <span className="text-xs text-foreground w-24 truncate">{pred.className}</span>
                      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-300"
                          style={{ width: `${pred.probability}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono text-muted-foreground w-10 text-right">
                        {pred.probability}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
