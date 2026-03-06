"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Zap } from "lucide-react"
import { emitGeofenceBreach } from "@/app/geofence-events/eventTypes"
import { handleGeofenceBreach } from "@/app/drone-response/autoLaunchHandler"

interface SimulationScenario {
  id: string
  animalName: string
  animalId: string
  species: string
  description: string
  x: number
  y: number
  severity: "low" | "medium" | "high"
}

const SCENARIOS: SimulationScenario[] = [
  {
    id: "scenario_1",
    animalName: "Tembo",
    animalId: "EL-001",
    species: "Elephant",
    description: "Elephant crosses boundary heading north",
    x: 35,
    y: 2,
    severity: "high",
  },
  {
    id: "scenario_2",
    animalName: "Simba",
    animalId: "LI-002",
    species: "Lion",
    description: "Lion escapes to eastern sector",
    x: 95,
    y: 40,
    severity: "high",
  },
  {
    id: "scenario_3",
    animalName: "Kifaru",
    animalId: "RH-003",
    species: "Rhino",
    description: "Rhino heads south outside boundary",
    x: 50,
    y: 95,
    severity: "high",
  },
  {
    id: "scenario_4",
    animalName: "Raja",
    animalId: "TI-004",
    species: "Tiger",
    description: "Tiger approaches western boundary",
    x: 5,
    y: 45,
    severity: "medium",
  },
]

export function BreachSimulator() {
  const [isSimulating, setIsSimulating] = useState(false)
  const [lastSimulation, setLastSimulation] = useState<string>("")

  const handleSimulate = async (scenario: SimulationScenario) => {
    setIsSimulating(true)

    try {
      // Create breach event
      const breachEvent = {
        type: "geofence_breach" as const,
        animal: scenario.animalName,
        animalId: scenario.animalId,
        species: scenario.species,
        location: {
          x: scenario.x,
          y: scenario.y,
        },
        direction: "outbound" as const,
        timestamp: Date.now(),
        severity: scenario.severity,
        zone: "reserve_boundary",
      }

      console.log("[Breach Simulator] Simulating breach:", breachEvent)

      // Emit event (triggers listeners)
      emitGeofenceBreach(breachEvent)

      // Trigger auto-launch handler
      handleGeofenceBreach(breachEvent)

      setLastSimulation(`${scenario.animalName} breach simulated at (${scenario.x}, ${scenario.y})`)

      // Simulate a brief delay
      await new Promise((resolve) => setTimeout(resolve, 500))
    } catch (error) {
      console.error("[Breach Simulator] Error during simulation:", error)
      setLastSimulation(`Error: ${String(error)}`)
    } finally {
      setIsSimulating(false)
    }
  }

  return (
    <Card className="border-2 border-dashed">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-ai-cyan" />
          <div>
            <CardTitle>Geofence Breach Simulator</CardTitle>
            <CardDescription>Test autonomous drone response to boundary violations</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status */}
        {lastSimulation && (
          <div className="p-3 bg-ai-navy border border-ai-cyan rounded-lg">
            <p className="text-sm text-ai-cyan">{lastSimulation}</p>
          </div>
        )}

        {/* Scenarios Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {SCENARIOS.map((scenario) => (
            <Button
              key={scenario.id}
              variant="outline"
              className="h-auto py-3 px-4 justify-start text-left border-ai-cyan hover:bg-ai-navy"
              onClick={() => handleSimulate(scenario)}
              disabled={isSimulating}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="h-4 w-4 text-ai-cyan" />
                  <span className="font-semibold">{scenario.animalName}</span>
                  <Badge variant="secondary" className="ml-auto">
                    {scenario.species}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{scenario.description}</p>
                <p className="text-xs text-muted-foreground mt-1">Position: ({scenario.x}, {scenario.y})</p>
              </div>
            </Button>
          ))}
        </div>

        {/* Info */}
        <div className="p-3 bg-ai-space/50 rounded-lg border border-ai-cyan/30">
          <p className="text-xs text-muted-foreground">
            💡 Select a scenario to simulate a geofence breach. The system will automatically detect the boundary
            violation and trigger autonomous drone response.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
