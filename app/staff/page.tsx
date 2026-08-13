import type { Metadata } from "next"
import { PageHeader } from "@/components/dashboard/page-header"
import { StaffProfiles } from "@/components/staff/staff-profiles"
import { LeafDecoration } from "@/components/leaf-decoration"

export const metadata: Metadata = {
  title: "Conservation Team | W.A.T.C.H",
  description: "Meet our dedicated wildlife conservation team",
}

export default function StaffPage() {
  return (
    <div className="container mx-auto py-6 relative">
      <LeafDecoration position="top-right" size="lg" opacity={0.05} className="hidden lg:block" />
      <LeafDecoration position="bottom-left" size="md" rotation={45} opacity={0.05} className="hidden lg:block" />

      <PageHeader
        title="Conservation Team"
        description="Meet the dedicated professionals behind our wildlife conservation efforts"
      />
      <StaffProfiles />
    </div>
  )
}
