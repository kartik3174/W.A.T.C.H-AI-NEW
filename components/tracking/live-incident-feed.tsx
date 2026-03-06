"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, AlertCircle, Zap, CheckCircle, Radio, Clock } from "lucide-react"
import { eventBus } from "@/app/shared-events/eventBus"
import { geofenceEventBus } from "@/app/shared-events/geofenceEventBus"

export interface IncidentEvent {
  id: string
  timestamp: Date
  type: "breach" | "threat" | "deployment" | "confirmation" | "notification"
  message: string
  severity?: "high" | "critical"
  animal?: string
}

export function LiveIncidentFeed() {
  const [incidents, setIncidents] = useState<IncidentEvent[]>([])
  const [autoScroll, setAutoScroll] = useState(true)

  // Subscribe to geofence breaches
  useEffect(() => {
    const unsubscribe = geofenceEventBus.onBreachDetected((breachEvent) => {
      const newIncident: IncidentEvent = {
        id: `breach-${breachEvent.id}`,
        timestamp: new Date(breachEvent.timestamp),
        type: "breach",
        message: `⚠️ Boundary breach detected — ${breachEvent.animalName} (${breachEvent.species}) left reserve`,
        severity: "critical",
        animal: breachEvent.animalName,
      }
      setIncidents((prev) => [newIncident, ...prev])

      // Auto-add deployment event
      setTimeout(() => {
        const deployEvent: IncidentEvent = {
          id: `deploy-${breachEvent.id}`,
          timestamp: new Date(),
          type: "deployment",
          message: `🚁 Drone Alpha deployed to intercept ${breachEvent.animalName}`,
          animal: breachEvent.animalName,
        }
        setIncidents((prev) => [deployEvent, ...prev])
      }, 800)

      // Auto-add confirmation event
      setTimeout(() => {
        const confirmEvent: IncidentEvent = {
          id: `confirm-${breachEvent.id}`,
          timestamp: new Date(),
          type: "confirmation",
          message: `📡 Visual confirmation in progress — tracking ${breachEvent.animalName}`,
          animal: breachEvent.animalName,
        }
        setIncidents((prev) => [confirmEvent, ...prev])
      }, 1600)

      // Auto-add ranger notification
      setTimeout(() => {
        const notifyEvent: IncidentEvent = {
          id: `notify-${breachEvent.id}`,
          timestamp: new Date(),
          type: "notification",
          message: `👮 Rangers notified — Coordinating response for ${breachEvent.animalName}`,
          animal: breachEvent.animalName,
        }
        setIncidents((prev) => [notifyEvent, ...prev])
      }, 2400)
    })

    return () => unsubscribe()
  }, [])

  // Subscribe to threat events
  useEffect(() => {
    const unsubscribe = eventBus.subscribe((event) => {
      if (event.type !== "boundary-breach") {
        const threatIncident: IncidentEvent = {
          id: `threat-${event.id}`,
          timestamp: new Date(event.timestamp),
          type: "threat",
          message: `⚠️ ${event.type} threat detected — Severity: ${event.severity}`,
          severity: event.severity,
        }
        setIncidents((prev) => [threatIncident, ...prev])
      }
    })

    return () => unsubscribe()
  }, [])

  const getIcon = (type: IncidentEvent["type"]) => {
    switch (type) {
      case "breach":
        return <AlertTriangle className="h-5 w-5 text-[#FF7A00]" />
      case "threat":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "deployment":
        return <Zap className="h-5 w-5 text-[#FF7A00]" />
      case "confirmation":
        return <Radio className="h-5 w-5 text-blue-400" />
      case "notification":
        return <CheckCircle className="h-5 w-5 text-green-400" />
    }
  }

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-600 text-white"
      case "high":
        return "bg-[#FF7A00] text-[#0B132B]"
      default:
        return "bg-blue-600 text-white"
    }
  }

  return (
    <Card className="bg-[#1C7ED6] border-2 border-[#FF7A00]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-[#EAEAEA]">Live Incident Feed</CardTitle>
            <CardDescription className="text-[#EAEAEA]/80">Real-time system actions and alerts</CardDescription>
          </div>
          <Badge className={getSeverityColor(incidents[0]?.severity)}>
            {incidents.length} Events
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {incidents.length === 0 ? (
            <div className="text-center py-8 text-[#EAEAEA]/60">
              <Radio className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Waiting for incidents...</p>
            </div>
          ) : (
            incidents.slice(0, 10).map((incident) => (
              <div
                key={incident.id}
                className="flex items-start gap-3 p-2 rounded-lg bg-[#0B132B]/50 border border-[#FF7A00]/30 hover:border-[#FF7A00] transition-colors"
              >
                <div className="mt-1 flex-shrink-0">{getIcon(incident.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#EAEAEA] break-words">{incident.message}</p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-[#EAEAEA]/60">
                    <Clock className="h-3 w-3" />
                    {incident.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
