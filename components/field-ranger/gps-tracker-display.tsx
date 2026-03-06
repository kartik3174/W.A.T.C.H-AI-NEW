"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { fieldRangerService } from "@/lib/field-ranger-service"
import { MapPin, Navigation, Activity, Zap } from "lucide-react"

interface GPSData {
  latitude: number
  longitude: number
  accuracy?: number
  altitude?: number
  speed?: number
  heading?: number
}

export const GPSTrackerDisplay = () => {
  const [gpsData, setGpsData] = useState<GPSData | null>(null)
  const [isTracking, setIsTracking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const startTracking = useCallback(async () => {
    try {
      setError(null)
      await fieldRangerService.initialize()
      fieldRangerService.startGPSTracking()
      setIsTracking(true)

      // Get initial location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setGpsData({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy || undefined,
              altitude: position.coords.altitude || undefined,
              speed: position.coords.speed || undefined,
              heading: position.coords.heading || undefined,
            })
            setLastUpdate(new Date())
          },
          (err) => {
            setError(`GPS Error: ${err.message}`)
          }
        )
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start tracking")
      setIsTracking(false)
    }
  }, [])

  const stopTracking = useCallback(() => {
    fieldRangerService.stopGPSTracking()
    setIsTracking(false)
  }, [])

  useEffect(() => {
    return () => {
      if (isTracking) {
        fieldRangerService.stopGPSTracking()
      }
    }
  }, [isTracking])

  const formatCoordinate = (value: number, decimals: number = 6): string => {
    return value.toFixed(decimals)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Navigation className="h-5 w-5" />
          GPS Tracker
          {isTracking && <Badge className="ml-auto">Active</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {gpsData ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-600">Latitude</p>
                <p className="font-mono text-lg">{formatCoordinate(gpsData.latitude)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">Longitude</p>
                <p className="font-mono text-lg">{formatCoordinate(gpsData.longitude)}</p>
              </div>
            </div>

            {gpsData.accuracy !== undefined && (
              <div className="space-y-1">
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Zap className="h-4 w-4" />
                  Accuracy
                </p>
                <p className="font-mono">{gpsData.accuracy.toFixed(2)} meters</p>
              </div>
            )}

            {gpsData.altitude !== undefined && (
              <div className="space-y-1">
                <p className="text-sm text-gray-600">Altitude</p>
                <p className="font-mono">{gpsData.altitude.toFixed(2)} meters</p>
              </div>
            )}

            {gpsData.speed !== undefined && gpsData.speed > 0 && (
              <div className="space-y-1">
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Activity className="h-4 w-4" />
                  Speed
                </p>
                <p className="font-mono">{(gpsData.speed * 3.6).toFixed(2)} km/h</p>
              </div>
            )}

            {lastUpdate && (
              <div className="text-xs text-gray-500">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </div>
            )}

            <div className="space-y-2">
              <a
                href={`https://maps.google.com/?q=${gpsData.latitude},${gpsData.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
              >
                <MapPin className="h-4 w-4" />
                View on Map
              </a>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-4">
            <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>GPS tracking not started</p>
          </div>
        )}

        <Button
          onClick={isTracking ? stopTracking : startTracking}
          className="w-full"
          variant={isTracking ? "destructive" : "default"}
        >
          {isTracking ? "Stop Tracking" : "Start GPS Tracking"}
        </Button>
      </CardContent>
    </Card>
  )
}
