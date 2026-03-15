"use client"

import Link from "next/link"
import { AnimalDashboard } from "@/components/dashboard/animal-dashboard"
import { Button } from "@/components/ui/button"
import { ExternalLink, Settings } from "lucide-react"
import { ClientErrorBoundary } from "@/components/client-error-boundary"
import { PageTransition } from "@/components/page-transition"
import { CommandCenterLayout } from "@/components/command-center/command-center-layout"
import {
  BottomPanelActivityLog,
} from "@/components/command-center/command-center-panels"

export default function DashboardPage() {
  const topBar = (
    <div className="flex items-center gap-3">
      <Button
        variant="ghost"
        size="sm"
        className="text-foreground hover:bg-[#14532D]"
      >
        <Settings className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        asChild
        size="sm"
        className="text-foreground border-border hover:bg-[#14532D]"
      >
        <Link href="/action-view">
          <ExternalLink className="mr-2 h-3 w-3" />
          Actions
        </Link>
      </Button>
    </div>
  )

  const bottomPanel = (
    <BottomPanelActivityLog />
  )

  const centerContent = (
    <ClientErrorBoundary>
      <AnimalDashboard />
    </ClientErrorBoundary>
  )

  return (
    <PageTransition>
      <CommandCenterLayout topBar={topBar} bottomPanel={bottomPanel}>
        {centerContent}
      </CommandCenterLayout>
    </PageTransition>
  )
}
