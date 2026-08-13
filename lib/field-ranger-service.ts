/**
 * Field Ranger Service
 * Handles offline incident recording, GPS tracking, and data synchronization
 */

interface GPSCoordinates {
  latitude: number
  longitude: number
  accuracy?: number
  altitude?: number
  speed?: number
  heading?: number
  timestamp: number
}

interface OfflineIncident {
  id: string
  animalId?: string
  incidentType: string
  description: string
  coordinates: GPSCoordinates
  severity: "low" | "medium" | "high" | "critical"
  synced: boolean
  createdAt: number
  syncedAt?: number
}

interface RangerObservation {
  id: string
  animalId?: string
  type: string
  notes: string
  coordinates: GPSCoordinates
  confidence: number
  mediaUrls?: string[]
  synced: boolean
  createdAt: number
  syncedAt?: number
}

const DB_NAME = "FieldRangerDB"
const DB_VERSION = 1
const INCIDENTS_STORE = "incidents"
const GPS_TRACKS_STORE = "gps_tracks"
const OBSERVATIONS_STORE = "observations"

export class FieldRangerService {
  private db: IDBDatabase | null = null
  private gpsWatchId: number | null = null

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        if (!db.objectStoreNames.contains(INCIDENTS_STORE)) {
          db.createObjectStore(INCIDENTS_STORE, { keyPath: "id" })
            .createIndex("synced", "synced", { unique: false })
            .createIndex("createdAt", "createdAt", { unique: false })
        }

        if (!db.objectStoreNames.contains(GPS_TRACKS_STORE)) {
          db.createObjectStore(GPS_TRACKS_STORE, { keyPath: "id", autoIncrement: true })
            .createIndex("timestamp", "timestamp", { unique: false })
        }

