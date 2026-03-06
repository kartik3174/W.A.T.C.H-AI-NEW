"use client"

import { PageHeader } from "@/components/dashboard/page-header"
import { TrackingMap } from "@/components/tracking/tracking-map"
import { EmbeddedDronePanel } from "@/components/tracking/embedded-drone-panel"
import { LiveIncidentFeed } from "@/components/tracking/live-incident-feed"
import { DroneCommandPanel } from "@/components/tracking/drone-command-panel"
import { Eye, Zap } from "lucide-react"
import { LeafDecoration } from "@/components/leaf-decoration"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { geofenceEventBus } from "@/app/shared-events/geofenceEventBus"

export default function TrackingPage() {
  const [showSimulator, setShowSimulator] = useState(false)

  // Demo boundary breach trigger
  const triggerDemoBreach = () => {
    const demoAnimals = [
      { id: "elephant-001", name: "Tusker", species: "Elephant" },
      { id: "leopard-002", name: "Shadow", species: "Leopard" },
      { id: "rhino-003", name: "Titans", species: "Rhino" },
    ]
    const animal = demoAnimals[Math.floor(Math.random() * demoAnimals.length)]

    geofenceEventBus.emitBreach({
      id: `demo-breach-${Date.now()}`,
      animalId: animal.id,
      animalName: animal.name,
      species: animal.species,
      timestamp: new Date(),
      position: { x: 650 + Math.random() * 100, y: 350 + Math.random() * 100 },
      direction: ["North", "South", "East", "West"][Math.floor(Math.random() * 4)],
      severity: "high",
    })
  }

  return (
    <div className="container mx-auto py-6 space-y-6 relative">
      {/* Decorative leaf elements */}
      <LeafDecoration position="top-right" size="lg" opacity={0.1} className="hidden lg:block" />
      <LeafDecoration position="bottom-left" size="md" rotation={45} opacity={0.1} className="hidden lg:block" />

      <PageHeader
        title="Wildlife Tracking & Drone Response Command Center"
        description="Monitor wildlife locations and manage autonomous drone response system in real-time"
        icon={<Eye className="h-6 w-6" />}
      />

      {/* Top Section - Live Incident Feed */}
      <div>
        <LiveIncidentFeed />
      </div>

      {/* Main Section - Tracking Map (Left) + Drone Command Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tracking Map - Left Side (2 columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#1C7ED6] rounded-lg border-2 border-[#FF7A00] p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-[#EAEAEA]">Reserve Tracking Map</h3>
              <Button
                onClick={triggerDemoBreach}
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white text-xs h-8"
              >
                <Zap className="h-3 w-3 mr-1" />
                Simulate Breach
              </Button>
            </div>
            <TrackingMap />
          </div>

          {/* Embedded Drone Panel - Full Width Below Map */}
          <EmbeddedDronePanel />
        </div>

        {/* Right Side - Drone Command Panel */}
        <div className="lg:col-span-1">
          <DroneCommandPanel />
        </div>
      </div>

    </div>
  )
}
