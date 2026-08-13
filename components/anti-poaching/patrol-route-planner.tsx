"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Users, Map, Clock } from "lucide-react"

interface PatrolRoute {
  id: string
  name: string
  description: string
  difficulty: "easy" | "moderate" | "hard"
  estimatedDuration: number
  assignedRangers: string[]
  status: "active" | "inactive"
  lastPatrol?: Date
}

interface PatrolRoutePlannerProps {
  routes?: PatrolRoute[]
  onPlanRoute?: (route: Partial<PatrolRoute>) => void
}

const mockRoutes: PatrolRoute[] = [
  {
    id: "ROUTE-001",
    name: "Northern Perimeter Patrol",
    description: "Monitor northern boundary where elephant migration is common",
    difficulty: "hard",
    estimatedDuration: 6,
    assignedRangers: ["Raj Kumar", "Amara Singh"],
    status: "active",
    lastPatrol: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: "ROUTE-002",
    name: "Rhino Sanctuary Loop",
    description: "Patrolonly critical area with black rhino population",
    difficulty: "moderate",
    estimatedDuration: 4,
    assignedRangers: ["Priya Patel"],
    status: "active",
    lastPatrol: new Date(Date.now() - 12 * 60 * 60 * 1000),
  },
  {
    id: "ROUTE-003",
    name: "Watering Hole Circuit",
    description: "Check all major water sources for poaching activity",
    difficulty: "moderate",
    estimatedDuration: 5,
    assignedRangers: ["Ahmed Hassan", "Daniel Kipchoge"],
    status: "active",
    lastPatrol: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
]

const DIFFICULTY_COLORS = {
  easy: "bg-green-100 text-green-800",
  moderate: "bg-yellow-100 text-yellow-800",
  hard: "bg-red-100 text-red-800",
}

export const PatrolRoutePlanner = ({
  routes = mockRoutes,
  onPlanRoute,
}: PatrolRoutePlannerProps) => {
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    difficulty: "moderate" as const,
  })

  const handleCreateRoute = () => {
    if (formData.name && formData.description) {
      onPlanRoute?.(formData)
      setFormData({ name: "", description: "", difficulty: "moderate" })
      setIsCreating(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Create New Route */}
      {isCreating && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-lg">Plan New Patrol Route</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="route-name">Route Name</Label>
              <Input
                id="route-name"
                placeholder="e.g., Eastern Ridge Patrol"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="route-description">Description</Label>
              <Textarea
                id="route-description"
                placeholder="Describe the patrol route objectives and areas..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCreateRoute} className="flex-1">
                Create Route
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsCreating(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!isCreating && (
        <Button onClick={() => setIsCreating(true)} className="w-full">
          <Map className="h-4 w-4 mr-2" />
          Plan New Route
        </Button>
      )}

      {/* Existing Routes */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Active Patrol Routes</h3>

        {routes.map((route) => (
          <Card key={route.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{route.name}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{route.description}</p>
                </div>
                <Badge className={DIFFICULTY_COLORS[route.difficulty]}>
                  {route.difficulty.charAt(0).toUpperCase() + route.difficulty.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-600" />
                  <span>{route.estimatedDuration} hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-600" />
                  <span>{route.assignedRangers.length} rangers</span>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-600 mb-2">Assigned Rangers:</p>
                <div className="flex flex-wrap gap-2">
                  {route.assignedRangers.map((ranger) => (
                    <Badge key={ranger} variant="secondary">
                      {ranger}
                    </Badge>
                  ))}
                </div>
              </div>

              {route.lastPatrol && (
                <div className="text-xs text-gray-600 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Last patrol: {route.lastPatrol.toLocaleDateString()}{" "}
                  {route.lastPatrol.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              )}

              <div className="flex gap-2">
                <Button size="sm" className="flex-1">
                  Execute Patrol
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  Edit Route
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
