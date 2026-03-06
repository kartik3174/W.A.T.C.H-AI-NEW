/**
 * useBreachMonitoring Hook
 * Integrate geofence breach detection into any component
 * Must be used inside TrackingMap component to monitor animal positions
 */

import { useEffect, useCallback } from 'react'
import { monitorAnimalsForBreach } from '@/app/shared-events/breachListener'
import { geofenceEventBus } from '@/app/shared-events/geofenceEventBus'

export interface UseBreachMonitoringOptions {
  enabled?: boolean
  onBreachDetected?: (event: any) => void
}

export function useBreachMonitoring(options: UseBreachMonitoringOptions = {}) {
  const { enabled = true, onBreachDetected } = options

  useEffect(() => {
    if (!enabled) return

    // Subscribe to breach events
    const unsubscribe = geofenceEventBus.onBreachDetected(event => {
      console.log('[useBreachMonitoring] Breach detected:', {
        animal: event.animalName,
        direction: event.direction,
        timestamp: event.timestamp.toLocaleTimeString(),
      })

      if (onBreachDetected) {
        onBreachDetected(event)
      }
    })

    return () => unsubscribe()
  }, [enabled, onBreachDetected])

  // Function to check animals for breach
  const checkAnimals = useCallback(
    (animals: Array<{
      id: string
      name: string
      species: string
      x: number
      y: number
      speed?: number
    }>) => {
      if (enabled && animals.length > 0) {
        monitorAnimalsForBreach(animals)
      }
    },
    [enabled],
  )

  return {
    checkAnimals,
    getActiveMission: () => geofenceEventBus.getActiveMission(),
    getListenerCount: () => geofenceEventBus.getListenerCount(),
  }
}
