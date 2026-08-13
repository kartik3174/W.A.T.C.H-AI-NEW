"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Activity, AlertTriangle, ArrowRight, Heart, ThermometerSnowflake, Timer } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState } from "react"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"

export function HealthUpdates() {
  const [selectedAnimal, setSelectedAnimal] = useState<(typeof animals)[0] | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const animals = [
    {
      id: "EL-001",
      name: "Tembo",
      species: "Elephant",
      image: "/images/elephant.jpg",
      vitals: {
        heartRate: "65 bpm",
        temperature: "36.2°C",
        activity: "Normal",
        lastChecked: "2 hours ago",
      },
      status: "Excellent",
      alert: false,
    },
    {
      id: "LI-002",
      name: "Simba",
      species: "Lion",
      image: "/images/lion.jpg",
      vitals: {
        heartRate: "70 bpm",
        temperature: "38.1°C",
        activity: "Normal",
        lastChecked: "1 hour ago",
      },
      status: "Good",
      alert: false,
    },
    {
      id: "RH-003",
      name: "Kifaru",
      species: "Rhino",
      image: "/images/rhino.jpg",
      vitals: {
        heartRate: "75 bpm",
        temperature: "37.5°C",
        activity: "Reduced",
        lastChecked: "3 hours ago",
      },
      status: "Fair",
      alert: false,
    },
    {
      id: "TI-004",
      name: "Raja",
      species: "Tiger",
      image: "/images/tiger.jpg",
      vitals: {
        heartRate: "90 bpm",
        temperature: "39.2°C",
        activity: "Low",
        lastChecked: "30 minutes ago",
      },
      status: "Poor",
      alert: true,
      alertMessage: "Elevated temperature and heart rate",
    },
    {
      id: "GO-005",
      name: "Zuri",
      species: "Gorilla",
      image: "/images/gorilla.jpg",
      vitals: {
        heartRate: "95 bpm",
        temperature: "39.5°C",
        activity: "Very Low",
        lastChecked: "4 hours ago",
      },
      status: "Critical",
      alert: true,
      alertMessage: "Significantly reduced activity and elevated vitals",
    },
  ]

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

  const showFullReport = (animal: (typeof animals)[0]) => {
    setSelectedAnimal(animal)
    setIsDialogOpen(true)
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {animals.map((animal) => (
          <Card key={animal.id} className={`${animal.alert ? "border-red-500 shadow-md" : ""}`}>
            <CardHeader className="pb-2">
              <div className="relative aspect-video w-full overflow-hidden rounded-md mb-3">
                <Image src={animal.image || "/placeholder.svg"} alt={animal.name} fill className="object-cover" />
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{animal.name}</CardTitle>
                  <CardDescription>
                    {animal.species} ({animal.id})
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(animal.status)}>{animal.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span className="text-sm">Heart Rate: {animal.vitals.heartRate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ThermometerSnowflake className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Temperature: {animal.vitals.temperature}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Activity: {animal.vitals.activity}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Timer className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Last Checked: {animal.vitals.lastChecked}</span>
                </div>
              </div>

              {animal.alert && (
                <div className="mt-4 p-2 bg-red-50 dark:bg-red-950/30 rounded-md border border-red-200 dark:border-red-900">
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm font-medium">Health Alert</span>
                  </div>
                  <p className="text-sm mt-1">{animal.alertMessage}</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full bg-transparent" onClick={() => showFullReport(animal)}>
                View Full Health Record
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Complete Health Report: {selectedAnimal?.name}</DialogTitle>
            <DialogDescription>
              {selectedAnimal?.species} ({selectedAnimal?.id}) - Comprehensive Health Assessment
            </DialogDescription>
          </DialogHeader>

          {selectedAnimal && (
            <div className="space-y-6">
              <div className="relative aspect-video w-full overflow-hidden rounded-md">
                <Image
                  src={selectedAnimal.image || "/placeholder.svg"}
                  alt={selectedAnimal.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Health Status</h3>
                <Badge className={getStatusColor(selectedAnimal.status)}>{selectedAnimal.status}</Badge>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Animal ID</p>
                  <p className="font-medium">{selectedAnimal.id}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Species</p>
                  <p className="font-medium">{selectedAnimal.species}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Last Checked</p>
                  <p className="font-medium">{selectedAnimal.vitals.lastChecked}</p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3">Vital Signs</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                    <div className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-red-500" />
                      <span className="font-medium">Heart Rate</span>
                    </div>
                    <span className="text-lg font-semibold">{selectedAnimal.vitals.heartRate}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                    <div className="flex items-center gap-2">
                      <ThermometerSnowflake className="h-5 w-5 text-blue-500" />
                      <span className="font-medium">Temperature</span>
                    </div>
                    <span className="text-lg font-semibold">{selectedAnimal.vitals.temperature}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                    <div className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-green-500" />
                      <span className="font-medium">Activity Level</span>
                    </div>
                    <span className="text-lg font-semibold">{selectedAnimal.vitals.activity}</span>
                  </div>
                </div>
              </div>

              {selectedAnimal.alert && (
                <>
                  <Separator />
                  <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-md border border-red-200 dark:border-red-900">
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-2">
                      <AlertTriangle className="h-5 w-5" />
                      <span className="font-semibold">Active Health Alert</span>
                    </div>
                    <p className="text-sm">{selectedAnimal.alertMessage}</p>
                  </div>
                </>
              )}

              <Separator />

              <div>
                <h3 className="font-semibold mb-3">Recent Medical History</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <Timer className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Last Vaccination: 2 weeks ago</p>
                      <p className="text-muted-foreground">Rabies booster administered</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Timer className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Last Physical Exam: 1 month ago</p>
                      <p className="text-muted-foreground">Routine checkup - all systems normal</p>
                    </div>
                  </div>
                  {selectedAnimal.status === "Critical" || selectedAnimal.status === "Poor" ? (
                    <div className="flex items-start gap-2">
                      <Timer className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Treatment In Progress</p>
                        <p className="text-muted-foreground">
                          Veterinary team monitoring closely. Medication administered twice daily.
                        </p>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3">Veterinary Notes</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedAnimal.status === "Excellent"
                    ? `${selectedAnimal.name} is in excellent health with all vital signs within normal ranges. Continue regular monitoring and maintain current care routine.`
                    : selectedAnimal.status === "Good"
                      ? `${selectedAnimal.name} is in good health. Minor observations noted but no immediate concerns. Regular checkups recommended.`
                      : selectedAnimal.status === "Fair"
                        ? `${selectedAnimal.name} showing some concerning signs. Increased monitoring frequency recommended. Veterinary consultation scheduled.`
                        : selectedAnimal.status === "Poor"
                          ? `${selectedAnimal.name} requires immediate attention. Active treatment plan in place. Daily monitoring and medication required.`
                          : `${selectedAnimal.name} is in critical condition. 24/7 monitoring in place. Emergency veterinary team on standby. Immediate intervention protocols activated.`}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
