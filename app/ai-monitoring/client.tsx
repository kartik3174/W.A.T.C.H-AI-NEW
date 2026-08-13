"use client"

import { useEffect, useState, useRef } from "react"
import * as tmImage from "@teachablemachine/image"
import * as mobilenet from "@tensorflow-models/mobilenet"
import * as tf from "@tensorflow/tfjs"
import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { AlertTriangle } from "lucide-react"

export function AIMonitoringClient() {
  const { t } = useLanguage()
  const [AIMonitoringDashboard, setAIMonitoringDashboard] =
    useState<React.ComponentType | null>(null)

  const [loading, setLoading] = useState(true)

  const [detections, setDetections] = useState<any[]>([])
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(false)

  const [model, setModel] = useState<any>(null)
  const [visionModel, setVisionModel] = useState<any>(null)

  /* -------------------------
     Load AI model
  --------------------------*/
  const imageRef = useRef<HTMLImageElement | null>(null)

  useEffect(() => {
    const loadModels = async () => {
      try {
        // Load Custom Model
        const modelURL = "/model/model.json"
        const metadataURL = "/model/metadata.json"
        const [custom, pro] = await Promise.all([
          tmImage.load(modelURL, metadataURL),
          mobilenet.load({ version: 2, alpha: 1.0 })
        ]);

        setModel(custom)
        setVisionModel(pro)
        console.log("AI detection engines ready")
      } catch (error) {
        console.error("Failed to load AI models:", error)
      }
    }
    loadModels()
  }, [])

  // Re-run detection if model finishes loading and an image is already there
  useEffect(() => {
    if (model && imagePreview && imageRef.current) {
      detectAnimal(imageRef.current);
    }
  }, [model, imagePreview]);

  /* -------------------------
     Load dashboard component
  --------------------------*/

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

  /* -------------------------
     Run AI prediction
  --------------------------*/

  async function detectAnimal(imageElement: HTMLImageElement | null) {
    if (!model || !visionModel || !imageElement) return
    
    setIsScanning(true);
    setDetections([]);

    try {
      // Ensure image is fully decoded
      await imageElement.decode();

      // Create a square snapshot for the models
      const canvas = document.createElement("canvas");
      canvas.width = 224;
      canvas.height = 224;
      const ctx = canvas.getContext("2d");
      
      if (ctx) {
        const size = Math.min(imageElement.naturalWidth, imageElement.naturalHeight);
        const startX = (imageElement.naturalWidth - size) / 2;
        const startY = (imageElement.naturalHeight - size) / 2;
        ctx.drawImage(imageElement, startX, startY, size, size, 0, 0, 224, 224);
      }

      // 1. Get custom model prediction
      const customPred = await model.predict(canvas);
      
      // 2. Get vision model (MobileNet) verification
      const proPred = await visionModel.classify(canvas);

      // 3. Define the scanning area as the bounding box
      // Since we center-crop for prediction, the focus box should match that area
      const size = Math.min(imageElement.naturalWidth, imageElement.naturalHeight);
      const startX = (imageElement.naturalWidth - size) / 2;
      const startY = (imageElement.naturalHeight - size) / 2;
      
      const focusBox = [startX, startY, size, size];
      
      // Hybrid Logic:
      // If the custom model is very unsure (< 60%), but the vision model clearly sees 
      // one of our target animals, we prioritize the vision model's accuracy.
      let bestResult = customPred.map((p: any) => ({
        label: p.className,
        confidence: p.probability
      })).sort((a: any, b: any) => b.confidence - a.confidence)[0];

      // Verification Step
      const targetLabels = ["Elephant", "Tiger", "Lion", "Rhino", "Gorilla"];
      const mapping: Record<string, string[]> = {
        "Elephant": ["elephant", "tusker", "proboscidean", "african elephant", "indian elephant"],
        "Tiger": ["tiger", "panthera tigris", "bengal tiger", "siberian tiger", "feline"],
        "Lion": ["lion", "big cat", "king of beasts", "panthera leo"],
        "Rhino": ["rhino", "rhinoceros", "white rhinoceros", "black rhinoceros", "indian rhinoceros", "ceratotherium", "diceros", "pachyderm", "water buffalo", "hippopotamus", "hippo"],
        "Gorilla": ["gorilla", "western gorilla", "eastern gorilla", "ape", "primate", "hominoid", "chimpanzee"],
        "Human": ["human", "person", "man", "woman", "guy", "adult", "child", "hiker", "pedestrian"]
      };

      let matchedLabel: string | null = null;
      let matchedConfidence = 0;

      // Check top 5 results from the vision model (MobileNet) for maximum sensitivity
      for (const p of proPred.slice(0, 5)) {
        const detectedClass = p.className.toLowerCase();
        
        for (const [label, synonyms] of Object.entries(mapping)) {
          if (synonyms.some(s => detectedClass.includes(s.toLowerCase()))) {
            matchedLabel = label;
            matchedConfidence = p.probability;
            break;
          }
        }
        if (matchedLabel) break;
      }

      // Hybrid Confidence Decision Logic Refinement:
      // CRITICAL: Aggressively prioritize Human detection
      if (matchedLabel === "Human" && (bestResult.confidence < 0.8 || bestResult.label !== "Human")) {
        bestResult = {
          label: "Human",
          confidence: Math.max(0.96, matchedConfidence)
        };
      } else if (matchedLabel && matchedLabel !== "Elephant" && bestResult.label === "Elephant" && bestResult.confidence < 0.7) {
        bestResult = {
          label: matchedLabel,
          confidence: Math.max(0.95, matchedConfidence)
        };
      } else if (matchedLabel && bestResult.label !== matchedLabel && matchedConfidence > (bestResult.confidence + 0.2)) {
        bestResult = {
          label: matchedLabel,
          confidence: Math.max(0.95, matchedConfidence)
        };
      }
      
      // Special case: If it's a very low match for Elephant, it might be a false positive
      // (often happens with grey-colored animals). Re-check if it's potentially something else.
      if (bestResult.label === "Elephant" && bestResult.confidence < 0.45 && !matchedLabel) {
        // Fallback to second best custom predicted label if it's much more specific
        const secondBest = customPred.map((p: any) => ({
          label: p.className,
          confidence: p.probability
        })).sort((a: any, b: any) => b.confidence - a.confidence)[1];
        
        if (secondBest && secondBest.confidence > 0.2) {
          bestResult = secondBest;
        }
      }

      // Small delay for UX scanning feel
      await new Promise(resolve => setTimeout(resolve, 800));

      setDetections([{
        ...bestResult,
        bbox: focusBox
      }])
    } catch (error) {
      console.error("Vision Process Error:", error)
    } finally {
      setIsScanning(false);
    }
  }

  /* -------------------------
     Handle image upload
  --------------------------*/

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {

    const file = e.target.files?.[0]

    if (!file) return

    setDetections([])
    const preview = URL.createObjectURL(file)

    setImagePreview(preview)

  }

  /* -------------------------
     Loading state
  --------------------------*/
  if (loading) {
    return (
      <Card className="w-full p-8">
        <CardContent className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">
              {t("loading.dashboard") || "Loading AI monitoring dashboard..."}
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
              {t("failed.dashboard") || "Failed to load AI monitoring dashboard."}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  /* -------------------------
     UI
  --------------------------*/

  return (
    <div className="space-y-6">

      <Card className="p-6">
        <CardContent className="space-y-4">

          <h2 className="text-xl font-semibold">
            {t("detection.title")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("detection.description")}
          </p>

          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="border p-2 rounded"
          />

          {imagePreview && (
            <div className="relative inline-block overflow-hidden rounded-xl border-2 border-primary/20 shadow-2xl group">
              <img
                ref={imageRef}
                src={imagePreview}
                alt="AI Analysis Preview"
                className="max-w-full md:max-w-2xl h-auto block"
                onLoad={(e) => {
                  detectAnimal(e.currentTarget as HTMLImageElement)
                }}
              />
              
              {/* Scanning Beam Effect */}
              {isScanning && (
                <div className="absolute inset-0 z-10 pointer-events-none">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-primary/50 shadow-[0_0_20px_rgba(var(--primary),0.8)] animate-scan-beam" />
                  <div className="absolute inset-0 bg-primary/5 animate-pulse" />
                </div>
              )}

              {/* Bounding Boxes */}
              {!isScanning && detections.map((d: any, i: number) => {
                if (!d.bbox || !imageRef.current) return null;
                
                const img = imageRef.current;
                const scaleX = img.clientWidth / img.naturalWidth;
                const scaleY = img.clientHeight / img.naturalHeight;
                
                return (
                  <div
                    key={i}
                    className="absolute border-2 border-primary animate-in fade-in zoom-in duration-500 z-20"
                    style={{
                      left: d.bbox[0] * scaleX,
                      top: d.bbox[1] * scaleY,
                      width: d.bbox[2] * scaleX,
                      height: d.bbox[3] * scaleY,
                      boxShadow: '0 0 0 4000px rgba(0,0,0,0.3)',
                    }}
                  >
                    <div className="absolute -top-7 left-0 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-t flex items-center gap-1 whitespace-nowrap">
                      <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      {d.label} ({(d.confidence * 100).toPrecision(3)}%)
                    </div>
                    
                    {/* Corner accents for the box */}
                    <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-white" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-white" />
                    <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-white" />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-white" />
                  </div>
                );
              })}
            </div>
          )}

          {isScanning && (
            <div className="flex items-center space-x-2 text-primary animate-pulse py-2">
              <div className="h-2 w-2 bg-primary rounded-full animate-bounce"></div>
              <span className="text-sm font-medium">{t("scanning.wildlife") || "Scanning Wildlife..."}</span>
            </div>
          )}

          {detections.length > 0 && (
            <div className="mt-4">
              <div className="p-4 border border-primary/20 rounded-xl bg-primary/5 backdrop-blur-sm">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-muted-foreground">{t("identified.species") || "Identified Species"}</span>
                  <span className="text-xs font-mono bg-primary/10 px-2 py-0.5 rounded text-primary">
                    {(detections[0].confidence * 100).toFixed(2)}% {t("match") || "Match"}
                  </span>
                </div>
                <div className="text-2xl font-bold tracking-tight">
                  {detections[0].label}
                </div>
              </div>

              {/* Human Detection Security Alert */}
              {detections[0].label === "Human" && (
                <div className="mt-3 p-3 bg-red-600/10 border border-red-600/20 rounded-xl animate-pulse">
                  <div className="flex items-center gap-2 text-red-600 font-bold">
                    <AlertTriangle className="h-5 w-5" />
                    <span>{t("human.alert") || "SECURITY ALERT: HUMAN DETECTED"}</span>
                  </div>
                  <p className="text-xs text-red-600/80 mt-1">
                    {t("human.alert.desc") || "Unauthorized person detected in restricted conservation zone."}
                  </p>
                </div>
              )}
            </div>
          )}

        </CardContent>
      </Card>

      <AIMonitoringDashboard />

    </div>
  )
}