"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Calendar, MapPin, Users } from "lucide-react"

interface MigrationData {
  year: number
  species: string
  startDate: Date
  endDate: Date
  distance: number
  duration: number
  animalsTracked: number
  successRate: number
  avgSpeed: number
}

interface MigrationAnalyzerProps {
  migrations?: MigrationData[]
}

const mockMigrations: MigrationData[] = [
  {
    year: 2024,
    species: "African Elephant",
    startDate: new Date("2024-06-15"),
    endDate: new Date("2024-10-20"),
    distance: 1850,
    duration: 127,
    animalsTracked: 342,
    successRate: 94.5,
    avgSpeed: 14.6,
  },
  {
    year: 2024,
    species: "Wildebeest",
    startDate: new Date("2024-05-01"),
    endDate: new Date("2024-09-15"),
    distance: 2400,
    duration: 137,
    animalsTracked: 12500,
    successRate: 88.2,
    avgSpeed: 17.5,
  },
  {
    year: 2023,
    species: "African Elephant",
    startDate: new Date("2023-06-10"),
    endDate: new Date("2023-10-25"),
    distance: 1920,
    duration: 138,
    animalsTracked: 298,
    successRate: 96.3,
    avgSpeed: 13.9,
  },
]

export const MigrationAnalyzer = ({ migrations = mockMigrations }: MigrationAnalyzerProps) => {
  const avgSuccessRate =
    migrations.reduce((sum, m) => sum + m.successRate, 0) / migrations.length
  const totalDistance = migrations.reduce((sum, m) => sum + m.distance, 0)
  const totalAnimalsTracked = migrations.reduce((sum, m) => sum + m.animalsTracked, 0)

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{avgSuccessRate.toFixed(1)}%</div>
              <p className="text-sm text-gray-600">Avg. Success Rate</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{totalDistance.toLocaleString()}</div>
              <p className="text-sm text-gray-600">Total Distance (km)</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {totalAnimalsTracked.toLocaleString()}
              </div>
              <p className="text-sm text-gray-600">Animals Tracked</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Migration Details */}
      <div className="space-y-4">
        {migrations.map((migration, idx) => (
          <Card key={idx}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{migration.species}</CardTitle>
                  <p className="text-sm text-gray-600">Year: {migration.year}</p>
                </div>
                <Badge variant="outline">{migration.successRate.toFixed(1)}% Success</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 mt-1 text-gray-600" />
                  <div>
                    <p className="text-xs text-gray-600">Migration Period</p>
                    <p className="font-semibold">
                      {migration.startDate.toLocaleDateString()} - {migration.endDate.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Users className="h-4 w-4 mt-1 text-gray-600" />
                  <div>
                    <p className="text-xs text-gray-600">Animals Tracked</p>
                    <p className="font-semibold">{migration.animalsTracked.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Distance</span>
                  <span className="font-bold">{migration.distance} km</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Duration</span>
                  <span className="font-bold">{migration.duration} days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Average Speed</span>
                  <span className="font-bold">{migration.avgSpeed.toFixed(1)} km/day</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>Route tracked with {migration.animalsTracked} GPS units</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
