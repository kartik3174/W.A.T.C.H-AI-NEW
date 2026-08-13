"use client"

import { notFound } from "next/navigation"
import { animals } from "@/components/dashboard/animal-table"
import { PageHeader } from "@/components/dashboard/page-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { AnimalActivityChart } from "@/components/animals/animal-activity-chart"
import { AnimalHealthChart } from "@/components/animals/animal-health-chart"
import { LeafDecoration } from "@/components/leaf-decoration"

interface HealthRecordsPageProps {
  params: {
    id: string
  }
}

export default function HealthRecordsPage({ params }: HealthRecordsPageProps) {
  const animal = animals.find((a) => a.id === params.id)

  if (!animal) {
    notFound()
  }

  const getStatusColor = (status: string) => {
    if (!status) return "bg-gray-500"

    switch (status.toLowerCase()) {
      case "excellent":
        return "bg-green-500 hover:bg-green-600"
      case "good":
        return "bg-emerald-500 hover:bg-emerald-600"
      case "fair":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "poor":
        return "bg-orange-500 hover:bg-orange-600"
      case "critical":
        return "bg-red-500 hover:bg-red-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  return (
    <div className="container mx-auto py-6 relative">
      <LeafDecoration className="absolute -top-6 -left-6 w-16 h-16 text-green-600/20 rotate-45" />
      <LeafDecoration className="absolute -bottom-6 -right-6 w-16 h-16 text-green-600/20 -rotate-45" />

      <div className="flex items-center mb-6">
        <Link href={`/animals/${animal.id}`}>
          <Button variant="outline" size="sm" className="mr-4 bg-transparent">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Profile
          </Button>
        </Link>
        <PageHeader
          title={`${animal.name} (${animal.id}) Health Records`}
          description={
            <div className="flex items-center">
              <span className="mr-2">
                {animal.age} year old {animal.gender} {animal.species}
              </span>
              <Badge className={getStatusColor(animal.status)}>{animal.status}</Badge>
            </div>
          }
        />
      </div>

      <Tabs defaultValue="activity">
        <TabsList className="mb-4">
          <TabsTrigger value="activity">Activity Patterns</TabsTrigger>
          <TabsTrigger value="health">Health Trends</TabsTrigger>
          <TabsTrigger value="history">Medical History</TabsTrigger>
        </TabsList>

        <TabsContent value="activity">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Activity Pattern</CardTitle>
                <CardDescription>Activity levels throughout the day</CardDescription>
              </CardHeader>
              <CardContent>
                <AnimalActivityChart animal={animal} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Movement Range</CardTitle>
                <CardDescription>Distance traveled by time of day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">{animal.movementRange}</p>
                  <div className="h-[200px] flex items-end gap-2">
                    {animal.activityByTime?.map((time) => (
                      <div key={time.timeOfDay} className="flex-1 flex flex-col items-center gap-2">
                        <div
                          className="w-full bg-primary rounded-t-md"
                          style={{ height: `${time.movement * 20}px` }}
                        ></div>
                        <span className="text-xs">{time.timeOfDay}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Rest vs Activity Balance</CardTitle>
                <CardDescription>Overall activity distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{animal.restActivity}</p>
                <div className="w-full h-8 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{
                      width: animal.restActivity ? animal.restActivity.split(",")[1].trim().split("%")[0] + "%" : "30%",
                    }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="health">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Vital Signs</CardTitle>
                <CardDescription>Current health metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Heart Rate:</span>
                    <span className="text-sm">{animal.vitals?.heartRate || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Temperature:</span>
                    <span className="text-sm">{animal.vitals?.temperature || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Activity Level:</span>
                    <span className="text-sm">{animal.vitals?.activity || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Last Checked:</span>
                    <span className="text-sm">{animal.vitals?.lastChecked || "N/A"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Health Trends</CardTitle>
                <CardDescription>6-month health status</CardDescription>
              </CardHeader>
              <CardContent>
                <AnimalHealthChart animal={animal} />
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Health Assessment</CardTitle>
                <CardDescription>Current condition and recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{animal.description}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Medical History</CardTitle>
              <CardDescription>Past treatments and observations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {animal.history?.map((record, index) => (
                  <div key={index} className="relative pl-6 pb-6 border-l border-muted">
                    <div className="absolute left-0 top-0 w-3 h-3 -translate-x-1.5 rounded-full bg-primary"></div>
                    <time className="text-sm text-muted-foreground">{record.date}</time>
                    <h3 className="text-base font-medium mt-1">{record.event}</h3>
                    <p className="text-sm mt-1">{record.notes}</p>
                  </div>
                ))}
                {!animal.history?.length && (
                  <p className="text-muted-foreground text-center py-8">No medical history records available.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
