/**
 * Persistent Geofence Event Bus
 * Manages geofence breach events across the entire application
 * Survives page navigation and tab switches
 */

export interface GeofenceBreachEvent {
  id: string
  animalId: string
  animalName: string
  species: string
  timestamp: Date
  position: { x: number; y: number }
  direction: string
  severity: 'high' | 'critical'
}

export interface DroneDeploymentRequest {
  breachEventId: string
  animalId: string
  targetPosition: { x: number; y: number }
  targetName: string
  priority: 'high' | 'critical'
}

// Global event listeners
const listeners: {
  onBreach: Set<(event: GeofenceBreachEvent) => void>
  onDeploy: Set<(request: DroneDeploymentRequest) => void>
  onMissionUpdate: Set<(status: any) => void>
} = {
  onBreach: new Set(),
  onDeploy: new Set(),
  onMissionUpdate: new Set(),
}

// Mission state persistence
let activeMission: { breachEventId: string; targetAnimalId: string; startTime: Date } | null = null

export const geofenceEventBus = {
  /**
   * Register listener for boundary breach events
   */
  onBreachDetected(callback: (event: GeofenceBreachEvent) => void) {
    listeners.onBreach.add(callback)
    return () => listeners.onBreach.delete(callback)
  },

  /**
   * Register listener for drone deployment requests
   */
  onDroneDeployment(callback: (request: DroneDeploymentRequest) => void) {
    listeners.onDeploy.add(callback)
    return () => listeners.onDeploy.delete(callback)
  },

  /**
   * Register listener for mission status updates
   */
  onMissionUpdate(callback: (status: any) => void) {
    listeners.onMissionUpdate.add(callback)
    return () => listeners.onMissionUpdate.delete(callback)
  },

  /**
   * Emit breach event to all listeners
   */
  emitBreach(event: GeofenceBreachEvent) {
    console.log('[GeofenceEventBus] Breach detected:', event.animalName)
    listeners.onBreach.forEach(listener => listener(event))

    // Automatically trigger drone deployment
    this.requestDroneDeployment({
      breachEventId: event.id,
      animalId: event.animalId,
      targetPosition: event.position,
      targetName: event.animalName,
      priority: event.severity,
    })
  },

  /**
   * Request drone deployment (auto-triggered by breach)
   */
  requestDroneDeployment(request: DroneDeploymentRequest) {
    console.log('[GeofenceEventBus] Deploying drone for:', request.targetName)
    activeMission = {
      breachEventId: request.breachEventId,
      targetAnimalId: request.animalId,
      startTime: new Date(),
    }
    listeners.onDeploy.forEach(listener => listener(request))
  },

  /**
   * Update mission status
   */
  updateMissionStatus(status: any) {
    listeners.onMissionUpdate.forEach(listener => listener(status))
  },

  /**
   * Get active mission
   */
  getActiveMission() {
    return activeMission
  },

  /**
   * Complete mission
   */
  completeMission() {
    activeMission = null
  },

  /**
   * Get all registered listeners count (for debugging)
   */
  getListenerCount() {
    return {
      breach: listeners.onBreach.size,
      deploy: listeners.onDeploy.size,
      missionUpdate: listeners.onMissionUpdate.size,
    }
  },
}
