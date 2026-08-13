"use server"

export type Alert = {
  id: number
  animal_id?: number
  animal_name?: string
  alert_type: string
  severity: string
  message: string
  location?: string
  status: string
  created_at: string
  latitude?: number
  longitude?: number
}

// Mock alerts data for fallback
const MOCK_ALERTS: Alert[] = [
  {
    id: 1,
    animal_id: 1,
    animal_name: "Jumbo",
    alert_type: "Poaching Risk",
    severity: "Critical",
    message: "Suspicious vehicle detected near elephant herd",
    location: "North Ridge, Sector 2",
    status: "active",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toLocaleString(),
    latitude: -1.2345,
    longitude: 36.7890,
  },
  {
    id: 2,
    animal_id: 2,
    animal_name: "Simba",
    alert_type: "Health Issue",
    severity: "High",
    message: "Elevated body temperature detected in lion",
    location: "West Reserve",
    status: "active",
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toLocaleString(),
    latitude: -1.3456,
    longitude: 36.8901,
  },
  {
    id: 3,
    animal_id: 4,
    animal_name: "Kali",
    alert_type: "Movement Alert",
    severity: "Medium",
    message: "Rhino moved outside habitual range",
    location: "Central Zone",
    status: "resolved",
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleString(),
    latitude: -1.4567,
    longitude: 36.9012,
  },
  {
    id: 4,
    animal_id: 3,
    animal_name: "Rajah",
    alert_type: "Camera Failure",
    severity: "Medium",
    message: "Motion sensor camera offline in sector 5",
    location: "Sector 5, Ridge Trail",
    status: "active",
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toLocaleString(),
    latitude: -1.5678,
    longitude: 37.0123,
  },
  {
    id: 5,
    animal_id: 5,
    animal_name: "Kali",
    alert_type: "Intrusion Alert",
    severity: "High",
    message: "Unauthorized human detected in protected zone",
    location: "Gorilla Sanctuary",
    status: "active",
    created_at: new Date(Date.now() - 30 * 60 * 1000).toLocaleString(),
    latitude: -1.6789,
    longitude: 37.1234,
  },
]

export async function getAlerts(limit = 10, includeResolved = false): Promise<Alert[]> {
  try {
    // Return mock data for now - in production this would connect to Supabase
    let alerts = [...MOCK_ALERTS].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    if (!includeResolved) {
      alerts = alerts.filter((a) => a.status === "active")
    }

    return alerts.slice(0, limit)
  } catch (err) {
    console.error("Error in getAlerts:", err)
    return []
  }
}

export async function resolveAlert(alertId: number) {
  try {
    // Mock implementation - in production this would save to Supabase
    const alert = MOCK_ALERTS.find((a) => a.id === alertId)
    if (alert) {
      alert.status = "resolved"
      return alert
    }
    throw new Error("Alert not found")
  } catch (err) {
    console.error("Error in resolveAlert:", err)
    throw err
  }
}
