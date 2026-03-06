// Autonomous Drone Response Simulation Engine
// Handles drone deployment logic and telemetry

import { ThreatEvent } from "@/app/shared-events/eventTypes"

export type DroneStatus = "idle" | "launching" | "en_route" | "observing" | "returning" | "landed"

export interface Coordinates {
  lat: number
  lng: number
}

export interface DroneBase {
  id: string
  name: string
  location: Coordinates
  maxRange: number // kilometers
}

export interface Drone {
  id: string
  name: string
  baseId: string
  status: DroneStatus
  battery: number // 0-100
  currentLocation: Coordinates
  targetLocation?: Coordinates
  altitude: number // meters
  speed: number // km/h
  headingDirection: number // degrees 0-360
  timeOnMission: number // seconds
  missionId?: string
}

export interface Mission {
  id: string
  droneId: string
  threatId: string
  targetLocation: Coordinates
  threatType: string
  threatSeverity: string
  startTime: number
  endTime?: number
  status: "assigned" | "active" | "completed" | "failed"
  telemetry: MissionTelemetry[]
}

export interface MissionTelemetry {
  timestamp: number
  altitude: number
  speed: number
  battery: number
  location: Coordinates
  signal: number // 0-100
}

// Drone bases
const DRONE_BASES: DroneBase[] = [
  {
    id: "base-1",
    name: "North Command",
    location: { lat: -0.5, lng: 35.5 },
    maxRange: 50,
  },
  {
    id: "base-2",
    name: "Central Hub",
    location: { lat: -1.2921, lng: 36.8219 },
    maxRange: 60,
  },
  {
    id: "base-3",
    name: "South Outpost",
    location: { lat: -2.0, lng: 37.5 },
    maxRange: 50,
  },
]

// Initialize fleet
function initializeFleet(): Drone[] {
  return [
    {
      id: "drone-1",
      name: "GUARDIAN-ALPHA",
      baseId: "base-1",
      status: "idle",
      battery: 95,
      currentLocation: DRONE_BASES[0].location,
      altitude: 0,
      speed: 0,
      headingDirection: 0,
      timeOnMission: 0,
    },
    {
      id: "drone-2",
      name: "GUARDIAN-BETA",
      baseId: "base-2",
      status: "idle",
      battery: 88,
      currentLocation: DRONE_BASES[1].location,
      altitude: 0,
      speed: 0,
      headingDirection: 0,
      timeOnMission: 0,
    },
    {
      id: "drone-3",
      name: "GUARDIAN-GAMMA",
      baseId: "base-3",
      status: "idle",
      battery: 92,
      currentLocation: DRONE_BASES[2].location,
      altitude: 0,
      speed: 0,
      headingDirection: 0,
      timeOnMission: 0,
    },
  ]
}

