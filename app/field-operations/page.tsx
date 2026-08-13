import { Suspense } from "react"
import { ProtectedComponent } from "@/components/rbac/protected-component"
import { Permission, UserRole } from "@/types/rbac"
import { IncidentRecorder } from "@/components/field-ranger/incident-recorder"
import { GPSTrackerDisplay } from "@/components/field-ranger/gps-tracker-display"
import { PageTransition } from "@/components/page-transition"

export const metadata = {
  title: "Field Operations - W.A.T.C.H",
  description: "Field ranger mode with offline incident reporting and GPS tracking",
}

export default function FieldOperationsPage() {
  return (
    <PageTransition>
      <ProtectedComponent
        permissions={[Permission.ACCESS_FIELD_MODE]}
        roles={[UserRole.RANGER, UserRole.ADMIN]}
        fallback={
          <div className="p-6 text-center text-gray-600">
            You do not have access to Field Operations. Please contact an administrator.
          </div>
        }
      >
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Field Operations
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Offline incident reporting and GPS tracking for field rangers
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded-lg" />}>
              <GPSTrackerDisplay />
            </Suspense>

            <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded-lg" />}>
              <IncidentRecorder />
            </Suspense>
          </div>

          <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
              Offline Mode Tips
            </h3>
            <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
              <li>• GPS tracking and incident reports work offline</li>
              <li>• Data syncs automatically when connection is restored</li>
              <li>• All records are stored locally on your device</li>
              <li>• Check sync status in settings</li>
            </ul>
          </div>
        </div>
      </ProtectedComponent>
    </PageTransition>
  )
}
