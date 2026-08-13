"use client"

import { useEffect, useState } from "react"
import { watchAlerts, type FirebaseAlert } from "@/lib/firebase-rtdb"
import { type Alert } from "@/app/actions/alert-actions"

export type FirebaseCompatAlert = Alert & { key: string }

function mapToAlert(fbAlert: FirebaseAlert & { key: string }): FirebaseCompatAlert {
  return {
    id: fbAlert.id,
    animal_name: fbAlert.animal,
    alert_type: fbAlert.type,
    severity: fbAlert.severity,
    message: fbAlert.message,
    location: fbAlert.location,
    status: fbAlert.status === "resolved" ? "resolved" : "active",
    created_at: fbAlert.createdAt
      ? new Date(fbAlert.createdAt).toLocaleString()
      : "Unknown",
    key: fbAlert.key,
  }
}

export function useFirebaseAlerts(includeResolved: boolean) {
  const [alerts, setAlerts] = useState<FirebaseCompatAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const unsubscribe = watchAlerts((fbAlerts) => {
        const mapped = fbAlerts.map(mapToAlert)
        const filtered = includeResolved
          ? mapped
          : mapped.filter((a) => a.status !== "resolved")
        filtered.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        setAlerts(filtered)
        setLoading(false)
      })
      return unsubscribe
    } catch (err) {
      setError("Failed to connect to Firebase")
      setLoading(false)
    }
  }, [includeResolved])

  return { alerts, loading, error }
}
