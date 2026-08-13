"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Activity time data
const activityTimeData = [
  { timeOfDay: "Morning", tembo: 60, simba: 70, raja: 30, kifaru: 40, zuri: 50 },
  { timeOfDay: "Afternoon", tembo: 20, simba: 10, raja: 10, kifaru: 10, zuri: 60 },
  { timeOfDay: "Evening", tembo: 50, simba: 80, raja: 60, kifaru: 50, zuri: 40 },
  { timeOfDay: "Night", tembo: 10, simba: 20, raja: 90, kifaru: 20, zuri: 10 },
]

interface BehavioralTrendsChartProps {
  animals?: any[]
}

export function BehavioralTrendsChart({ animals }: BehavioralTrendsChartProps) {
  const times = ["Morning", "Afternoon", "Evening", "Night"]

  const chartData = times.map((time) => {
    const dataPoint: any = { timeOfDay: time }
    if (animals) {
      animals.forEach((animal) => {
        const timeData = animal.activityByTime.find((t: any) => t.timeOfDay === time)
        dataPoint[animal.name.toLowerCase()] = timeData ? timeData.activity : 0
      })
    }
    return dataPoint
  })

  const animalColors = ["#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6", "#ec4899", "#06b6d4"]

  return (
    <div className="space-y-4">
      <Tabs defaultValue="activity">
        <TabsList className="w-full">
          <TabsTrigger value="activity">Activity Pattern</TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="pt-4">
          <div className="w-full h-[300px] flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timeOfDay" />
                <YAxis />
                <Tooltip />
                <Legend />
                {animals?.map((animal, index) => (
                  <Line
                    key={animal.id}
                    type="monotone"
                    dataKey={animal.name.toLowerCase()}
                    name={animal.name}
                    stroke={animalColors[index % animalColors.length]}
                    activeDot={{ r: 8 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-sm text-muted-foreground mt-2">
            Activity patterns throughout the day for each monitored animal. Note Raja's nocturnal behavior with peak
            activity at night.
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            {animals?.map((animal, index) => (
              <div key={animal.id} className="flex items-center gap-1">
                <span
                  className={`h-3 w-3 rounded-full`}
                  style={{ backgroundColor: animalColors[index % animalColors.length] }}
                ></span>{" "}
                {animal.name}
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="p-4 bg-muted/30 rounded-md border">
        <h3 className="font-medium mb-2">Animal Activity Insights</h3>
        <div className="space-y-2 text-sm">
          {(animals || []).map((animal, index) => (
            <div key={animal.id} className="flex items-start gap-2">
              <span
                className={`h-2 w-2 rounded-full mt-1.5`}
                style={{ backgroundColor: animalColors[index % animalColors.length] }}
              ></span>
              <span>
                <span className="font-medium">
                  {animal.name} ({animal.species}):
                </span>
                <span className="text-muted-foreground">
                  {" "}
                  {animal.activityPattern} {animal.movementRange}
                </span>
              </span>
            </div>
          ))}
          {(!animals || animals.length === 0) && <p className="text-muted-foreground italic">No animals selected</p>}
        </div>
      </div>
    </div>
  )
}
