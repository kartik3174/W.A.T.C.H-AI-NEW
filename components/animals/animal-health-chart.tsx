"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample health data for different animals
const healthData = {
  "EL-001": [
    { date: "Day 1", heartRate: 40, temperature: 36.5, stressLevel: 20, normalHeartRate: 40, normalTemp: 36.5 },
    { date: "Day 5", heartRate: 42, temperature: 36.6, stressLevel: 22, normalHeartRate: 40, normalTemp: 36.5 },
    { date: "Day 10", heartRate: 41, temperature: 36.4, stressLevel: 21, normalHeartRate: 40, normalTemp: 36.5 },
    { date: "Day 15", heartRate: 40, temperature: 36.5, stressLevel: 20, normalHeartRate: 40, normalTemp: 36.5 },
    { date: "Day 20", heartRate: 39, temperature: 36.3, stressLevel: 19, normalHeartRate: 40, normalTemp: 36.5 },
    { date: "Day 25", heartRate: 40, temperature: 36.5, stressLevel: 20, normalHeartRate: 40, normalTemp: 36.5 },
    { date: "Day 30", heartRate: 41, temperature: 36.6, stressLevel: 21, normalHeartRate: 40, normalTemp: 36.5 },
  ],
  "LI-002": [
    { date: "Day 1", heartRate: 70, temperature: 38.0, stressLevel: 30, normalHeartRate: 70, normalTemp: 38.0 },
    { date: "Day 5", heartRate: 72, temperature: 38.1, stressLevel: 32, normalHeartRate: 70, normalTemp: 38.0 },
    { date: "Day 10", heartRate: 71, temperature: 38.0, stressLevel: 31, normalHeartRate: 70, normalTemp: 38.0 },
    { date: "Day 15", heartRate: 73, temperature: 38.2, stressLevel: 33, normalHeartRate: 70, normalTemp: 38.0 },
    { date: "Day 20", heartRate: 70, temperature: 38.0, stressLevel: 30, normalHeartRate: 70, normalTemp: 38.0 },
    { date: "Day 25", heartRate: 69, temperature: 37.9, stressLevel: 29, normalHeartRate: 70, normalTemp: 38.0 },
    { date: "Day 30", heartRate: 71, temperature: 38.1, stressLevel: 31, normalHeartRate: 70, normalTemp: 38.0 },
  ],
  "RH-003": [
    { date: "Day 1", heartRate: 45, temperature: 36.8, stressLevel: 25, normalHeartRate: 45, normalTemp: 36.8 },
    { date: "Day 5", heartRate: 46, temperature: 36.9, stressLevel: 26, normalHeartRate: 45, normalTemp: 36.8 },
    { date: "Day 10", heartRate: 47, temperature: 37.0, stressLevel: 27, normalHeartRate: 45, normalTemp: 36.8 },
    { date: "Day 15", heartRate: 48, temperature: 37.1, stressLevel: 28, normalHeartRate: 45, normalTemp: 36.8 },
    { date: "Day 20", heartRate: 47, temperature: 37.0, stressLevel: 27, normalHeartRate: 45, normalTemp: 36.8 },
    { date: "Day 25", heartRate: 46, temperature: 36.9, stressLevel: 26, normalHeartRate: 45, normalTemp: 36.8 },
    { date: "Day 30", heartRate: 45, temperature: 36.8, stressLevel: 25, normalHeartRate: 45, normalTemp: 36.8 },
  ],
  "TI-004": [
    { date: "Day 1", heartRate: 75, temperature: 37.5, stressLevel: 35, normalHeartRate: 70, normalTemp: 37.5 },
    { date: "Day 5", heartRate: 77, temperature: 37.7, stressLevel: 37, normalHeartRate: 70, normalTemp: 37.5 },
    { date: "Day 10", heartRate: 78, temperature: 37.8, stressLevel: 38, normalHeartRate: 70, normalTemp: 37.5 },
    { date: "Day 15", heartRate: 79, temperature: 37.9, stressLevel: 39, normalHeartRate: 70, normalTemp: 37.5 },
    { date: "Day 20", heartRate: 80, temperature: 38.0, stressLevel: 40, normalHeartRate: 70, normalTemp: 37.5 },
    { date: "Day 25", heartRate: 82, temperature: 38.2, stressLevel: 42, normalHeartRate: 70, normalTemp: 37.5 },
    { date: "Day 30", heartRate: 85, temperature: 38.5, stressLevel: 45, normalHeartRate: 70, normalTemp: 37.5 },
  ],
  "GO-005": [
    { date: "Day 1", heartRate: 55, temperature: 37.0, stressLevel: 25, normalHeartRate: 55, normalTemp: 37.0 },
    { date: "Day 5", heartRate: 57, temperature: 37.2, stressLevel: 27, normalHeartRate: 55, normalTemp: 37.0 },
    { date: "Day 10", heartRate: 58, temperature: 37.3, stressLevel: 28, normalHeartRate: 55, normalTemp: 37.0 },
    { date: "Day 15", heartRate: 59, temperature: 37.4, stressLevel: 29, normalHeartRate: 55, normalTemp: 37.0 },
    { date: "Day 20", heartRate: 60, temperature: 37.5, stressLevel: 30, normalHeartRate: 55, normalTemp: 37.0 },
    { date: "Day 25", heartRate: 62, temperature: 37.7, stressLevel: 32, normalHeartRate: 55, normalTemp: 37.0 },
    { date: "Day 30", heartRate: 65, temperature: 38.0, stressLevel: 35, normalHeartRate: 55, normalTemp: 37.0 },
  ],
  "EL-006": [
    { date: "Day 1", heartRate: 40, temperature: 36.5, stressLevel: 20, normalHeartRate: 40, normalTemp: 36.5 },
    { date: "Day 5", heartRate: 41, temperature: 36.6, stressLevel: 21, normalHeartRate: 40, normalTemp: 36.5 },
    { date: "Day 10", heartRate: 40, temperature: 36.5, stressLevel: 20, normalHeartRate: 40, normalTemp: 36.5 },
    { date: "Day 15", heartRate: 39, temperature: 36.4, stressLevel: 19, normalHeartRate: 40, normalTemp: 36.5 },
    { date: "Day 20", heartRate: 40, temperature: 36.5, stressLevel: 20, normalHeartRate: 40, normalTemp: 36.5 },
    { date: "Day 25", heartRate: 41, temperature: 36.6, stressLevel: 21, normalHeartRate: 40, normalTemp: 36.5 },
    { date: "Day 30", heartRate: 40, temperature: 36.5, stressLevel: 20, normalHeartRate: 40, normalTemp: 36.5 },
  ],
}

