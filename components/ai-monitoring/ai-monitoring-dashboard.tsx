"use client"

import Link from "next/link"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThreatAlerts } from "@/components/ai-monitoring/threat-alerts"
import { PredictiveInsights } from "@/components/ai-monitoring/predictive-insights"
import { ActivityTimeline } from "@/components/ai-monitoring/activity-timeline"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, RefreshCw, BarChart3, ArrowRight } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ClientErrorBoundary } from "@/components/client-error-boundary"
import { useToast } from "@/hooks/use-toast"
import AiMonitor from "@/components/AiMonitor"

function AIMonitoringDashboard() {
  const [timeRange, setTimeRange] = useState<string>("7d")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("live-feed")
  const { toast } = useToast()

  const handleRefresh = () => {
    setIsRefreshing(true)
    // Simulate data refresh
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1500)
  }

  const handleExport = () => {
    try {
      const timestamp = new Date().toLocaleString()
      let csvContent = `AI Monitoring Export - ${activeTab}\nGenerated: ${timestamp}\n\n`

      switch (activeTab) {
        case "live-feed":
          csvContent +=
            "Tab: Live Feed\nNote: Live feed data is captured in real-time from the AI camera node."
          break
        case "patterns":
          csvContent +=
            "Tab: Behavioral Patterns\nNote: Use the export button within the Behavioral Patterns tab for detailed data."
          break
        case "threats":
          csvContent += "Tab: Threat Alerts\nNote: Threat alerts are monitored and logged in real-time."
          break
        case "insights":
          csvContent +=
            "Tab: Predictive Insights\nNote: Use the export button within the Predictive Insights tab for detailed data."
          break
        case "timeline":
          csvContent += "Tab: Activity Timeline\nNote: Timeline data shows recent activity events."
          break
      }

      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `ai-monitoring-${activeTab}-${Date.now()}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast({
        title: "Export Successful",
        description: `${activeTab} data has been exported`,
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export data",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="border-none shadow-none bg-transparent">
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Last 24 Hours</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="90d">Last 90 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 sm:flex-none bg-transparent"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                {isRefreshing ? "Refreshing..." : "Refresh Data"}
              </Button>
              <Button size="sm" className="flex-1 sm:flex-none" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="live-feed" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="w-full grid grid-cols-2 md:grid-cols-4 h-auto bg-[#111827] border-[#14532D]">
          <TabsTrigger value="live-feed" className="py-2 text-[#E5E7EB] data-[state=active]:bg-[#0B3D2E]">
            Live Feed
          </TabsTrigger>
          <TabsTrigger value="threats" className="py-2 text-[#E5E7EB] data-[state=active]:bg-[#0B3D2E]">
            Threat Alerts
          </TabsTrigger>
          <TabsTrigger value="insights" className="py-2 text-[#E5E7EB] data-[state=active]:bg-[#0B3D2E]">
            Predictive Insights
          </TabsTrigger>
          <TabsTrigger value="timeline" className="py-2 text-[#E5E7EB] data-[state=active]:bg-[#0B3D2E]">
            Activity Timeline
          </TabsTrigger>
        </TabsList>

        <TabsContent value="live-feed" className="space-y-6">
          <ClientErrorBoundary>
            <AiMonitor />
          </ClientErrorBoundary>
        </TabsContent>

        <TabsContent value="threats" className="space-y-6">
          <ClientErrorBoundary>
            <ThreatAlerts />
          </ClientErrorBoundary>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <ClientErrorBoundary>
            <PredictiveInsights />
          </ClientErrorBoundary>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <ClientErrorBoundary>
            <ActivityTimeline timeRange={timeRange} />
          </ClientErrorBoundary>
        </TabsContent>
      </Tabs>

      {/* Analytics Link Card */}
      <Card className="border-[#14532D] bg-[#0F172A]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#E5E7EB]">
            <BarChart3 className="h-5 w-5 text-[#16A34A]" />
            Comprehensive Analytics
          </CardTitle>
          <CardDescription className="text-[#9CA3AF]">View behavioral patterns and health trends</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[#9CA3AF] mb-4">
            Access detailed behavioral trends analysis, health status distribution, and comprehensive animal health profiles in the dedicated Analytics module.
          </p>
          <Button
            asChild
            className="w-full bg-[#16A34A] hover:bg-[#15803d] text-white"
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

// Export as default for dynamic import
export default AIMonitoringDashboard
