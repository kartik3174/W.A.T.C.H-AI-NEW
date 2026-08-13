"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Clock,
  FileText,
  Heart,
  MapPin,
  ThermometerSnowflake,
  Timer,
  User,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { AnimalHealthChart } from "@/components/animals/animal-health-chart"
import { AnimalActivityChart } from "@/components/animals/animal-activity-chart"
import { AnimalActionDialog } from "@/components/animals/animal-action-dialog"
import { LeafDecoration } from "@/components/leaf-decoration"

type Animal = {
  id: string
  name: string
  species: string
  age: number
  gender: string
  location: string
  lastSeen?: string
  status?: string
  tracked?: boolean
  alert?: boolean
  image?: string
  description?: string
  vitals?: {
    heartRate: string
    temperature: string
    activity: string
    lastChecked: string
  }
  activityPattern?: string
  movementRange?: string
  restActivity?: string
  history?: Array<{
    date: string
    event: string
    notes: string
  }>
  healthStatus?: string
  lastCheckup?: string
  conservationStatus?: string
  imageUrl?: string
}

type AnimalProfileProps = {
  animal: Animal
}

export function AnimalProfile({ animal }: AnimalProfileProps) {
  const router = useRouter()
  const [actionDialogOpen, setActionDialogOpen] = useState(false)

  // Use status if healthStatus is not available
  const healthStatus = animal.healthStatus || animal.status || "Unknown"

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "excellent":
        return "status-excellent"
      case "good":
        return "status-good"
      case "fair":
        return "status-fair"
      case "poor":
        return "status-poor"
      case "critical":
        return "status-critical"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  const getHealthStatusColor = () => {
    if (!healthStatus) return "bg-gray-500 text-white"

    switch (healthStatus.toLowerCase()) {
      case "excellent":
        return "bg-green-500 text-white"
      case "good":
        return "bg-blue-500 text-white"
      case "fair":
        return "bg-yellow-500 text-white"
      case "poor":
        return "bg-red-500 text-white"
      case "critical":
        return "bg-red-700 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getConservationStatusColor = () => {
    if (!animal.conservationStatus) return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"

    switch (animal.conservationStatus.toLowerCase()) {
      case "least concern":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      case "near threatened":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
      case "vulnerable":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
      case "endangered":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100"
      case "critically endangered":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
    }
  }

  // Determine which layout to use based on available data
  const useSimpleLayout = !animal.vitals && !animal.history

  if (useSimpleLayout) {
    return (
      <>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => router.back()} className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold md:text-3xl">
              {animal.name} <span className="text-muted-foreground">({animal.id})</span>
            </h1>
            {healthStatus && <Badge className={getStatusColor(healthStatus)}>{healthStatus}</Badge>}
            {animal.alert && (
              <Badge variant="outline" className="border-red-500 text-red-500">
                <AlertTriangle className="mr-1 h-3 w-3" />
                Alert
              </Badge>
            )}
          </div>
          <Button
            onClick={() => setActionDialogOpen(true)}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
          >
            Record Action Taken
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 relative">
          <LeafDecoration position="top-right" size="md" opacity={0.05} className="hidden lg:block" />
          <LeafDecoration position="bottom-left" size="sm" rotation={45} opacity={0.05} className="hidden lg:block" />

          <Card className="lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle>Profile</CardTitle>
              <CardDescription>Animal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative aspect-video overflow-hidden rounded-md">
                <Image
                  src={animal.image || animal.imageUrl || "/placeholder.svg?height=300&width=300"}
                  alt={animal.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {animal.age} year old {animal.gender}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{animal.location}</span>
                </div>
                {animal.lastSeen && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Last seen: {animal.lastSeen}</span>
                  </div>
                )}
                {animal.lastCheckup && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Last checkup: {animal.lastCheckup}</span>
                  </div>
                )}
                <Separator />
                {animal.description && (
                  <div>
                    <h3 className="mb-2 font-medium">Description</h3>
                    <p className="text-sm text-muted-foreground">{animal.description}</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Link href={`/animals/${animal.id}/health-records`} className="w-full">
                <Button variant="outline" className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  View Full Health Records
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Monitoring Data</CardTitle>
                <CardDescription>Health and activity information</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="activity">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="activity" className="flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Activity
                    </TabsTrigger>
                    <TabsTrigger value="health" className="flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      Health
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="activity" className="pt-4">
                    <AnimalActivityChart animalId={animal.id} />
                  </TabsContent>
                  <TabsContent value="health" className="pt-4">
                    <AnimalHealthChart animalId={animal.id} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>

        <AnimalActionDialog animal={animal} open={actionDialogOpen} onOpenChange={setActionDialogOpen} />
      </>
    )
  }

  // Original detailed layout for animals with complete data
  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.back()} className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold md:text-3xl">
            {animal.name} <span className="text-muted-foreground">({animal.id})</span>
          </h1>
          {healthStatus && <Badge className={getStatusColor(healthStatus)}>{healthStatus}</Badge>}
          {animal.alert && (
            <Badge variant="outline" className="border-red-500 text-red-500">
              <AlertTriangle className="mr-1 h-3 w-3" />
              Alert
            </Badge>
          )}
        </div>
        <Button
          onClick={() => setActionDialogOpen(true)}
          className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
        >
          Record Action Taken
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 relative">
        <LeafDecoration position="top-right" size="md" opacity={0.05} className="hidden lg:block" />
        <LeafDecoration position="bottom-left" size="sm" rotation={45} opacity={0.05} className="hidden lg:block" />

        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle>Profile</CardTitle>
            <CardDescription>Animal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative aspect-video overflow-hidden rounded-md">
              <Image
                src={animal.image || animal.imageUrl || "/placeholder.svg?height=300&width=300"}
                alt={animal.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>
                  {animal.age} year old {animal.gender}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{animal.location}</span>
              </div>
              {animal.lastSeen && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Last seen: {animal.lastSeen}</span>
                </div>
              )}
              <Separator />
              {animal.description && (
                <div>
                  <h3 className="mb-2 font-medium">Description</h3>
                  <p className="text-sm text-muted-foreground">{animal.description}</p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Link href={`/animals/${animal.id}/health-records`} className="w-full">
              <Button variant="outline" className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                View Full Health Records
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          {animal.vitals && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Health Vitals</CardTitle>
                <CardDescription>Current health metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="flex flex-col gap-1 rounded-md border p-3">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium">Heart Rate</span>
                    </div>
                    <span className="text-xl font-bold">{animal.vitals.heartRate}</span>
                  </div>
                  <div className="flex flex-col gap-1 rounded-md border p-3">
                    <div className="flex items-center gap-2">
                      <ThermometerSnowflake className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">Temperature</span>
                    </div>
                    <span className="text-xl font-bold">{animal.vitals.temperature}</span>
                  </div>
                  <div className="flex flex-col gap-1 rounded-md border p-3">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Activity</span>
                    </div>
                    <span className="text-xl font-bold">{animal.vitals.activity}</span>
                  </div>
                  <div className="flex flex-col gap-1 rounded-md border p-3">
                    <div className="flex items-center gap-2">
                      <Timer className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium">Last Checked</span>
                    </div>
                    <span className="text-xl font-bold">{animal.vitals.lastChecked}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue="health" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="health">Health Trends</TabsTrigger>
              <TabsTrigger value="activity">Activity Patterns</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            <TabsContent value="health" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Health Metrics Over Time</CardTitle>
                  <CardDescription>30-day health trend analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <AnimalHealthChart animalId={animal.id} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Activity Patterns</CardTitle>
                  <CardDescription>Movement and rest cycles</CardDescription>
                </CardHeader>
                <CardContent>
                  <AnimalActivityChart animalId={animal.id} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Event History</CardTitle>
                  <CardDescription>Past treatments and observations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {animal.history && animal.history.length > 0 ? (
                      animal.history.map((event, index) => (
                        <div key={index} className="flex flex-col space-y-1 rounded-md border p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-primary" />
                              <span className="font-medium">{event.date}</span>
                            </div>
                            <Badge variant="outline">{event.event}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{event.notes}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground">No history records available.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <AnimalActionDialog animal={animal} open={actionDialogOpen} onOpenChange={setActionDialogOpen} />
    </>
  )
}
