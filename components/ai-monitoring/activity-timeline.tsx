"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Activity, AlertTriangle, Calendar, Clock, FileText, Heart, MapPin, RotateCw, Shield, User } from "lucide-react"

interface ActivityTimelineProps {
  timeRange?: string
}

export function ActivityTimeline({ timeRange = "7d" }: ActivityTimelineProps) {
  const [filter, setFilter] = useState<string>("all")
  const [animalFilter, setAnimalFilter] = useState<string>("all")
  const [severityFilter, setSeverityFilter] = useState<string>("all")

  const timelineEvents = [
    {
      id: "EVENT-001",
      date: "2024-03-15",
      time: "08:23 AM",
      type: "threat",
      title: "Poaching Risk Detected",
      description: "AI detected suspicious vehicle near perimeter fence in South Region, Sector 3.",
      location: "South Region, Sector 3",
      severity: "high",
      animalId: "RH-003",
      animalName: "Kifaru",
      timestamp: new Date("2024-03-15T08:23:00"),
    },
    {
      id: "EVENT-002",
      date: "2024-03-15",
      time: "10:45 AM",
      type: "intervention",
      title: "Response Team Deployed",
      description: "Conservation team dispatched to investigate potential poaching threat.",
      location: "South Region, Sector 3",
      severity: "medium",
      timestamp: new Date("2024-03-15T10:45:00"),
    },
    {
      id: "EVENT-003",
      date: "2024-03-14",
      time: "03:45 PM",
      type: "threat",
      title: "Habitat Disturbance",
      description: "Unauthorized logging activity detected by acoustic sensors.",
      location: "East Region, Sector 5",
      severity: "high",
      animalId: "LI-002",
      animalName: "Simba",
      timestamp: new Date("2024-03-14T15:45:00"),
    },
    {
      id: "EVENT-004",
      date: "2024-03-14",
      time: "11:30 PM",
      type: "movement",
      title: "Unusual Migration Pattern",
      description: "Group of elephants moving outside of typical seasonal routes.",
      location: "North Region, Sector 1",
      severity: "low",
      animalId: "EL-001",
      animalName: "Tembo",
      timestamp: new Date("2024-03-14T23:30:00"),
    },
    {
      id: "EVENT-005",
      date: "2024-03-10",
      time: "09:15 AM",
      type: "health",
      title: "Health Alert Triggered",
      description: "Elevated temperature and respiratory rate detected in tiger.",
      location: "West Region, Sector 4",
      severity: "critical",
      animalId: "TI-004",
      animalName: "Raja",
      timestamp: new Date("2024-03-10T09:15:00"),
    },
    {
      id: "EVENT-006",
      date: "2024-02-15",
      time: "11:20 AM",
      type: "observation",
      title: "Social Interaction Logged",
      description: "Gorilla group observed in a peaceful interaction at the feeding site.",
      location: "North Region, Sector 2",
      severity: "low",
      animalId: "GO-005",
      animalName: "Zuri",
      timestamp: new Date("2024-02-15T11:20:00"),
    },
  ]

  const filteredEvents = useMemo(() => {
    const now = new Date("2024-03-16T00:00:00") // Simulate current time for the demo
    return timelineEvents.filter((event) => {
      // Time range filter
      const diffDays = (now.getTime() - event.timestamp.getTime()) / (1000 * 3600 * 24)
      if (timeRange === "24h" && diffDays > 1) return false
      if (timeRange === "7d" && diffDays > 7) return false
      if (timeRange === "30d" && diffDays > 30) return false
      if (timeRange === "90d" && diffDays > 90) return false

      // Category filters
      if (filter !== "all" && event.type !== filter) return false
      if (animalFilter !== "all" && event.animalId !== animalFilter) return false
      if (severityFilter !== "all" && event.severity !== severityFilter) return false
      return true
    })
  }, [timeRange, filter, animalFilter, severityFilter])

  const getEventIcon = (type: string) => {
    switch (type) {
      case "health":
        return <Heart className="h-5 w-5 text-red-500" />
      case "movement":
        return <Activity className="h-5 w-5 text-blue-500" />
      case "threat":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      case "intervention":
        return <Shield className="h-5 w-5 text-green-500" />
      case "observation":
        return <FileText className="h-5 w-5 text-purple-500" />
      default:
        return <Activity className="h-5 w-5" />
    }
  }

  const getSeverityColor = (severity?: string) => {
    if (!severity) return "bg-gray-500"

    switch (severity) {
      case "low":
        return "bg-blue-500"
      case "medium":
        return "bg-amber-500"
      case "high":
        return "bg-orange-500"
      case "critical":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Event Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="health">Health</SelectItem>
              <SelectItem value="movement">Movement</SelectItem>
              <SelectItem value="threat">Threat</SelectItem>
              <SelectItem value="intervention">Intervention</SelectItem>
              <SelectItem value="observation">Observation</SelectItem>
            </SelectContent>
          </Select>

          <Select value={animalFilter} onValueChange={setAnimalFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Animal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Animals</SelectItem>
              <SelectItem value="EL-001">Tembo (EL-001)</SelectItem>
              <SelectItem value="LI-002">Simba (LI-002)</SelectItem>
              <SelectItem value="RH-003">Kifaru (RH-003)</SelectItem>
              <SelectItem value="TI-004">Raja (TI-004)</SelectItem>
              <SelectItem value="GO-005">Zuri (GO-005)</SelectItem>
            </SelectContent>
          </Select>

          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setFilter("all")
            setAnimalFilter("all")
            setSeverityFilter("all")
          }}
          className="w-full sm:w-auto"
        >
          <RotateCw className="mr-2 h-4 w-4" />
          Reset Filters
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
          <CardDescription>Chronological record of significant events detected by AI monitoring</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event, index) => (
                <div key={event.id} className="relative pl-8 pb-8">
                  {/* Timeline connector */}
                  {index < filteredEvents.length - 1 && (
                    <div className="absolute left-3.5 top-3 h-full w-px bg-border" />
                  )}

                  {/* Event marker */}
                  <div
                    className={`absolute left-0 top-0 flex h-7 w-7 items-center justify-center rounded-full ${getSeverityColor(event.severity)} text-white`}
                  >
                    {getEventIcon(event.type)}
                  </div>

                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{event.time}</span>
                      </div>
                      {event.severity && (
                        <Badge className={getSeverityColor(event.severity)}>
                          {event.severity.charAt(0).toUpperCase() + event.severity.slice(1)} Severity
                        </Badge>
                      )}
                    </div>

                    <h3 className="text-lg font-medium">{event.title}</h3>
                    <p className="text-muted-foreground">{event.description}</p>

                    <div className="flex flex-wrap gap-4 pt-1">
                      {event.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{event.location}</span>
                        </div>
                      )}
                      {event.animalId && (
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {event.animalName} ({event.animalId})
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-muted-foreground">No events match the selected filters.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
