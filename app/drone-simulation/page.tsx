'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertTriangle, Battery, Radio, Activity, Zap, TrendingUp, Wind, Eye } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface DroneMetrics {
  id: string
  name: string
  status: 'active' | 'idle' | 'charging' | 'offline'
  battery: number
  altitude: number
  speed: number
  temperature: number
  flightTime: number
  targetFound: boolean
}

interface SimulationData {
  timestamp: number
  drones: DroneMetrics[]
  totalArea: number
  targetsDetected: number
  efficiency: number
}

export default function DroneSimulationPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [simulationData, setSimulationData] = useState<SimulationData>({
    timestamp: 0,
    drones: [
      {
        id: 'drone-1',
        name: 'Alpha-1',
        status: 'active',
        battery: 85,
        altitude: 150,
        speed: 25,
        temperature: 42,
        flightTime: 18,
        targetFound: false,
      },
      {
        id: 'drone-2',
        name: 'Beta-2',
        status: 'active',
        battery: 72,
        altitude: 180,
        speed: 22,
        temperature: 38,
        flightTime: 24,
        targetFound: true,
      },
      {
        id: 'drone-3',
        name: 'Gamma-3',
        status: 'charging',
        battery: 45,
        altitude: 0,
        speed: 0,
        temperature: 35,
        flightTime: 8,
        targetFound: false,
      },
    ],
    totalArea: 2400,
    targetsDetected: 3,
    efficiency: 92,
  })

  const [telemetryHistory, setTelemetryHistory] = useState<any[]>([])

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setSimulationData(prev => {
        const updated = {
          ...prev,
          timestamp: prev.timestamp + 1,
          drones: prev.drones.map(drone => {
            if (drone.status === 'offline' || drone.status === 'charging') {
              return drone
            }

            // Simulate battery drain
            const batteryDrain = Math.random() * 0.8
            const newBattery = Math.max(0, drone.battery - batteryDrain)

            // Simulate movement
            const altitude = drone.altitude + (Math.random() - 0.5) * 20
            const speed = Math.max(0, Math.min(40, drone.speed + (Math.random() - 0.5) * 5))

            // Status based on battery
            let status: DroneMetrics['status'] = drone.status
            if (newBattery < 20) {
              status = 'idle'
            }

            return {
              ...drone,
              battery: parseFloat(newBattery.toFixed(1)),
              altitude: Math.max(0, parseFloat(altitude.toFixed(1))),
              speed: parseFloat(speed.toFixed(1)),
              temperature: 35 + Math.random() * 15,
              flightTime: drone.flightTime + 1,
              targetFound: Math.random() > 0.85,
              status,
            }
          }),
          totalArea: prev.totalArea + Math.random() * 50,
          targetsDetected: prev.targetsDetected + (Math.random() > 0.92 ? 1 : 0),
          efficiency: Math.max(70, Math.min(99, prev.efficiency + (Math.random() - 0.5) * 2)),
        }

        // Update telemetry history
        setTelemetryHistory(hist => [
          ...hist.slice(-29),
          {
            time: updated.timestamp,
            avgBattery: updated.drones.reduce((a, b) => a + b.battery, 0) / updated.drones.length,
            avgAltitude: updated.drones
              .filter(d => d.status !== 'offline')
              .reduce((a, b) => a + b.altitude, 0) / updated.drones.filter(d => d.status !== 'offline').length,
            avgSpeed: updated.drones
              .filter(d => d.status !== 'offline')
              .reduce((a, b) => a + b.speed, 0) / updated.drones.filter(d => d.status !== 'offline').length,
          },
        ])

        return updated
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [isRunning])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-500 border-green-500'
      case 'idle':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500'
      case 'charging':
        return 'bg-blue-500/20 text-blue-500 border-blue-500'
      default:
        return 'bg-red-500/20 text-red-500 border-red-500'
    }
  }

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  const getThreatLevel = () => {
    const avgBattery = simulationData.drones.reduce((a, b) => a + b.battery, 0) / simulationData.drones.length
    if (avgBattery < 20) return { level: 'Critical', color: 'text-red-500' }
    if (avgBattery < 40) return { level: 'High', color: 'text-orange-500' }
    if (avgBattery < 60) return { level: 'Medium', color: 'text-yellow-500' }
    return { level: 'Low', color: 'text-green-500' }
  }

  const threat = getThreatLevel()

  return (
    <div className="min-h-screen bg-background text-foreground p-6 ml-64">
      <div className="space-y-6 max-w-7xl">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-primary">Autonomous Drone Simulation</h1>
            <Button
              onClick={() => setIsRunning(!isRunning)}
              className={`${isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/90'}`}
            >
              {isRunning ? 'Stop Simulation' : 'Start Simulation'}
            </Button>
          </div>
          <p className="text-muted-foreground">
            Real-time autonomous drone fleet management and monitoring system
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-primary/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Eye className="h-4 w-4 text-secondary" />
                Total Area Scanned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{simulationData.totalArea.toFixed(0)}</div>
              <p className="text-xs text-muted-foreground mt-1">km²</p>
            </CardContent>
          </Card>

          <Card className="border-secondary/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-secondary" />
                Targets Detected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-secondary">{simulationData.targetsDetected}</div>
              <p className="text-xs text-muted-foreground mt-1">Active</p>
            </CardContent>
          </Card>

          <Card className="border-green-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                Efficiency Rating
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">{simulationData.efficiency.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground mt-1">Fleet Wide</p>
            </CardContent>
          </Card>

          <Card className={`border-${threat.color.split('-')[1]}-500/30`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Battery className="h-4 w-4" />
                Threat Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${threat.color}`}>{threat.level}</div>
              <p className="text-xs text-muted-foreground mt-1">Fleet Status</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="fleet" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="fleet">Fleet Status</TabsTrigger>
            <TabsTrigger value="telemetry">Telemetry Data</TabsTrigger>
            <TabsTrigger value="logs">System Logs</TabsTrigger>
          </TabsList>

          {/* Fleet Status Tab */}
          <TabsContent value="fleet" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Drone Fleet Overview</CardTitle>
                <CardDescription>Real-time status of autonomous drone units</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {simulationData.drones.map(drone => (
                    <div
                      key={drone.id}
                      className="p-4 border border-card rounded-lg bg-card/50 hover:bg-card/70 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="space-y-1">
                          <h3 className="text-lg font-semibold text-primary">{drone.name}</h3>
                          <p className="text-sm text-muted-foreground">ID: {drone.id}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(drone.status)} variant="outline">
                            {getStatusLabel(drone.status)}
                          </Badge>
                          {drone.targetFound && <Badge className="bg-secondary text-secondary-foreground">Target Found</Badge>}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Battery className="h-4 w-4 text-primary" />
                            <span className="text-sm text-muted-foreground">Battery</span>
                          </div>
                          <p className="text-xl font-semibold text-primary">{drone.battery.toFixed(1)}%</p>
                          <div className="w-full bg-card rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{ width: `${drone.battery}%` }}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Wind className="h-4 w-4 text-secondary" />
                            <span className="text-sm text-muted-foreground">Altitude</span>
                          </div>
                          <p className="text-xl font-semibold text-secondary">{drone.altitude.toFixed(0)}</p>
                          <p className="text-xs text-muted-foreground">meters</p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-muted-foreground">Speed</span>
                          </div>
                          <p className="text-xl font-semibold text-green-500">{drone.speed.toFixed(1)}</p>
                          <p className="text-xs text-muted-foreground">km/h</p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Radio className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm text-muted-foreground">Flight Time</span>
                          </div>
                          <p className="text-xl font-semibold text-yellow-500">{drone.flightTime}</p>
                          <p className="text-xs text-muted-foreground">minutes</p>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-border/50">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Temperature: {drone.temperature.toFixed(1)}°C</span>
                          <span className={`text-sm font-medium ${drone.temperature > 50 ? 'text-orange-500' : 'text-green-500'}`}>
                            {drone.temperature > 50 ? 'High' : 'Normal'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Telemetry Data Tab */}
          <TabsContent value="telemetry" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Fleet Telemetry</CardTitle>
                <CardDescription>Historical data and performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {telemetryHistory.length > 0 && (
                  <>
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground mb-4">Battery Levels</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={telemetryHistory}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(34, 255, 136, 0.1)" />
                          <XAxis
                            dataKey="time"
                            stroke="rgba(232, 245, 236, 0.5)"
                            style={{ fontSize: '12px' }}
                          />
                          <YAxis stroke="rgba(232, 245, 236, 0.5)" style={{ fontSize: '12px' }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'rgba(11, 31, 23, 0.95)',
                              border: '1px solid rgba(34, 255, 136, 0.3)',
                              borderRadius: '8px',
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="avgBattery"
                            stroke="#22FF88"
                            dot={false}
                            isAnimationActive={false}
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground mb-4">Flight Metrics</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={telemetryHistory}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(34, 255, 136, 0.1)" />
                          <XAxis
                            dataKey="time"
                            stroke="rgba(232, 245, 236, 0.5)"
                            style={{ fontSize: '12px' }}
                          />
                          <YAxis stroke="rgba(232, 245, 236, 0.5)" style={{ fontSize: '12px' }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'rgba(11, 31, 23, 0.95)',
                              border: '1px solid rgba(34, 255, 136, 0.3)',
                              borderRadius: '8px',
                            }}
                          />
                          <Legend />
                          <Bar dataKey="avgAltitude" fill="#00E5A0" />
                          <Bar dataKey="avgSpeed" fill="#22FF88" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </>
                )}

                {telemetryHistory.length === 0 && (
                  <div className="text-center py-12">
                    <Zap className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Start the simulation to collect telemetry data
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Logs Tab */}
          <TabsContent value="logs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Event Log</CardTitle>
                <CardDescription>Real-time system events and alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {telemetryHistory.length > 0 ? (
                    telemetryHistory.slice().reverse().map((entry, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-card/50 rounded border border-border/50">
                        <Activity className="h-4 w-4 text-primary flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground">
                            Telemetry Update #{entry.time}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Avg Battery: {entry.avgBattery.toFixed(1)}% | Avg Speed: {entry.avgSpeed.toFixed(1)} km/h
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No events yet. Start the simulation to generate logs.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
