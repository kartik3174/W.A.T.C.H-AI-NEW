"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, Radio, ShieldAlert, Volume2 } from "lucide-react"
import { AudioAlert } from "@/components/tracking/audio-alert"

interface AcousticAlert {
  id: number
  type: string
  location: string
  time: string
  severity: "CRITICAL" | "HIGH" | "MEDIUM"
}

interface AcousticMonitorProps {
  onAlert: (type: string, location: string, severity: "CRITICAL" | "HIGH" | "MEDIUM") => void
}

export function AcousticMonitor({ onAlert }: AcousticMonitorProps) {
  const [isListening, setIsListening] = useState(false)
  const [lastTranscript, setLastTranscript] = useState("")
  const [localAlerts, setLocalAlerts] = useState<AcousticAlert[]>([])
  const [isSupported, setIsSupported] = useState(true)
  const recognitionRef = useRef<any>(null)
  const isListeningRef = useRef(false)

  // Keep the ref in sync with state
  useEffect(() => {
    isListeningRef.current = isListening
  }, [isListening])

  const processTranscript = useCallback(
    (transcript: string) => {
      const upper = transcript.toUpperCase()
      setLastTranscript(transcript)

      const sectorLocations = [
        "Sector 1 - Northern Ridge",
        "Sector 2 - River Basin",
        "Sector 3 - Southern Perimeter",
        "Sector 4 - Near Water Hole",
        "Sector 5 - Eastern Grasslands",
        "Sector 6 - Western Forest Edge",
      ]
      const randomLocation = sectorLocations[Math.floor(Math.random() * sectorLocations.length)]

      if (upper.includes("BANG") || upper.includes("GUN") || upper.includes("SHOT")) {
        triggerAlert("GUNSHOT DETECTED", randomLocation, "CRITICAL")
      }
      if (upper.includes("HELP") || upper.includes("DANGER")) {
        triggerAlert("DISTRESS CALL DETECTED", randomLocation, "HIGH")
      }
      if (upper.includes("VEHICLE") || upper.includes("ENGINE") || upper.includes("TRUCK")) {
        triggerAlert("VEHICLE DETECTED IN RESTRICTED ZONE", randomLocation, "HIGH")
      }
      if (upper.includes("CHAINSAW") || upper.includes("SAW") || upper.includes("CUTTING")) {
        triggerAlert("ILLEGAL LOGGING ACTIVITY", randomLocation, "CRITICAL")
      }
      if (upper.includes("ANIMAL") || upper.includes("ROAR") || upper.includes("SCREAM")) {
        triggerAlert("ANIMAL DISTRESS VOCALIZATION", randomLocation, "MEDIUM")
      }
    },
    []
  )

  const triggerAlert = useCallback(
    (type: string, location: string, severity: "CRITICAL" | "HIGH" | "MEDIUM") => {
      const newAlert: AcousticAlert = {
        id: Date.now(),
        type,
        location,
        time: new Date().toLocaleTimeString(),
        severity,
      }
      setLocalAlerts((prev) => [newAlert, ...prev].slice(0, 10))

      // Play audio alert for critical detections
      if (severity === "CRITICAL") {
        try {
          AudioAlert.init()
          AudioAlert.playAlertPattern(2, 300)
        } catch {
          // Audio may not be available
        }
      }

      onAlert(type, location, severity)
    },
    [onAlert]
  )

  const startListening = useCallback(() => {
    const SpeechRecognition =
      typeof window !== "undefined"
        ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        : null

    if (!SpeechRecognition) {
      setIsSupported(false)
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.lang = "en-US"
    recognition.interimResults = false

    recognition.onresult = (event: any) => {
      const transcript = event.results[event.resultIndex][0].transcript
      processTranscript(transcript)
    }

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error)
      if (event.error === "not-allowed") {
        setIsListening(false)
      }
    }

    recognition.onend = () => {
      // Auto-restart if still supposed to be listening
      if (isListeningRef.current) {
        try {
          recognition.start()
        } catch {
          // May fail if already started
        }
      }
    }

    recognitionRef.current = recognition

    try {
      recognition.start()
      setIsListening(true)
    } catch {
      setIsListening(false)
    }
  }, [processTranscript])

  const stopListening = useCallback(() => {
    setIsListening(false)
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch {
        // May already be stopped
      }
      recognitionRef.current = null
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch {
          // ignore
        }
      }
    }
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return "bg-red-500 text-white hover:bg-red-600"
      case "HIGH":
        return "bg-orange-500 text-white hover:bg-orange-600"
      case "MEDIUM":
        return "bg-yellow-500 text-foreground hover:bg-yellow-600"
      default:
        return "bg-muted text-foreground"
    }
  }

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Acoustic Monitoring</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {isListening && (
              <span className="flex items-center gap-1.5 text-xs text-red-500 font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                </span>
                LISTENING
              </span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status and Controls */}
        <div className="flex items-center gap-3">
          {!isListening ? (
            <Button
              onClick={startListening}
              size="sm"
              className="gap-2"
              disabled={!isSupported}
            >
              <Mic className="h-4 w-4" />
              Start Acoustic Sensors
            </Button>
          ) : (
            <Button onClick={stopListening} size="sm" variant="destructive" className="gap-2">
              <MicOff className="h-4 w-4" />
              Stop Monitoring
            </Button>
          )}

          {!isSupported && (
            <p className="text-xs text-muted-foreground">
              Speech Recognition is not supported in this browser.
            </p>
          )}
        </div>

        {/* Active listening indicator */}
        {isListening && (
          <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3">
            <Volume2 className="h-4 w-4 text-primary animate-pulse" />
            <div className="flex-1">
              <p className="text-xs font-medium text-foreground">Sensors Active</p>
              <p className="text-xs text-muted-foreground">
                Monitoring for: gunshots, distress calls, vehicles, chainsaws, animal vocalizations
              </p>
            </div>
          </div>
        )}

        {/* Last detected transcript */}
        {lastTranscript && (
          <div className="rounded-lg border border-border bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground mb-1">Last Audio Input</p>
            <p className="text-sm font-mono text-foreground">{lastTranscript}</p>
          </div>
        )}

        {/* Recent acoustic alerts */}
        {localAlerts.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <ShieldAlert className="h-3.5 w-3.5" />
              Recent Acoustic Detections ({localAlerts.length})
            </p>
            <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
              {localAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start justify-between rounded-md border border-border bg-card p-2.5"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{alert.type}</p>
                    <p className="text-xs text-muted-foreground">{alert.location}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 ml-2">
                    <Badge className={getSeverityColor(alert.severity)} variant="default">
                      {alert.severity}
                    </Badge>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{alert.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
