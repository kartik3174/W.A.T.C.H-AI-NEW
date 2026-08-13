"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react"

interface PopulationMetrics {
  species: string
  date: Date
  totalPopulation: number
  males: number
  females: number
  juveniles: number
  birthRate: number
  mortalityRate: number
  trend: "increasing" | "stable" | "declining"
  confidence: number
}

interface PopulationAnalysisProps {
  metrics?: PopulationMetrics[]
}

const mockMetrics: PopulationMetrics[] = [
  {
    species: "African Elephant",
    date: new Date("2024-12-01"),
    totalPopulation: 4782,
    males: 2341,
    females: 2189,
    juveniles: 1205,
    birthRate: 4.2,
    mortalityRate: 1.8,
    trend: "increasing",
    confidence: 0.92,
  },
  {
    species: "Black Rhino",
    date: new Date("2024-11-15"),
    totalPopulation: 156,
    males: 67,
    females: 89,
    juveniles: 34,
    birthRate: 2.1,
    mortalityRate: 2.9,
    trend: "stable",
    confidence: 0.88,
  },
  {
    species: "African Lion",
    date: new Date("2024-12-01"),
    totalPopulation: 892,
    males: 412,
    females: 480,
    juveniles: 285,
    birthRate: 3.5,
    mortalityRate: 2.2,
    trend: "declining",
    confidence: 0.85,
  },
  {
    species: "Spotted Leopard",
    date: new Date("2024-11-20"),
    totalPopulation: 1243,
    males: 634,
    females: 609,
    juveniles: 412,
    birthRate: 3.8,
    mortalityRate: 1.4,
    trend: "increasing",
    confidence: 0.80,
  },
]

const TREND_COLORS = {
  increasing: { icon: TrendingUp, color: "text-green-600", bg: "bg-green-100" },
  stable: { icon: BarChart3, color: "text-blue-600", bg: "bg-blue-100" },
  declining: { icon: TrendingDown, color: "text-red-600", bg: "bg-red-100" },
}

export const PopulationAnalysis = ({ metrics = mockMetrics }: PopulationAnalysisProps) => {
  const totalAnimals = metrics.reduce((sum, m) => sum + m.totalPopulation, 0)
  const avgConfidence = metrics.reduce((sum, m) => sum + m.confidence, 0) / metrics.length
  const increasingCount = metrics.filter((m) => m.trend === "increasing").length

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{increasingCount}</div>
              <p className="text-sm text-gray-600">Species Increasing</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {totalAnimals.toLocaleString()}
              </div>
              <p className="text-sm text-gray-600">Total Population</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {(avgConfidence * 100).toFixed(0)}%
              </div>
              <p className="text-sm text-gray-600">Avg. Data Confidence</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Population Details */}
      <div className="space-y-4">
        {metrics.map((metric) => {
          const trendConfig = TREND_COLORS[metric.trend]
          const TrendIcon = trendConfig.icon
          const malePercent = (metric.males / metric.totalPopulation) * 100
          const femalePercent = (metric.females / metric.totalPopulation) * 100
          const juvenilePercent = (metric.juveniles / metric.totalPopulation) * 100

          return (
            <Card key={metric.species}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{metric.species}</CardTitle>
                    <p className="text-sm text-gray-600">
                      {metric.date.toLocaleDateString()}
                    </p>
                  </div>
                  <Badge className={`${trendConfig.bg} ${trendConfig.color}`}>
                    <TrendIcon className="h-3 w-3 mr-1" />
                    {metric.trend.charAt(0).toUpperCase() + metric.trend.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                      {metric.totalPopulation.toLocaleString()}
                    </div>
                    <p className="text-sm text-gray-600">Total Population</p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Males</span>
                        <span className="font-semibold">
                          {metric.males} ({malePercent.toFixed(0)}%)
                        </span>
                      </div>
                      <Progress value={malePercent} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Females</span>
                        <span className="font-semibold">
                          {metric.females} ({femalePercent.toFixed(0)}%)
                        </span>
                      </div>
                      <Progress value={femalePercent} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Juveniles</span>
                        <span className="font-semibold">
                          {metric.juveniles} ({juvenilePercent.toFixed(0)}%)
                        </span>
                      </div>
                      <Progress value={juvenilePercent} className="h-2" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-600">Birth Rate</p>
                    <p className="font-bold text-green-600">{metric.birthRate}%</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-600">Mortality Rate</p>
                    <p className="font-bold text-red-600">{metric.mortalityRate}%</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-600">Net Growth</p>
                    <p className="font-bold text-blue-600">
                      {(metric.birthRate - metric.mortalityRate).toFixed(1)}%
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-600">Data Confidence</p>
                    <p className="font-bold">{(metric.confidence * 100).toFixed(0)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
