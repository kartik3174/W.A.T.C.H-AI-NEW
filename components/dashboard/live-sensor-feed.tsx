"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Activity,
  Heart,
  Thermometer,
  AlertTriangle,
  Shield,
  Radio,
  Battery,
  Signal,
  MapPin,
  Pause,
  Play,
  RefreshCw,
} from "lucide-react"

interface AnimalReading {
  animal_id: string
  name: string
  species: string
  location: string
  timestamp: string
  heart_rate: number
  body_temp: number
  stress_level: number
  status: string
  battery_level: string
  signal_strength: string
  gps_accuracy: string
}

interface SensorPayload {
  timestamp: string
  total_animals: number
  alerts: number
  readings: AnimalReading[]
  source: string
}

const POLL_INTERVAL = 2000

export function LiveSensorFeed() {
  const [data, setData] = useState<SensorPayload | null>(null)
  const [isPolling, setIsPolling] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<string>("")
  const [pollCount, setPollCount] = useState(0)
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "connecting" | "error">("connecting")
  const [alertHistory, setAlertHistory] = useState<Array<{ time: string; animal: string; status: string }>>([])
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const fetchSensorData = useCallback(async () => {
    try {
      const res = await fetch("/api/sensor-data", { cache: "no-store" })
      if (!res.ok) throw new Error("Failed to fetch")
      const payload: SensorPayload = await res.json()

      setData(payload)
      setConnectionStatus("connected")
      setLastUpdate(new Date().toLocaleTimeString())
      setPollCount((prev) => prev + 1)

      // Track alert history (keep last 10)
      const newAlerts = payload.readings
        .filter((r) => r.status !== "Normal")
        .map((r) => ({
          time: new Date().toLocaleTimeString(),
          animal: r.name,
          status: r.status,
        }))
      if (newAlerts.length > 0) {
        setAlertHistory((prev) => [...newAlerts, ...prev].slice(0, 10))
      }
    } catch {
      setConnectionStatus("error")
    }
  }, [])

  useEffect(() => {
    // Initial fetch
    fetchSensorData()

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [fetchSensorData])

  useEffect(() => {
    if (isPolling) {
      intervalRef.current = setInterval(fetchSensorData, POLL_INTERVAL)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPolling, fetchSensorData])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Critical":
        return "bg-red-600 text-white"
      case "High Stress/Threat":
        return "bg-amber-500 text-white"
      case "Normal":
        return "bg-emerald-600 text-white"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusBorder = (status: string) => {
    switch (status) {
      case "Critical":
        return "border-l-red-500"
      case "High Stress/Threat":
        return "border-l-amber-500"
      case "Normal":
        return "border-l-emerald-500"
      default:
        return "border-l-muted"
    }
  }

  const getStressColor = (level: number) => {
    if (level >= 75) return "text-red-500"
    if (level >= 50) return "text-amber-500"
    if (level >= 30) return "text-yellow-500"
    return "text-emerald-500"
  }

  const getStressBarColor = (level: number) => {
    if (level >= 75) return "[&>div]:bg-red-500"
    if (level >= 50) return "[&>div]:bg-amber-500"
    if (level >= 30) return "[&>div]:bg-yellow-500"
    return "[&>div]:bg-emerald-500"
  }

  return (
    <div className="space-y-6">
      {/* Connection Status Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Radio className="h-4 w-4 text-primary" />
                <span className="font-semibold text-sm text-foreground">Live Sensor Feed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className={`relative flex h-2.5 w-2.5 ${connectionStatus === "connected" ? "" : "opacity-50"}`}
                >
                  {connectionStatus === "connected" && isPolling && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  )}
                  <span
                    className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                      connectionStatus === "connected"
                        ? "bg-emerald-500"
                        : connectionStatus === "connecting"
                          ? "bg-amber-500"
                          : "bg-red-500"
                    }`}
                  />
                </span>
                <span className="text-xs text-muted-foreground capitalize">{connectionStatus}</span>
              </div>
              {data?.source && (
                <Badge variant="outline" className="text-xs">
                  {data.source === "python-simulation" ? "Python Sim" : "JS Sim"}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-xs text-muted-foreground">
                Polls: {pollCount} | Last: {lastUpdate || "---"}
              </span>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPolling(!isPolling)}
                  className="h-7 px-2 bg-transparent"
                >
                  {isPolling ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                  <span className="ml-1 text-xs">{isPolling ? "Pause" : "Resume"}</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchSensorData}
                  className="h-7 px-2 bg-transparent"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      {data && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Activity className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-muted-foreground">Animals Tracked</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{data.total_animals}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span className="text-xs font-medium text-muted-foreground">Active Alerts</span>
              </div>
              <p className={`text-2xl font-bold ${data.alerts > 0 ? "text-amber-500" : "text-emerald-500"}`}>
                {data.alerts}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="h-4 w-4 text-emerald-500" />
                <span className="text-xs font-medium text-muted-foreground">Normal Status</span>
              </div>
              <p className="text-2xl font-bold text-emerald-500">
                {data.readings.filter((r) => r.status === "Normal").length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Heart className="h-4 w-4 text-red-500" />
                <span className="text-xs font-medium text-muted-foreground">Avg Heart Rate</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {Math.round(data.readings.reduce((sum, r) => sum + r.heart_rate, 0) / data.readings.length)}
                <span className="text-sm font-normal text-muted-foreground ml-1">bpm</span>
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Animal Readings Grid */}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {data.readings.map((reading) => (
            <Card
              key={reading.animal_id}
              className={`border-l-4 ${getStatusBorder(reading.status)} transition-all duration-300`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{reading.name}</CardTitle>
                    <CardDescription className="text-xs">
                      {reading.animal_id} - {reading.species}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(reading.status)}>{reading.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Vitals */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <Heart className="h-3.5 w-3.5 text-red-500 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Heart Rate</p>
                      <p className="text-sm font-semibold font-mono text-foreground">{reading.heart_rate} bpm</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-3.5 w-3.5 text-orange-500 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Body Temp</p>
                      <p className="text-sm font-semibold font-mono text-foreground">{reading.body_temp}°C</p>
                    </div>
                  </div>
                </div>

                {/* Stress Level Bar */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">Stress Level</span>
                    <span className={`text-xs font-semibold font-mono ${getStressColor(reading.stress_level)}`}>
                      {reading.stress_level}%
                    </span>
                  </div>
                  <Progress
                    value={reading.stress_level}
                    className={`h-1.5 ${getStressBarColor(reading.stress_level)}`}
                  />
                </div>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate max-w-[120px]">{reading.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      <Battery className="h-3 w-3" />
                      <span>{reading.battery_level}</span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <Signal className="h-3 w-3" />
                      <span>{reading.signal_strength}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Alert History */}
      {alertHistory.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Recent Alert History</CardTitle>
            <CardDescription>Last {alertHistory.length} sensor alerts detected</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {alertHistory.map((alert, i) => (
                <div
                  key={`${alert.time}-${alert.animal}-${i}`}
                  className="flex items-center justify-between text-sm p-2 rounded-md bg-muted/50"
                >
                  <div className="flex items-center gap-2">
                    <AlertTriangle
                      className={`h-3.5 w-3.5 ${alert.status === "Critical" ? "text-red-500" : "text-amber-500"}`}
                    />
                    <span className="font-medium text-foreground">{alert.animal}</span>
                    <Badge variant="outline" className="text-xs">
                      {alert.status}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">{alert.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {!data && connectionStatus === "connecting" && (
        <Card>
          <CardContent className="p-12 flex flex-col items-center gap-3">
            <RefreshCw className="h-8 w-8 text-muted-foreground animate-spin" />
            <p className="text-sm text-muted-foreground">Connecting to sensor network...</p>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {connectionStatus === "error" && !data && (
        <Card>
          <CardContent className="p-12 flex flex-col items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-destructive" />
            <p className="text-sm text-destructive">Failed to connect to sensor network</p>
            <Button variant="outline" size="sm" onClick={fetchSensorData} className="bg-transparent">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
