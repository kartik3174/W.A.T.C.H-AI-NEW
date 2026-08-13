"use client"

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts"

const defaultData = [
  { name: "Excellent", value: 35, color: "#10b981" },
  { name: "Good", value: 40, color: "#3b82f6" },
  { name: "Fair", value: 15, color: "#f59e0b" },
  { name: "Poor", value: 7, color: "#ef4444" },
  { name: "Critical", value: 3, color: "#7c3aed" },
]

interface HealthStatusChartProps {
  animals?: any[]
}

export function HealthStatusChart({ animals }: HealthStatusChartProps) {
  const chartData = animals
    ? [
        { name: "Excellent", value: animals.filter((a) => a.status === "Excellent").length, color: "#10b981" },
        { name: "Good", value: animals.filter((a) => a.status === "Good").length, color: "#3b82f6" },
        { name: "Fair", value: animals.filter((a) => a.status === "Fair").length, color: "#f59e0b" },
        { name: "Poor", value: animals.filter((a) => a.status === "Poor").length, color: "#ef4444" },
        { name: "Critical", value: animals.filter((a) => a.status === "Critical").length, color: "#7c3aed" },
      ].filter((d) => d.value > 0)
    : defaultData

  return (
    <div className="w-full h-[300px] flex justify-center items-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
