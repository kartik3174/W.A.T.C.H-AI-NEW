import type { Metadata } from "next"
import { PageHeader } from "@/components/dashboard/page-header"
import { SearchInterface } from "@/components/tools/search-interface"
import { LeafDecoration } from "@/components/leaf-decoration"

export const metadata: Metadata = {
  title: "Search | W.A.T.C.H",
  description: "Search and find wildlife conservation data and records",
}

export default function SearchPage() {
  return (
    <div className="container mx-auto py-6 relative">
      <LeafDecoration position="top-right" size="lg" opacity={0.05} className="hidden lg:block" />
      <LeafDecoration position="bottom-left" size="md" rotation={45} opacity={0.05} className="hidden lg:block" />

      <PageHeader title="Conservation Search" description="Find and access wildlife data, reports, and records" />
      <SearchInterface />
    </div>
  )
}
