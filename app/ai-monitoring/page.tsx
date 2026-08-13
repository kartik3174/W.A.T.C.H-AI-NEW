"use client"

import { PageHeader } from "@/components/dashboard/page-header"
import { AIMonitoringClient } from "./client"
import { LeafDecoration } from "@/components/leaf-decoration"
import { useLanguage } from "@/contexts/language-context"

export default function AIMonitoringPage() {
  const { t } = useLanguage()

  return (
    <div className="container mx-auto py-6 relative">
      <LeafDecoration position="top-right" size="lg" opacity={0.05} className="hidden lg:block" />
      <LeafDecoration position="bottom-left" size="md" rotation={45} opacity={0.05} className="hidden lg:block" />

      <PageHeader 
        title={t("ai.monitoring") || "AI Monitoring"} 
        description={t("monitor.subtitle") || "Advanced AI-powered wildlife monitoring and analysis"} 
      />
      <AIMonitoringClient />
    </div>
  )
}
