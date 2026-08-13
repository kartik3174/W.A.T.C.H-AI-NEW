"use client"

import { useEffect, useState } from "react"
import { watchCameras, type FirebaseCamera } from "@/lib/firebase-rtdb"
import { type Camera } from "@/app/actions/camera-actions"

export type FirebaseCompatCamera = Camera & { key: string }

function mapToCamera(fbCamera: FirebaseCamera & { key: string }): FirebaseCompatCamera {
  return {
    id: fbCamera.id,
    name: fbCamera.name,
    location: fbCamera.location,
    location_description: fbCamera.location,
    camera_type: fbCamera.type,
    status: fbCamera.status,
    threshold_value: fbCamera.threshold,
    last_maintenance: fbCamera.lastMaintenance,
    key: fbCamera.key,
  }
}

export function useFirebaseCameras() {
  const [cameras, setCameras] = useState<FirebaseCompatCamera[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const unsubscribe = watchCameras((fbCameras) => {
        setCameras(fbCameras.map(mapToCamera))
        setLoading(false)
      })
      return unsubscribe
    } catch (err) {
      setError("Failed to connect to Firebase")
      setLoading(false)
    }
  }, [])

  return { cameras, loading, error }
}
