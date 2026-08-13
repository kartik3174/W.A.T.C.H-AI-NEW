"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"

const data = [
  { name: "Elephant", value: 40 },
  { name: "Lion", value: 70 },
  { name: "Tiger", value: 80 },
  { name: "Rhino", value: 45 },
  { name: "Gorilla", value: 60 },
]

export function TestChart() {
  return (
    <div className="w-full h-[300px] border rounded-md p-4">
      <h2 className="text-lg font-medium mb-4">Test Chart</h2>
      <div className="w-full h-[250px] flex justify-center">
        <BarChart width={500} height={250} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#10b981" />
        </BarChart>
      </div>
    </div>
  )
}
