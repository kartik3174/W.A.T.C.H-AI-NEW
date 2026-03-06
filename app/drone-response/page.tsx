"use client"

import React, { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Radio, Play, Pause, RotateCcw, AlertTriangle, Zap, Users } from "lucide-react"
import { eventBus } from "@/app/shared-events/eventBus"
import { ThreatEvent } from "@/app/shared-events/eventTypes"
import {
  initializeFleet,
  deployDrone,
  selectOptimalDrone,
  updateDroneState,
  DRONE_BASES,
  Drone,
  Mission,
} from "./simulationEngine"

// Using types from shared event system and simulation engine

export default function DroneResponsePage() {
  const [fleet, setFleet] = useState<Drone[]>([])
  const [missions, setMissions] = useState<Mission[]>([])
  const [events, setEvents] = useState<ThreatEvent[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null)
  const [eventLogs, setEventLogs] = useState<string[]>([])

  // Initialize fleet
  useEffect(() => {
    setFleet(initializeFleet())
    setEventLogs([(new Date()).toISOString() + " - System initialized"])
  }, [])

  // Subscribe to events from shared event bus
  useEffect(() => {
    const unsubscribe = eventBus.subscribe((event: ThreatEvent) => {
      setEvents((prev) => [event, ...prev.slice(0, 99)])
      addEventLog(`[AI-THREAT] ${event.type} detected at ${event.location.region} - Confidence: ${event.confidence.toFixed(0)}%`)

      // Auto-deploy drone if running
      if (isRunning) {
        handleAutoDeploy(event)
      }
    })

    return () => unsubscribe()
  }, [isRunning])

  // Simulation loop
  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setFleet((prevFleet) => {
        const updatedFleet = prevFleet.map((drone) => {
          const mission = missions.find((m) => m.id === drone.missionId)
          const { drone: updated } = updateDroneState(drone, mission, 0.5)
          return updated
        })
        return updatedFleet
      })
    }, 500)

    return () => clearInterval(interval)
  }, [isRunning, missions])

  const handleAutoDeploy = useCallback(
    (threat: ThreatEvent) => {
      const optimalDrone = selectOptimalDrone(threat, fleet)
      if (optimalDrone) {
        const { drone: updated, mission } = deployDrone(optimalDrone, threat)
        setFleet((prev) =>
          prev.map((d) => (d.id === updated.id ? { ...updated, status: "launching" as const } : d))
        )
        setMissions((prev) => [...prev, { ...mission, status: "active" as const }])
        addEventLog(`[DEPLOYMENT] Drone ${optimalDrone.name} dispatched to ${threat.location.region}`)
      } else {
        addEventLog(`[WARNING] No available drones for threat response`)
      }
    },
    [fleet]
  )

  const handleManualThreat = useCallback(() => {
    const event = eventBus.generateDemoEvent()
    eventBus.publish(event)
  }, [])

  const addEventLog = (message: string) => {
    setEventLogs((prev) => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev.slice(0, 99)])
  }

  const toggleSimulation = () => {
    setIsRunning(!isRunning)
    addEventLog(isRunning ? "[SYSTEM] Simulation paused" : "[SYSTEM] Simulation started")
  }

  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-card border-muted">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Missions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{missions.filter((m) => m.status === "active").length}</div>
            <p className="text-xs text-muted-foreground mt-1">Currently deployed</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-muted">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Fleet Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-secondary">{fleet.filter((d) => d.status !== "idle").length}</div>
            <p className="text-xs text-muted-foreground mt-1">Drones in operation</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-muted">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Threats Detected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{events.length}</div>
            <p className="text-xs text-muted-foreground mt-1">This session</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-muted">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="outline" className={isRunning ? "bg-primary text-primary-foreground" : ""}>
              {isRunning ? "ACTIVE" : "IDLE"}
            </Badge>
            <p className="text-xs text-muted-foreground mt-1">Monitoring enabled</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Button
          onClick={toggleSimulation}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          size="lg"
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Start
            </>
          )}
        </Button>

        <Button onClick={handleManualThreat} variant="outline" size="lg" className="border-secondary">
          <AlertTriangle className="w-4 h-4 mr-2 text-destructive" />
          Simulate AI Event
        </Button>

        <Button
          onClick={() => {
            setFleet(initializeFleet())
            setMissions([])
            setEvents([])
            setEventLogs([])
            setIsRunning(false)
            addEventLog("[SYSTEM] System reset")
          }}
          variant="outline"
          size="lg"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>

      <Tabs defaultValue="fleet" className="space-y-4">
        <TabsList className="bg-card border-muted">
          <TabsTrigger value="fleet">Fleet Status</TabsTrigger>
          <TabsTrigger value="missions">Missions</TabsTrigger>
          <TabsTrigger value="events">Event Stream</TabsTrigger>
          <TabsTrigger value="logs">System Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="fleet" className="space-y-4">
          <Card className="bg-card border-muted">
            <CardHeader>
              <CardTitle className="text-lg">Autonomous Fleet</CardTitle>
              <CardDescription>Real-time drone status and location</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fleet.map((drone) => (
                  <div key={drone.id} className="border border-muted rounded-lg p-4 bg-background/50">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-primary flex items-center gap-2">
                          <Radio className="w-4 h-4" />
                          {drone.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          Base: {DRONE_BASES.find((b) => b.id === drone.baseId)?.name}
                        </p>
                      </div>
                      <Badge
                        variant={
                          drone.status === "idle"
                            ? "outline"
                            : drone.status === "landed"
                              ? "outline"
                              : "default"
                        }
                      >
                        {drone.status.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-4 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs">Battery</p>
                        <p className="text-primary font-semibold">{drone.battery.toFixed(0)}%</p>
                        <div className="h-1 bg-muted rounded-full mt-1">
                          <div
                            className="h-1 bg-primary rounded-full"
                            style={{ width: `${drone.battery}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Altitude</p>
                        <p className="text-secondary font-semibold">{drone.altitude.toFixed(0)}m</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Speed</p>
                        <p className="font-semibold">{drone.speed.toFixed(0)}km/h</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Mission Time</p>
                        <p className="font-semibold">{drone.timeOnMission.toFixed(0)}s</p>
                      </div>
                    </div>

                    {drone.missionId && (
                      <div className="mt-3 pt-3 border-t border-muted text-xs">
                        <p className="text-muted-foreground">
                          <span className="font-semibold">Mission:</span> {drone.missionId}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="missions" className="space-y-4">
          <Card className="bg-card border-muted">
            <CardHeader>
              <CardTitle className="text-lg">Active Missions</CardTitle>
              <CardDescription>Threat response deployment status</CardDescription>
            </CardHeader>
            <CardContent>
              {missions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No missions yet. Simulate a threat to begin.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {missions.map((mission) => (
                    <div
                      key={mission.id}
                      onClick={() => setSelectedMission(mission)}
                      className="border border-muted rounded-lg p-4 bg-background/50 cursor-pointer hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-primary capitalize">{mission.threatType}</h3>
                          <p className="text-xs text-muted-foreground">{mission.id}</p>
                        </div>
                        <Badge variant={mission.status === "completed" ? "outline" : "default"}>
                          {mission.status.toUpperCase()}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-3 text-sm mt-3">
                        <div>
                          <p className="text-muted-foreground text-xs">Drone</p>
                          <p className="font-semibold">{mission.droneId}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Severity</p>
                          <p className="font-semibold capitalize">{mission.threatSeverity}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Duration</p>
                          <p className="font-semibold">
                            {((mission.endTime || Date.now()) - mission.startTime) / 1000}s
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {selectedMission && (
            <Card className="bg-card border-primary/50">
              <CardHeader>
                <CardTitle className="text-lg">Mission Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground">Mission ID</p>
                    <p className="font-mono font-semibold">{selectedMission.id}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Threat ID</p>
                    <p className="font-mono font-semibold">{selectedMission.threatId}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Target Location</p>
                    <p className="font-semibold">
                      {selectedMission.targetLocation.lat.toFixed(4)}, {selectedMission.targetLocation.lng.toFixed(4)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Telemetry Points</p>
                    <p className="font-semibold">{selectedMission.telemetry.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card className="bg-card border-muted">
            <CardHeader>
              <CardTitle className="text-lg">Shared Event Stream</CardTitle>
              <CardDescription>Real-time threat events from AI Monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              {events.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Zap className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Waiting for threat events...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {events.map((event) => (
                    <div key={event.id} className="border border-muted rounded-lg p-3 bg-background/50">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-primary capitalize">{event.type}</h4>
                          <p className="text-xs text-muted-foreground">{event.id}</p>
                        </div>
                        <Badge variant="outline" className="text-secondary">
                          {event.confidence.toFixed(0)}%
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {event.location.region} - {new Date(event.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card className="bg-card border-muted">
            <CardHeader>
              <CardTitle className="text-lg">System Activity Log</CardTitle>
              <CardDescription>Real-time system events and operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-background/50 rounded-lg p-4 font-mono text-xs space-y-2 max-h-96 overflow-y-auto">
                {eventLogs.map((log, idx) => (
                  <div key={idx} className="text-muted-foreground">
                    <span className="text-primary">{log.split("]")[0]}]</span>
                    <span>{log.split("]").slice(1).join("]")}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
