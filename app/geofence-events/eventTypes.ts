/**
 * Geofence Event Types
 * Defines event structures for boundary breach detection
 */

export type GeofenceBreachType = "geofence_breach" | "warning_zone_entry" | "boundary_crossing"

export interface GeofenceLocation {
  lat?: number
  lng?: number
  x: number
  y: number
  zone?: string
}

export interface GeofenceBreachEvent {
  type: GeofenceBreachType
  animal: string
  animalId: string
  species: string
  location: GeofenceLocation
  direction: "outbound" | "inbound"
  timestamp: number
  severity: "low" | "medium" | "high"
  zone?: string
}

export interface GeofenceEventListener {
  (event: GeofenceBreachEvent): void
}

// Event listener registry
let geofenceListeners: Set<GeofenceEventListener> = new Set()

/**
 * Register a listener for geofence breach events
 */
export function onGeofenceBreach(listener: GeofenceEventListener): () => void {
  geofenceListeners.add(listener)

  // Return unsubscribe function
  return () => {
    geofenceListeners.delete(listener)
  }
}

/**
 * Emit a geofence breach event to all listeners
 */
export function emitGeofenceBreach(event: GeofenceBreachEvent): void {
  console.log("[Geofence] Breach event emitted:", event)
  geofenceListeners.forEach((listener) => {
    try {
      listener(event)
    } catch (error) {
      console.error("[Geofence] Listener error:", error)
    }
  })
}

/**
 * Get all active listeners (for testing/debugging)
 */
export function getActiveListeners(): number {
  return geofenceListeners.size
}

/**
 * Clear all listeners (for cleanup/testing)
 */
export function clearAllListeners(): void {
  geofenceListeners.clear()
}
