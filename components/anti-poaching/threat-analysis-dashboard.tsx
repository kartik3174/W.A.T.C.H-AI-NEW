"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, TrendingUp, Target, Eye } from "lucide-react"

interface ThreatMetrics {
  animalId: string
  animalName: string
  threatLevel: "low" | "medium" | "high" | "critical"
  poachingRiskScore: number
  movementAnomalyScore: number
  behavioralChangeScore: number
  lastHumanProximity?: Date
  lastSuspiciousActivity?: Date
}

interface ThreatAnalysisDashboardProps {
  threats?: ThreatMetrics[]
}

const THREAT_COLORS = {
  low: { bg: "bg-green-100", text: "text-green-800", badge: "bg-green-500" },
  medium: { bg: "bg-yellow-100", text: "text-yellow-800", badge: "bg-yellow-500" },
  high: { bg: "bg-orange-100", text: "text-orange-800", badge: "bg-orange-500" },
  critical: { bg: "bg-red-100", text: "text-red-800", badge: "bg-red-500" },
}

const mockThreats: ThreatMetrics[] = [
  {
    animalId: "ELE-001",
    animalName: "Tusker (Elephant)",
    threatLevel: "critical",
    poachingRiskScore: 92,
    movementAnomalyScore: 78,
    behavioralChangeScore: 65,
    lastHumanProximity: new Date(Date.now() - 2 * 60 * 60 * 1000),
    lastSuspiciousActivity: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    animalId: "RHI-042",
    animalName: "Black Rhino",
    threatLevel: "high",
    poachingRiskScore: 78,
    movementAnomalyScore: 62,
    behavioralChangeScore: 48,
    lastHumanProximity: new Date(Date.now() - 6 * 60 * 60 * 1000),
    lastSuspiciousActivity: new Date(Date.now() - 12 * 60 * 60 * 1000),
  },
  {
    animalId: "LIO-156",
    animalName: "Pride Leader (Lion)",
    threatLevel: "medium",
    poachingRiskScore: 45,
    movementAnomalyScore: 38,
    behavioralChangeScore: 32,
    lastHumanProximity: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    animalId: "LEO-089",
    animalName: "Spotted Leopard",
    threatLevel: "low",
    poachingRiskScore: 15,
    movementAnomalyScore: 12,
    behavioralChangeScore: 8,
  },
]

export const ThreatAnalysisDashboard = ({ threats = mockThreats }: ThreatAnalysisDashboardProps) => {
  const criticalCount = threats.filter((t) => t.threatLevel === "critical").length
  const highCount = threats.filter((t) => t.threatLevel === "high").length
  const averageRiskScore =
    threats.reduce((sum, t) => sum + t.poachingRiskScore, 0) / threats.length

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{criticalCount}</div>
              <p className="text-sm text-gray-600">Critical Threats</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{highCount}</div>
              <p className="text-sm text-gray-600">High Priority</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{threats.length}</div>
              <p className="text-sm text-gray-600">Monitored Animals</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold">{averageRiskScore.toFixed(0)}%</div>
              <p className="text-sm text-gray-600">Avg Risk Score</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Threat Details */}
      <div className="space-y-4">
        {threats.map((threat) => {
          const colors = THREAT_COLORS[threat.threatLevel]
          return (
            <Card key={threat.animalId} className={colors.bg}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className={`text-lg ${colors.text}`}>
                      {threat.animalName}
                    </CardTitle>
                    <p className="text-sm opacity-75">ID: {threat.animalId}</p>
                  </div>
                  <Badge className={`${colors.badge} text-white`}>
                    {threat.threatLevel.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className={`space-y-4 ${colors.text}`}>
                {threat.threatLevel === "critical" && (
                  <Alert className="border-red-300 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      CRITICAL THREAT: Immediate intervention may be required. Alert patrol teams.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium flex items-center gap-1">
                        <Target className="h-4 w-4" />
                        Poaching Risk Score
                      </span>
                      <span className="text-sm font-bold">{threat.poachingRiskScore}%</span>
                    </div>
                    <Progress value={threat.poachingRiskScore} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        Movement Anomaly
                      </span>
                      <span className="text-sm font-bold">{threat.movementAnomalyScore}%</span>
                    </div>
                    <Progress value={threat.movementAnomalyScore} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        Behavioral Change
                      </span>
                      <span className="text-sm font-bold">{threat.behavioralChangeScore}%</span>
                    </div>
                    <Progress value={threat.behavioralChangeScore} className="h-2" />
                  </div>
                </div>

                <div className="text-xs space-y-1 opacity-75">
                  {threat.lastHumanProximity && (
                    <p>
                      Last human proximity:{" "}
                      {threat.lastHumanProximity.toLocaleTimeString()}
                    </p>
                  )}
                  {threat.lastSuspiciousActivity && (
                    <p>
                      Last suspicious activity:{" "}
                      {threat.lastSuspiciousActivity.toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
