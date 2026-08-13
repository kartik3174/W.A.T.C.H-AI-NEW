"use client"

import { PageHeader } from "@/components/dashboard/page-header"
import { ReportsOverview } from "@/components/tools/reports-overview"
import { LeafDecoration } from "@/components/leaf-decoration"
import { useLanguage } from "@/contexts/language-context"

export default function ReportsPage() {
  const { t } = useLanguage()

  return (
    <div className="container mx-auto py-6 relative">
      <LeafDecoration position="top-right" size="lg" opacity={0.05} className="hidden lg:block" />
      <LeafDecoration position="bottom-left" size="md" rotation={45} opacity={0.05} className="hidden lg:block" />

      <PageHeader
        title={t("reports.title") || "Conservation Reports"}
        description={t("reports.description") || "Generate and access detailed reports on wildlife monitoring and conservation efforts"}
      />
      <ReportsOverview />
    </div>
  )
}
