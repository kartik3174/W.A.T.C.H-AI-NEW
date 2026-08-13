"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Pause, Zap, Navigation2, Gauge } from "lucide-react"
import { geofenceEventBus } from "@/app/shared-events/geofenceEventBus"

interface DroneState {
  id: string
  name: string
  status: "idle" | "flying" | "engaged"
  altitude: number
  speed: number
  battery: number
  heading: number
}

export function DroneCommandPanel() {
  const [isActive, setIsActive] = useState(false)
  const [activeDrone, setActiveDrone] = useState<DroneState | null>(null)
  const [flightPath, setFlightPath] = useState<Array<{ x: number; y: number }>>([])
  const [missionTimer, setMissionTimer] = useState(0)

  // Subscribe to breaches to activate panel
  useEffect(() => {
    const unsubscribe = geofenceEventBus.onBreachDetected(() => {
      setIsActive(true)
      setActiveDrone({
        id: "ALPHA-001",
        name: "Drone Alpha",
        status: "flying",
        altitude: 120,
        speed: 42,
        battery: 95,
        heading: 45,
      })
      setMissionTimer(0)
    })

    return () => unsubscribe()
  }, [])

  // Simulate drone telemetry updates
  useEffect(() => {
    if (!isActive || !activeDrone) return

    const telemetryInterval = setInterval(() => {
      setActiveDrone((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          altitude: Math.max(50, prev.altitude + (Math.random() - 0.5) * 10),
          speed: Math.max(0, prev.speed + (Math.random() - 0.5) * 5),
          battery: Math.max(0, prev.battery - 0.3),
          heading: (prev.heading + (Math.random() - 0.5) * 10) % 360,
        }
      })

      setFlightPath((prev) => [
        ...prev,
        {
          x: 500 + Math.random() * 100,
          y: 300 + Math.random() * 100,
        },
      ])

      setMissionTimer((prev) => prev + 1)
    }, 1500)

    return () => clearInterval(telemetryInterval)
  }, [isActive, activeDrone])

  if (!isActive) return null

  return (
    <Card className="bg-[#1C7ED6] border-2 border-[#FF7A00] sticky top-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-[#EAEAEA]">Drone Command Panel</CardTitle>
            <CardDescription className="text-[#EAEAEA]/80">Live flight control & telemetry</CardDescription>
          </div>
          <Badge className="bg-green-600 text-white animate-pulse">ACTIVE</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="telemetry" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-[#0B132B]">
            <TabsTrigger value="telemetry" className="text-[#EAEAEA]">Telemetry</TabsTrigger>
            <TabsTrigger value="mission" className="text-[#EAEAEA]">Mission</TabsTrigger>
          </TabsList>

          <TabsContent value="telemetry" className="space-y-4 mt-4">
            {activeDrone && (
              <div className="space-y-3">
                <div className="bg-[#0B132B]/50 rounded-lg p-3 border border-[#FF7A00]/30">
                  <p className="text-sm text-[#EAEAEA]/80 mb-2">Drone Status</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-[#EAEAEA]/60">Altitude</p>
                      <p className="text-lg font-semibold text-[#FF7A00]">{activeDrone.altitude.toFixed(0)} m</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#EAEAEA]/60">Speed</p>
                      <p className="text-lg font-semibold text-[#FF7A00]">{activeDrone.speed.toFixed(1)} km/h</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#EAEAEA]/60">Battery</p>
                      <div className="flex items-center gap-1">
                        <div className="flex-1 h-2 bg-[#0B132B] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 transition-all"
                            style={{ width: `${Math.max(0, activeDrone.battery)}%` }}
                          />
                        </div>
                        <span className="text-sm text-[#FF7A00] font-semibold">{activeDrone.battery.toFixed(0)}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-[#EAEAEA]/60">Heading</p>
                      <p className="text-lg font-semibold text-[#FF7A00]">{activeDrone.heading.toFixed(0)}°</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0B132B]/50 rounded-lg p-3 border border-[#FF7A00]/30">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-[#EAEAEA]/80">Flight Path Visualization</p>
                    <Gauge className="h-4 w-4 text-[#FF7A00]" />
                  </div>
                  <div className="bg-[#0B132B] rounded h-24 flex items-end justify-start gap-1 p-2 overflow-x-auto">
                    {flightPath.slice(-20).map((point, idx) => (
                      <div
                        key={idx}
                        className="flex-shrink-0 bg-gradient-to-t from-[#FF7A00] to-blue-400 opacity-70 transition-all"
                        style={{
                          width: "3px",
                          height: `${(point.x % 80) + 10}px`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="mission" className="space-y-4 mt-4">
            <div className="bg-[#0B132B]/50 rounded-lg p-3 border border-[#FF7A00]/30 space-y-2">
              <div>
                <p className="text-xs text-[#EAEAEA]/60">Mission Duration</p>
                <p className="text-lg font-semibold text-[#FF7A00]">{missionTimer} seconds</p>
              </div>
              <div>
                <p className="text-xs text-[#EAEAEA]/60">AI Decision Status</p>
                <Badge className="bg-red-600 text-white mt-1">High Priority — Immediate Response</Badge>
              </div>
              <div className="mt-3 pt-3 border-t border-[#FF7A00]/30">
                <p className="text-xs text-[#EAEAEA]/80 mb-2">Mission Objectives:</p>
                <ul className="text-xs text-[#EAEAEA]/70 space-y-1">
                  <li>✓ Locate breach subject</li>
                  <li>✓ Establish visual track</li>
                  <li>✓ Coordinate with rangers</li>
                  <li>→ Monitor movement</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
