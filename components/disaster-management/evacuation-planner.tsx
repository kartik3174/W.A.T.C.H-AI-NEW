"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Truck, MapPin, Calendar, CheckCircle2 } from "lucide-react"

interface EvacuationPlan {
  id: string
  animalId: string
  animalName: string
  targetLocation: string
  targetCoordinates: { lat: number; lng: number }
  priority: number
  status: "pending" | "in_progress" | "completed"
  evacuationDate?: Date
  transportVehicles: number
  specialRequirements: string
}

interface EvacuationPlannerProps {
  plans?: EvacuationPlan[]
  onStartEvacuation?: (planId: string) => void
}

const mockPlans: EvacuationPlan[] = [
  {
    id: "EVAC-001",
    animalId: "ELE-001",
    animalName: "Tusker (Elephant)",
    targetLocation: "Northern Wildlife Sanctuary",
    targetCoordinates: { lat: -0.9456, lng: 36.4284 },
    priority: 1,
    status: "pending",
    transportVehicles: 1,
    specialRequirements: "Large transport truck, water supply for journey",
  },
  {
    id: "EVAC-002",
    animalId: "RHI-042",
    animalName: "Black Rhino",
    targetLocation: "Protected Reserve Zone B",
    targetCoordinates: { lat: -1.1456, lng: 36.2284 },
    priority: 2,
    status: "in_progress",
    evacuationDate: new Date(),
    transportVehicles: 2,
    specialRequirements: "Tranquilization team standby, medical support",
  },
  {
    id: "EVAC-003",
    animalId: "LIO-156",
    animalName: "Pride Leader (Lion)",
    targetLocation: "Safe Zone A",
    targetCoordinates: { lat: -1.3456, lng: 36.5284 },
    priority: 3,
    status: "completed",
    evacuationDate: new Date(Date.now() - 4 * 60 * 60 * 1000),
    transportVehicles: 1,
    specialRequirements: "Veterinary team for stress monitoring",
  },
]

const STATUS_COLORS = {
  pending: { bg: "bg-gray-100", text: "text-gray-800", badge: "bg-gray-500" },
  in_progress: { bg: "bg-blue-100", text: "text-blue-800", badge: "bg-blue-500" },
  completed: { bg: "bg-green-100", text: "text-green-800", badge: "bg-green-500" },
}

export const EvacuationPlanner = ({
  plans = mockPlans,
  onStartEvacuation,
}: EvacuationPlannerProps) => {
  const completedCount = plans.filter((p) => p.status === "completed").length
  const inProgressCount = plans.filter((p) => p.status === "in_progress").length
  const pendingCount = plans.filter((p) => p.status === "pending").length
  const completionRate = (completedCount / plans.length) * 100

  // Sort plans by priority
  const sortedPlans = [...plans].sort((a, b) => a.priority - b.priority)

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Evacuation Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Overall Completion</span>
              <span className="text-sm font-bold">{completionRate.toFixed(0)}%</span>
            </div>
            <Progress value={completionRate} className="h-3" />
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-red-600">{pendingCount}</div>
              <p className="text-xs text-gray-600">Pending</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{inProgressCount}</div>
              <p className="text-xs text-gray-600">In Progress</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{completedCount}</div>
              <p className="text-xs text-gray-600">Completed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Evacuation Plans */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Evacuation Queue</h3>

        {sortedPlans.map((plan) => {
          const colors = STATUS_COLORS[plan.status]
          return (
            <Card key={plan.id} className={colors.bg}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">#{plan.priority}</span>
                      <CardTitle className={`text-base ${colors.text}`}>
                        {plan.animalName}
                      </CardTitle>
                    </div>
                    <p className="text-sm opacity-75">ID: {plan.animalId}</p>
                  </div>
                  <Badge className={`${colors.badge} text-white`}>
                    {plan.status === "completed" ? (
                      <>
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        COMPLETED
                      </>
                    ) : (
                      plan.status.replace("_", " ").toUpperCase()
                    )}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className={`space-y-3 ${colors.text}`}>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs opacity-75">Target Location</p>
                      <p className="font-semibold">{plan.targetLocation}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Truck className="h-4 w-4 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs opacity-75">Transport Units</p>
                      <p className="font-semibold">{plan.transportVehicles} vehicles</p>
                    </div>
                  </div>
                </div>

                {plan.evacuationDate && (
                  <div className="flex items-start gap-2 text-sm">
                    <Calendar className="h-4 w-4 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs opacity-75">Evacuation Date/Time</p>
                      <p className="font-semibold">
                        {plan.evacuationDate.toLocaleDateString()} at{" "}
                        {plan.evacuationDate.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-1 text-sm">
                  <p className="text-xs font-semibold opacity-75">Special Requirements:</p>
                  <p className="text-sm">{plan.specialRequirements}</p>
                </div>

                {plan.status === "pending" && (
                  <Button
                    onClick={() => onStartEvacuation?.(plan.id)}
                    className="w-full"
                    size="sm"
                  >
                    <Truck className="h-4 w-4 mr-2" />
                    Start Evacuation
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
