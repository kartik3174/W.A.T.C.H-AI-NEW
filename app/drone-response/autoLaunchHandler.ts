/**
 * Autonomous Drone Launch Handler
 * Automatically triggers drone response when geofence breach is detected
 * Integrates with shared event system for drone deployment
 */

import { GeofenceBreachEvent } from "@/app/geofence-events/eventTypes"
import { eventBus } from "@/app/shared-events/eventBus"
import { ThreatEvent } from "@/app/shared-events/eventTypes"

export interface AutoLaunchConfig {
  enabled: boolean
  minSeverity: "low" | "medium" | "high"
  autoDeployOnBreach: boolean
  notifyUser: boolean
}

let autoLaunchConfig: AutoLaunchConfig = {
  enabled: true,
  minSeverity: "high",
  autoDeployOnBreach: true,
  notifyUser: true,
}

/**
 * Convert geofence breach event to threat event for drone system
 */
export function convertBreachToThreat(breach: GeofenceBreachEvent): ThreatEvent {
  const confidenceMap: Record<string, number> = {
    low: 60,
    medium: 80,
    high: 95,
  }

  return {
    id: `threat_${breach.animalId}_${breach.timestamp}`,
    type: "boundary-breach",
    location: {
      lat: breach.location.x,
      lng: breach.location.y,
      region: breach.zone || "boundary",
    },
    confidence: confidenceMap[breach.severity] || 80,
    timestamp: breach.timestamp,
    sourceCamera: "geofence-system",
    description: `${breach.animal} (${breach.species}) breached reserve boundary`,
    severity: (breach.severity === "high" ? "high" : breach.severity === "medium" ? "medium" : "low") as "low" | "medium" | "high" | "critical",
    affectedAnimals: [breach.animalId],
    metadata: {
      animalName: breach.animal,
      species: breach.species,
      breachType: breach.type,
      direction: breach.direction,
    },
  }
}

/**
 * Handle incoming geofence breach event
 * Automatically triggers drone response if conditions are met
 */
export function handleGeofenceBreach(breach: GeofenceBreachEvent): void {
  console.log("[AutoLaunch] Processing geofence breach:", breach)

  // Check if auto-launch is enabled
  if (!autoLaunchConfig.enabled) {
    console.log("[AutoLaunch] Auto-launch disabled, skipping deployment")
    return
  }

  // Check severity threshold
  const severityOrder = { low: 0, medium: 1, high: 2 }
  const breachLevel = severityOrder[breach.severity]
  const minLevel = severityOrder[autoLaunchConfig.minSeverity]

  if (breachLevel < minLevel) {
    console.log(
      `[AutoLaunch] Breach severity ${breach.severity} below threshold ${autoLaunchConfig.minSeverity}`
    )
    return
  }

  // Convert to threat event
  const threatEvent = convertBreachToThreat(breach)

  // Emit threat event to drone response system
  console.log("[AutoLaunch] Emitting threat event to drone system:", threatEvent)
  eventBus.publish(threatEvent)

  // Log deployment notification
  if (autoLaunchConfig.notifyUser) {
    console.log(
      `[AutoLaunch] ALERT: ${breach.animal} (${breach.species}) breached reserve boundary at (${breach.location.x}, ${breach.location.y}). Drone deployment initiated.`
    )
  }
}

/**
 * Update auto-launch configuration
 */
export function setAutoLaunchConfig(config: Partial<AutoLaunchConfig>): void {
  autoLaunchConfig = { ...autoLaunchConfig, ...config }
  console.log("[AutoLaunch] Configuration updated:", autoLaunchConfig)
}

/**
 * Get current auto-launch configuration
 */
export function getAutoLaunchConfig(): AutoLaunchConfig {
  return { ...autoLaunchConfig }
}

/**
 * Enable/disable auto-launch
 */
export function setAutoLaunchEnabled(enabled: boolean): void {
  autoLaunchConfig.enabled = enabled
  console.log(`[AutoLaunch] Auto-launch ${enabled ? "enabled" : "disabled"}`)
}

/**
 * Check if auto-launch is currently enabled
 */
export function isAutoLaunchEnabled(): boolean {
  return autoLaunchConfig.enabled
}
