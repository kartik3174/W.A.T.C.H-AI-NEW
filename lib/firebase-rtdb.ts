import { ref, set, push, update, onValue, off, get } from "firebase/database"
import { database } from "./Firebase"

// ── TYPES ──────────────────────────────────────────────────────────────────

export type FirebaseAnimal = {
  tagId: string
  name: string
  species: string
  gender: string
  age: number
  healthStatus: string
  lastSeen: string
  createdAt?: string
  updatedAt?: string
  notes?: string
  image_url?: string
}

export type FirebaseCamera = {
  id: number
  name: string
  location: string
  type: string
  status: string
  threshold: number
  lastMaintenance: string
  createdAt?: string
  updatedAt?: string
}

export type FirebaseAlert = {
  id: number
  type: string
  severity: string
  animal: string
  message: string
  location: string
  createdAt: string
  status: string
  resolved: boolean
  updatedAt?: string
}

// ── ANIMALS ────────────────────────────────────────────────────────────────

export function watchAnimals(
  callback: (animals: (FirebaseAnimal & { key: string })[]) => void
) {
  const animalsRef = ref(database, "animals")
  onValue(animalsRef, (snapshot) => {
    const data = snapshot.val()
    if (data) {
      const list = Object.entries(data).map(([key, value]) => ({
        ...(value as FirebaseAnimal),
        key,
      }))
      callback(list)
    } else {
      callback([])
    }
  })
  return () => off(animalsRef)
}

export async function addAnimalToDb(animal: FirebaseAnimal) {
  const animalRef = ref(database, `animals/${animal.tagId}`)
  await set(animalRef, {
    ...animal,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })
}

export async function updateAnimalInDb(key: string, updates: Partial<FirebaseAnimal>) {
  const animalRef = ref(database, `animals/${key}`)
  await update(animalRef, { ...updates, updatedAt: new Date().toISOString() })
}

// ── CAMERAS ────────────────────────────────────────────────────────────────

export function watchCameras(
  callback: (cameras: (FirebaseCamera & { key: string })[]) => void
) {
  const camerasRef = ref(database, "cameras")
  onValue(camerasRef, (snapshot) => {
    const data = snapshot.val()
    if (data) {
      const list = Object.entries(data).map(([key, value]) => ({
        ...(value as FirebaseCamera),
        key,
      }))
      callback(list)
    } else {
      callback([])
    }
  })
  return () => off(camerasRef)
}

export async function addCameraToDb(camera: Omit<FirebaseCamera, "id">) {
  const camerasRef = ref(database, "cameras")
  const snapshot = await get(camerasRef)
  const existing = snapshot.val() || {}
  const ids = Object.values(existing).map((c: any) => Number(c.id) || 0)
  const newId = Math.max(0, ...ids) + 1
  const newCameraRef = ref(database, `cameras/${newId}`)
  await set(newCameraRef, {
    ...camera,
    id: newId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })
}

export async function updateCameraInDb(key: string, updates: Partial<FirebaseCamera>) {
  const cameraRef = ref(database, `cameras/${key}`)
  await update(cameraRef, { ...updates, updatedAt: new Date().toISOString() })
}

// ── ALERTS ─────────────────────────────────────────────────────────────────

export function watchAlerts(
  callback: (alerts: (FirebaseAlert & { key: string })[]) => void
) {
  const alertsRef = ref(database, "alerts")
  onValue(alertsRef, (snapshot) => {
    const data = snapshot.val()
    if (data) {
      const list = Object.entries(data).map(([key, value]) => ({
        ...(value as FirebaseAlert),
        key,
      }))
      callback(list)
    } else {
      callback([])
    }
  })
  return () => off(alertsRef)
}

export async function resolveAlertInDb(key: string) {
  const alertRef = ref(database, `alerts/${key}`)
  await update(alertRef, {
    status: "resolved",
    resolved: true,
    updatedAt: new Date().toISOString(),
  })
}

export async function addAlertToDb(alert: Omit<FirebaseAlert, "id">) {
  const alertsRef = ref(database, "alerts")
  const snapshot = await get(alertsRef)
  const existing = snapshot.val() || {}
  const ids = Object.values(existing).map((a: any) => Number(a.id) || 0)
  const newId = Math.max(0, ...ids) + 1
  const newAlertRef = ref(database, `alerts/${newId}`)
  await set(newAlertRef, {
    ...alert,
    id: newId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })
}

// ── IOT COLLAR TELEMETRY ──────────────────────────────────────────────────

export type FirebaseCollarTelemetry = {
  animalId: string
  animalName: string
  species: string
  heartRate: number
  bodyTemp: number
  stressLevel: number
  status: "Normal" | "High Stress/Threat" | "Critical"
  batteryLevel: number | string
  latitude: number
  longitude: number
  altitude?: number
  timestamp: string
}

export function watchCollarTelemetry(
  callback: (telemetry: Record<string, FirebaseCollarTelemetry>) => void
) {
  const telemetryRef = ref(database, "collar_telemetry")
  onValue(telemetryRef, (snapshot) => {
    const data = snapshot.val() || {}
    callback(data)
  })
  return () => off(telemetryRef)
}

export async function pushCollarTelemetry(telemetry: FirebaseCollarTelemetry) {
  const nodeRef = ref(database, `collar_telemetry/${telemetry.animalId}`)
  await set(nodeRef, {
    ...telemetry,
    updatedAt: new Date().toISOString(),
  })
}

