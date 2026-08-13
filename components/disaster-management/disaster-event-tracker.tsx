"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, MapPin, Clock, Activity } from "lucide-react"

interface DisasterEvent {
  id: string
  type: string
  latitude: number
  longitude: number
  radiusMeters: number
  severity: "low" | "moderate" | "severe" | "critical"
  description: string
  affectedAnimalsCount: number
  status: "open" | "monitoring" | "under_control" | "resolved"
  createdAt: Date
  updatedAt?: Date
}

interface DisasterEventTrackerProps {
  events?: DisasterEvent[]
}

const mockEvents: DisasterEvent[] = [
  {
    id: "FIRE-001",
    type: "Wildfire",
    latitude: -1.2456,
    longitude: 36.7284,
    radiusMeters: 5000,
    severity: "critical",
    description: "Major wildfire spreading rapidly in northern reserve. Wind driven spread.",
    affectedAnimalsCount: 234,
    status: "open",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "FLOOD-001",
    type: "Flash Flood",
    latitude: -1.3456,
    longitude: 36.8284,
    radiusMeters: 2000,
    severity: "severe",
    description: "Heavy rainfall causing flash floods in valley area. Roads blocked.",
    affectedAnimalsCount: 87,
    status: "monitoring",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
  {
    id: "DROUGHT-001",
    type: "Drought Condition",
    latitude: -1.1456,
    longitude: 36.6284,
    radiusMeters: 8000,
    severity: "severe",
    description: "Extended drought period - water sources drying up. Critical for wildlife.",
    affectedAnimalsCount: 512,
    status: "monitoring",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
]

const SEVERITY_COLORS = {
  low: { bg: "bg-blue-100", text: "text-blue-800", badge: "bg-blue-500" },
  moderate: { bg: "bg-green-100", text: "text-green-800", badge: "bg-green-500" },
  severe: { bg: "bg-orange-100", text: "text-orange-800", badge: "bg-orange-500" },
  critical: { bg: "bg-red-100", text: "text-red-800", badge: "bg-red-500" },
}

const STATUS_TEXT = {
  open: "Active Event",
  monitoring: "Under Monitoring",
  under_control: "Under Control",
  resolved: "Resolved",
}

export const DisasterEventTracker = ({ events = mockEvents }: DisasterEventTrackerProps) => {
  const criticalCount = events.filter((e) => e.severity === "critical").length
  const totalAffected = events.reduce((sum, e) => sum + e.affectedAnimalsCount, 0)
  const activeEvents = events.filter((e) => e.status === "open" || e.status === "monitoring")
    .length

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{criticalCount}</div>
              <p className="text-sm text-gray-600">Critical Events</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{activeEvents}</div>
              <p className="text-sm text-gray-600">Active Events</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{totalAffected}</div>
              <p className="text-sm text-gray-600">Affected Animals</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Event Details */}
      <div className="space-y-4">
        {events.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-gray-500">
              No active disaster events. All systems normal.
            </CardContent>
          </Card>
        ) : (
          events.map((event) => {
            const colors = SEVERITY_COLORS[event.severity]
            return (
              <Card key={event.id} className={colors.bg}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className={`text-lg flex items-center gap-2 ${colors.text}`}>
                        <AlertTriangle className="h-5 w-5" />
                        {event.type}
                      </CardTitle>
                      <p className="text-sm mt-1 opacity-75">{event.description}</p>
                    </div>
                    <Badge className={`${colors.badge} text-white`}>
                      {event.severity.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className={`space-y-3 ${colors.text}`}>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <div>
                        <p className="text-xs opacity-75">Location</p>
                        <p className="font-mono text-xs">
                          {event.latitude.toFixed(4)}, {event.longitude.toFixed(4)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      <div>
                        <p className="text-xs opacity-75">Status</p>
                        <p className="font-semibold text-xs">
                          {STATUS_TEXT[event.status]}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs opacity-75">Radius</p>
                      <p className="font-semibold">{(event.radiusMeters / 1000).toFixed(1)} km</p>
                    </div>
                    <div>
                      <p className="text-xs opacity-75">Animals Affected</p>
                      <p className="font-semibold">{event.affectedAnimalsCount}</p>
                    </div>
                  </div>

                  <div className="text-xs opacity-75 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Reported: {event.createdAt.toLocaleDateString()} at{" "}
                    {event.createdAt.toLocaleTimeString()}
                  </div>

                  <button className="w-full bg-white/20 hover:bg-white/30 text-current font-medium py-2 px-3 rounded text-sm transition">
                    View Evacuation Plan
                  </button>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {criticalCount > 0 && (
        <Alert className="border-red-300 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            CRITICAL ALERT: {criticalCount} critical disaster event{criticalCount > 1 ? "s" : ""}{" "}
            requiring immediate response. Check evacuation plans and alert teams.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
