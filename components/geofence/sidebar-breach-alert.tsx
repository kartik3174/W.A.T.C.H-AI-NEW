"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, X, Clock, MapPin, AlertCircle } from "lucide-react"
import { geofenceEventBus } from "@/app/shared-events/geofenceEventBus"
import type { GeofenceBreachEvent } from "@/app/shared-events/geofenceEventBus"

export function SidebarBreachAlert() {
  const [breaches, setBreaches] = useState<GeofenceBreachEvent[]>([])

  useEffect(() => {
    const handleBreach = (event: GeofenceBreachEvent) => {
      setBreaches((prev) => [event, ...prev].slice(0, 5)) // Keep last 5 breaches
    }

    // Subscribe to breach events using the correct method
    const unsubscribe = geofenceEventBus.onBreachDetected(handleBreach)

    return () => {
      unsubscribe()
    }
  }, [])

  const removeBreach = (id: string) => {
    setBreaches((prev) => prev.filter((b) => b.id !== id))
  }

  if (breaches.length === 0) {
    return null
  }

  return (
    <div className="fixed right-4 top-20 z-50 max-w-sm space-y-2">
      {breaches.map((breach) => (
        <div
          key={breach.id}
          className="bg-[#FF3B3B] text-white p-4 rounded-lg shadow-xl border-l-4 border-[#FF1A1A] animate-pulse-red"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-bold text-sm">Boundary Breach Alert</h3>
                <p className="text-xs mt-1 opacity-95">{breach.animalName} left protected reserve</p>

                <div className="mt-2 space-y-1 text-xs">
                  <div className="flex items-center gap-2 opacity-90">
                    <AlertCircle className="h-3 w-3" />
                    <span>Animal: {breach.animalId}</span>
                  </div>
                  <div className="flex items-center gap-2 opacity-90">
                    <MapPin className="h-3 w-3" />
                    <span>
                      {breach.position.x.toFixed(3)}, {breach.position.y.toFixed(3)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 opacity-90">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(breach.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="flex items-center gap-2 opacity-90">
                    <AlertCircle className="h-3 w-3" />
                    <span className="capitalize">Severity: {breach.severity}</span>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => removeBreach(breach.id)}
              className="text-white/70 hover:text-white p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 text-xs font-semibold text-white/90">
            AUTONOMOUS DRONE RESPONSE ACTIVATED
          </div>
        </div>
      ))}
    </div>
  )
}
