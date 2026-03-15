"use client"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { HealthUpdates } from "@/components/animal-care/health-updates"
import { CareRecommendations } from "@/components/animal-care/care-recommendations"
import { VeterinaryHistory } from "@/components/animal-care/veterinary-history"
import { BarChart3, ArrowRight } from "lucide-react"

export function AnimalCareHub() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="health" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-card border-border">
          <TabsTrigger value="health" className="text-foreground data-[state=active]:bg-secondary">Health Updates</TabsTrigger>
          <TabsTrigger value="recommendations" className="text-foreground data-[state=active]:bg-secondary">Care Recommendations</TabsTrigger>
          <TabsTrigger value="history" className="text-foreground data-[state=active]:bg-secondary">Veterinary History</TabsTrigger>
        </TabsList>

        <TabsContent value="health" className="space-y-6">
          <HealthUpdates />
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <CareRecommendations />
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <VeterinaryHistory />
        </TabsContent>
      </Tabs>

      {/* Analytics Link Card */}
      <Card className="border-border bg-background">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <BarChart3 className="h-5 w-5 text-accent" />
            Health Analytics & Trends
          </CardTitle>
          <CardDescription className="text-muted-foreground">View detailed health statistics and insights</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Access comprehensive health status distribution, behavioral trends, and detailed animal health profiles in the Analytics module.
          </p>
          <Button
            asChild
            className="w-full bg-primary hover:bg-primary/90 text-white"
          >
            <Link href="/analytics" className="flex items-center justify-center gap-2">
              View Analytics
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
