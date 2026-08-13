import type { Metadata } from "next"
import { BarChart3 } from "lucide-react"
import { PageHeader } from "@/components/dashboard/page-header"
import { HealthDashboard } from "@/components/analytics/health-dashboard"
import { LeafDecoration } from "@/components/leaf-decoration"

export const metadata: Metadata = {
  title: "Analytics | W.A.T.C.H",
  description: "Advanced analytics and insights for wildlife conservation data",
}

export default function AnalyticsPage() {
  return (
    <div className="container mx-auto py-6 relative">
      <LeafDecoration position="top-right" size="lg" opacity={0.05} className="hidden lg:block" />
      <LeafDecoration position="bottom-left" size="md" rotation={45} opacity={0.05} className="hidden lg:block" />

      <PageHeader
        title="Health Analytics"
        description="Monitor animal health status, interventions, and trends"
        icon={<BarChart3 className="h-6 w-6 text-forest-green" />}
      />
      <HealthDashboard />
    </div>
  )
}
