"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { PageHeader } from "@/components/dashboard/page-header"
import { BreachSimulator } from "@/components/geofence/breach-simulator"
import { LeafDecoration } from "@/components/leaf-decoration"
import { AlertTriangle, Radio, Shield, Zap, CheckCircle } from "lucide-react"
import { getAutoLaunchConfig, setAutoLaunchEnabled, isAutoLaunchEnabled } from "@/app/drone-response/autoLaunchHandler"
import { getActiveListeners } from "@/app/geofence-events/eventTypes"

export default function GeofenceDemoPage() {
  const [autoLaunchEnabled, setAutoLaunchEnabledState] = useState(false)
  const [listenerCount, setListenerCount] = useState(0)
  const [config, setConfig] = useState(getAutoLaunchConfig())

  useEffect(() => {
    // Initialize state
    setAutoLaunchEnabledState(isAutoLaunchEnabled())
    setListenerCount(getActiveListeners())

    // Poll for listener updates
    const interval = setInterval(() => {
      setListenerCount(getActiveListeners())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleToggleAutoLaunch = (enabled: boolean) => {
    setAutoLaunchEnabled(enabled)
    setAutoLaunchEnabledState(enabled)
    setConfig(getAutoLaunchConfig())
  }

  return (
    <div className="container mx-auto py-6 space-y-6 relative">
      {/* Decorative elements */}
      <LeafDecoration position="top-right" size="lg" opacity={0.1} className="hidden lg:block" />
      <LeafDecoration position="bottom-left" size="md" rotation={45} opacity={0.1} className="hidden lg:block" />

      <PageHeader
        title="Geofence Breach Response System"
        description="Autonomous drone deployment triggered by wildlife boundary violations"
        icon={<Shield className="h-6 w-6" />}
      />

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${autoLaunchEnabled ? "bg-ai-cyan animate-pulse" : "bg-gray-500"}`} />
              <span className="text-sm">{autoLaunchEnabled ? "Active" : "Inactive"}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Active Listeners</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-ai-cyan">{listenerCount}</p>
            <p className="text-xs text-muted-foreground">Monitoring threads</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Min Severity</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary" className="capitalize">
              {config.minSeverity}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="simulator">Breach Simulator</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
              <CardDescription>The autonomous boundary protection pipeline</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {/* Step 1 */}
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ai-cyan text-ai-midnight font-semibold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Animal Tracking Monitor</h4>
                    <p className="text-sm text-muted-foreground">
                      System continuously tracks animal positions within reserve boundaries
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ai-cyan text-ai-midnight font-semibold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Boundary Detection</h4>
                    <p className="text-sm text-muted-foreground">
                      Geofence listener detects when animal crosses reserve boundary
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ai-cyan text-ai-midnight font-semibold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Breach Event Emission</h4>
                    <p className="text-sm text-muted-foreground">
                      Geofence breach event is created with animal, location, and severity data
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ai-cyan text-ai-midnight font-semibold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Auto-Launch Handler</h4>
                    <p className="text-sm text-muted-foreground">
                      Handler validates event, checks severity, finds nearest drone base
                    </p>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ai-cyan text-ai-midnight font-semibold flex-shrink-0">
                    5
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Drone Deployment</h4>
                    <p className="text-sm text-muted-foreground">
                      Optimal drone is automatically deployed from nearest base with high priority
                    </p>
                  </div>
                </div>

                {/* Step 6 */}
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ai-cyan text-ai-midnight font-semibold flex-shrink-0">
                    6
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Live Tracking</h4>
                    <p className="text-sm text-muted-foreground">
                      Drone provides thermal/visual feed and follows animal outside protected zone
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Features */}
          <Card>
            <CardHeader>
              <CardTitle>Key Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-ai-cyan flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Non-Invasive Integration</p>
                  <p className="text-xs text-muted-foreground">Fully modular - does not modify existing tracking system</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-ai-cyan flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Automatic Response</p>
                  <p className="text-xs text-muted-foreground">Zero manual intervention - autonomous deployment</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-ai-cyan flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Priority Assignment</p>
                  <p className="text-xs text-muted-foreground">Boundary breach = high priority deployment</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-ai-cyan flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Base Optimization</p>
                  <p className="text-xs text-muted-foreground">Selects nearest ranger station for fastest response</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Simulator Tab */}
        <TabsContent value="simulator">
          {!autoLaunchEnabled && (
            <Alert className="mb-4 border-ai-cyan/50 bg-ai-navy/50">
              <AlertTriangle className="h-4 w-4 text-ai-cyan" />
              <AlertTitle>Auto-Launch Disabled</AlertTitle>
              <AlertDescription>
                Enable auto-launch in Settings to test autonomous drone deployment. Simulations will still emit events.
              </AlertDescription>
            </Alert>
          )}
          <BreachSimulator />
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Auto-Launch Configuration</CardTitle>
              <CardDescription>Control autonomous drone response behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-3 px-4 bg-ai-space/50 rounded-lg">
                <div>
                  <p className="font-semibold text-sm">Enable Auto-Launch</p>
                  <p className="text-xs text-muted-foreground">Automatically deploy drones on geofence breach</p>
                </div>
                <Switch checked={autoLaunchEnabled} onCheckedChange={handleToggleAutoLaunch} />
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold text-sm mb-3">Current Settings</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Enabled:</span>
                    <Badge variant={config.enabled ? "default" : "secondary"}>{config.enabled ? "Yes" : "No"}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Min Severity:</span>
                    <Badge variant="secondary" className="capitalize">
                      {config.minSeverity}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Auto Deploy:</span>
                    <Badge variant={config.autoDeployOnBreach ? "default" : "secondary"}>
                      {config.autoDeployOnBreach ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">User Notification:</span>
                    <Badge variant={config.notifyUser ? "default" : "secondary"}>
                      {config.notifyUser ? "Yes" : "No"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Integration</CardTitle>
              <CardDescription>How the feature integrates with existing systems</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="text-muted-foreground">
                ✓ Listens to geofence breach events from tracking system
              </p>
              <p className="text-muted-foreground">
                ✓ Emits threat events to drone response system via shared event bus
              </p>
              <p className="text-muted-foreground">
                ✓ No modifications to existing tracking or drone components
              </p>
              <p className="text-muted-foreground">
                ✓ Fully modular and can be enabled/disabled independently
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
