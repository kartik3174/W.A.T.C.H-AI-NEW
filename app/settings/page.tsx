import type { Metadata } from "next"
import { PageHeader } from "@/components/dashboard/page-header"
import { SettingsPanel } from "@/components/settings/settings-panel"
import { LeafDecoration } from "@/components/leaf-decoration"

export const metadata: Metadata = {
  title: "Settings | W.A.T.C.H",
  description: "Configure your application settings and preferences",
}

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-6 relative">
      <LeafDecoration position="top-right" size="lg" opacity={0.05} className="hidden lg:block" />
      <LeafDecoration position="bottom-left" size="md" rotation={45} opacity={0.05} className="hidden lg:block" />

      <PageHeader title="Settings" description="Configure your application settings and preferences" />
      <SettingsPanel />
    </div>
  )
}
