"use client"

import type * as React from "react"
import {
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

// Simple wrapper for ResponsiveContainer
export function ChartContainer({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  )
}

// Health Status Chart (Pie Chart)
export function HealthStatusChart() {
  const data = [
    { name: "Excellent", value: 35, color: "#10b981" },
    { name: "Good", value: 40, color: "#3b82f6" },
    { name: "Fair", value: 15, color: "#f59e0b" },
    { name: "Poor", value: 7, color: "#ef4444" },
    { name: "Critical", value: 3, color: "#7c3aed" },
  ]

  return (
    <ChartContainer className="h-[300px]">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          innerRadius={60}
          paddingAngle={2}
          dataKey="value"
          nameKey="name"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ChartContainer>
  )
}

// Heart Rate Chart
export function HeartRateChart({ data }: { data: any[] }) {
  return (
    <ChartContainer className="h-[300px]">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="animal" />
        <YAxis label={{ value: "Heart Rate (bpm)", angle: -90, position: "insideLeft" }} />
        <Tooltip />
        <Legend />
        <Bar dataKey="heartRate" name="Heart Rate" fill="#ef4444" />
      </BarChart>
    </ChartContainer>
  )
}

// Stress Level Chart
export function StressLevelChart({ data }: { data: any[] }) {
  return (
    <ChartContainer className="h-[300px]">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="animal" />
        <YAxis label={{ value: "Stress Level (%)", angle: -90, position: "insideLeft" }} />
        <Tooltip />
        <Legend />
        <Bar dataKey="stressLevel" name="Stress Level" fill="#f59e0b" />
      </BarChart>
    </ChartContainer>
  )
}

// Activity Pattern Chart
export function ActivityPatternChart({ data }: { data: any[] }) {
  return (
    <ChartContainer className="h-[300px]">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="timeOfDay" />
        <YAxis label={{ value: "Activity Level (%)", angle: -90, position: "insideLeft" }} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="tembo" name="Tembo" stroke="#10b981" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="simba" name="Simba" stroke="#f59e0b" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="raja" name="Raja" stroke="#ef4444" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="kifaru" name="Kifaru" stroke="#3b82f6" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="zuri" name="Zuri" stroke="#8b5cf6" activeDot={{ r: 8 }} />
      </LineChart>
    </ChartContainer>
  )
}

// Movement Range Chart
export function MovementRangeChart({ data }: { data: any[] }) {
  return (
    <ChartContainer className="h-[300px]">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="animal" />
        <YAxis label={{ value: "Average Movement Range (km)", angle: -90, position: "insideLeft" }} />
        <Tooltip />
        <Legend />
        <Bar dataKey="average" name="Average Movement Range" fill="#3b82f6" />
      </BarChart>
    </ChartContainer>
  )
}

// Activity vs Rest Chart
export function ActivityRestChart({ data }: { data: any[] }) {
  return (
    <ChartContainer className="h-[300px]">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="animal" />
        <YAxis label={{ value: "Percentage (%)", angle: -90, position: "insideLeft" }} />
        <Tooltip />
        <Legend />
        <Bar dataKey="activity" name="Activity" stackId="a" fill="#10b981" />
        <Bar dataKey="rest" name="Rest" stackId="a" fill="#6366f1" />
      </BarChart>
    </ChartContainer>
  )
}

// Activity Duration Chart
export function ActivityDurationChart({ data }: { data: any[] }) {
  return (
    <ChartContainer className="h-[300px]">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="activityType" />
        <YAxis label={{ value: "Duration (Hours)", angle: -90, position: "insideLeft" }} />
        <Tooltip />
        <Legend />
        <Bar dataKey="Tembo" name="Tembo" fill="#10b981" />
        <Bar dataKey="Simba" name="Simba" fill="#f59e0b" />
        <Bar dataKey="Raja" name="Raja" fill="#ef4444" />
        <Bar dataKey="Kifaru" name="Kifaru" fill="#3b82f6" />
        <Bar dataKey="Zuri" name="Zuri" fill="#8b5cf6" />
      </BarChart>
    </ChartContainer>
  )
}

// Activity Frequency Chart
export function ActivityFrequencyChart({ data }: { data: any[] }) {
  return (
    <ChartContainer className="h-[300px]">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="animal" />
        <YAxis label={{ value: "Frequency (per Day)", angle: -90, position: "insideLeft" }} />
        <Tooltip />
        <Legend />
        <Bar dataKey="frequency" name="Frequency" fill="#10b981" />
      </BarChart>
    </ChartContainer>
  )
}

// Health Trend Chart
export function HealthTrendChart({ data, dataKey }: { data: any[]; dataKey: string }) {
  return (
    <ChartContainer className="h-[300px]">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="Tembo" name="Tembo" stroke="#10b981" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="Simba" name="Simba" stroke="#f59e0b" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="Raja" name="Raja" stroke="#ef4444" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="Kifaru" name="Kifaru" stroke="#3b82f6" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="Zuri" name="Zuri" stroke="#8b5cf6" activeDot={{ r: 8 }} />
      </LineChart>
    </ChartContainer>
  )
}

// Animal Health Chart
export function AnimalHealthLineChart({ data, dataKey, color }: { data: any[]; dataKey: string; color: string }) {
  return (
    <ChartContainer className="h-[300px]">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey={dataKey} name={dataKey} stroke={color} activeDot={{ r: 8 }} />
        {dataKey === "heartRate" && (
          <Line
            type="monotone"
            dataKey="normalHeartRate"
            name="Normal Heart Rate"
            stroke={color}
            strokeDasharray="5 5"
            strokeOpacity={0.6}
          />
        )}
        {dataKey === "temperature" && (
          <Line
            type="monotone"
            dataKey="normalTemp"
            name="Normal Temperature"
            stroke={color}
            strokeDasharray="5 5"
            strokeOpacity={0.6}
          />
        )}
      </LineChart>
    </ChartContainer>
  )
}

export {
  AreaChart as ChartArea,
  BarChart as ChartBar,
  Bar as ChartBarSeries,
  CartesianGrid as ChartGrid,
  Tooltip as ChartTooltip,
  Tooltip as ChartTooltipContent,
  XAxis as ChartXAxis,
  YAxis as ChartYAxis,
  LineChart as ChartLineSeries,
  Legend as ChartLegend,
  Legend as ChartLegendContent,
  PieChart as ChartPie,
  Pie as ChartPieSeries,
  ChartContainer as Chart,
}
