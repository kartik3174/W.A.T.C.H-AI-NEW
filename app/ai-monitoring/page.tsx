import type { Metadata } from "next"
import { PageHeader } from "@/components/dashboard/page-header"
import { AIMonitoringClient } from "./client"
import { LeafDecoration } from "@/components/leaf-decoration"

export const metadata: Metadata = {
  title: "AI Monitoring | W.A.T.C.H",
  description: "AI-powered wildlife monitoring and analysis",
}

export default function AIMonitoringPage() {
  return (
    <div className="container mx-auto py-6 relative">
      <LeafDecoration position="top-right" size="lg" opacity={0.05} className="hidden lg:block" />
      <LeafDecoration position="bottom-left" size="md" rotation={45} opacity={0.05} className="hidden lg:block" />

      <PageHeader title="AI Monitoring" description="Advanced AI-powered wildlife monitoring and analysis" />
      <AIMonitoringClient />
    </div>
  )
}
