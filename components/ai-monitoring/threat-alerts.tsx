"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Clock, MapPin, Shield, Users } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function ThreatAlerts() {
  const { toast } = useToast()
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null)
  const [selectedThreat, setSelectedThreat] = useState<any>(null)
  const [isResponseOpen, setIsResponseOpen] = useState(false)

  const [threats, setThreats] = useState([
    {
      id: "THREAT-001",
      type: "Poaching Risk",
      location: "South Region, Sector 3",
      timestamp: "Today, 08:23 AM",
      description:
        "Suspicious vehicle detected near perimeter fence. Multiple occupants with potential hunting equipment.",
      confidence: "87%",
      status: "Active",
      affectedAnimals: ["RH-003"],
    },
    {
      id: "THREAT-002",
      type: "Habitat Disturbance",
      location: "East Region, Sector 5",
      timestamp: "Yesterday, 03:45 PM",
      description:
        "Unauthorized logging activity detected. Machinery sounds and tree falling identified by acoustic sensors.",
      confidence: "92%",
      status: "Active",
      affectedAnimals: ["LI-002", "TI-004"],
    },
    {
      id: "THREAT-003",
      type: "Predator Intrusion",
      location: "North Region, Sector 1",
      timestamp: "Yesterday, 11:30 PM",
      description: "Pack of wild dogs entered protected area. Potential threat to younger animals.",
      confidence: "78%",
      status: "Monitoring",
      affectedAnimals: ["EL-001"],
    },
    {
      id: "THREAT-004",
      type: "Environmental Hazard",
      location: "West Region, Sector 8",
      timestamp: "2 days ago, 02:15 PM",
      description:
        "Water source contamination detected. Abnormal chemical readings in river feeding into protected area.",
      confidence: "95%",
      status: "Resolved",
      affectedAnimals: ["GO-005", "TI-004"],
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-red-500 hover:bg-red-600"
      case "monitoring":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "resolved":
        return "bg-green-500 hover:bg-green-600"
      default:
        return "bg-blue-500 hover:bg-blue-600"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "poaching risk":
        return <Users className="h-5 w-5 text-red-500" />
      case "habitat disturbance":
        return <MapPin className="h-5 w-5 text-orange-500" />
      case "predator intrusion":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "environmental hazard":
        return <Shield className="h-5 w-5 text-blue-500" />
      default:
        return <AlertTriangle className="h-5 w-5" />
    }
  }

  const toggleExpandAlert = (id: string) => {
    if (expandedAlert === id) {
      setExpandedAlert(null)
    } else {
      setExpandedAlert(id)
    }
  }

  const handleRespond = (threat: any) => {
    setSelectedThreat(threat)
    setIsResponseOpen(true)
  }

  const confirmResponse = () => {
    setIsResponseOpen(false)
    toast({
      title: "Response Dispatched",
      description: `Security team dispatched to ${selectedThreat?.location}`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {threats.map((alert) => (
          <Card
            key={alert.id}
            className={`border-l-4 ${
              alert.status.toLowerCase() === "active"
                ? "border-l-red-500"
                : alert.status.toLowerCase() === "monitoring"
                  ? "border-l-yellow-500"
                  : "border-l-green-500"
            }`}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  {getTypeIcon(alert.type)}
                  <CardTitle>{alert.title || alert.type}</CardTitle>
                </div>
                <Badge className={getStatusColor(alert.status)}>{alert.status}</Badge>
              </div>
              <CardDescription>
                {alert.id} • {alert.type}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{alert.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{alert.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{alert.timestamp}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">AI Confidence:</span>
                <span>{alert.confidence}</span>
              </div>

              <div>
                <span className="text-sm font-medium">Affected Animals:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {alert.affectedAnimals.map((animal) => (
                    <Badge key={animal} variant="outline">
                      {animal}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between">
              <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-auto bg-transparent"
                onClick={() => toggleExpandAlert(alert.id)}
              >
                {expandedAlert === alert.id ? "Hide Details" : "View Details"}
              </Button>
              <Button size="sm" className="w-full sm:w-auto" onClick={() => handleRespond(alert)}>
                <Shield className="mr-2 h-4 w-4" />
                Respond to Threat
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isResponseOpen} onOpenChange={setIsResponseOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Respond to Threat</DialogTitle>
            <DialogDescription>Deploy appropriate countermeasures for {selectedThreat?.type}</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <Shield className="h-8 w-8 text-red-500" />
              <div>
                <p className="font-medium">Emergency Dispatch</p>
                <p className="text-sm text-muted-foreground">
                  Send nearest security patrol to {selectedThreat?.location}
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResponseOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmResponse}>
              Confirm Dispatch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>Threat Detection System</CardTitle>
          <CardDescription>
            AI-powered monitoring and detection of potential threats to wildlife and habitat
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>
              The AI threat detection system continuously monitors the protected area using a network of cameras,
              acoustic sensors, and environmental monitors. Machine learning algorithms analyze patterns to identify
              potential threats to wildlife and their habitat.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-red-500" />
                  <h3 className="font-medium">Human Intrusion</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Detects unauthorized human presence using motion sensors and camera recognition.
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  <h3 className="font-medium">Predator Tracking</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Monitors natural predator movements that may threaten vulnerable species.
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-5 w-5 text-orange-500" />
                  <h3 className="font-medium">Habitat Monitoring</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Identifies unauthorized activities like logging or construction.
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-blue-500" />
                  <h3 className="font-medium">Environmental Sensors</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Monitors water and air quality for potential contamination.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
