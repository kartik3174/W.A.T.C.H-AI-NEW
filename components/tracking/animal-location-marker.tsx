"use client"
import { Badge } from "@/components/ui/badge"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

type AnimalLocationMarkerProps = {
  id: string
  name: string
  species: string
  position: {
    top: string
    left: string
  }
  status: "Excellent" | "Good" | "Fair" | "Poor" | "Critical"
  alert?: boolean
}

export function AnimalLocationMarker({
  id,
  name,
  species,
  position,
  status,
  alert = false,
}: AnimalLocationMarkerProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "excellent":
        return "bg-green-500 hover:bg-green-600"
      case "good":
        return "bg-blue-500 hover:bg-blue-600"
      case "fair":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "poor":
        return "bg-red-500 hover:bg-red-600"
      case "critical":
        return "bg-purple-500 hover:bg-purple-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  return (
    <div
      className="absolute z-10"
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      <HoverCard>
        <HoverCardTrigger>
          <Badge
            className={`${getStatusColor(status)} cursor-pointer ${alert ? "animate-pulse ring-2 ring-red-500" : ""}`}
          >
            {id}
          </Badge>
        </HoverCardTrigger>
        <HoverCardContent className="w-64">
          <div className="space-y-2">
            <h4 className="font-medium">
              {name} ({id})
            </h4>
            <div className="text-sm text-muted-foreground">
              <p>Species: {species}</p>
              <p>Status: {status}</p>
              <p>Last Updated: Just now</p>
            </div>
            {alert && <div className="text-sm text-red-500 font-medium">Alert: Unusual movement pattern detected</div>}
            <Button size="sm" className="w-full">
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  )
}
