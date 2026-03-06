'use client'

import { ReactNode } from 'react'
import { AlertCircle, Activity, Zap, BarChart3 } from 'lucide-react'

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
  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-[#0F172A] to-[#111827] overflow-hidden">
      {/* Top Bar - System Status and Controls */}
      <div className="border-b border-[#14532D] bg-[#0F172A] shadow-lg flex-shrink-0">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-[#E5E7EB] tracking-wide">
              W.A.T.C.H Command Center
            </h1>
            <div className="flex gap-3 ml-6">
              <div className="flex items-center gap-2 px-3 py-1 bg-[#0B3D2E] rounded-full border border-[#16A34A]">
                <div className="w-2 h-2 bg-[#16A34A] rounded-full animate-pulse" />
                <span className="text-xs text-[#16A34A] font-medium">System Active</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-[#1C2A3A] rounded-full border border-[#2563EB]">
                <Activity className="w-3 h-3 text-[#2563EB]" />
                <span className="text-xs text-[#2563EB] font-medium">Monitoring</span>
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
    <div className={`bg-[#111827] border border-[#14532D] rounded-lg shadow-lg overflow-hidden ${className}`}>
      <div className="bg-gradient-to-r from-[#0B3D2E] to-[#14532D] px-6 py-4 border-b border-[#14532D] flex items-center gap-3">
        {Icon && <Icon className="w-5 h-5 text-[#16A34A]" />}
        <h3 className="text-base font-semibold text-[#E5E7EB]">{title}</h3>
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
      bg: 'bg-[#0B3D2E]',
      border: 'border-[#16A34A]',
      dot: 'bg-[#16A34A]',
      text: 'text-[#16A34A]',
    },
    warning: {
      bg: 'bg-[#3F2A00]',
      border: 'border-[#F59E0B]',
      dot: 'bg-[#F59E0B]',
      text: 'text-[#F59E0B]',
    },
    alert: {
      bg: 'bg-[#3F0000]',
      border: 'border-[#DC2626]',
      dot: 'bg-[#DC2626]',
      text: 'text-[#DC2626]',
    },
    info: {
      bg: 'bg-[#0F2A4A]',
      border: 'border-[#2563EB]',
      dot: 'bg-[#2563EB]',
      text: 'text-[#2563EB]',
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
    <div className="bg-[#111827] border border-[#14532D] rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-[#9CA3AF] uppercase tracking-wider mb-1">{label}</p>
          <p className="text-2xl font-bold text-[#E5E7EB]">
            {value}{unit && <span className="text-sm text-[#9CA3AF] ml-1">{unit}</span>}
          </p>
        </div>
        {Icon && <Icon className="w-6 h-6 text-[#0B3D2E]" />}
      </div>
    </div>
  )
}
