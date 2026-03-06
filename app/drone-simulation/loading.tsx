import { LoadingAnimation } from "@/components/loading-animation"

export default function DroneSimulationLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <LoadingAnimation />
    </div>
  )
}
