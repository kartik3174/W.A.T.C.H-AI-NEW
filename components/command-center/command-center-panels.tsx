'use client'

import { AlertTriangle, Activity, AlertCircle, Zap, Users, TrendingUp } from 'lucide-react'
import { CommandCenterCard, StatusBadge, MetricCard } from './command-center-layout'

export function RightPanelAlerts() {
  const alerts = [
    {
      id: 1,
      title: 'Geofence Breach Detected',
      animal: 'Elephant - Tusker',
      severity: 'alert',
      time: '2 minutes ago',
    },
    {
      id: 2,
      title: 'Health Alert',
      animal: 'Rhino - Titans',
      severity: 'warning',
      time: '15 minutes ago',
    },
    {
      id: 3,
      title: 'Drone Battery Low',
      animal: 'Drone Unit 3',
      severity: 'info',
      time: '22 minutes ago',
    },
  ]

  return (
    <CommandCenterCard title="Active Alerts" icon={AlertTriangle}>
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div key={alert.id} className="bg-[#0F172A] border border-[#14532D] rounded-lg p-3">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h4 className="text-sm font-medium text-[#E5E7EB]">{alert.title}</h4>
              <StatusBadge status={alert.severity as any} label={alert.severity} />
            </div>
            <p className="text-xs text-[#9CA3AF]">{alert.animal}</p>
            <p className="text-xs text-[#6B7280] mt-1">{alert.time}</p>
          </div>
        ))}
      </div>
    </CommandCenterCard>
  )
}

export function RightPanelInsights() {
  const insights = [
    {
      title: 'Movement Pattern Change',
      description: 'Lion pride showing unusual northern movement',
      icon: TrendingUp,
      color: 'text-[#F59E0B]',
    },
    {
      title: 'Poaching Risk Increase',
      description: 'High-risk zone activity detected near reserve border',
      icon: AlertCircle,
      color: 'text-[#DC2626]',
    },
    {
      title: 'Weather Impact',
      description: 'Storm approaching - animal sheltering behavior expected',
      icon: Activity,
      color: 'text-[#2563EB]',
    },
  ]

  return (
    <CommandCenterCard title="AI Insights" icon={Activity}>
      <div className="space-y-3">
        {insights.map((insight, idx) => {
          const Icon = insight.icon
          return (
            <div key={idx} className="bg-[#0F172A] border border-[#14532D] rounded-lg p-3">
              <div className="flex items-start gap-3">
                <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${insight.color}`} />
                <div>
                  <h4 className="text-sm font-medium text-[#E5E7EB]">{insight.title}</h4>
                  <p className="text-xs text-[#9CA3AF] mt-1">{insight.description}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </CommandCenterCard>
  )
}

export function OperationalMetrics() {
  return (
    <CommandCenterCard title="Operational Status" icon={Zap}>
      <div className="grid grid-cols-2 gap-3">
        <MetricCard label="Animals Tracked" value="47" icon={Users} />
        <MetricCard label="Drones Active" value="6" icon={Zap} />
        <MetricCard label="Active Alerts" value="3" icon={AlertTriangle} />
        <MetricCard label="System Health" value="98" unit="%" />
      </div>
    </CommandCenterCard>
  )
}

export function BottomPanelDroneMissions() {
  const missions = [
    {
      id: 'M001',
      drone: 'Unit 1',
      status: 'active',
      target: 'Elephant - Tusker (Breach)',
      progress: 75,
      eta: '5 min',
    },
    {
      id: 'M002',
      drone: 'Unit 3',
      status: 'returning',
      target: 'Patrol Grid A',
      progress: 45,
      eta: '8 min',
    },
    {
      id: 'M003',
      drone: 'Unit 5',
      status: 'charging',
      target: 'Standby',
      progress: 60,
      eta: 'Ready in 12 min',
    },
  ]

  return (
    <CommandCenterCard title="Drone Mission Status" icon={Zap} className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {missions.map((mission) => (
          <div key={mission.id} className="bg-[#0F172A] border border-[#14532D] rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="text-sm font-semibold text-[#E5E7EB]">{mission.drone}</h4>
                <p className="text-xs text-[#9CA3AF]">{mission.id}</p>
              </div>
              <StatusBadge
                status={
                  mission.status === 'active'
                    ? 'active'
                    : mission.status === 'returning'
                      ? 'warning'
                      : 'info'
                }
                label={mission.status}
              />
            </div>
            <p className="text-sm text-[#E5E7EB] mb-3">{mission.target}</p>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-[#9CA3AF] mb-1">
                <span>Progress</span>
                <span>{mission.progress}%</span>
              </div>
              <div className="w-full bg-[#111827] border border-[#14532D] rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#0B3D2E] to-[#16A34A] h-full transition-all duration-300"
                  style={{ width: `${mission.progress}%` }}
                />
              </div>
              <p className="text-xs text-[#2563EB] mt-2">ETA: {mission.eta}</p>
            </div>
          </div>
        ))}
      </div>
    </CommandCenterCard>
  )
}

export function BottomPanelActivityLog() {
  const activities = [
    { time: '14:32', event: 'Geofence breach detected - Elephant (Tusker)', type: 'alert' },
    { time: '14:28', event: 'Drone Unit 1 deployed for incident response', type: 'action' },
    { time: '14:15', event: 'Health check completed for all tracked animals', type: 'info' },
    { time: '14:02', event: 'AI model updated with new behavioral patterns', type: 'system' },
  ]

  return (
    <CommandCenterCard title="Activity Log" icon={Activity}>
      <div className="space-y-2 max-h-32 overflow-y-auto">
        {activities.map((activity, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 pb-2 border-b border-[#14532D] last:border-0"
          >
            <span className="text-xs font-mono text-[#2563EB] flex-shrink-0">{activity.time}</span>
            <p className="text-xs text-[#9CA3AF]">{activity.event}</p>
          </div>
        ))}
      </div>
    </CommandCenterCard>
  )
}
