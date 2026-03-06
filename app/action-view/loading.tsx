import { PageHeader } from "@/components/dashboard/page-header"
import { Skeleton } from "@/components/ui/skeleton"

export default function ActionViewLoading() {
  return (
    <div className="container mx-auto py-6">
      <PageHeader title="Animal Action View" description="View and manage actions for wildlife conservation" />

      <div className="mt-6 p-6 border rounded-lg bg-card">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-4 w-full max-w-md mb-6" />

        <div className="mt-6 grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 border rounded-md">
              <Skeleton className="h-5 w-40 mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-32 mt-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
