import { Suspense } from "react"
import { ThreatAnalysisDashboard } from "@/components/anti-poaching/threat-analysis-dashboard"
import { PatrolRoutePlanner } from "@/components/anti-poaching/patrol-route-planner"
import { PageTransition } from "@/components/page-transition"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageHeader } from "@/components/dashboard/page-header"

export const metadata = {
  title: "Anti-Poaching Intelligence - W.A.T.C.H",
  description: "Monitor threats, analyze poaching risks, and plan patrol routes",
}

export default function AntiPoachingPage() {
  return (
    <PageTransition>
      <div className="container mx-auto py-6">
        <PageHeader title="Anti-Poaching Intelligence" description="Monitor threats, analyze poaching risks, and plan patrol routes" />
        
        <Tabs defaultValue="threats" className="w-full mt-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="threats">Threat Analysis</TabsTrigger>
            <TabsTrigger value="patrols">Patrol Routes</TabsTrigger>
          </TabsList>

          <TabsContent value="threats" className="space-y-6 mt-6">
            <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded-lg" />}>
              <ThreatAnalysisDashboard />
            </Suspense>
          </TabsContent>

          <TabsContent value="patrols" className="space-y-6 mt-6">
            <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded-lg" />}>
              <PatrolRoutePlanner />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  )
}
