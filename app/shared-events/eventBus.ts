// Shared Live Event Bus - Central event distribution layer
// Non-invasive event streaming for the drone response system

import { ThreatEvent, EventSubscriber, EventStats } from "./eventTypes"

class EventBus {
  private subscribers: Map<string, EventSubscriber> = new Map()
  private eventHistory: ThreatEvent[] = []
  private maxHistorySize = 100
  private listeners: Set<() => void> = new Set()

  /**
   * Subscribe to threat events
   * Returns unsubscribe function
   */
  subscribe(
    callback: (event: ThreatEvent) => void,
    filter?: (event: ThreatEvent) => boolean
  ): () => void {
    const subscriberId = `sub-${Date.now()}-${Math.random()}`
    const subscriber: EventSubscriber = { id: subscriberId, callback, filter }

    this.subscribers.set(subscriberId, subscriber)

    // Return unsubscribe function
    return () => {
      this.subscribers.delete(subscriberId)
    }
  }

  /**
   * Publish a threat event to all subscribers
   */
  publish(event: ThreatEvent): void {
    // Ensure event has timestamp
    if (!event.timestamp) {
      event.timestamp = Date.now()
    }

    // Store in history
    this.eventHistory.push(event)
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift()
    }

    // Notify all matching subscribers
    this.subscribers.forEach((subscriber) => {
      try {
        // Apply filter if provided
        if (subscriber.filter && !subscriber.filter(event)) {
          return
        }
        subscriber.callback(event)
      } catch (error) {
        console.error("[EventBus] Subscriber error:", error)
      }
    })

    // Notify state listeners
    this.notifyListeners()
  }

  /**
   * Get recent events
   */
  getRecentEvents(limit: number = 50): ThreatEvent[] {
    return this.eventHistory.slice(-limit)
  }

  /**
   * Get events by type
   */
  getEventsByType(type: string): ThreatEvent[] {
    return this.eventHistory.filter((event) => event.type === type)
  }

  /**
   * Get events in time range
   */
  getEventsByTimeRange(startTime: number, endTime: number): ThreatEvent[] {
    return this.eventHistory.filter((event) => event.timestamp >= startTime && event.timestamp <= endTime)
  }

  /**
   * Get event statistics
   */
  getStats(): EventStats {
    const stats: EventStats = {
      totalEvents: this.eventHistory.length,
      eventsByType: {
        poaching: 0,
        fire: 0,
        animal_intrusion: 0,
        environmental_hazard: 0,
        unknown: 0,
      },
      averageConfidence: 0,
    }

    let totalConfidence = 0

    this.eventHistory.forEach((event) => {
      stats.eventsByType[event.type]++
      totalConfidence += event.confidence
      stats.lastEventTime = Math.max(stats.lastEventTime || 0, event.timestamp)
    })

    stats.averageConfidence = this.eventHistory.length > 0 ? totalConfidence / this.eventHistory.length : 0

    return stats
  }

  /**
   * Subscribe to state changes
   */
  onStateChange(listener: () => void): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => {
      try {
        listener()
      } catch (error) {
        console.error("[EventBus] Listener error:", error)
      }
    })
  }

  /**
   * Clear all events and subscribers (for testing/reset)
   */
  clear(): void {
    this.subscribers.clear()
    this.eventHistory = []
    this.listeners.clear()
  }

  /**
   * Get subscriber count
   */
  getSubscriberCount(): number {
    return this.subscribers.size
  }

  /**
   * Simulate events for demo mode
   */
  generateDemoEvent(): ThreatEvent {
    const threatTypes: Array<"poaching" | "fire" | "animal_intrusion" | "environmental_hazard" | "unknown"> = [
      "poaching",
      "fire",
      "animal_intrusion",
      "environmental_hazard",
    ]
    const regions = ["North Region", "South Region", "East Region", "West Region"]
    const sectors = ["Sector 1", "Sector 2", "Sector 3", "Sector 4", "Sector 5"]

    const selectedType = threatTypes[Math.floor(Math.random() * threatTypes.length)]
    const selectedRegion = regions[Math.floor(Math.random() * regions.length)]
    const selectedSector = sectors[Math.floor(Math.random() * sectors.length)]

    const event: ThreatEvent = {
      id: `EVENT-${Date.now()}`,
      type: selectedType,
      location: {
        lat: -1.2921 + (Math.random() - 0.5) * 2,
        lng: 36.8219 + (Math.random() - 0.5) * 2,
        region: selectedRegion,
        sector: selectedSector,
      },
      confidence: 70 + Math.random() * 30,
      timestamp: Date.now(),
      sourceCamera: `CAM-${Math.floor(Math.random() * 20) + 1}`,
      description: this.getDemoDescription(selectedType),
      severity: ["low", "medium", "high", "critical"][Math.floor(Math.random() * 4)] as any,
      affectedAnimals: Math.random() > 0.5 ? ["RH-003", "LI-002"] : undefined,
    }

    return event
  }

  private getDemoDescription(type: string): string {
    const descriptions: Record<string, string> = {
      poaching: "Suspicious activity detected near perimeter. Vehicle and potential hunting equipment identified.",
      fire: "Smoke detected in forest zone. Thermal anomaly confirmation required.",
      animal_intrusion: "Unknown animal species detected in protected zone. May pose threat to resident population.",
      environmental_hazard: "Water source contamination or chemical hazard detected in monitoring area.",
      unknown: "Anomalous activity detected. Requires human review and classification.",
    }
    return descriptions[type] || "Unknown threat event detected."
  }
}

// Create singleton instance
export const eventBus = new EventBus()

// For development/testing - also export the class for mock testing
export { EventBus }
