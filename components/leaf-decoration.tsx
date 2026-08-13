import { Leaf } from "lucide-react"
import { cn } from "@/lib/utils"

interface LeafDecorationProps {
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center-left" | "center-right"
  rotation?: number
  opacity?: number
}

export function LeafDecoration({
  className,
  size = "md",
  position = "top-right",
  rotation = -12,
  opacity = 0.1,
}: LeafDecorationProps) {
  const sizeMap = {
    sm: "h-16 w-16",
    md: "h-24 w-24",
    lg: "h-32 w-32",
    xl: "h-48 w-48",
  }

  const positionMap = {
    "top-left": "top-0 left-0",
    "top-right": "top-0 right-0",
    "bottom-left": "bottom-0 left-0",
    "bottom-right": "bottom-0 right-0",
    "center-left": "top-1/2 -translate-y-1/2 left-0",
    "center-right": "top-1/2 -translate-y-1/2 right-0",
  }

  return (
    <div
      className={cn("absolute pointer-events-none z-0", positionMap[position], sizeMap[size], className)}
      style={{
        transform: `rotate(${rotation}deg)`,
        opacity,
      }}
    >
      <Leaf className="h-full w-full text-wildlife-green" />
    </div>
  )
}
