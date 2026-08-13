/**
 * useGeofenceMonitoring Hook
 * Monitors animal positions and detects geofence breaches
 * Can be attached to tracking components without modifying them
 */

import { useEffect, useRef, useCallback } from "react"
import { onGeofenceBreach, emitGeofenceBreach, GeofenceBreachEvent } from "@/app/geofence-events/eventTypes"
import { detectBreach, findNearestBase, AnimalPosition } from "@/app/geofence-events/geofenceListener"
import { handleGeofenceBreach } from "@/app/drone-response/autoLaunchHandler"

export interface UseGeofenceMonitoringOptions {
  enabled?: boolean
  outerBoundary?: Array<{ x: number; y: number }>
  innerZone?: Array<{ x: number; y: number }>
  droneBases?: Array<{ name: string; x: number; y: number }>
  onBreach?: (event: GeofenceBreachEvent) => void
}

// Default reserve boundaries (from tracking page)
const DEFAULT_OUTER_BOUNDARY = [
  { x: 15, y: 8 },
  { x: 40, y: 5 },
  { x: 65, y: 7 },
  { x: 85, y: 15 },
  { x: 90, y: 35 },
  { x: 88, y: 55 },
  { x: 82, y: 72 },
  { x: 70, y: 85 },
  { x: 50, y: 92 },
  { x: 30, y: 88 },
  { x: 15, y: 75 },
  { x: 8, y: 55 },
  { x: 10, y: 30 },
]

const DEFAULT_INNER_ZONE = [
  { x: 22, y: 16 },
  { x: 42, y: 13 },
  { x: 62, y: 15 },
  { x: 78, y: 22 },
  { x: 82, y: 38 },
  { x: 80, y: 52 },
  { x: 75, y: 66 },
  { x: 64, y: 77 },
  { x: 48, y: 83 },
  { x: 33, y: 80 },
  { x: 22, y: 68 },
  { x: 16, y: 52 },
  { x: 17, y: 35 },
]

const DEFAULT_DRONE_BASES = [
  { name: "North Base", x: 35, y: 10 },
  { name: "East Base", x: 85, y: 40 },
  { name: "South Base", x: 50, y: 85 },
  { name: "West Base", x: 10, y: 45 },
]

export function useGeofenceMonitoring(options: UseGeofenceMonitoringOptions = {}) {
  const {
    enabled = true,
    outerBoundary = DEFAULT_OUTER_BOUNDARY,
    innerZone = DEFAULT_INNER_ZONE,
    droneBases = DEFAULT_DRONE_BASES,
    onBreach,
  } = options

  // Track previous positions to detect movement
  const previousPositionsRef = useRef<Map<string, { x: number; y: number }>>(new Map())
  const breachTrackerRef = useRef<Map<string, number>>(new Map())

  /**
   * Check animal positions for breaches
   */
  const checkBreaches = useCallback(
    (animals: AnimalPosition[]): void => {
      if (!enabled) return

      animals.forEach((animal) => {
        const currentPos = { x: animal.x, y: animal.y }
        const previousPos = previousPositionsRef.current.get(animal.id)

        if (!previousPos) {
          // First time seeing this animal, just store position
          previousPositionsRef.current.set(animal.id, currentPos)
          return
        }

        // Detect breach
        const breach = detectBreach(currentPos, previousPos, outerBoundary, innerZone, animal)

        if (breach) {
          // Prevent duplicate breach events (debounce)
          const lastBreachTime = breachTrackerRef.current.get(animal.id) || 0
          const timeSinceLastBreach = Date.now() - lastBreachTime

          if (timeSinceLastBreach > 5000) {
            // 5 second debounce
            console.log("[Geofence Monitor] Breach detected:", breach)

            // Find nearest drone base
            const nearestBase = findNearestBase(breach.location, droneBases)
            if (nearestBase) {
              console.log(`[Geofence Monitor] Nearest drone base: ${nearestBase.name}`)
            }

            // Emit event
            emitGeofenceBreach(breach)

            // Call user callback if provided
            if (onBreach) {
              onBreach(breach)
            }

            // Auto-trigger drone launch
            handleGeofenceBreach(breach)

            // Update breach tracker
            breachTrackerRef.current.set(animal.id, Date.now())
          }
        }

        // Update previous position
        previousPositionsRef.current.set(animal.id, currentPos)
      })
    },
    [enabled, outerBoundary, innerZone, droneBases, onBreach]
  )

  /**
   * Reset monitoring state
   */
  const resetMonitoring = useCallback((): void => {
    previousPositionsRef.current.clear()
    breachTrackerRef.current.clear()
    console.log("[Geofence Monitor] Monitoring reset")
  }, [])

  /**
   * Subscribe to geofence breach events
   */
  useEffect(() => {
    if (!enabled) return

    const unsubscribe = onGeofenceBreach((event) => {
      console.log("[Geofence Monitor] Breach event received:", event)
    })

    return unsubscribe
  }, [enabled])

  return {
    checkBreaches,
    resetMonitoring,
    previousPositions: previousPositionsRef.current,
  }
}
