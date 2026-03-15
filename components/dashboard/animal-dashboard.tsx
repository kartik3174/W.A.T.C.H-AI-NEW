"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { animals } from "@/components/dashboard/animal-table"
import { AlertCircle, Heart, Activity, Zap, BarChart3, ArrowRight } from "lucide-react"

export function AnimalDashboard() {
  const totalAnimals = animals.length
  const healthyAnimals = animals.filter(a => a.status === "Excellent" || a.status === "Good").length
  const alertsCount = animals.filter(a => a.status === "Critical" || a.status === "Fair").length
  const activeNow = Math.round(animals.length * 0.85)

  return (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Total Animals</CardTitle>
            <Activity className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalAnimals}</div>
            <p className="text-xs text-muted-foreground mt-1">Currently tracked</p>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Healthy Animals</CardTitle>
            <Heart className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{healthyAnimals}</div>
            <p className="text-xs text-muted-foreground mt-1">{Math.round((healthyAnimals/totalAnimals)*100)}% of total</p>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Active Alerts</CardTitle>
            <AlertCircle className="h-4 w-4 text-[#DC2626]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{alertsCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Require attention</p>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Active Now</CardTitle>
            <Zap className="h-4 w-4 text-[#2563EB]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{activeNow}</div>
            <p className="text-xs text-muted-foreground mt-1">In field monitoring</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Summary */}
      <Card className="border border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">System Status</CardTitle>
          <CardDescription className="text-muted-foreground">Quick overview of conservation operations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start space-x-3">
              <div className="h-2 w-2 bg-primary rounded-full mt-2" />
              <div>
                <p className="text-sm font-medium text-foreground">All Systems Operational</p>
                <p className="text-xs text-muted-foreground">Tracking, monitoring, and alerts active</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="h-2 w-2 bg-primary rounded-full mt-2" />
              <div>
                <p className="text-sm font-medium text-foreground">Data Sync: Current</p>
                <p className="text-xs text-muted-foreground">Last update 2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="h-2 w-2 bg-primary rounded-full mt-2" />
              <div>
                <p className="text-sm font-medium text-foreground">Network Status: Connected</p>
                <p className="text-xs text-muted-foreground">All devices reporting</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Preview */}
      <Card className="border border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Recent Activity</CardTitle>
          <CardDescription className="text-muted-foreground">Latest events and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-border">
              <p className="text-sm text-foreground">Health check completed for all animals</p>
              <p className="text-xs text-muted-foreground">14:15</p>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <p className="text-sm text-foreground">Drone Unit 1 deployment for incident</p>
              <p className="text-xs text-muted-foreground">14:29</p>
            </div>
            <div className="flex items-center justify-between py-2">
              <p className="text-sm text-foreground">Geofence breach detected - Elephant</p>
              <p className="text-xs text-muted-foreground">14:32</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Insights Card */}
      <Card className="border border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <BarChart3 className="h-5 w-5 text-accent" />
            Analytics & Insights
          </CardTitle>
          <CardDescription className="text-muted-foreground">View comprehensive health statistics and trends</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Access detailed health status distribution, behavioral trends analysis, and animal health profiles in the dedicated Analytics module.
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