type AnimalHealthChartProps = {
  animalId: string
}

export function AnimalHealthChart({ animalId }: AnimalHealthChartProps) {
  // Get data for the selected animal or use default data
  const data = healthData[animalId as keyof typeof healthData] || []

  return (
    <div className="space-y-4">
      <Tabs defaultValue="heartRate">
        <TabsList className="w-full">
          <TabsTrigger value="heartRate">Heart Rate</TabsTrigger>
          <TabsTrigger value="temperature">Temperature</TabsTrigger>
          <TabsTrigger value="stress">Stress Level</TabsTrigger>
        </TabsList>

        <TabsContent value="heartRate" className="pt-4">
          <div className="w-full h-[300px] flex justify-center">
            <LineChart width={600} height={300} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="heartRate" name="Heart Rate" stroke="#ef4444" activeDot={{ r: 8 }} />
              <Line
                type="monotone"
                dataKey="normalHeartRate"
                name="Normal Heart Rate"
                stroke="#ef4444"
                strokeDasharray="5 5"
                strokeOpacity={0.6}
              />
            </LineChart>
          </div>
        </TabsContent>

        <TabsContent value="temperature" className="pt-4">
          <div className="w-full h-[300px] flex justify-center">
            <LineChart width={600} height={300} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="temperature" name="Temperature" stroke="#3b82f6" activeDot={{ r: 8 }} />
              <Line
                type="monotone"
                dataKey="normalTemp"
                name="Normal Temperature"
                stroke="#3b82f6"
                strokeDasharray="5 5"
                strokeOpacity={0.6}
              />
            </LineChart>
          </div>
        </TabsContent>

        <TabsContent value="stress" className="pt-4">
          <div className="w-full h-[300px] flex justify-center">
            <LineChart width={600} height={300} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="stressLevel" name="Stress Level" stroke="#f59e0b" activeDot={{ r: 8 }} />
            </LineChart>
          </div>
        </TabsContent>
      </Tabs>

      <div className="rounded-md border p-4 bg-muted/30">
        <h3 className="font-medium mb-2 flex items-center gap-2">
          Health Analysis
          {animalId === "EL-001" && <span className="text-sm">(Tembo)</span>}
          {animalId === "LI-002" && <span className="text-sm">(Simba)</span>}
          {animalId === "RH-003" && <span className="text-sm">(Kifaru)</span>}
          {animalId === "TI-004" && <span className="text-sm">(Raja)</span>}
          {animalId === "GO-005" && <span className="text-sm">(Zuri)</span>}
          {animalId === "EL-006" && <span className="text-sm">(Jambo)</span>}
        </h3>
        {animalId === "EL-001" && (
          <p className="text-sm text-muted-foreground">
            Tembo's vital signs have remained stable over the past 30 days, with heart rate around 40 bpm and
            temperature at 36.5°C. Stress levels are consistently low at 20%, indicating excellent health and adaptation
            to the environment.
          </p>
        )}
        {animalId === "LI-002" && (
          <p className="text-sm text-muted-foreground">
            Simba shows normal vital signs with minor fluctuations that correspond to typical activity patterns. Heart
            rate averages 70 bpm with moderate stress levels around 30%, typical for a dominant male lion maintaining
            territory.
          </p>
        )}
        {animalId === "RH-003" && (
          <p className="text-sm text-muted-foreground">
            Kifaru's vital signs show a slight elevation above normal ranges, with heart rate increasing to 48 bpm at
            peak. While not critical, the gradual increase in both heart rate and temperature suggests monitoring for
            potential joint issues.
          </p>
        )}
        {animalId === "TI-004" && (
          <p className="text-sm text-muted-foreground">
            Raja's vital signs show a concerning upward trend over the 30-day period. Heart rate has increased from 75
            to 85 bpm, temperature has risen to 38.5°C, and stress levels have reached 45%. This significant elevation
            in all vital signs strongly indicates respiratory infection requiring immediate intervention.
          </p>
        )}
        {animalId === "GO-005" && (
          <p className="text-sm text-muted-foreground">
            Zuri's health metrics show a severe and rapid deterioration. Heart rate has increased from 55 to 65 bpm,
            temperature has risen to 38.0°C, and stress levels have increased to 35%. This concerning trend correlates
            with observed behavioral changes and requires urgent veterinary attention.
          </p>
        )}
        {animalId === "EL-006" && (
          <p className="text-sm text-muted-foreground">
            Jambo's vital signs are remarkably stable and within optimal ranges for his species and age. Heart rate
            consistently stays around 40 bpm with minimal fluctuations, and stress levels remain low at 20%. This
            stability suggests excellent health and successful adaptation to the environment.
          </p>
        )}

        <div className="mt-4 grid grid-cols-3 gap-3">
          <div
            className={`p-3 rounded-md border ${
              animalId === "EL-001" || animalId === "RH-003" || animalId === "EL-006"
                ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900"
                : animalId === "LI-002" || animalId === "GO-005"
                  ? "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900"
                  : "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900"
            }`}
          >
            <h4 className="font-medium text-sm mb-1">Heart Rate</h4>
            <p className="text-2xl font-bold">
              {data[data.length - 1]?.heartRate} <span className="text-sm font-normal">bpm</span>
            </p>
          </div>

          <div
            className={`p-3 rounded-md border ${
              animalId === "EL-001" || animalId === "RH-003" || animalId === "EL-006"
                ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900"
                : animalId === "LI-002" || animalId === "GO-005"
                  ? "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900"
                  : "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900"
            }`}
          >
            <h4 className="font-medium text-sm mb-1">Temperature</h4>
            <p className="text-2xl font-bold">
              {data[data.length - 1]?.temperature} <span className="text-sm font-normal">°C</span>
            </p>
          </div>

          <div
            className={`p-3 rounded-md border ${
              animalId === "EL-001" || animalId === "RH-003" || animalId === "EL-006"
                ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900"
                : animalId === "LI-002" || animalId === "GO-005"
                  ? "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900"
                  : "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900"
            }`}
          >
            <h4 className="font-medium text-sm mb-1">Stress Level</h4>
            <p className="text-2xl font-bold">
              {data[data.length - 1]?.stressLevel}
              <span className="text-sm font-normal">%</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
