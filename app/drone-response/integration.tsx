"use client"

// Event listener for AI Monitoring page
// Bridges threat detection with drone response system

import { useEffect } from "react"
import { eventBus } from "@/app/shared-events/eventBus"
import { ThreatEvent } from "@/app/shared-events/eventTypes"

/**
 * Hook to sync threat alerts from AI Monitoring to Event Bus
 * This intercepts threat data without modifying the AI Monitoring page
 */
export function useSyncAIThreatsToDroneEvents() {
  useEffect(() => {
    // Simulate intercepting threat data from AI Monitoring
    // In production, this would connect to the actual threat feed
    // For now, we provide a mechanism for the AI Monitoring page to publish events

    // Check if AI Monitoring has published events
    const checkForAIThreats = () => {
      // This function can be called by AI Monitoring to bridge the systems
      // Example: window.__aiMonitoringEventPublisher?.publishThreat(threat)
    }

    return () => {
      // Cleanup
    }
  }, [])
}

/**
 * Bridge function that AI Monitoring can call to publish events
 * Usage: publishThreatFromAIMonitoring(threatEvent)
 */
export function publishThreatFromAIMonitoring(event: ThreatEvent): void {
  // Validate and publish event to shared bus
  if (!event.id || !event.type || !event.location) {
    console.error("[Integration] Invalid threat event", event)
    return
  }

  eventBus.publish(event)
  console.log("[Integration] Threat published from AI Monitoring:", event.id)
}

/**
 * Helper to convert AI Monitoring threat format to Event Bus format
 */
export function convertAIMonitoringThreat(aiThreat: any): ThreatEvent {
  // Parse threat type from AI Monitoring format
  let threatType: "poaching" | "fire" | "animal_intrusion" | "environmental_hazard" | "unknown" = "unknown"

  const typeStr = aiThreat.type?.toLowerCase() || ""
  if (typeStr.includes("poaching") || typeStr.includes("hunting")) threatType = "poaching"
  else if (typeStr.includes("fire")) threatType = "fire"
  else if (typeStr.includes("predator") || typeStr.includes("intrusion")) threatType = "animal_intrusion"
  else if (typeStr.includes("environmental") || typeStr.includes("hazard")) threatType = "environmental_hazard"

  // Map severity
  let severity: "low" | "medium" | "high" | "critical" = "medium"
  const confidenceNum = parseInt(aiThreat.confidence) || 50
  if (confidenceNum > 90) severity = "critical"
  else if (confidenceNum > 75) severity = "high"
  else if (confidenceNum < 40) severity = "low"

  return {
    id: aiThreat.id || `EVENT-${Date.now()}`,
    type: threatType,
    location: {
      lat: aiThreat.lat || -1.2921,
      lng: aiThreat.lng || 36.8219,
      region: aiThreat.location?.split(",")[0],
      sector: aiThreat.location?.split(",")[1],
    },
    confidence: confidenceNum,
    timestamp: aiThreat.timestamp || Date.now(),
    sourceCamera: aiThreat.camera || "AI-CAM",
    description: aiThreat.description || aiThreat.type,
    severity,
    affectedAnimals: aiThreat.affectedAnimals,
  }
}