// Calculate distance between coordinates (Haversine)
function calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371 // Earth radius in km
  const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180
  const dLng = ((coord2.lng - coord1.lng) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1.lat * Math.PI) / 180) *
      Math.cos((coord2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Find best drone for threat
export function selectOptimalDrone(threat: ThreatEvent, fleet: Drone[]): Drone | null {
  const availableDrones = fleet.filter((d) => d.status === "idle" && d.battery > 20)

  if (availableDrones.length === 0) return null

  // Score drones based on distance, battery, and availability
  const scoredDrones = availableDrones.map((drone) => {
    const base = DRONE_BASES.find((b) => b.id === drone.baseId)!
    const distanceToBase = calculateDistance(base.location, threat.location)
    const withinRange = distanceToBase <= base.maxRange

    if (!withinRange) return { drone, score: 0 }

    const distanceScore = 100 - (distanceToBase / base.maxRange) * 100
    const batteryScore = drone.battery
    const score = distanceScore * 0.6 + batteryScore * 0.4

    return { drone, score }
  })

  // Sort by score and return best
  scoredDrones.sort((a, b) => b.score - a.score)
  return scoredDrones[0]?.score > 0 ? scoredDrones[0].drone : null
}

// Deploy drone to threat
export function deployDrone(drone: Drone, threat: ThreatEvent): { drone: Drone; mission: Mission } {
  const mission: Mission = {
    id: `mission-${Date.now()}`,
    droneId: drone.id,
    threatId: threat.id,
    targetLocation: threat.location,
    threatType: threat.type,
    threatSeverity: threat.severity,
    startTime: Date.now(),
    status: "assigned",
    telemetry: [],
  }

  const updatedDrone: Drone = {
    ...drone,
    status: "launching",
    missionId: mission.id,
    targetLocation: threat.location,
    timeOnMission: 0,
  }

  return { drone: updatedDrone, mission }
}

// Simulate drone movement and telemetry
export function updateDroneState(
  drone: Drone,
  mission: Mission | undefined,
  deltaTime: number
): { drone: Drone; telemetry?: MissionTelemetry } {
  let updatedDrone = { ...drone }

  if (!mission || mission.status !== "active") {
    return { drone: updatedDrone }
  }

  const base = DRONE_BASES.find((b) => b.id === drone.baseId)!
  const targetLocation = mission.targetLocation

  updatedDrone.timeOnMission += deltaTime

  // Status progression
  if (updatedDrone.status === "launching") {
    updatedDrone.altitude = Math.min(150, updatedDrone.altitude + 30 * (deltaTime / 1000))
    updatedDrone.speed = Math.min(50, updatedDrone.speed + 10 * (deltaTime / 1000))
    updatedDrone.battery -= 0.1 * (deltaTime / 1000)

    if (updatedDrone.timeOnMission > 5) {
      updatedDrone.status = "en_route"
    }
  } else if (updatedDrone.status === "en_route") {
    const distance = calculateDistance(updatedDrone.currentLocation, targetLocation)

    if (distance > 0.5) {
      // Move towards target
      const heading = calculateBearing(updatedDrone.currentLocation, targetLocation)
      updatedDrone.headingDirection = heading

      const moveDistance = (50 * (deltaTime / 1000)) / 111 // Convert km/h to degrees
      updatedDrone.currentLocation = {
        lat: updatedDrone.currentLocation.lat + Math.cos(((heading + 90) * Math.PI) / 180) * moveDistance,
        lng: updatedDrone.currentLocation.lng + Math.sin(((heading + 90) * Math.PI) / 180) * moveDistance,
      }

      updatedDrone.speed = 50
      updatedDrone.altitude = 150
      updatedDrone.battery -= 0.15 * (deltaTime / 1000)
    } else {
      updatedDrone.status = "observing"
      updatedDrone.currentLocation = targetLocation
    }
  } else if (updatedDrone.status === "observing") {
    updatedDrone.speed = 0
    updatedDrone.battery -= 0.05 * (deltaTime / 1000)

    if (updatedDrone.timeOnMission > 20) {
      updatedDrone.status = "returning"
    }
  } else if (updatedDrone.status === "returning") {
    const distance = calculateDistance(updatedDrone.currentLocation, base.location)

    if (distance > 0.5) {
      const heading = calculateBearing(updatedDrone.currentLocation, base.location)
      updatedDrone.headingDirection = heading

      const moveDistance = (45 * (deltaTime / 1000)) / 111
      updatedDrone.currentLocation = {
        lat: updatedDrone.currentLocation.lat + Math.cos(((heading + 90) * Math.PI) / 180) * moveDistance,
        lng: updatedDrone.currentLocation.lng + Math.sin(((heading + 90) * Math.PI) / 180) * moveDistance,
      }

      updatedDrone.speed = 45
      updatedDrone.altitude = Math.max(0, updatedDrone.altitude - 20 * (deltaTime / 1000))
      updatedDrone.battery -= 0.1 * (deltaTime / 1000)
    } else {
      updatedDrone.status = "landed"
      updatedDrone.currentLocation = base.location
      updatedDrone.altitude = 0
      updatedDrone.speed = 0
      updatedDrone.battery = Math.min(100, updatedDrone.battery + 1) // Charging
    }
  }

  // Clamp battery
  updatedDrone.battery = Math.max(0, Math.min(100, updatedDrone.battery))

  // Record telemetry
  const telemetry: MissionTelemetry = {
    timestamp: Date.now(),
    altitude: updatedDrone.altitude,
    speed: updatedDrone.speed,
    battery: updatedDrone.battery,
    location: updatedDrone.currentLocation,
    signal: Math.max(10, 100 - calculateDistance(updatedDrone.currentLocation, base.location) * 2),
  }

  return { drone: updatedDrone, telemetry }
}

// Calculate bearing between two points
function calculateBearing(from: Coordinates, to: Coordinates): number {
  const dLng = ((to.lng - from.lng) * Math.PI) / 180
  const y = Math.sin(dLng) * Math.cos((to.lat * Math.PI) / 180)
  const x =
    Math.cos((from.lat * Math.PI) / 180) * Math.sin((to.lat * Math.PI) / 180) -
    Math.sin((from.lat * Math.PI) / 180) * Math.cos((to.lat * Math.PI) / 180) * Math.cos(dLng)
  return (Math.atan2(y, x) * 180) / Math.PI
}

export { DRONE_BASES, initializeFleet }
