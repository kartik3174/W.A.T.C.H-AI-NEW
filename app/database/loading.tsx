import { PageHeader } from "@/components/dashboard/page-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Database, Camera, AlertTriangle } from "lucide-react"
import { LeafDecoration } from "@/components/leaf-decoration"

export default function DatabaseLoading() {
  return (
    <div className="container mx-auto py-6 space-y-6 relative">
      <LeafDecoration position="top-right" size="lg" opacity={0.1} className="hidden lg:block" />
      <LeafDecoration position="bottom-left" size="md" rotation={45} opacity={0.1} className="hidden lg:block" />

      <PageHeader
        title="Wildlife Database"
        description="Manage wildlife data, cameras, and alerts"
        icon={<Database className="h-6 w-6" />}
      />

      <Tabs defaultValue="animals" className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
          <TabsTrigger value="animals" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Animals
          </TabsTrigger>
          <TabsTrigger value="cameras" className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Cameras
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Alerts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="animals">
          <Card>
            <CardHeader className="h-[76px]">
              <Skeleton className="h-8 w-[250px]" />
              <Skeleton className="h-4 w-[350px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-full mb-4" />
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
