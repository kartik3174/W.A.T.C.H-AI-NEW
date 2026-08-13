"use client"

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Detailed activity data for different animals based on the provided dataset
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
  "EL-006": [
    { timeOfDay: "Morning", activity: 60, movement: 3 },
    { timeOfDay: "Afternoon", activity: 20, movement: 1 },
    { timeOfDay: "Evening", activity: 50, movement: 5 },
    { timeOfDay: "Night", activity: 10, movement: 0.5 },
  ],
}

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
  "EL-006": [
    { name: "Activity", value: 30 },
    { name: "Rest", value: 70 },
  ],
}

type AnimalActivityChartProps = {
  animalId: string
}

export function AnimalActivityChart({ animalId }: AnimalActivityChartProps) {
  // Get data for the selected animal or use default data
  const timeData = activityByTimeData[animalId as keyof typeof activityByTimeData] || []
  const restData = activityRestData[animalId as keyof typeof activityRestData] || []

  // Calculate average movement range
  const avgMovement = timeData.reduce((sum, item) => sum + item.movement, 0) / timeData.length

  return (
    <div className="space-y-4">
      <Tabs defaultValue="daily">
        <TabsList className="w-full">
          <TabsTrigger value="daily">Daily Activity</TabsTrigger>
          <TabsTrigger value="movement">Movement Range</TabsTrigger>
          <TabsTrigger value="rest">Activity vs Rest</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="pt-4">
          <div className="w-full h-[300px] flex justify-center">
            <LineChart width={600} height={300} data={timeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timeOfDay" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="activity" name="Activity Level" stroke="#10b981" activeDot={{ r: 8 }} />
            </LineChart>
          </div>
          <div className="text-sm text-muted-foreground mt-2">
            {animalId === "EL-001" &&
              "Tembo is most active during morning hours, with a secondary peak in the evening."}
            {animalId === "LI-002" &&
              "Simba shows highest activity in the evening, with a secondary peak in the morning."}
            {animalId === "RH-003" && "Kifaru's activity peaks in the evening, with moderate activity in the morning."}
            {animalId === "TI-004" &&
              "Raja is strongly nocturnal, with 90% activity at night and a secondary peak in the evening."}
            {animalId === "GO-005" &&
              "Zuri is most active during the afternoon, with good activity in the morning as well."}
            {animalId === "EL-006" && "Jambo shows similar patterns to Tembo, with peak activity in the morning."}
          </div>
        </TabsContent>

        <TabsContent value="movement" className="pt-4">
          <div className="w-full h-[300px] flex justify-center">
            <BarChart width={600} height={300} data={timeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timeOfDay" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="movement" name="Movement Range" fill="#3b82f6" />
            </BarChart>
          </div>
          <div className="text-sm text-muted-foreground mt-2">
            {animalId === "EL-001" &&
              "Tembo covers the most ground in the evening (5 km), with an average range of 2.4 km."}
            {animalId === "LI-002" && "Simba's movement peaks in the evening (3 km), with an average range of 1.4 km."}
            {animalId === "RH-003" && "Kifaru moves most in the evening (4 km), with an average range of 2 km."}
            {animalId === "TI-004" &&
              "Raja covers significant territory at night (7 km), with an average range of 3.8 km."}
            {animalId === "GO-005" && "Zuri has limited movement range, peaking at 1.2 km in the afternoon."}
            {animalId === "EL-006" &&
              "Jambo shows similar movement patterns to Tembo, covering most ground in the evening."}
          </div>
        </TabsContent>

        <TabsContent value="rest" className="pt-4">
          <div className="w-full h-[300px] flex justify-center">
            <BarChart width={600} height={300} data={restData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Percentage" fill="#10b981" />
            </BarChart>
          </div>
          <div className="text-sm text-muted-foreground mt-2">
            {animalId === "EL-001" && "Tembo spends 70% of time resting and 30% in active behaviors."}
            {animalId === "LI-002" &&
              "Simba spends 80% of time resting, typical for big cats who conserve energy between hunts."}
            {animalId === "RH-003" && "Kifaru rests for 75% of the time, with 25% spent in active behaviors."}
            {animalId === "TI-004" && "Raja is more active than other big cats, with 40% activity and 60% rest."}
            {animalId === "GO-005" &&
              "Zuri spends 40% of time in active behaviors, including feeding and social interactions."}
            {animalId === "EL-006" && "Jambo has the same rest pattern as Tembo, with 70% rest and 30% activity."}
          </div>
        </TabsContent>
      </Tabs>

      <div className="rounded-md border p-4 bg-muted/30">
        <h3 className="font-medium mb-2 flex items-center gap-2">
          Activity Analysis
          {animalId === "EL-001" && <span className="text-xl">🐘</span>}
          {animalId === "LI-002" && <span className="text-xl">🦁</span>}
          {animalId === "RH-003" && <span className="text-xl">🦏</span>}
          {animalId === "TI-004" && <span className="text-xl">🐅</span>}
          {animalId === "GO-005" && <span className="text-xl">🦍</span>}
          {animalId === "EL-006" && <span className="text-xl">🐘</span>}
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-md border border-green-200 dark:border-green-900">
              <h4 className="font-medium text-sm mb-1 flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                Activity Pattern
              </h4>
              <p className="text-sm text-muted-foreground">
                {animalId === "EL-001" && "Mostly active in the morning (60%) and evening (50%)."}
                {animalId === "LI-002" && "Active during early morning (70%) and evening (80%)."}
                {animalId === "RH-003" && "Active during early morning (40%) and late evening (50%)."}
                {animalId === "TI-004" && "Nocturnal; peak activity at night (90%)."}
                {animalId === "GO-005" && "Active during the day, especially midday (60%)."}
                {animalId === "EL-006" && "Mostly active in the morning (60%) and evening (50%)."}
              </p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-md border border-blue-200 dark:border-blue-900">
              <h4 className="font-medium text-sm mb-1 flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                Movement Range
              </h4>
              <p className="text-sm text-muted-foreground">
                {animalId === "EL-001" && "5-10 km per day, with peak movement in evening (5 km)."}
                {animalId === "LI-002" && "2-5 km per day, with peak movement in evening (3 km)."}
                {animalId === "RH-003" && "3-7 km per day, with peak movement in evening (4 km)."}
                {animalId === "TI-004" && "8-12 km per day, with peak movement at night (7 km)."}
                {animalId === "GO-005" && "1-3 km per day, with peak movement in afternoon (1.2 km)."}
                {animalId === "EL-006" && "5-10 km per day, with peak movement in evening (5 km)."}
              </p>
              <p className="text-sm text-muted-foreground mt-1">Average: {avgMovement.toFixed(1)} km</p>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-md border border-amber-200 dark:border-amber-900">
              <h4 className="font-medium text-sm mb-1 flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                Rest vs Activity
              </h4>
              <p className="text-sm text-muted-foreground">
                {animalId === "EL-001" && "70% Rest, 30% Activity"}
                {animalId === "LI-002" && "80% Rest, 20% Activity"}
                {animalId === "RH-003" && "75% Rest, 25% Activity"}
                {animalId === "TI-004" && "60% Rest, 40% Activity"}
                {animalId === "GO-005" && "60% Rest, 40% Activity"}
                {animalId === "EL-006" && "70% Rest, 30% Activity"}
              </p>
            </div>
          </div>

          <div className="p-3 rounded-md bg-muted/50 border">
            {animalId === "EL-001" && (
              <p className="text-sm text-muted-foreground">
                Tembo shows a bimodal activity pattern with peaks in the morning (60%) and evening (50%). This is
                typical for elephants who avoid the heat of midday. Movement range is highest in the evening (5 km) when
                traveling to water sources. The 70% rest time includes standing sleep and social bonding behaviors.
              </p>
            )}
            {animalId === "LI-002" && (
              <p className="text-sm text-muted-foreground">
                Simba displays classic lion behavior with peak activity in the evening (80%) and morning (70%)
                coinciding with prime hunting times. The 80% rest time is normal for lions, who conserve energy between
                hunts. Movement is concentrated in the evening (3 km) when patrolling territory and hunting.
              </p>
            )}
            {animalId === "RH-003" && (
              <p className="text-sm text-muted-foreground">
                Kifaru shows a pattern typical for rhinos with highest activity in the evening (50%) and morning (40%).
                Movement is greatest in the evening (4 km) when visiting water sources. The 75% rest time includes
                midday inactivity when the animal seeks shade to regulate body temperature.
              </p>
            )}
            {animalId === "TI-004" && (
              <p className="text-sm text-muted-foreground">
                Raja exhibits strong nocturnal behavior with 90% activity at night, typical for tigers. The extensive
                movement range at night (7 km) reflects hunting behavior. With 40% overall activity, Raja is more active
                than many other big cats, possibly due to territorial pressures or hunting challenges.
              </p>
            )}
            {animalId === "GO-005" && (
              <p className="text-sm text-muted-foreground">
                Zuri shows a diurnal pattern with peak activity in the afternoon (60%), typical for gorillas who feed
                throughout the day. The limited movement range (max 1.2 km) reflects the species' tendency to stay
                within a small, resource-rich area. The 40% activity includes feeding, social grooming, and play.
              </p>
            )}
            {animalId === "EL-006" && (
              <p className="text-sm text-muted-foreground">
                Jambo exhibits the typical elephant bimodal activity pattern with peaks in the morning and evening. As a
                mature bull, his movement patterns are similar to Tembo's but may extend over larger areas when
                searching for mates or new territories.
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 rounded-md bg-muted/30 border text-center">
              <h4 className="text-xs font-medium mb-1">Peak Activity Time</h4>
              <p className="text-lg font-bold">
                {animalId === "EL-001" && "Morning"}
                {animalId === "LI-002" && "Evening"}
                {animalId === "RH-003" && "Evening"}
                {animalId === "TI-004" && "Night"}
                {animalId === "GO-005" && "Afternoon"}
                {animalId === "EL-006" && "Morning"}
              </p>
            </div>
            <div className="p-3 rounded-md bg-muted/30 border text-center">
              <h4 className="text-xs font-medium mb-1">Max Activity</h4>
              <p className="text-lg font-bold">
                {animalId === "EL-001" && "60%"}
                {animalId === "LI-002" && "80%"}
                {animalId === "RH-003" && "50%"}
                {animalId === "TI-004" && "90%"}
                {animalId === "GO-005" && "60%"}
                {animalId === "EL-006" && "60%"}
              </p>
            </div>
            <div className="p-3 rounded-md bg-muted/30 border text-center">
              <h4 className="text-xs font-medium mb-1">Max Range</h4>
              <p className="text-lg font-bold">
                {animalId === "EL-001" && "5 km"}
                {animalId === "LI-002" && "3 km"}
                {animalId === "RH-003" && "4 km"}
                {animalId === "TI-004" && "7 km"}
                {animalId === "GO-005" && "1.2 km"}
                {animalId === "EL-006" && "5 km"}
              </p>
            </div>
            <div className="p-3 rounded-md bg-muted/30 border text-center">
              <h4 className="text-xs font-medium mb-1">Rest Time</h4>
              <p className="text-lg font-bold">
                {animalId === "EL-001" && "70%"}
                {animalId === "LI-002" && "80%"}
                {animalId === "RH-003" && "75%"}
                {animalId === "TI-004" && "60%"}
                {animalId === "GO-005" && "60%"}
                {animalId === "EL-006" && "70%"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
