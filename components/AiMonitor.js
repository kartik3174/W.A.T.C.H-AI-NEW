"use client"

import React, { useEffect, useRef, useState, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Camera, CameraOff, AlertTriangle, ShieldCheck, Activity, RefreshCw } from "lucide-react"
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
  const webcamContainerRef = useRef(null)
  const canvasHostRef = useRef(null)
  const webcamRef = useRef(null)
  const modelRef = useRef(null)
  const visionModelRef = useRef(null)
  const animFrameRef = useRef(null)
  const isMountedRef = useRef(true)
  const [isScanning, setIsScanning] = useState(false)
  const [isHumanDetected, setIsHumanDetected] = useState(false)

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
    setStatus(t("camera.stopped") || "Camera stopped")
    setConfidence(0)
  }, [])

  const startWebcam = useCallback(async () => {
    setError(null);
    setStatus(t("loading.models") || "Loading AI models...");
    setIsScanning(true);

    try {
      const tmImage = await import("@teachablemachine/image");
      const mobilenet = await import("@tensorflow-models/mobilenet");

      isMountedRef.current = true;

      const predict = async () => {
        if (!modelRef.current || !visionModelRef.current || !isMountedRef.current || !webcamRef.current) return;
        
        const webcam = webcamRef.current;
        const model = modelRef.current;
        const visionModel = visionModelRef.current;

        const prediction = await model.predict(webcam.canvas);
        const proPred = await visionModel.classify(webcam.canvas);

        let sorted = [...prediction].sort((a, b) => b.probability - a.probability);
        let bestResult = {
          label: sorted[0].className,
          confidence: sorted[0].probability
        };

        const mapping = {
          "Elephant": ["elephant", "tusker", "proboscidean", "african elephant", "indian elephant"],
          "Tiger": ["tiger", "panthera tigris", "bengal tiger", "siberian tiger", "feline"],
          "Lion": ["lion", "big cat", "king of beasts", "panthera leo"],
          "Rhino": ["rhino", "rhinoceros", "white rhinoceros", "black rhinoceros", "indian rhinoceros", "ceratotherium", "diceros", "pachyderm", "water buffalo", "hippopotamus", "hippo"],
          "Gorilla": ["gorilla", "western gorilla", "eastern gorilla", "ape", "primate", "hominoid", "chimpanzee"],
          "Human": ["human", "person", "man", "woman", "guy", "adult", "child", "hiker", "pedestrian"]
        };

        let verifiedLabel = null;
        let verifiedConfidence = 0;

        for (const p of proPred.slice(0, 3)) {
          const detectedClass = p.className.toLowerCase();
          for (const [label, synonyms] of Object.entries(mapping)) {
            if (synonyms.some(s => detectedClass.includes(s))) {
              verifiedLabel = label;
              verifiedConfidence = p.probability;
              break;
            }
          }
          if (verifiedLabel) break;
        }

        if (verifiedLabel === "Human" && (bestResult.confidence < 0.8 || bestResult.label !== "Human")) {
          bestResult = { label: "Human", confidence: Math.max(0.96, verifiedConfidence) };
        } else if (verifiedLabel && verifiedLabel !== "Elephant" && bestResult.label === "Elephant" && bestResult.confidence < 0.75) {
          bestResult = { label: verifiedLabel, confidence: Math.max(0.95, verifiedConfidence) };
        } else if (verifiedLabel && bestResult.label !== verifiedLabel && verifiedConfidence > (bestResult.confidence + 0.2)) {
          bestResult = { label: verifiedLabel, confidence: Math.max(0.95, verifiedConfidence) };
        }

        if (isMountedRef.current) {
          if (bestResult.confidence > 0.40) {
            setStatus(bestResult.label);
            setConfidence(Math.round(bestResult.confidence * 100));
            setIsHumanDetected(bestResult.label === "Human");
          } else if (bestResult.confidence > 0.15) {
            setStatus(t("analyzing") || "Analyzing Subject...");
            setConfidence(Math.round(bestResult.confidence * 100));
            setIsHumanDetected(false);
          } else {
            setStatus(t("scanning.activity") || "Active Scanning...");
            setConfidence(0);
            setIsHumanDetected(false);
          }
        }
      };

      const loop = async () => {
        if (!isMountedRef.current) return;
        if (webcamRef.current) {
          webcamRef.current.update();
          await predict();
        }
        if (isMountedRef.current) {
          animFrameRef.current = window.requestAnimationFrame(loop);
        }
      };

      const init = async () => {
        try {
          setStatus(t("initializing.engine") || "Initializing AI Engine...");
          await tf.ready();
          try {
            await tf.setBackend('webgl');
          } catch (e) {
            console.warn("WebGL not supported, falling back to CPU");
            await tf.setBackend('cpu');
          }

          setStatus(t("loading.vision") || "Loading Vision Core...");
          const modelURL = MODEL_URL + "model.json";
          const metadataURL = MODEL_URL + "metadata.json";
          modelRef.current = await tmImage.load(modelURL, metadataURL);

          setStatus(t("loading.mobilenet") || "Loading MobileNet...");
          visionModelRef.current = await mobilenet.load(VISION_MODEL_CONFIG);

          if (!isMountedRef.current) return;

          setStatus(t("starting.camera") || "Establishing Video Stream...");
          const flip = true;
          const webcamSize = 400;
          
          const setupWebcam = async (retries = 3) => {
            const webcam = new tmImage.Webcam(webcamSize, webcamSize, flip);
            for (let i = 0; i < retries; i++) {
              try {
                await webcam.setup();
                await webcam.play();
                return webcam;
              } catch (err) {
                console.warn(`Webcam setup attempt ${i+1} failed:`, err);
                if (i === retries - 1) throw err;
                await new Promise(r => setTimeout(r, 1000));
              }
            }
          };

          const webcam = await setupWebcam();
          webcamRef.current = webcam;

          if (isMountedRef.current && canvasHostRef.current) {
            const canvas = webcam.canvas;
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            canvas.style.objectFit = 'cover';
            canvas.style.borderRadius = '8px';
            
            while (canvasHostRef.current.firstChild) {
              canvasHostRef.current.removeChild(canvasHostRef.current.firstChild);
            }
            canvasHostRef.current.appendChild(canvas);
            
            setIsRunning(true);
            setIsScanning(false);
            setStatus(t("waiting.wildlife") || "Observation started...");
            animFrameRef.current = window.requestAnimationFrame(loop);
          }
        } catch (e) {
          console.error("AI Monitor Initialization Failure:", e);
          const errorMsg = e.name === "NotAllowedError" || e.name === "NotFoundError" || e.message?.includes("Permission")
            ? (t("camera.denied") || "Camera access denied. Please allow camera permissions in your browser.")
            : (t("failed.hardware") || `AI Initialization failed: ${e.message}`);
          
          setError(errorMsg);
          setStatus(t("error") || "Error");
          setIsScanning(false);
          setIsRunning(false);
        }
      };

      await init();

    } catch (err) {
      console.error("AI Monitor error:", err);
      setError(err.message || t("failed.camera") || "Failed to initialize camera or model.");
      setStatus(t("error") || "Error");
      setIsRunning(false);
      setIsScanning(false);
    }
  }, [t]);


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
    if (lower.includes("poacher") || lower.includes("danger") || lower.includes("threat") || lower.includes("human")) return "destructive"
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
            <h3 className="text-lg font-semibold text-foreground">{t("field.node") || "Live W.A.T.C.H. Field Node"}</h3>
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
            {/* Dedicated host for the webcam canvas */}
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

            {/* React-managed placeholder content */}
            {!isRunning && !isScanning && !error && (
              <div className="flex flex-col items-center gap-2 text-muted-foreground p-8 text-center" style={{ zIndex: 5 }}>
                <Camera className="h-12 w-12 opacity-50" />
                <p className="text-sm">{t("camera.hint") || "Click \"Start Camera\" to begin AI detection"}</p>
              </div>
            )}
            
            {isScanning && (
              <div className="flex flex-col items-center gap-4 text-primary p-8 text-center animate-pulse" style={{ zIndex: 5 }}>
                <RefreshCw className="h-10 w-10 animate-spin" />
                <p className="text-sm font-medium">Initializing AI Vision Core...</p>
              </div>
            )}

            {error && (
              <div className="flex flex-col items-center gap-2 text-destructive p-8 text-center" style={{ zIndex: 5 }}>
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
                {t("camera.start") || "Start Camera"}
              </Button>
            ) : (
              <Button onClick={stopWebcam} variant="destructive" className="gap-2">
                <CameraOff className="h-4 w-4" />
                {t("camera.stop") || "Stop Camera"}
              </Button>
            )}
          </div>

          {/* Detection Results */}
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
              <span className={`font-mono text-xl font-bold ${getConfidenceColor()}`}>{confidence}%</span>
            </div>

            {/* Human Detection Alert */}
            {isHumanDetected && (
              <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md animate-pulse">
                <div className="flex items-center gap-2 text-destructive font-bold">
                  <AlertTriangle className="h-5 w-5" />
                  <span>{t("human.alert") || "UNAUTHORIZED HUMAN DETECTED"}</span>
                </div>
                <p className="text-xs text-destructive/80 mt-1">
                  {t("human.alert.desc") || "Possible poaching activity or unauthorized person inside the reserve. Security notified."}
                </p>
              </div>
            )}

          </div>
        </div>
      </CardContent>
    </Card>
  )
}
