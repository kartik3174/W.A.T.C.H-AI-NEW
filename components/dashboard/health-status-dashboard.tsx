"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { HealthStatusChart } from "@/components/dashboard/health-status-chart"
import { BehavioralTrendsChart } from "@/components/dashboard/behavioral-trends-chart"

// Health status data without emojis
const healthData = [
  { animal: "Tembo", heartRate: 40, temperature: 36.5, stressLevel: 20, status: "Healthy" },
  { animal: "Simba", heartRate: 70, temperature: 38.0, stressLevel: 30, status: "Slightly Stressed" },
  { animal: "Raja", heartRate: 80, temperature: 37.8, stressLevel: 40, status: "Moderately Stressed" },
  { animal: "Kifaru", heartRate: 45, temperature: 36.8, stressLevel: 25, status: "Healthy" },
  { animal: "Zuri", heartRate: 60, temperature: 37.2, stressLevel: 35, status: "Slightly Stressed" },
]

export function HealthStatusDashboard() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="health">
        <TabsList className="w-full">
          <TabsTrigger value="health">Health Status</TabsTrigger>
          <TabsTrigger value="behavioral">Behavioral Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="health" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Health Status Distribution</CardTitle>
                <CardDescription>Overall health distribution of tracked animals</CardDescription>
              </CardHeader>
              <CardContent>
                <HealthStatusChart />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Health Status Overview</CardTitle>
                <CardDescription>Comprehensive health metrics for all monitored animals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="py-2 px-4 text-left">Animal</th>
                        <th className="py-2 px-4 text-left">Heart Rate (bpm)</th>
                        <th className="py-2 px-4 text-left">Body Temperature (°C)</th>
                        <th className="py-2 px-4 text-left">Stress Level (%)</th>
                        <th className="py-2 px-4 text-left">Health Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {healthData.map((animal, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-2 px-4">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{animal.animal}</span>
                            </div>
                          </td>
                          <td className="py-2 px-4">{animal.heartRate}</td>
                          <td className="py-2 px-4">{animal.temperature}</td>
                          <td className="py-2 px-4">{animal.stressLevel}%</td>
                          <td className="py-2 px-4">
                            <Badge
                              className={
                                animal.status === "Healthy"
                                  ? "bg-green-500"
                                  : animal.status === "Slightly Stressed"
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                              }
                            >
                              {animal.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Health Analysis</CardTitle>
              <CardDescription>Comprehensive analysis of health trends for all animals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-md border border-green-200 dark:border-green-900">
                  <h3 className="font-medium text-green-800 dark:text-green-300 mb-1">Stable Health Patterns</h3>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Tembo and Kifaru show stable health metrics with minimal fluctuations in heart rate, temperature,
                    and stress levels. This indicates good adaptation to their environment and effective conservation
                    management.
                  </p>
                </div>

                <div className="p-4 bg-yellow-50 dark:bg-yellow-950/30 rounded-md border border-yellow-200 dark:border-yellow-900">
                  <h3 className="font-medium text-yellow-800 dark:text-yellow-300 mb-1">Moderate Concerns</h3>
                  <p className="text-sm text-yellow-700 dark:text-yellow-400">
                    Simba and Zuri show slight increases in stress levels that warrant monitoring. Zuri's stress has
                    increased from 25% to 35% over three months, which may indicate environmental pressures or social
                    group changes.
                  </p>
                </div>

                <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-md border border-red-200 dark:border-red-900">
                  <h3 className="font-medium text-red-800 dark:text-red-300 mb-1">Critical Concerns</h3>
                  <p className="text-sm text-red-700 dark:text-red-400">
                    Raja shows a concerning trend with heart rate increasing from 75 to 80 bpm and stress levels rising
                    from 35% to 40%. These changes, combined with elevated body temperature, strongly suggest a
                    developing respiratory infection that requires immediate veterinary intervention.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="behavioral" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Behavioral Trends</CardTitle>
              <CardDescription>Activity patterns over the last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <BehavioralTrendsChart />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
