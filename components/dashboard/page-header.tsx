import type React from "react"
import { WatchLogo } from "@/components/watch-logo"

interface PageHeaderProps {
  title: string
  description?: string
  children?: React.ReactNode
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b">
      <div className="flex items-center gap-3">
        <div className="hidden sm:block">
          <WatchLogo size={36} />
        </div>
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">{title}</h1>
          {description && <p className="text-muted-foreground mt-1">{description}</p>}
        </div>
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  )
}
