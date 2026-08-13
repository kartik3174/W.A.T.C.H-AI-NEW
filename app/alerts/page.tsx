import type { Metadata } from "next"
import { PageHeader } from "@/components/dashboard/page-header"
import { AlertsOverview } from "@/components/tools/alerts-overview"
import { LeafDecoration } from "@/components/leaf-decoration"

export const metadata: Metadata = {
  title: "Alerts | W.A.T.C.H",
  description: "Monitor and respond to wildlife conservation alerts and notifications",
}

export default function AlertsPage() {
  return (
    <div className="container mx-auto py-6 relative">
      <LeafDecoration position="top-right" size="lg" opacity={0.05} className="hidden lg:block" />
      <LeafDecoration position="bottom-left" size="md" rotation={45} opacity={0.05} className="hidden lg:block" />

      <PageHeader
        title="Conservation Alerts"
        description="Monitor and respond to critical alerts about wildlife and habitat"
      />
      <AlertsOverview />
    </div>
  )
}
