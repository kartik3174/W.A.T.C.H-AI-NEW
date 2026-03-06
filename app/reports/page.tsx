import type { Metadata } from "next"
import { PageHeader } from "@/components/dashboard/page-header"
import { ReportsOverview } from "@/components/tools/reports-overview"
import { LeafDecoration } from "@/components/leaf-decoration"

export const metadata: Metadata = {
  title: "Reports | W.A.T.C.H",
  description: "Generate and view detailed reports on wildlife conservation data",
}

export default function ReportsPage() {
  return (
    <div className="container mx-auto py-6 relative">
      <LeafDecoration position="top-right" size="lg" opacity={0.05} className="hidden lg:block" />
      <LeafDecoration position="bottom-left" size="md" rotation={45} opacity={0.05} className="hidden lg:block" />

      <PageHeader
        title="Conservation Reports"
        description="Generate and access detailed reports on wildlife monitoring and conservation efforts"
      />
      <ReportsOverview />
    </div>
  )
}
