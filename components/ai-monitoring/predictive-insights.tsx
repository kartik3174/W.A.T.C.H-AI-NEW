"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Brain,
  Calendar,
  Clock,
  Heart,
  LineChartIcon,
  ThumbsUp,
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import { ClientErrorBoundary } from "@/components/client-error-boundary"

export function PredictiveInsights() {
  const [selectedAnimal, setSelectedAnimal] = useState<string>("TI-004")
  const { toast } = useToast()

  const predictions = [
    {
      id: "PRED-001",
      animalId: "TI-004",
      animalName: "Raja",
      species: "Tiger",
      type: "Health Risk",
      prediction: "High probability of respiratory infection developing within 7 days if untreated.",
      confidence: "89%",
      timeframe: "7 days",
      priority: "High",
      indicators: [
        "Elevated temperature for 3 consecutive days",
        "Decreased activity levels by 35%",
        "Irregular breathing patterns detected during rest",
      ],
      recommendedActions: [
        "Schedule veterinary examination within 48 hours",
        "Monitor temperature every 4 hours",
        "Isolate from other animals if symptoms worsen",
      ],
    },
    {
      id: "PRED-002",
      animalId: "GO-005",
      animalName: "Zuri",
      species: "Gorilla",
      type: "Health Risk",
      prediction: "Severe nutritional deficiency developing, potential critical condition within 14 days.",
      confidence: "94%",
      timeframe: "14 days",
      priority: "Urgent",
      indicators: [
        "Progressive decline in activity over 30 days",
        "Reduced food intake by 40%",
        "Weight loss of approximately 7%",
        "Abnormal blood test results",
      ],
      recommendedActions: [
        "Immediate veterinary intervention",
        "Specialized nutrition plan",
        "Daily monitoring of vital signs",
        "Prepare for potential medical treatment",
      ],
    },
    {
      id: "PRED-003",
      animalId: "RH-003",
      animalName: "Kifaru",
      species: "Rhino",
      type: "Behavioral Change",
      prediction: "Likely territory shift due to environmental factors within 30 days.",
      confidence: "76%",
      timeframe: "30 days",
      priority: "Medium",
      indicators: [
        "Increased exploration of southern boundary",
        "Changed feeding patterns",
        "Reduced time spent at usual watering holes",
      ],
      recommendedActions: [
        "Enhance monitoring in predicted new territory area",
        "Ensure adequate resources in potential new area",
        "Track daily movement patterns",
      ],
    },
    {
      id: "PRED-004",
      animalId: "EL-001",
      animalName: "Tembo",
      species: "Elephant",
      type: "Seasonal Pattern",
      prediction: "Expected migration to northern region within 60 days due to seasonal changes.",
      confidence: "92%",
      timeframe: "60 days",
      priority: "Low",
      indicators: [
        "Historical migration patterns at this time of year",
        "Early signs of preparatory behavior",
        "Environmental factors (water availability, vegetation)",
      ],
      recommendedActions: [
        "Prepare northern region monitoring",
        "Ensure safe passage through potential human-wildlife conflict areas",
        "Monitor herd composition during migration",
      ],
    },
  ]

  const forecastDataByAnimal: Record<string, Array<{ day: string; health: number; baseline: number }>> = {
    "TI-004": [
      { day: "Today", health: 65, baseline: 80 },
      { day: "Day 1", health: 60, baseline: 80 },
      { day: "Day 2", health: 55, baseline: 80 },
      { day: "Day 3", health: 50, baseline: 80 },
      { day: "Day 4", health: 45, baseline: 80 },
      { day: "Day 5", health: 40, baseline: 80 },
      { day: "Day 6", health: 35, baseline: 80 },
      { day: "Day 7", health: 30, baseline: 80 },
    ],
    "GO-005": [
      { day: "Today", health: 55, baseline: 80 },
      { day: "Day 1", health: 50, baseline: 80 },
      { day: "Day 2", health: 45, baseline: 80 },
      { day: "Day 3", health: 40, baseline: 80 },
      { day: "Day 4", health: 35, baseline: 80 },
      { day: "Day 5", health: 30, baseline: 80 },
      { day: "Day 6", health: 25, baseline: 80 },
      { day: "Day 7", health: 20, baseline: 80 },
    ],
    "RH-003": [
      { day: "Today", health: 70, baseline: 80 },
      { day: "Day 1", health: 68, baseline: 80 },
      { day: "Day 2", health: 67, baseline: 80 },
      { day: "Day 3", health: 65, baseline: 80 },
      { day: "Day 4", health: 64, baseline: 80 },
      { day: "Day 5", health: 63, baseline: 80 },
      { day: "Day 6", health: 62, baseline: 80 },
      { day: "Day 7", health: 60, baseline: 80 },
    ],
    "EL-001": [
      { day: "Today", health: 85, baseline: 80 },
      { day: "Day 1", health: 85, baseline: 80 },
      { day: "Day 2", health: 84, baseline: 80 },
      { day: "Day 3", health: 84, baseline: 80 },
      { day: "Day 4", health: 83, baseline: 80 },
      { day: "Day 5", health: 83, baseline: 80 },
      { day: "Day 6", health: 82, baseline: 80 },
      { day: "Day 7", health: 82, baseline: 80 },
    ],
    "LI-002": [
      { day: "Today", health: 78, baseline: 80 },
      { day: "Day 1", health: 78, baseline: 80 },
      { day: "Day 2", health: 77, baseline: 80 },
      { day: "Day 3", health: 77, baseline: 80 },
      { day: "Day 4", health: 76, baseline: 80 },
      { day: "Day 5", health: 76, baseline: 80 },
      { day: "Day 6", health: 75, baseline: 80 },
      { day: "Day 7", health: 75, baseline: 80 },
    ],
  }

  const animalNames = {
    "EL-001": "Tembo (Elephant)",
    "LI-002": "Simba (Lion)",
    "RH-003": "Kifaru (Rhino)",
    "TI-004": "Raja (Tiger)",
    "GO-005": "Zuri (Gorilla)",
  }

  const forecastData = forecastDataByAnimal[selectedAnimal] || forecastDataByAnimal["TI-004"]

  const filteredPredictions = predictions.filter((p) => p.animalId === selectedAnimal)

  const handleExport = () => {
    try {
      const animalName = animalNames[selectedAnimal as keyof typeof animalNames]
      const prediction = filteredPredictions[0]

      const csvContent = `Predictive Insights Report - ${animalName}
Generated: ${new Date().toLocaleString()}

${
  prediction
    ? `Prediction ID: ${prediction.id}
Type: ${prediction.type}
Prediction: ${prediction.prediction}
Confidence: ${prediction.confidence}
Timeframe: ${prediction.timeframe}
Priority: ${prediction.priority}

Key Indicators:
${prediction.indicators.map((ind) => `- ${ind}`).join("\n")}

Recommended Actions:
${prediction.recommendedActions.map((act) => `- ${act}`).join("\n")}
`
    : "No predictions available for this animal."
}

Health Forecast (7-day):
Day,Health Score,Baseline
${forecastData.map((row) => `${row.day},${row.health},${row.baseline}`).join("\n")}
`

      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `predictive-insights-${selectedAnimal}-${Date.now()}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast({
        title: "Export Successful",
        description: "Predictive insights data has been exported",
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export predictive insights",
        variant: "destructive",
      })
    }
  }

  const handleViewDetailedAnalysis = (prediction: any) => {
    toast({
      title: "Opening Detailed Analysis",
      description: `Loading comprehensive report for ${prediction.animalName}...`,
    })
  }

  const handleViewHealthForecast = () => {
    toast({
      title: "Detailed Forecast",
      description: "Opening interactive trajectory visualization...",
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "urgent":
        return "bg-red-500 hover:bg-red-600"
      case "high":
        return "bg-orange-500 hover:bg-orange-600"
      case "medium":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "low":
        return "bg-green-500 hover:bg-green-600"
      default:
        return "bg-blue-500 hover:bg-blue-600"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "health risk":
        return <Heart className="h-5 w-5 text-red-500" />
      case "behavioral change":
        return <Activity className="h-5 w-5 text-blue-500" />
      case "seasonal pattern":
        return <Calendar className="h-5 w-5 text-green-500" />
      default:
        return <AlertTriangle className="h-5 w-5" />
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

      <Card className="border-orange-500">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <CardTitle>AI Health Forecast: {animalNames[selectedAnimal as keyof typeof animalNames]}</CardTitle>
          </div>
          <CardDescription>Predicted health trajectory over the next 7 days based on current data</CardDescription>
        </CardHeader>
        <CardContent>
          <ClientErrorBoundary>
            <div className="h-[300px] w-full flex justify-center">
              <LineChart
                width={500}
                height={300}
                data={forecastData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="health" name="Predicted Health" stroke="#ef4444" />
                <Line
                  type="monotone"
                  dataKey="baseline"
                  name="Healthy Baseline"
                  stroke="#10b981"
                  strokeDasharray="5 5"
                />
              </LineChart>
            </div>
          </ClientErrorBoundary>

          {(selectedAnimal === "TI-004" || selectedAnimal === "GO-005") && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/30 rounded-md border border-red-200 dark:border-red-900">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <AlertTriangle className="h-4 w-4" />
                <span className="font-medium">Critical Health Alert</span>
              </div>
              <p className="mt-1 text-sm">
                {selectedAnimal === "TI-004" &&
                  "Without intervention, Raja's health is predicted to decline to critical levels within 7 days. Immediate veterinary attention recommended."}
                {selectedAnimal === "GO-005" &&
                  "Without intervention, Zuri's health is predicted to decline to critical levels within 7 days. Immediate veterinary intervention required."}
              </p>
            </div>
          )}
          {selectedAnimal === "RH-003" && (
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950/30 rounded-md border border-yellow-200 dark:border-yellow-900">
              <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                <AlertTriangle className="h-4 w-4" />
                <span className="font-medium">Moderate Health Alert</span>
              </div>
              <p className="mt-1 text-sm">
                Kifaru's health shows a gradual decline. Continued monitoring and potential veterinary assessment
                recommended.
              </p>
            </div>
          )}
          {(selectedAnimal === "EL-001" || selectedAnimal === "LI-002") && (
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/30 rounded-md border border-green-200 dark:border-green-900">
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <ThumbsUp className="h-4 w-4" />
                <span className="font-medium">Healthy Status</span>
              </div>
              <p className="mt-1 text-sm">
                {selectedAnimal === "EL-001" &&
                  "Tembo's health forecast shows stable, positive indicators. Continue regular monitoring."}
                {selectedAnimal === "LI-002" &&
                  "Simba's health forecast shows stable indicators. Continue regular monitoring."}
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button className="w-full sm:w-auto" onClick={handleViewHealthForecast}>
            View Detailed Health Forecast
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPredictions.length > 0 ? (
          filteredPredictions.map((prediction) => (
            <Card
              key={prediction.id}
              className={`${
                prediction.priority.toLowerCase() === "urgent" || prediction.priority.toLowerCase() === "high"
                  ? "border-red-500"
                  : ""
              }`}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(prediction.type)}
                    <CardTitle>{prediction.type}</CardTitle>
                  </div>
                  <Badge className={getPriorityColor(prediction.priority)}>{prediction.priority} Priority</Badge>
                </div>
                <CardDescription>
                  {prediction.animalName} ({prediction.animalId}) - {prediction.species}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="font-medium">{prediction.prediction}</p>

                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <LineChartIcon className="h-4 w-4 text-blue-500" />
                    <span>Confidence: {prediction.confidence}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-yellow-500" />
                    <span>Timeframe: {prediction.timeframe}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-1">Key Indicators:</h4>
                  <ul className="space-y-1">
                    {prediction.indicators.map((indicator, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                        <span>{indicator}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-1">Recommended Actions:</h4>
                  <ul className="space-y-1">
                    {prediction.recommendedActions.map((action, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <ThumbsUp className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => handleViewDetailedAnalysis(prediction)}
                >
                  View Detailed Analysis
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <Card className="lg:col-span-2">
            <CardContent className="py-8">
              <p className="text-center text-muted-foreground">
                No predictions available for {animalNames[selectedAnimal as keyof typeof animalNames]}.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
