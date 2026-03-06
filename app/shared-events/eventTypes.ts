// Shared Live Event Stream - Event Type Definitions
// This is a completely isolated module that does not modify existing systems

export type ThreatType = "poaching" | "fire" | "animal_intrusion" | "environmental_hazard" | "unknown"

export interface Location {
  lat: number
  lng: number
  region?: string
  sector?: string
}

export interface ThreatEvent {
  id: string
  type: ThreatType
  location: Location
  confidence: number // 0-100
  timestamp: number // Unix timestamp
  sourceCamera: string
  description: string
  severity: "low" | "medium" | "high" | "critical"
  affectedAnimals?: string[]
  metadata?: Record<string, any>
}

export interface EventSubscriber {
  id: string
  callback: (event: ThreatEvent) => void
  filter?: (event: ThreatEvent) => boolean
}

export interface EventStats {
  totalEvents: number
  eventsByType: Record<ThreatType, number>
  lastEventTime?: number
  averageConfidence: number
}
