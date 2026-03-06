'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Activity, AlertCircle, Target, Zap } from 'lucide-react'
import { persistentMissionController, MissionState } from '@/app/shared-events/persistentMissionController'

export interface MissionStatusDisplayProps {
  compact?: boolean
}

export function MissionStatusDisplay({ compact = false }: MissionStatusDisplayProps) {
  const [mission, setMission] = useState<MissionState>(persistentMissionController.getState())

  useEffect(() => {
    // Subscribe to mission state changes
    const unsubscribe = persistentMissionController.onStateChange(state => {
      setMission(state)
    })

    return () => unsubscribe()
  }, [])

  if (!mission.isActive) {
    return null
  }

  const statusColors = {
    deploying: 'bg-yellow-500',
    'in-flight': 'bg-blue-500',
    pursuing: 'bg-red-500',
    returning: 'bg-purple-500',
    completed: 'bg-green-500',
    idle: 'bg-gray-500',
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-watch-midnight rounded-lg border border-watch-cyan">
        <Zap className="h-4 w-4 text-watch-cyan animate-pulse" />
        <span className="text-sm text-watch-mint font-medium">{mission.targetName}</span>
        <Badge className={`${statusColors[mission.status]} text-white text-xs`}>
          {mission.status.toUpperCase()}
        </Badge>
      </div>
    )
  }

  return (
    <Card className="bg-watch-navy border-watch-cyan">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-watch-cyan text-lg">Active Drone Mission</CardTitle>
            <CardDescription className="text-watch-mint">Autonomous Response - In Progress</CardDescription>
          </div>
          <Badge className={`${statusColors[mission.status]} text-white`}>
            {mission.status.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Target Information */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-watch-cyan" />
            <span className="text-sm font-medium text-watch-text">Target: {mission.targetName}</span>
          </div>
          <p className="text-xs text-watch-mint ml-6">
            Position: ({mission.targetPosition?.x.toFixed(1)}, {mission.targetPosition?.y.toFixed(1)})
          </p>
        </div>

        {/* Drone Information */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-watch-cyan animate-pulse" />
            <span className="text-sm font-medium text-watch-text">Drone: {mission.droneId}</span>
          </div>
          <p className="text-xs text-watch-mint ml-6">
            Base: {mission.baseStation} | ETA: {mission.estimatedArrival}s
          </p>
        </div>

        {/* Mission Status Timeline */}
        <div className="flex items-center justify-between text-xs pt-2 border-t border-watch-cyan/30">
          <div className="flex gap-1">
            <span
              className={`px-2 py-1 rounded ${
                mission.status === 'deploying'
                  ? 'bg-yellow-500/30 text-yellow-300'
                  : 'bg-watch-olive/50 text-watch-mint'
              }`}
            >
              Deploy
            </span>
            <span
              className={`px-2 py-1 rounded ${
                mission.status === 'in-flight'
                  ? 'bg-blue-500/30 text-blue-300'
                  : 'bg-watch-olive/50 text-watch-mint'
              }`}
            >
              Flight
            </span>
            <span
              className={`px-2 py-1 rounded ${
                mission.status === 'pursuing'
                  ? 'bg-red-500/30 text-red-300'
                  : 'bg-watch-olive/50 text-watch-mint'
              }`}
            >
              Pursue
            </span>
          </div>
          <span className="text-watch-cyan">
            {mission.startTime
              ? `${Math.round((Date.now() - new Date(mission.startTime).getTime()) / 1000)}s elapsed`
              : '0s elapsed'}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
