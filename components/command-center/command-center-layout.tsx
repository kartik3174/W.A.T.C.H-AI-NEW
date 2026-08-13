'use client'

import { ReactNode } from 'react'
import { AlertCircle, Activity, Zap, BarChart3 } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

interface CommandCenterLayoutProps {
  children: ReactNode
  topBar?: ReactNode
  rightPanel?: ReactNode
  bottomPanel?: ReactNode
}

export function CommandCenterLayout({
  children,
  topBar,
  rightPanel,
  bottomPanel,
}: CommandCenterLayoutProps) {
  const { t } = useLanguage()
  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Top Bar - System Status and Controls */}
      <div className="border-b border-border bg-background shadow-lg flex-shrink-0">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-foreground tracking-wide">
              {t("command.center") || "W.A.T.C.H Command Center"}
            </h1>
            <div className="flex gap-3 ml-6">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30" style={{ backgroundColor: "hsl(var(--status-active-bg))" }}>
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-xs font-medium" style={{ color: "hsl(var(--status-active-text))" }}>{t("system.active") || "System Active"}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-info/30" style={{ backgroundColor: "hsl(var(--status-mon-bg))" }}>
                <Activity className="w-3 h-3 text-info" />
                <span className="text-xs font-medium" style={{ color: "hsl(var(--status-mon-text))" }}>{t("monitoring") || "Monitoring"}</span>
              </div>
            </div>
          </div>
          {topBar}
        </div>
      </div>

      {/* Main Content Area - Full Width Single Column */}
      <div className="flex-1 overflow-y-auto">
        <div className="w-full max-w-7xl mx-auto p-6">
          <div className="space-y-6">
            {/* Main Content - Tabs and Dashboard */}
            {children}
            
            {/* Bottom Panels - Stacked Vertically */}
            {bottomPanel && (
              <div className="space-y-6">
                {bottomPanel}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function CommandCenterCard({
  title,
  icon: Icon,
  children,
  className = '',
}: {
  title: string
  icon?: any
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`bg-card border border-border rounded-lg shadow-lg overflow-hidden ${className}`}>
      <div className="bg-gradient-to-r from-primary/90 to-primary px-6 py-4 border-b border-border flex items-center gap-3">
        {Icon && <Icon className="w-5 h-5 text-accent" />}
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  )
}

export function StatusBadge({
  status,
  label,
}: {
  status: 'active' | 'warning' | 'alert' | 'info'
  label: string
}) {
  const statusConfig = {
    active: {
      bg: 'bg-primary/10',
      border: 'border-primary',
      dot: 'bg-primary',
      text: 'text-primary',
    },
    warning: {
      bg: 'bg-warning/10',
      border: 'border-warning',
      dot: 'bg-warning',
      text: 'text-warning',
    },
    alert: {
      bg: 'bg-destructive/10',
      border: 'border-destructive',
      dot: 'bg-destructive',
      text: 'text-destructive',
    },
    info: {
      bg: 'bg-info/10',
      border: 'border-info',
      dot: 'bg-info',
      text: 'text-info',
    },
  }

  const config = statusConfig[status]

  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${config.bg} ${config.border}`}>
      <div className={`w-2 h-2 rounded-full ${config.dot} animate-pulse`} />
      <span className={`text-xs font-medium ${config.text}`}>{label}</span>
    </div>
  )
}

export function MetricCard({
  label,
  value,
  unit,
  icon: Icon,
}: {
  label: string
  value: string | number
  unit?: string
  icon?: any
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
          <p className="text-2xl font-bold text-foreground">
            {value}{unit && <span className="text-sm text-muted-foreground ml-1">{unit}</span>}
          </p>
        </div>
        {Icon && <Icon className="w-6 h-6 text-[#0B3D2E]" />}
      </div>
    </div>
  )
}
