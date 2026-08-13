/**
 * Geofence Breach Listener
 * Monitors animal positions and detects boundary violations
 */

import { geofenceEventBus, GeofenceBreachEvent } from './geofenceEventBus'

// Reserve boundary (from tracking-map.tsx)
const RESERVE_BOUNDARY = [
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

// Point-in-polygon using ray casting
function isInsidePolygon(px: number, py: number, polygon: { x: number; y: number }[]): boolean {
  let inside = false
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x
    const yi = polygon[i].y
    const xj = polygon[j].x
    const yj = polygon[j].y

    const intersect = yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi
    if (intersect) inside = !inside
  }
  return inside
}

// Track previous positions to detect transitions
const previousPositions: Map<string, { x: number; y: number; inside: boolean }> = new Map()

// Track which breaches have been reported to avoid duplicates
const reportedBreaches: Set<string> = new Set()

/**
 * Check if animal has breached the boundary
 */
export function checkBoundaryBreach(animal: {
  id: string
  name: string
  species: string
  x: number
  y: number
  speed?: number
}): GeofenceBreachEvent | null {
  const currentInside = isInsidePolygon(animal.x, animal.y, RESERVE_BOUNDARY)
  const previous = previousPositions.get(animal.id)
  const wasInside = previous?.inside ?? true

  previousPositions.set(animal.id, {
    x: animal.x,
    y: animal.y,
    inside: currentInside,
  })

  // Detect breach: was inside, now outside
  if (wasInside && !currentInside) {
    const breachId = `${animal.id}-${Date.now()}`

    // Avoid duplicate reports for same animal in short time
    if (reportedBreaches.has(animal.id)) {
      return null
    }

    reportedBreaches.add(animal.id)
    setTimeout(() => reportedBreaches.delete(animal.id), 5000) // Clear after 5 seconds

    // Calculate direction based on movement
    const dx = animal.x - (previous?.x || animal.x)
    const dy = animal.y - (previous?.y || animal.y)
    const angle = Math.atan2(dy, dx) * (180 / Math.PI)

    let direction = 'Northeast'
    if (angle < -135 || angle > 135) direction = 'West'
    else if (angle >= -135 && angle < -45) direction = 'Northwest'
    else if (angle >= -45 && angle < 45) direction = 'East'
    else if (angle >= 45 && angle < 135) direction = 'Southeast'

    const breachEvent: GeofenceBreachEvent = {
      id: breachId,
      animalId: animal.id,
      animalName: animal.name,
      species: animal.species,
      timestamp: new Date(),
      position: { x: animal.x, y: animal.y },
      direction,
      severity: 'critical',
    }

    return breachEvent
  }

  return null
}

/**
 * Monitor animals for breaches
 */
export function monitorAnimalsForBreach(animals: Array<{
  id: string
  name: string
  species: string
  x: number
  y: number
  speed?: number
}>) {
  animals.forEach(animal => {
    const breach = checkBoundaryBreach(animal)
    if (breach) {
      geofenceEventBus.emitBreach(breach)
    }
  })
}

/**
 * Clear breach monitoring state
 */
export function clearBreachState() {
  previousPositions.clear()
  reportedBreaches.clear()
}
