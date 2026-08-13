'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Play, Zap } from 'lucide-react'
import { geofenceEventBus } from '@/app/shared-events/geofenceEventBus'

const DEMO_SCENARIOS = [
  {
    id: 'scenario-1',
    name: 'Elephant Escape',
    animal: { id: 'el-001', name: 'Tembo', species: 'Elephant' },
    position: { x: 92, y: 40 },
    direction: 'East',
  },
  {
    id: 'scenario-2',
    name: 'Lion Breach',
    animal: { id: 'li-002', name: 'Simba', species: 'Lion' },
    position: { x: 5, y: 50 },
    direction: 'West',
  },
  {
    id: 'scenario-3',
    name: 'Rhino Escape',
    animal: { id: 'rh-003', name: 'Kifaru', species: 'Rhino' },
    position: { x: 50, y: 95 },
    direction: 'South',
  },
  {
    id: 'scenario-4',
    name: 'Critical Multi-Breach',
    animal: { id: 'ti-004', name: 'Raja', species: 'Tiger' },
    position: { x: 88, y: 75 },
    direction: 'Northeast',
  },
]

export interface BreachSimulatorDemoProps {
  title?: string
}

export function BreachSimulatorDemo({ title = 'Breach Simulator' }: BreachSimulatorDemoProps) {
  const [lastTriggered, setLastTriggered] = useState<string | null>(null)
  const [triggerCount, setTriggerCount] = useState(0)

  const handleSimulateBreach = (scenario: typeof DEMO_SCENARIOS[0]) => {
    const breachEvent = {
      id: `demo-${Date.now()}-${scenario.id}`,
      animalId: scenario.animal.id,
      animalName: scenario.animal.name,
      species: scenario.animal.species,
      timestamp: new Date(),
      position: scenario.position,
      direction: scenario.direction,
      severity: 'critical' as const,
    }

    console.log('[BreachSimulator] Triggering scenario:', scenario.name)
    geofenceEventBus.emitBreach(breachEvent)

    setLastTriggered(scenario.name)
    setTriggerCount(prev => prev + 1)

    // Reset highlight after 2 seconds
    setTimeout(() => setLastTriggered(null), 2000)
  }

  return (
    <Card className="bg-watch-navy border-watch-cyan">
      <CardHeader>
        <CardTitle className="text-watch-cyan">{title}</CardTitle>
        <CardDescription className="text-watch-mint">
          Manually trigger breach scenarios for testing autonomous response
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Trigger Count */}
        <div className="flex items-center justify-between p-3 bg-watch-midnight rounded-lg border border-watch-cyan/30">
          <span className="text-watch-text font-medium">Total Breaches Triggered</span>
          <Badge className="bg-watch-cyan text-watch-midnight">{triggerCount}</Badge>
        </div>

        {/* Demo Scenarios Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {DEMO_SCENARIOS.map(scenario => (
            <Button
              key={scenario.id}
              onClick={() => handleSimulateBreach(scenario)}
              variant="outline"
              className={`h-auto flex flex-col items-start p-3 transition-all border-watch-cyan/50 hover:border-watch-cyan hover:bg-watch-space ${
                lastTriggered === scenario.name ? 'bg-red-500/20 border-red-500' : ''
              }`}
            >
              <div className="flex items-center gap-2 w-full">
                <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
                <span className="font-semibold text-watch-text text-sm">{scenario.name}</span>
              </div>
              <p className="text-xs text-watch-mint mt-1">
                {scenario.animal.name} ({scenario.animal.species})
              </p>
              <div className="flex gap-2 mt-2 text-xs">
                <Badge variant="secondary" className="bg-watch-olive/30 text-watch-cyan">
                  Pos: ({scenario.position.x}, {scenario.position.y})
                </Badge>
                <Badge variant="secondary" className="bg-watch-olive/30 text-watch-cyan">
                  {scenario.direction}
                </Badge>
              </div>
            </Button>
          ))}
        </div>

        {/* Last Triggered Info */}
        {lastTriggered && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2">
            <Zap className="h-4 w-4 text-red-500 animate-pulse" />
            <span className="text-sm text-red-400">✓ {lastTriggered} breach simulated</span>
          </div>
        )}

        {/* Info Text */}
        <div className="text-xs text-watch-mint/70 bg-watch-midnight/50 p-3 rounded-lg">
          <p className="font-semibold mb-1">How it works:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Click any scenario to simulate a boundary breach</li>
            <li>Drone response auto-triggers immediately</li>
            <li>Mission persists across page navigation</li>
            <li>View status in Drone Response page</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
