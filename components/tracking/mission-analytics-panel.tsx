"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Clock, Zap, Battery, AlertTriangle } from "lucide-react"
import { geofenceEventBus } from "@/app/shared-events/geofenceEventBus"

interface MissionMetrics {
  responseTime: number // milliseconds
  distanceTraveled: number // meters
  batteryUsed: number // percentage
  activeIncidents: number
  totalDeployments: number
}

export function MissionAnalyticsPanel() {
  const [metrics, setMetrics] = useState<MissionMetrics>({
    responseTime: 0,
    distanceTraveled: 0,
    batteryUsed: 0,
    activeIncidents: 0,
    totalDeployments: 0,
  })
  const [breachTimes, setBreachTimes] = useState<number[]>([])

  // Track breach detection and update metrics
  useEffect(() => {
    const unsubscribe = geofenceEventBus.onBreachDetected((breachEvent) => {
      const responseTime = 2400 // Simulated 2.4 second response time
      const breachTime = new Date(breachEvent.timestamp).getTime()
      
      setBreachTimes((prev) => [...prev.slice(-9), breachTime])
      
      setMetrics((prev) => ({
        responseTime,
        distanceTraveled: prev.distanceTraveled + 250 + Math.random() * 150,
        batteryUsed: Math.min(100, prev.batteryUsed + 5),
        activeIncidents: prev.activeIncidents + 1,
        totalDeployments: prev.totalDeployments + 1,
      }))
    })

    return () => unsubscribe()
  }, [])

  const getResponseColor = (time: number) => {
    if (time < 3000) return "text-green-400"
    if (time < 5000) return "text-yellow-400"
    return "text-red-400"
  }

  const getBatteryColor = (used: number) => {
    if (used < 30) return "bg-green-600"
    if (used < 70) return "bg-yellow-600"
    return "bg-red-600"
  }

  return (
    <Card className="bg-[#1C7ED6] border-2 border-[#FF7A00]">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-[#FF7A00]" />
          <div>
            <CardTitle className="text-[#EAEAEA]">Mission Analytics</CardTitle>
            <CardDescription className="text-[#EAEAEA]/80">Operational performance metrics</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Response Time */}
          <div className="bg-[#0B132B]/50 rounded-lg p-3 border border-[#FF7A00]/30">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-[#EAEAEA]/60">Response Time</p>
              <Clock className="h-4 w-4 text-[#FF7A00]" />
            </div>
            <p className={`text-2xl font-bold ${getResponseColor(metrics.responseTime)}`}>
              {(metrics.responseTime / 1000).toFixed(1)}s
            </p>
            <p className="text-xs text-[#EAEAEA]/50 mt-1">Avg deployment speed</p>
          </div>

          {/* Distance Traveled */}
          <div className="bg-[#0B132B]/50 rounded-lg p-3 border border-[#FF7A00]/30">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-[#EAEAEA]/60">Distance Traveled</p>
              <Zap className="h-4 w-4 text-[#FF7A00]" />
            </div>
            <p className="text-2xl font-bold text-blue-400">
              {(metrics.distanceTraveled / 1000).toFixed(1)} km
            </p>
            <p className="text-xs text-[#EAEAEA]/50 mt-1">Total mission distance</p>
          </div>

          {/* Battery Usage */}
          <div className="bg-[#0B132B]/50 rounded-lg p-3 border border-[#FF7A00]/30">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-[#EAEAEA]/60">Battery Used</p>
              <Battery className="h-4 w-4 text-[#FF7A00]" />
            </div>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-[#FF7A00]">{metrics.batteryUsed.toFixed(0)}%</p>
              <div className="flex-1 h-2 bg-[#0B132B] rounded-full overflow-hidden">
                <div
                  className={`h-full ${getBatteryColor(metrics.batteryUsed)} transition-all`}
                  style={{ width: `${Math.min(100, metrics.batteryUsed)}%` }}
                />
              </div>
            </div>
            <p className="text-xs text-[#EAEAEA]/50 mt-1">Fleet power status</p>
          </div>

          {/* Active Incidents */}
          <div className="bg-[#0B132B]/50 rounded-lg p-3 border border-[#FF7A00]/30">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-[#EAEAEA]/60">Active Incidents</p>
              <AlertTriangle className="h-4 w-4 text-[#FF7A00]" />
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-red-400">{metrics.activeIncidents}</p>
              <Badge variant="outline" className="text-xs text-[#EAEAEA]">
                {metrics.totalDeployments} total
              </Badge>
            </div>
            <p className="text-xs text-[#EAEAEA]/50 mt-1">Breaches detected</p>
          </div>
        </div>

        {/* Incident Timeline */}
        {breachTimes.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[#FF7A00]/30">
            <p className="text-sm text-[#EAEAEA]/80 mb-2">Recent Incidents</p>
            <div className="space-y-1">
              {breachTimes.slice(-5).reverse().map((time, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs text-[#EAEAEA]/70">
                  <span>Incident {breachTimes.length - idx}</span>
                  <span>{new Date(time).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
