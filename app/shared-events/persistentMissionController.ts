/**
 * Persistent Mission Controller
 * Maintains drone mission state across page navigation
 * Survives tab switches and keeps deployment active
 */

import { geofenceEventBus, DroneDeploymentRequest } from './geofenceEventBus'

export interface MissionState {
  isActive: boolean
  breachEventId: string | null
  targetAnimalId: string | null
  targetName: string | null
  targetPosition: { x: number; y: number } | null
  startTime: Date | null
  status: 'idle' | 'deploying' | 'in-flight' | 'pursuing' | 'returning' | 'completed'
  droneId?: string
  estimatedArrival?: number
  baseStation?: string
}

// Persistent mission state
let missionState: MissionState = {
  isActive: false,
  breachEventId: null,
  targetAnimalId: null,
  targetName: null,
  targetPosition: null,
  startTime: null,
  status: 'idle',
}

// Mission state listeners
const stateListeners: Set<(state: MissionState) => void> = new Set()

export const persistentMissionController = {
  /**
   * Initialize the controller
   */
  init() {
    // Listen for deployment requests
    geofenceEventBus.onDroneDeployment(request => {
      this.activateMission(request)
    })

    // Restore mission state from sessionStorage if exists
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('geofence-mission-state')
      if (saved) {
        try {
          missionState = JSON.parse(saved)
          console.log('[MissionController] Restored mission state:', missionState)
          this.notifyStateChange()
        } catch (e) {
          console.error('[MissionController] Failed to restore state')
        }
      }
    }
  },

  /**
   * Activate mission on breach detection
   */
  activateMission(request: DroneDeploymentRequest) {
    const now = new Date()
    missionState = {
      isActive: true,
      breachEventId: request.breachEventId,
      targetAnimalId: request.animalId,
      targetName: request.targetName,
      targetPosition: request.targetPosition,
      startTime: now,
      status: 'deploying',
      droneId: `DRONE-${Date.now()}`,
      estimatedArrival: 30, // seconds
      baseStation: 'Station-Alpha',
    }

    this.persistState()
    this.notifyStateChange()

    // Auto-transition to in-flight after 3 seconds
    setTimeout(() => {
      if (missionState.isActive && missionState.status === 'deploying') {
        missionState.status = 'in-flight'
        missionState.estimatedArrival = 25
        this.persistState()
        this.notifyStateChange()
      }
    }, 3000)

    // Auto-transition to pursuing after 6 seconds
    setTimeout(() => {
      if (missionState.isActive && missionState.status === 'in-flight') {
        missionState.status = 'pursuing'
        this.persistState()
        this.notifyStateChange()
      }
    }, 6000)
  },

  /**
   * Update mission status
   */
  updateStatus(status: MissionState['status']) {
    missionState.status = status
    this.persistState()
    this.notifyStateChange()
  },

  /**
   * Update target position (animal tracking)
   */
  updateTargetPosition(position: { x: number; y: number }) {
    if (missionState.isActive) {
      missionState.targetPosition = position
      this.notifyStateChange()
    }
  },

  /**
   * Complete mission
   */
  completeMission() {
    missionState = {
      isActive: false,
      breachEventId: null,
      targetAnimalId: null,
      targetName: null,
      targetPosition: null,
      startTime: null,
      status: 'completed',
    }
    this.persistState()
    this.notifyStateChange()
    geofenceEventBus.completeMission()
  },

  /**
   * Get current mission state
   */
  getState(): MissionState {
    return { ...missionState }
  },

  /**
   * Subscribe to state changes
   */
  onStateChange(callback: (state: MissionState) => void) {
    stateListeners.add(callback)
    return () => stateListeners.delete(callback)
  },

  /**
   * Notify all listeners of state change
   */
  notifyStateChange() {
    stateListeners.forEach(listener => listener({ ...missionState }))
  },

  /**
   * Persist state to sessionStorage
   */
  persistState() {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('geofence-mission-state', JSON.stringify(missionState))
    }
  },

  /**
   * Get listener count (for debugging)
   */
  getListenerCount() {
    return stateListeners.size
  },

  /**
   * Clear all state
   */
  clear() {
    missionState = {
      isActive: false,
      breachEventId: null,
      targetAnimalId: null,
      targetName: null,
      targetPosition: null,
      startTime: null,
      status: 'idle',
    }
    this.persistState()
    stateListeners.clear()
  },
}
