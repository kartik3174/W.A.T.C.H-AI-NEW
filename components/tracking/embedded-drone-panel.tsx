"use client"

import React, { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Radio, Play, Pause, AlertTriangle, Zap, AlertCircle, Zap as ZapIcon } from "lucide-react"
import { eventBus } from "@/app/shared-events/eventBus"
import { geofenceEventBus } from "@/app/shared-events/geofenceEventBus"
import { ThreatEvent } from "@/app/shared-events/eventTypes"
import {
  initializeFleet,
  deployDrone,
  selectOptimalDrone,
  updateDroneState,
  Drone,
  Mission,
} from "@/app/drone-response/simulationEngine"

interface EmbeddedDronePanelProps {
  onBreachDetected?: (threat: ThreatEvent) => void
}

// Demo animals for boundary breach simulation
const DEMO_ANIMALS = [
  { id: "elephant-001", name: "Tusker", species: "Elephant", x: 650, y: 300 },
  { id: "leopard-002", name: "Shadow", species: "Leopard", x: 720, y: 420 },
  { id: "rhino-003", name: "Titans", species: "Rhino", x: 580, y: 350 },
]

export function EmbeddedDronePanel({ onBreachDetected }: EmbeddedDronePanelProps) {
  const [fleet, setFleet] = useState<Drone[]>([])
  const [missions, setMissions] = useState<Mission[]>([])
  const [events, setEvents] = useState<ThreatEvent[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null)
  const [eventLogs, setEventLogs] = useState<string[]>([])
  const [showPanel, setShowPanel] = useState(false)
  const [breachCount, setBreachCount] = useState(0)

  // Initialize fleet
  useEffect(() => {
    setFleet(initializeFleet())
    setEventLogs([(new Date()).toISOString() + " - Embedded drone system initialized"])
  }, [])

  // Subscribe to events from shared event bus
  useEffect(() => {
    const unsubscribe = eventBus.subscribe((event: ThreatEvent) => {
      setEvents((prev) => [event, ...prev.slice(0, 99)])
      addEventLog(`[THREAT-ALERT] ${event.type} detected - Severity: ${event.severity}`)

      // Auto-show panel and deploy drone on breach
      setShowPanel(true)
      if (isRunning) {
        handleAutoDeploy(event)
      }

      // Notify parent
      if (onBreachDetected) {
        onBreachDetected(event)
      }
    })

    return () => unsubscribe()
  }, [isRunning, onBreachDetected])

  // Subscribe to geofence breach events
  useEffect(() => {
    const unsubscribe = geofenceEventBus.onBreachDetected((breachEvent) => {
      addEventLog(`[BOUNDARY-BREACH] ${breachEvent.animalName} (${breachEvent.species}) left reserve at ${new Date(breachEvent.timestamp).toLocaleTimeString()}`)
      setShowPanel(true)
      setBreachCount((prev) => prev + 1)
      
      // Auto-deploy if system is running
      if (isRunning) {
        const demoThreat: ThreatEvent = {
          id: breachEvent.id,
          type: "boundary-breach",
          location: {
            region: `${breachEvent.position.x.toFixed(0)},${breachEvent.position.y.toFixed(0)}`,
            coordinates: breachEvent.position,
          },
          severity: breachEvent.severity as "high" | "critical",
          confidence: 100,
          description: `${breachEvent.animalName} breached reserve boundary`,
          timestamp: new Date(),
          source: "geofence-system",
        }
        handleAutoDeploy(demoThreat)
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
        addEventLog(`[DEPLOYMENT] Drone ${optimalDrone.name} launched in response to threat`)
      }
    },
    [fleet]
  )

  const addEventLog = (message: string) => {
    setEventLogs((prev) => [message, ...prev.slice(0, 49)])
  }

  const toggleSimulation = () => {
    setIsRunning(!isRunning)
    addEventLog(isRunning ? "[SYSTEM] Simulation paused" : "[SYSTEM] Simulation started")
  }

  const simulateBoundaryBreach = useCallback(() => {
    const animal = DEMO_ANIMALS[Math.floor(Math.random() * DEMO_ANIMALS.length)]
    const breachEvent = {
      id: `breach-${Date.now()}`,
      animalId: animal.id,
      animalName: animal.name,
      species: animal.species,
      timestamp: new Date(),
      position: { x: animal.x + (Math.random() - 0.5) * 100, y: animal.y + (Math.random() - 0.5) * 100 },
      direction: ["North", "South", "East", "West"][Math.floor(Math.random() * 4)],
      severity: Math.random() > 0.5 ? ("high" as const) : ("critical" as const),
    }
    
    geofenceEventBus.emitBreach(breachEvent)
    addEventLog(`[DEMO] Boundary breach simulated - ${animal.name} left reserve`)
  }, [])

  if (!showPanel) {
    return null
  }

  const activeMissions = missions.filter((m) => m.status === "active")
  const activeDrones = fleet.filter((d) => d.status === "active" || d.status === "launching")

  return (
    <div className="space-y-4 mt-6">
      <Card className="bg-[#1C7ED6] border-[#FF7A00]">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Radio className="h-5 w-5 text-[#FF7A00] animate-pulse" />
              <div>
                <CardTitle className="text-[#EAEAEA]">Autonomous Drone Response System</CardTitle>
                <CardDescription className="text-[#EAEAEA]/70">Real-time threat response and fleet management</CardDescription>
              </div>
            </div>
            <Badge variant={isRunning ? "default" : "secondary"} className="bg-[#FF7A00] text-[#0B132B]">
              {isRunning ? "Running" : "Standby"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <Tabs defaultValue="missions" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-[#0B132B]">
              <TabsTrigger value="missions" className="text-[#EAEAEA] data-[state=active]:bg-[#FF7A00] data-[state=active]:text-[#0B132B]">
                Missions ({activeMissions.length})
              </TabsTrigger>
              <TabsTrigger value="fleet" className="text-[#EAEAEA] data-[state=active]:bg-[#FF7A00] data-[state=active]:text-[#0B132B]">
                Fleet ({activeDrones.length}/{fleet.length})
              </TabsTrigger>
              <TabsTrigger value="logs" className="text-[#EAEAEA] data-[state=active]:bg-[#FF7A00] data-[state=active]:text-[#0B132B]">
                Logs
              </TabsTrigger>
            </TabsList>

            <TabsContent value="missions" className="space-y-3 mt-4">
              {activeMissions.length === 0 ? (
                <p className="text-[#EAEAEA]/60 text-sm">No active missions. Awaiting threat detection.</p>
              ) : (
                activeMissions.map((mission) => (
                  <div key={mission.id} className="p-3 bg-[#0B132B] rounded border border-[#FF7A00]/30">
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-semibold text-[#FF7A00]">Mission {mission.id}</div>
                      <Badge className="bg-[#FF7A00] text-[#0B132B]">{mission.status}</Badge>
                    </div>
                    <p className="text-xs text-[#EAEAEA]/70">Target: {mission.targetLocation.region}</p>
                    <p className="text-xs text-[#EAEAEA]/70">Drone: {mission.assignedDroneId}</p>
                    <p className="text-xs text-[#EAEAEA]/70">Distance: {mission.distance.toFixed(1)}m</p>
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="fleet" className="space-y-3 mt-4">
              {fleet.map((drone) => (
                <div key={drone.id} className="p-3 bg-[#0B132B] rounded border border-[#FF7A00]/30">
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-semibold text-[#FF7A00]">{drone.name}</div>
                    <Badge className={`${
                      drone.status === "active" ? "bg-green-600" : "bg-gray-500"
                    } text-white`}>{drone.status}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-[#EAEAEA]/70">
                    <p>Battery: {drone.battery}%</p>
                    <p>Altitude: {drone.altitude}m</p>
                    <p>Speed: {drone.speed}m/s</p>
                    <p>Status: {drone.status}</p>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="logs" className="space-y-2 mt-4">
              <div className="h-40 overflow-y-auto bg-[#0B132B] p-2 rounded border border-[#FF7A00]/30 space-y-1">
                {eventLogs.map((log, idx) => (
                  <p key={idx} className="text-xs text-[#EAEAEA]/70 font-mono">
                    {log}
                  </p>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={toggleSimulation}
              className="flex-1 bg-[#FF7A00] text-[#0B132B] hover:bg-[#FF8C1A]"
            >
              {isRunning ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause System
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Start System
                </>
              )}
            </Button>
            <Button
              onClick={simulateBoundaryBreach}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              title="Simulate a boundary breach to test drone response"
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              Simulate Breach
            </Button>
            <Button
              onClick={() => setShowPanel(false)}
              variant="outline"
              className="border-[#FF7A00] text-[#EAEAEA]"
            >
              Minimize
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
