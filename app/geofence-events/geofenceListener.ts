/**
 * Geofence Breach Listener
 * Passively monitors animal positions and detects boundary violations
 * This is a non-invasive module that hooks into existing tracking data
 */

import { GeofenceBreachEvent, GeofenceLocation } from "./eventTypes"

export interface AnimalPosition {
  id: string
  name: string
  species: string
  x: number
  y: number
}

export interface ReserveBoundary {
  vertices: GeofenceLocation[]
  innerZone?: GeofenceLocation[]
}

/**
 * Point-in-polygon algorithm (ray casting)
 * Determines if a point is inside a polygon
 */
export function isPointInPolygon(
  point: { x: number; y: number },
  polygon: { x: number; y: number }[]
): boolean {
  let inside = false
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x
    const yi = polygon[i].y
    const xj = polygon[j].x
    const yj = polygon[j].y
    const intersect = yi > point.y !== yj > point.y && point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi
    if (intersect) inside = !inside
  }
  return inside
}

/**
 * Check if animal is in warning zone (between inner and outer boundary)
 */
export function isInWarningZone(
  point: { x: number; y: number },
  outerBoundary: { x: number; y: number }[],
  innerZone: { x: number; y: number }[]
): boolean {
  const inOuter = isPointInPolygon(point, outerBoundary)
  const inInner = isPointInPolygon(point, innerZone)
  return inOuter && !inInner
}

/**
 * Detect if animal has breached the reserve boundary
 * Returns breach event if boundary violation detected
 */
export function detectBreach(
  currentPos: { x: number; y: number },
  previousPos: { x: number; y: number },
  outerBoundary: { x: number; y: number }[],
  innerZone: { x: number; y: number }[],
  animal: AnimalPosition
): GeofenceBreachEvent | null {
  const wasInside = isPointInPolygon(previousPos, outerBoundary)
  const isNowInside = isPointInPolygon(currentPos, outerBoundary)

  // Breach detected: animal moved from inside to outside
  if (wasInside && !isNowInside) {
    return {
      type: "geofence_breach",
      animal: animal.name,
      animalId: animal.id,
      species: animal.species,
      location: {
        x: currentPos.x,
        y: currentPos.y,
      },
      direction: "outbound",
      timestamp: Date.now(),
      severity: "high",
      zone: "reserve_boundary",
    }
  }

  // Return - animal moved from outside to inside
  if (!wasInside && isNowInside) {
    return {
      type: "geofence_breach",
      animal: animal.name,
      animalId: animal.id,
      species: animal.species,
      location: {
        x: currentPos.x,
        y: currentPos.y,
      },
      direction: "inbound",
      timestamp: Date.now(),
      severity: "medium",
      zone: "reserve_boundary",
    }
  }

  return null
}

/**
 * Calculate distance between two points
 */
export function calculateDistance(
  p1: { x: number; y: number },
  p2: { x: number; y: number }
): number {
  const dx = p2.x - p1.x
  const dy = p2.y - p1.y
  return Math.sqrt(dx * dx + dy * dy)
}

/**
 * Find nearest drone base to breach location
 */
export function findNearestBase(
  breachLocation: { x: number; y: number },
  bases: Array<{ name: string; x: number; y: number }>
): { name: string; x: number; y: number } | null {
  if (bases.length === 0) return null

  let nearest = bases[0]
  let minDistance = calculateDistance(breachLocation, bases[0])

  for (let i = 1; i < bases.length; i++) {
    const distance = calculateDistance(breachLocation, bases[i])
    if (distance < minDistance) {
      minDistance = distance
      nearest = bases[i]
    }
  }

  return nearest
}
