import { Suspense } from "react"
import { MigrationAnalyzer } from "@/components/research/migration-analyzer"
import { PopulationAnalysis } from "@/components/research/population-analysis"
import { PageTransition } from "@/components/page-transition"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageHeader } from "@/components/dashboard/page-header"

export const metadata = {
  title: "Research & Conservation - W.A.T.C.H",
  description: "Migration patterns, population analytics, and seasonal trends",
}

export default function ResearchPage() {
  return (
    <PageTransition>
      <div className="container mx-auto py-6">
        <PageHeader title="Research & Conservation Insights" description="Analyze migration patterns, population dynamics, and conservation trends" />
        <Tabs defaultValue="migration" className="w-full mt-6">
          <TabsList className="grid w-full grid-cols-2 bg-[#111827] border border-[#14532D]">
            <TabsTrigger value="migration">Migration Patterns</TabsTrigger>
            <TabsTrigger value="population">Population Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="migration" className="space-y-6 mt-6">
            <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded-lg" />}>
              <MigrationAnalyzer />
            </Suspense>
          </TabsContent>

          <TabsContent value="population" className="space-y-6 mt-6">
            <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded-lg" />}>
              <PopulationAnalysis />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  )
}
