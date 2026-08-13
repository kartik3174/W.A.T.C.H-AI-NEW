import { PageHeader } from "@/components/dashboard/page-header"
import { Skeleton } from "@/components/ui/skeleton"

export default function AIMonitoringLoading() {
  return (
    <div className="container mx-auto py-6">
      <PageHeader title="AI Monitoring" description="Advanced AI-powered wildlife monitoring and analysis" />
      <div className="mt-6 space-y-6">
        <Skeleton className="h-[400px] w-full rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-[300px] w-full rounded-lg" />
          <Skeleton className="h-[300px] w-full rounded-lg" />
        </div>
      </div>
    </div>
  )
}
