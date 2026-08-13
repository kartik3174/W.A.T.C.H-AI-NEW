"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export function BehavioralPatterns() {
  const [selectedAnimal, setSelectedAnimal] = useState<string>("EL-001")
  const { toast } = useToast()

  // Activity data by time of day for each animal
  const activityByTimeData = {
    "EL-001": [
      { timeOfDay: "Morning", activity: 60, movement: 3 },
      { timeOfDay: "Afternoon", activity: 20, movement: 1 },
      { timeOfDay: "Evening", activity: 50, movement: 5 },
      { timeOfDay: "Night", activity: 10, movement: 0.5 },
    ],
    "LI-002": [
      { timeOfDay: "Morning", activity: 70, movement: 1 },
      { timeOfDay: "Afternoon", activity: 10, movement: 0.5 },
      { timeOfDay: "Evening", activity: 80, movement: 3 },
      { timeOfDay: "Night", activity: 20, movement: 1 },
    ],
    "RH-003": [
      { timeOfDay: "Morning", activity: 40, movement: 2 },
      { timeOfDay: "Afternoon", activity: 10, movement: 1 },
      { timeOfDay: "Evening", activity: 50, movement: 4 },
      { timeOfDay: "Night", activity: 20, movement: 1 },
    ],
    "TI-004": [
      { timeOfDay: "Morning", activity: 30, movement: 2 },
      { timeOfDay: "Afternoon", activity: 10, movement: 1 },
      { timeOfDay: "Evening", activity: 60, movement: 5 },
      { timeOfDay: "Night", activity: 90, movement: 7 },
    ],
    "GO-005": [
      { timeOfDay: "Morning", activity: 50, movement: 0.8 },
      { timeOfDay: "Afternoon", activity: 60, movement: 1.2 },
      { timeOfDay: "Evening", activity: 40, movement: 0.5 },
      { timeOfDay: "Night", activity: 10, movement: 0.2 },
    ],
  }

  // Activity vs Rest data
  const activityRestData = {
    "EL-001": [
      { name: "Activity", value: 30 },
      { name: "Rest", value: 70 },
    ],
    "LI-002": [
      { name: "Activity", value: 20 },
      { name: "Rest", value: 80 },
    ],
    "RH-003": [
      { name: "Activity", value: 25 },
      { name: "Rest", value: 75 },
    ],
    "TI-004": [
      { name: "Activity", value: 40 },
      { name: "Rest", value: 60 },
    ],
    "GO-005": [
      { name: "Activity", value: 40 },
      { name: "Rest", value: 60 },
    ],
  }

  // Get data for the selected animal
  const timeData = activityByTimeData[selectedAnimal as keyof typeof activityByTimeData] || []
  const restData = activityRestData[selectedAnimal as keyof typeof activityRestData] || []

  // Animal names mapping
  const animalNames = {
    "EL-001": "Tembo 🐘 (Elephant)",
    "LI-002": "Simba 🦁 (Lion)",
    "RH-003": "Kifaru 🦏 (Rhino)",
    "TI-004": "Raja 🐅 (Tiger)",
    "GO-005": "Zuri 🦍 (Gorilla)",
  }

  const handleExport = () => {
    try {
      const timeData = activityByTimeData[selectedAnimal as keyof typeof activityByTimeData] || []
      const restData = activityRestData[selectedAnimal as keyof typeof activityRestData] || []
      const animalName = animalNames[selectedAnimal as keyof typeof animalNames]

      const csvContent = `Behavioral Pattern Report - ${animalName}
Generated: ${new Date().toLocaleString()}

Activity by Time of Day:
Time,Activity Level (%),Movement Range (km)
${timeData.map((row) => `${row.timeOfDay},${row.activity},${row.movement}`).join("\n")}

Activity vs Rest Distribution:
Category,Percentage (%)
${restData.map((row) => `${row.name},${row.value}`).join("\n")}
`

      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `behavioral-pattern-${selectedAnimal}-${Date.now()}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast({
        title: "Export Successful",
        description: "Behavioral pattern data has been exported",
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export behavioral data",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={selectedAnimal} onValueChange={setSelectedAnimal}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Animal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EL-001">Tembo (EL-001)</SelectItem>
              <SelectItem value="LI-002">Simba (LI-002)</SelectItem>
              <SelectItem value="RH-003">Kifaru (RH-003)</SelectItem>
              <SelectItem value="TI-004">Raja (TI-004)</SelectItem>
              <SelectItem value="GO-005">Zuri (GO-005)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleExport} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>

      <Tabs defaultValue="activity">
        <TabsList className="w-full">
          <TabsTrigger value="activity">Activity Pattern</TabsTrigger>
          <TabsTrigger value="movement">Movement Range</TabsTrigger>
          <TabsTrigger value="rest">Activity vs Rest</TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity Pattern by Time of Day</CardTitle>
              <CardDescription>
                {animalNames[selectedAnimal as keyof typeof animalNames] || "Selected Animal"}'s activity levels
                throughout the day
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timeOfDay" />
                    <YAxis label={{ value: "Activity Level (%)", angle: -90, position: "insideLeft" }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="activity" name="Activity Level" stroke="#10b981" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="text-sm text-muted-foreground mt-4">
                {selectedAnimal === "EL-001" &&
                  "Tembo shows a bimodal activity pattern with peaks in the morning (60%) and evening (50%), avoiding the heat of midday."}
                {selectedAnimal === "LI-002" &&
                  "Simba displays classic lion behavior with peak activity in the evening (80%) and morning (70%) coinciding with prime hunting times."}
                {selectedAnimal === "RH-003" &&
                  "Kifaru shows a pattern typical for rhinos with highest activity in the evening (50%) and morning (40%)."}
                {selectedAnimal === "TI-004" &&
                  "Raja exhibits strong nocturnal behavior with 90% activity at night, typical for tigers."}
                {selectedAnimal === "GO-005" &&
                  "Zuri shows a diurnal pattern with peak activity in the afternoon (60%), typical for gorillas who feed throughout the day."}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movement" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Movement Range by Time of Day</CardTitle>
              <CardDescription>Distance traveled during different periods of the day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timeOfDay" />
                    <YAxis label={{ value: "Movement Range (km)", angle: -90, position: "insideLeft" }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="movement" name="Movement Range" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="text-sm text-muted-foreground mt-4">
                {selectedAnimal === "EL-001" &&
                  "Tembo covers the most ground in the evening (5 km), likely when traveling to water sources."}
                {selectedAnimal === "LI-002" &&
                  "Simba's movement peaks in the evening (3 km) when patrolling territory and hunting."}
                {selectedAnimal === "RH-003" && "Kifaru moves most in the evening (4 km) when visiting water sources."}
                {selectedAnimal === "TI-004" &&
                  "Raja covers significant territory at night (7 km), reflecting hunting behavior."}
                {selectedAnimal === "GO-005" &&
                  "Zuri has limited movement range, peaking at 1.2 km in the afternoon during feeding."}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rest" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity vs. Rest Distribution</CardTitle>
              <CardDescription>Percentage of time spent active versus resting</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={restData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: "Percentage (%)", angle: -90, position: "insideLeft" }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Percentage" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="text-sm text-muted-foreground mt-4">
                {selectedAnimal === "EL-001" &&
                  "Tembo spends 70% of time resting and 30% in active behaviors including feeding, traveling, and social interactions."}
                {selectedAnimal === "LI-002" &&
                  "Simba spends 80% of time resting, typical for big cats who conserve energy between hunts."}
                {selectedAnimal === "RH-003" &&
                  "Kifaru rests for 75% of the time, with 25% spent in active behaviors like feeding and traveling."}
                {selectedAnimal === "TI-004" &&
                  "Raja is more active than other big cats, with 40% activity and 60% rest."}
                {selectedAnimal === "GO-005" &&
                  "Zuri spends 40% of time in active behaviors, including feeding and social interactions."}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>AI Behavioral Analysis</CardTitle>
          <CardDescription>AI-generated insights based on behavioral patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {selectedAnimal === "EL-001" && (
              <p>
                Tembo's activity pattern follows the typical bimodal distribution expected for elephants, with peaks in
                the morning and evening. This pattern helps elephants avoid the heat of midday and optimize feeding
                during cooler periods. The 5 km movement range in the evening suggests regular travel to water sources,
                which is essential for elephants who need to drink daily. The 70% rest time is normal and includes
                standing sleep, dust bathing, and social bonding behaviors. Overall, Tembo's behavioral patterns
                indicate a healthy, well-adjusted elephant with normal activity cycles.
              </p>
            )}
            {selectedAnimal === "LI-002" && (
              <p>
                Simba exhibits classic lion behavior with crepuscular activity peaks (dawn and dusk). The 80% rest time
                is typical for lions, who are energy-conserving predators. His evening movement peak of 3 km coincides
                with prime hunting time, when prey visibility is reduced but still sufficient for stalking. The morning
                activity likely represents territorial patrolling and social interactions within the pride. The minimal
                afternoon activity (10%) reflects the species' adaptation to avoid heat stress. These patterns indicate
                Simba is displaying healthy, species-appropriate behavior.
              </p>
            )}
            {selectedAnimal === "RH-003" && (
              <p>
                Kifaru's activity pattern shows the typical bimodal distribution for rhinos, with peaks in the morning
                and evening. The 4 km movement in the evening is consistent with travel to water sources and foraging
                areas. The 75% rest time is normal for rhinos, who need to regulate body temperature by seeking shade
                during midday. The minimal afternoon activity (10%) is a thermoregulatory adaptation. Recent tracking
                data shows a slight decrease in morning activity compared to historical patterns, which may warrant
                monitoring for potential health concerns.
              </p>
            )}
            {selectedAnimal === "TI-004" && (
              <p>
                Raja displays strong nocturnal behavior with 90% activity at night, which is characteristic of tigers.
                The extensive movement range at night (7 km) reflects hunting behavior and territorial patrolling. With
                40% overall activity, Raja is more active than many other big cats, which could indicate either
                excellent health or potential hunting challenges requiring more effort. The secondary activity peak in
                the evening (60%) suggests a transitional period as Raja prepares for nighttime hunting. These patterns
                are consistent with a solitary, territorial predator in good condition.
              </p>
            )}
            {selectedAnimal === "GO-005" && (
              <p>
                Zuri exhibits the diurnal pattern typical for gorillas, with peak activity during daylight hours,
                especially in the afternoon (60%). The limited movement range (max 1.2 km) reflects the species'
                tendency to stay within a small, resource-rich area. The 40% activity includes feeding, social grooming,
                and play behaviors essential for troop cohesion. The afternoon activity peak coincides with the species'
                second major feeding period of the day. Recent data shows a concerning 15% decrease in overall activity
                compared to last month, which correlates with observed health issues and requires continued monitoring.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
