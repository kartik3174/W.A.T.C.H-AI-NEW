import { PageHeader } from "@/components/dashboard/page-header"

export default function ActionViewPage() {
  return (
    <div className="container mx-auto py-6">
      <PageHeader title="Animal Action View" description="View and manage actions for wildlife conservation" />

      <div className="mt-6 p-6 border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-4">Action Details</h2>
        <p className="text-muted-foreground">
          This page displays detailed information about conservation actions taken for specific animals.
        </p>

        <div className="mt-6 grid gap-4">
          <div className="p-4 border rounded-md">
            <h3 className="font-medium">Medical Treatment</h3>
            <p className="text-sm text-muted-foreground">
              Administered antibiotics to Raja (TI-004) for respiratory infection.
            </p>
            <p className="text-sm mt-2">Date: March 15, 2025</p>
          </div>

          <div className="p-4 border rounded-md">
            <h3 className="font-medium">Field Observation</h3>
            <p className="text-sm text-muted-foreground">
              Observed Tembo (EL-001) with calf at watering hole. Both appear healthy.
            </p>
            <p className="text-sm mt-2">Date: March 12, 2025</p>
          </div>

          <div className="p-4 border rounded-md">
            <h3 className="font-medium">Tracking Device Maintenance</h3>
            <p className="text-sm text-muted-foreground">Replaced battery in Simba's (LI-002) tracking collar.</p>
            <p className="text-sm mt-2">Date: March 10, 2025</p>
          </div>
        </div>
      </div>
    </div>
  )
}
