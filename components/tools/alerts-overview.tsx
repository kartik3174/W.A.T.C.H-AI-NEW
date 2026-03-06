"use client"

import Link from "next/link"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertTriangle,
  Bell,
  BellOff,
  Check,
  Clock,
  Eye,
  MapPin,
  RotateCw,
  Shield,
  Users,
  Download,
  BarChart3,
  ArrowRight,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { AcousticMonitor } from "@/components/tracking/acoustic-monitor"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function AlertsOverview() {
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedAlert, setSelectedAlert] = useState<any>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [alerts, setAlerts] = useState([
    {
      id: "ALERT-001",
      title: "Poaching Risk Detected",
      description: "Suspicious vehicle detected near perimeter fence in South Region, Sector 3.",
      type: "Security",
      priority: "High",
      status: "Active",
      timestamp: "Today, 08:23 AM",
      location: "South Region, Sector 3",
      affectedAnimals: ["RH-003"],
    },
    {
      id: "ALERT-002",
      title: "Habitat Disturbance",
      description: "Unauthorized logging activity detected by acoustic sensors in East Region.",
      type: "Environmental",
      priority: "High",
      status: "Active",
      timestamp: "Yesterday, 03:45 PM",
      location: "East Region, Sector 5",
      affectedAnimals: ["LI-002", "TI-004"],
    },
    {
      id: "ALERT-003",
      title: "Animal Health Critical",
      description: "Tiger (TI-004) showing severe respiratory distress and elevated temperature.",
      type: "Health",
      priority: "Critical",
      status: "Active",
      timestamp: "Today, 10:15 AM",
      location: "West Region, Sector 4",
      affectedAnimals: ["TI-004"],
    },
    {
      id: "ALERT-004",
      title: "Predator Intrusion",
      description: "Pack of wild dogs entered protected area. Potential threat to younger animals.",
      type: "Security",
      priority: "Medium",
      status: "Monitoring",
      timestamp: "Yesterday, 11:30 PM",
      location: "North Region, Sector 1",
      affectedAnimals: ["EL-001"],
    },
    {
      id: "ALERT-005",
      title: "Unusual Migration Pattern",
      description: "Elephant herd moving outside typical seasonal routes toward human settlement.",
      type: "Behavioral",
      priority: "Medium",
      status: "Monitoring",
      timestamp: "2 days ago, 09:45 AM",
      location: "North Region, Sector 2",
      affectedAnimals: ["EL-001", "EL-006"],
    },
  ])
  const { toast } = useToast()

  const [resolvedAlerts, setResolvedAlerts] = useState([
    {
      id: "ALERT-006",
      title: "Water Source Contamination",
      description: "Abnormal chemical readings in river feeding into protected area.",
      type: "Environmental",
      priority: "High",
      resolvedBy: "Environmental Team",
      resolvedAt: "2 days ago, 05:30 PM",
      resolution: "Source identified as agricultural runoff. Water diverted and filtered.",
    },
    {
      id: "ALERT-007",
      title: "Fence Breach Detected",
      description: "Section of perimeter fence damaged in West Region.",
      type: "Security",
      priority: "High",
      resolvedBy: "Security Team",
      resolvedAt: "3 days ago, 02:15 PM",
      resolution: "Fence repaired and additional patrols scheduled.",
    },
    {
      id: "ALERT-008",
      title: "Animal Health Alert",
      description: "Rhino (RH-003) showing signs of skin infection.",
      type: "Health",
      priority: "Medium",
      resolvedBy: "Veterinary Team",
      resolvedAt: "5 days ago, 11:20 AM",
      resolution: "Treatment administered. Follow-up scheduled in 7 days.",
    },
  ])

  const [alertSettings, setAlertSettings] = useState([
    {
      category: "Security Alerts",
      types: [
        { name: "Poaching Threats", enabled: true },
        { name: "Fence Breaches", enabled: true },
        { name: "Unauthorized Access", enabled: true },
        { name: "Predator Intrusions", enabled: false },
      ],
    },
    {
      category: "Health Alerts",
      types: [
        { name: "Critical Health Status", enabled: true },
        { name: "Disease Outbreaks", enabled: true },
        { name: "Injury Reports", enabled: true },
        { name: "Nutritional Concerns", enabled: false },
      ],
    },
    {
      category: "Environmental Alerts",
      types: [
        { name: "Water Contamination", enabled: true },
        { name: "Habitat Destruction", enabled: true },
        { name: "Weather Warnings", enabled: true },
        { name: "Resource Depletion", enabled: false },
      ],
    },
    {
      category: "Behavioral Alerts",
      types: [
        { name: "Unusual Migration", enabled: true },
        { name: "Territorial Conflicts", enabled: true },
        { name: "Abnormal Behavior", enabled: true },
        { name: "Social Structure Changes", enabled: false },
      ],
    },
  ])

  const filteredAlerts = alerts.filter((alert) => {
    if (priorityFilter !== "all" && alert.priority.toLowerCase() !== priorityFilter.toLowerCase()) return false
    if (typeFilter !== "all" && alert.type.toLowerCase() !== typeFilter.toLowerCase()) return false
    if (statusFilter !== "all" && alert.status.toLowerCase() !== statusFilter.toLowerCase()) return false
    return true
  })

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "critical":
        return "bg-red-500 hover:bg-red-600"
      case "high":
        return "bg-orange-500 hover:bg-orange-600"
      case "medium":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "low":
        return "bg-green-500 hover:bg-green-600"
      default:
        return "bg-blue-500 hover:bg-blue-600"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "security":
        return <Shield className="h-5 w-5 text-red-500" />
      case "health":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />
      case "environmental":
        return <MapPin className="h-5 w-5 text-green-500" />
      case "behavioral":
        return <Users className="h-5 w-5 text-blue-500" />
      default:
        return <AlertTriangle className="h-5 w-5" />
    }
  }

  const handleResolveAlert = (alertId: string) => {
    const alertToResolve = alerts.find((a) => a.id === alertId)
    if (alertToResolve) {
      setResolvedAlerts((prev) => [
        {
          ...alertToResolve,
          resolvedBy: "Current User",
          resolvedAt: "Just now",
          resolution: "Manual resolution via dashboard",
        },
        ...prev,
      ])
      setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== alertId))

      toast({
        title: "Alert Resolved",
        description: "The alert has been marked as resolved and moved to history",
      })
    }
  }

  const handleViewDetails = (alert: any) => {
    setSelectedAlert(alert)
    setIsDetailsOpen(true)
  }

  const handleAcousticAlert = (type: string, location: string, severity: "CRITICAL" | "HIGH" | "MEDIUM") => {
    const newAlert = {
      id: `ACOUSTIC-${Date.now()}`,
      title: type,
      description: `Acoustic sensor detected: ${type.toLowerCase()}. Automated alert generated from field microphone array.`,
      type: "Security",
      priority: severity === "CRITICAL" ? "Critical" : severity === "HIGH" ? "High" : "Medium",
      status: "Active",
      timestamp: `Today, ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
      location,
      affectedAnimals: [] as string[],
    }
    setAlerts((prev) => [newAlert, ...prev])
    toast({
      title: "Acoustic Alert",
      description: `${type} detected at ${location}`,
      variant: severity === "CRITICAL" ? "destructive" : "default",
    })
  }

  const handleToggleSetting = (categoryIdx: number, typeIdx: number, current: boolean) => {
    const newSettings = [...alertSettings]
    newSettings[categoryIdx].types[typeIdx].enabled = !current
    setAlertSettings(newSettings)

    toast({
      title: "Settings Updated",
      description: `${newSettings[categoryIdx].types[typeIdx].name} ${!current ? "enabled" : "disabled"}`,
    })
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="active" className="space-y-6">
        <TabsList>
          <TabsTrigger value="active">Active Alerts</TabsTrigger>
          <TabsTrigger value="resolved">Resolved Alerts</TabsTrigger>
          <TabsTrigger value="settings">Alert Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          <AcousticMonitor onAlert={handleAcousticAlert} />

          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Alert Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="environmental">Environmental</SelectItem>
                  <SelectItem value="behavioral">Behavioral</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="monitoring">Monitoring</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setPriorityFilter("all")
                setTypeFilter("all")
                setStatusFilter("all")
              }}
            >
              <RotateCw className="mr-2 h-4 w-4" />
              Reset Filters
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map((alert) => (
                <Card
                  key={alert.id}
                  className={`border-l-4 ${
                    alert.priority.toLowerCase() === "critical"
                      ? "border-l-red-500"
                      : alert.priority.toLowerCase() === "high"
                        ? "border-l-orange-500"
                        : "border-l-yellow-500"
                  }`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(alert.type)}
                        <CardTitle>{alert.title}</CardTitle>
                      </div>
                      <Badge className={getPriorityColor(alert.priority)}>{alert.priority}</Badge>
                    </div>
                    <CardDescription>
                      {alert.id} • {alert.type}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>{alert.description}</p>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{alert.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{alert.timestamp}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-sm font-medium">Affected Animals:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {alert.affectedAnimals.map((animal) => (
                          <Badge key={animal} variant="outline">
                            {animal}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(alert)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                    <Button size="sm" onClick={() => handleResolveAlert(alert.id)}>
                      <Check className="mr-2 h-4 w-4" />
                      Mark as Resolved
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-2 p-8 text-center border rounded-md bg-muted/20">
                <AlertTriangle className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium">No alerts match your filters</h3>
                <p className="text-muted-foreground mt-1">Try adjusting your filter criteria or reset filters</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="resolved" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resolved Alerts</CardTitle>
              <CardDescription>Historical record of addressed alerts and their resolutions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Alert ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Resolved By</TableHead>
                      <TableHead>Resolved At</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resolvedAlerts.map((alert) => (
                      <TableRow key={alert.id}>
                        <TableCell className="font-medium">{alert.id}</TableCell>
                        <TableCell>{alert.title}</TableCell>
                        <TableCell>{alert.type}</TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(alert.priority)}>{alert.priority}</Badge>
                        </TableCell>
                        <TableCell>{alert.resolvedBy}</TableCell>
                        <TableCell>{alert.resolvedAt}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleViewDetails(alert)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                toast({
                                  title: "Report Generated",
                                  description: `Report for ${alert.id} is being downloaded.`,
                                })
                              }
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Alert Settings</CardTitle>
              <CardDescription>Configure which alerts you receive and how they are delivered</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {alertSettings.map((category, catIdx) => (
                <div key={category.category} className="space-y-4">
                  <h3 className="font-medium">{category.category}</h3>
                  <div className="space-y-2">
                    {category.types.map((type, typeIdx) => (
                      <div key={type.name} className="flex items-center justify-between py-2 border-b">
                        <div className="flex items-center gap-2">
                          {type.enabled ? (
                            <Bell className="h-4 w-4 text-primary" />
                          ) : (
                            <BellOff className="h-4 w-4 text-muted-foreground" />
                          )}
                          <Label htmlFor={`${type.name}-toggle`} className="cursor-pointer">
                            {type.name}
                          </Label>
                        </div>
                        <Switch
                          id={`${type.name}-toggle`}
                          checked={type.enabled}
                          onCheckedChange={() => handleToggleSetting(catIdx, typeIdx, type.enabled)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button
                onClick={() =>
                  toast({ title: "Settings Saved", description: "Your alert preferences have been updated." })
                }
              >
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Analytics Link Card */}
      <Card className="border-[#14532D] bg-[#0F172A]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#E5E7EB]">
            <BarChart3 className="h-5 w-5 text-[#16A34A]" />
            Health Analytics & Insights
          </CardTitle>
          <CardDescription className="text-[#9CA3AF]">Analyze health patterns and trends</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[#9CA3AF] mb-4">
            View comprehensive health status distribution, behavioral trends, and detailed animal health profiles to understand patterns behind alerts.
          </p>
          <Button
            asChild
            className="w-full bg-[#16A34A] hover:bg-[#15803d] text-white"
          >
            <Link href="/analytics" className="flex items-center justify-center gap-2">
              View Analytics
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Details Dialog for active alerts */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedAlert?.title}</DialogTitle>
            <DialogDescription>
              {selectedAlert?.id} • {selectedAlert?.type}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm">{selectedAlert?.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-muted-foreground">Location</Label>
                <p className="font-medium">{selectedAlert?.location}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Priority</Label>
                <Badge className={selectedAlert ? getPriorityColor(selectedAlert.priority) : ""}>
                  {selectedAlert?.priority}
                </Badge>
              </div>
            </div>
            <div>
              <Label className="text-muted-foreground">Affected Animals</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {selectedAlert?.affectedAnimals.map((animal: string) => (
                  <Badge key={animal} variant="outline">
                    {animal}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                handleResolveAlert(selectedAlert?.id)
                setIsDetailsOpen(false)
              }}
            >
              Resolve Alert
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
