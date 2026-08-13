import { Suspense } from "react"
import { DisasterEventTracker } from "@/components/disaster-management/disaster-event-tracker"
import { EvacuationPlanner } from "@/components/disaster-management/evacuation-planner"
import { PageTransition } from "@/components/page-transition"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageHeader } from "@/components/dashboard/page-header"

export const metadata = {
  title: "Disaster Management - W.A.T.C.H",
  description: "Monitor disaster events and coordinate wildlife evacuation plans",
}

export default function DisasterManagementPage() {
  return (
    <PageTransition>
      <div className="container mx-auto py-6">
        <PageHeader title="Wildlife Disaster Management" description="Monitor disaster events and coordinate wildlife evacuation plans" />
        <Tabs defaultValue="events" className="w-full mt-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="events">Disaster Events</TabsTrigger>
            <TabsTrigger value="evacuation">Evacuation Plans</TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-6 mt-6">
            <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded-lg" />}>
              <DisasterEventTracker />
            </Suspense>
          </TabsContent>

          <TabsContent value="evacuation" className="space-y-6 mt-6">
            <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded-lg" />}>
              <EvacuationPlanner />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  )
}