        if (!db.objectStoreNames.contains(OBSERVATIONS_STORE)) {
          db.createObjectStore(OBSERVATIONS_STORE, { keyPath: "id" })
            .createIndex("synced", "synced", { unique: false })
            .createIndex("createdAt", "createdAt", { unique: false })
        }
      }
    })
  }

  /**
   * Start tracking GPS location
   */
  startGPSTracking(interval: number = 30000): void {
    if (!navigator.geolocation) {
      console.error("[v0] Geolocation not supported")
      return
    }

    this.gpsWatchId = navigator.geolocation.watchPosition(
      (position) => {
        const coords: GPSCoordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy || undefined,
          altitude: position.coords.altitude || undefined,
          speed: position.coords.speed || undefined,
          heading: position.coords.heading || undefined,
          timestamp: position.timestamp,
        }

        this.saveGPSTrack(coords)
      },
      (error) => {
        console.error("[v0] GPS tracking error:", error)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )
  }

  /**
   * Stop GPS tracking
   */
  stopGPSTracking(): void {
    if (this.gpsWatchId !== null) {
      navigator.geolocation.clearWatch(this.gpsWatchId)
      this.gpsWatchId = null
    }
  }

  /**
   * Save GPS track to IndexedDB
   */
  private async saveGPSTrack(coords: GPSCoordinates): Promise<void> {
    if (!this.db) {
      console.error("[v0] Database not initialized")
      return
    }

    const tx = this.db.transaction([GPS_TRACKS_STORE], "readwrite")
    const store = tx.objectStore(GPS_TRACKS_STORE)
    store.add(coords)
  }

  /**
   * Create incident report (works offline)
   */
  async createIncident(
    incidentType: string,
    description: string,
    severity: "low" | "medium" | "high" | "critical",
    coordinates?: GPSCoordinates,
    animalId?: string
  ): Promise<OfflineIncident> {
    if (!this.db) {
      throw new Error("Database not initialized")
    }

    // Get current location if not provided
    let coords = coordinates
    if (!coords) {
      coords = await this.getCurrentLocation()
    }

    const incident: OfflineIncident = {
      id: Math.random().toString(36).substr(2, 9),
      animalId,
      incidentType,
      description,
      coordinates: coords,
      severity,
      synced: false,
      createdAt: Date.now(),
    }

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction([INCIDENTS_STORE], "readwrite")
      const store = tx.objectStore(INCIDENTS_STORE)
      const request = store.add(incident)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(incident)
    })
  }

  /**
   * Create observation record (works offline)
   */
  async createObservation(
    type: string,
    notes: string,
    confidence: number,
    coordinates?: GPSCoordinates,
    animalId?: string,
    mediaUrls?: string[]
  ): Promise<RangerObservation> {
    if (!this.db) {
      throw new Error("Database not initialized")
    }

    let coords = coordinates
    if (!coords) {
      coords = await this.getCurrentLocation()
    }

    const observation: RangerObservation = {
      id: Math.random().toString(36).substr(2, 9),
      animalId,
      type,
      notes,
      coordinates: coords,
      confidence,
      mediaUrls,
      synced: false,
      createdAt: Date.now(),
    }

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction([OBSERVATIONS_STORE], "readwrite")
      const store = tx.objectStore(OBSERVATIONS_STORE)
      const request = store.add(observation)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(observation)
    })
  }

  /**
   * Get unsynchronized data
   */
  async getUnsyncedData(): Promise<{
    incidents: OfflineIncident[]
    observations: RangerObservation[]
  }> {
    if (!this.db) {
      throw new Error("Database not initialized")
    }

    const incidents = await this.getUnsyncedRecords<OfflineIncident>(INCIDENTS_STORE)
    const observations = await this.getUnsyncedRecords<RangerObservation>(OBSERVATIONS_STORE)

    return { incidents, observations }
  }

  /**
   * Mark record as synced
   */
  async markAsSynced(storeType: "incidents" | "observations", id: string): Promise<void> {
    if (!this.db) {
      throw new Error("Database not initialized")
    }

    const store = storeType === "incidents" ? INCIDENTS_STORE : OBSERVATIONS_STORE

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction([store], "readwrite")
      const objectStore = tx.objectStore(store)
      const getRequest = objectStore.get(id)

      getRequest.onsuccess = () => {
        const record = getRequest.result
        if (record) {
          record.synced = true
          record.syncedAt = Date.now()
          const updateRequest = objectStore.put(record)
          updateRequest.onsuccess = () => resolve()
          updateRequest.onerror = () => reject(updateRequest.error)
        }
      }
      getRequest.onerror = () => reject(getRequest.error)
    })
  }

  /**
   * Get GPS tracks since timestamp
   */
  async getGPSTracksSince(timestamp: number): Promise<GPSCoordinates[]> {
    if (!this.db) {
      throw new Error("Database not initialized")
    }

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction([GPS_TRACKS_STORE], "readonly")
      const store = tx.objectStore(GPS_TRACKS_STORE)
      const index = store.index("timestamp")
      const range = IDBKeyRange.lowerBound(timestamp)
      const request = index.getAll(range)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  /**
   * Clear old GPS tracks
   */
  async clearOldGPSTracks(daysOld: number = 30): Promise<void> {
    if (!this.db) {
      throw new Error("Database not initialized")
    }

    const cutoffTime = Date.now() - daysOld * 24 * 60 * 60 * 1000

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction([GPS_TRACKS_STORE], "readwrite")
      const store = tx.objectStore(GPS_TRACKS_STORE)
      const index = store.index("timestamp")
      const range = IDBKeyRange.upperBound(cutoffTime)
      const request = index.openCursor(range)

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result
        if (cursor) {
          cursor.delete()
          cursor.continue()
        } else {
          resolve()
        }
      }
      request.onerror = () => reject(request.error)
    })
  }

  /**
   * Get current location
   */
  private getCurrentLocation(): Promise<GPSCoordinates> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation not supported"))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy || undefined,
            altitude: position.coords.altitude || undefined,
            speed: position.coords.speed || undefined,
            heading: position.coords.heading || undefined,
            timestamp: position.timestamp,
          })
        },
        (error) => reject(error)
      )
    })
  }

  /**
   * Helper: Get unsynced records from store
   */
  private getUnsyncedRecords<T extends { synced: boolean }>(
    storeName: string
  ): Promise<T[]> {
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction([storeName], "readonly")
      const store = tx.objectStore(storeName)
      const index = store.index("synced")
      const request = index.getAll(false)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }
}

export const fieldRangerService = new FieldRangerService()
