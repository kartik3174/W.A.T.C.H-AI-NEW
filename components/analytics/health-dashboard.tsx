"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts"
import { animals } from "@/components/dashboard/animal-table"
import { Eye } from "lucide-react"

interface Animal {
  id: string
  name: string
  species: string
  age: number
  gender: string
  location: string
  status: string
  lastSeen: string
  tracked: boolean
  hasAlert: boolean
}

const STATUS_COLORS: Record<string, string> = {
  Excellent: "#10b981",
  Good: "#3b82f6",
  Fair: "#f59e0b",
  Poor: "#ef4444",
  Critical: "#7c3aed",
}

const STATUS_BADGE_COLORS: Record<string, string> = {
  Excellent: "bg-green-100 text-green-800",
  Good: "bg-blue-100 text-blue-800",
  Fair: "bg-yellow-100 text-yellow-800",
  Poor: "bg-red-100 text-red-800",
  Critical: "bg-purple-100 text-purple-800",
}

export function HealthDashboard() {
  const [selectedSpecies, setSelectedSpecies] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedLocation, setSelectedLocation] = useState<string>("all")
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null)
  const [statusDrawerOpen, setStatusDrawerOpen] = useState(false)
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string | null>(null)

  // Get unique values for filters
  const species = Array.from(new Set((animals as Animal[]).map((a) => a.species)))
  const locations = Array.from(new Set((animals as Animal[]).map((a) => a.location)))
  const statuses = ["Excellent", "Good", "Fair", "Poor", "Critical"]

  // Filter animals based on selected filters
  const filteredAnimals = useMemo(() => {
    return (animals as Animal[]).filter((animal) => {
      const speciesMatch = selectedSpecies === "all" || animal.species === selectedSpecies
      const statusMatch = selectedStatus === "all" || animal.status === selectedStatus
      const locationMatch = selectedLocation === "all" || animal.location === selectedLocation
      return speciesMatch && statusMatch && locationMatch
    })
  }, [selectedSpecies, selectedStatus, selectedLocation])

  // Calculate health status distribution
  const healthDistribution = useMemo(() => {
    const distribution = statuses.map((status) => ({
      name: status,
      value: filteredAnimals.filter((a) => a.status === status).length,
      color: STATUS_COLORS[status],
    }))
    return distribution.filter((d) => d.value > 0)
  }, [filteredAnimals])

  // Health interventions data (simulated based on filtered animals)
  const healthInterventions = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
    return months.map((month, index) => ({
      month,
      Preventative: Math.round(filteredAnimals.length * (0.3 + Math.random() * 0.4)),
      Emergency: Math.round(filteredAnimals.length * (0.1 + Math.random() * 0.3)),
      Routine: Math.round(filteredAnimals.length * (0.4 + Math.random() * 0.3)),
    }))
  }, [filteredAnimals])

  // Health trends data (simulated per animal)
  const healthTrends = useMemo(() => {
    if (!selectedAnimal) {
      return []
    }
    const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"]
    const baseValue = selectedAnimal.status === "Critical" ? 40 : selectedAnimal.status === "Poor" ? 60 : selectedAnimal.status === "Fair" ? 75 : selectedAnimal.status === "Good" ? 85 : 95
    return weeks.map((week) => ({
      week,
      health: Math.max(30, Math.min(100, baseValue + (Math.random() - 0.5) * 20)),
      activity: Math.round(Math.random() * 100),
    }))
  }, [selectedAnimal])

  // Behavioral trends data (connected to filtered animals)
  const behavioralTrends = useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    const excellentAnimals = filteredAnimals.filter((a) => a.status === "Excellent").length
    const goodAnimals = filteredAnimals.filter((a) => a.status === "Good").length
    const fairAnimals = filteredAnimals.filter((a) => a.status === "Fair").length
    const poorAnimals = filteredAnimals.filter((a) => a.status === "Poor").length
    const criticalAnimals = filteredAnimals.filter((a) => a.status === "Critical").length

    return days.map((day) => ({
      day,
      "Excellent (Active)": excellentAnimals * (80 + Math.random() * 20),
      "Good (Active)": goodAnimals * (60 + Math.random() * 30),
      "Fair (Alert)": fairAnimals * (40 + Math.random() * 30),
      "Poor (Limited)": poorAnimals * (20 + Math.random() * 20),
      "Critical (Rest)": criticalAnimals * (10 + Math.random() * 10),
    }))
  }, [filteredAnimals])

  const handleStatusFilterClick = (status: string) => {
    setSelectedStatusFilter(status)
    setStatusDrawerOpen(true)
  }

  const handleSelectStatusFromDrawer = (status: string) => {
    setSelectedStatus(status)
    setStatusDrawerOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select value={selectedSpecies} onValueChange={setSelectedSpecies}>
          <SelectTrigger className="bg-card border-border text-foreground">
            <SelectValue placeholder="All Species" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all" className="text-foreground">All Species</SelectItem>
            {species.map((sp) => (
              <SelectItem key={sp} value={sp} className="text-foreground">
                {sp}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="bg-card border-border text-foreground">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all" className="text-foreground">All Statuses</SelectItem>
            {statuses.map((status) => (
              <SelectItem key={status} value={status} className="text-foreground">
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
          <SelectTrigger className="bg-card border-border text-foreground">
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all" className="text-foreground">All Locations</SelectItem>
            {locations.map((loc) => (
              <SelectItem key={loc} value={loc} className="text-foreground">
                {loc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Health Status Chart */}
      <Card className="border-border bg-background">
        <CardHeader>
          <CardTitle className="text-foreground">Health Status</CardTitle>
          <CardDescription className="text-muted-foreground">Overall health distribution of tracked animals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={healthDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                >
                  {healthDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#111827", border: "1px solid #14532D", color: "#E5E7EB" }} itemStyle={{ color: "#E5E7EB" }} />
                <Legend
                  wrapperStyle={{ color: "#E5E7EB" }}
                  onClick={(e) => {
                    if (e.dataKey) {
                      handleStatusFilterClick(e.dataKey as string)
                    }
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Behavioral Trends Analysis */}
      <Card className="border-border bg-background">
        <CardHeader>
          <CardTitle className="text-foreground">Behavioral Trends Analysis</CardTitle>
          <CardDescription className="text-muted-foreground">Activity patterns by health status across the week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={behavioralTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#14532D" />
                <XAxis dataKey="day" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip contentStyle={{ backgroundColor: "#111827", border: "1px solid #14532D", color: "#E5E7EB" }} itemStyle={{ color: "#E5E7EB" }} />
                <Legend wrapperStyle={{ color: "#E5E7EB" }} />
                <Line
                  type="monotone"
                  dataKey="Excellent (Active)"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="Good (Active)"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="Fair (Alert)"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="Poor (Limited)"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="Critical (Rest)"
                  stroke="#7c3aed"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Animals Table */}
      <Card className="border-border bg-background">
        <CardHeader>
          <CardTitle className="text-foreground">Animals Overview</CardTitle>
          <CardDescription className="text-muted-foreground">Click on an animal to view detailed health information</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="bg-card border-border">
              <TabsTrigger value="all" className="text-foreground data-[state=active]:bg-secondary">All Animals</TabsTrigger>
              <TabsTrigger value="tracked" className="text-foreground data-[state=active]:bg-secondary">Currently Tracked</TabsTrigger>
              <TabsTrigger value="alerts" className="text-foreground data-[state=active]:bg-secondary">Health Alerts</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-secondary">
                      <TableHead className="text-foreground">ID</TableHead>
                      <TableHead className="text-foreground">Name</TableHead>
                      <TableHead className="text-foreground">Species</TableHead>
                      <TableHead className="text-foreground">Age</TableHead>
                      <TableHead className="text-foreground">Gender</TableHead>
                      <TableHead className="text-foreground">Location</TableHead>
                      <TableHead className="text-foreground">Status</TableHead>
                      <TableHead className="text-foreground">Last Seen</TableHead>
                      <TableHead className="text-foreground">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAnimals.map((animal) => (
                      <TableRow
                        key={animal.id}
                        onClick={() => setSelectedAnimal(animal)}
                        className="cursor-pointer hover:bg-secondary border-border"
                      >
                        <TableCell className="font-medium text-foreground">{animal.id}</TableCell>
                        <TableCell className="text-foreground">{animal.name}</TableCell>
                        <TableCell className="text-foreground">{animal.species}</TableCell>
                        <TableCell className="text-foreground">{animal.age}</TableCell>
                        <TableCell className="text-foreground">{animal.gender}</TableCell>
                        <TableCell className="text-foreground">{animal.location}</TableCell>
                        <TableCell>
                          <Badge className={STATUS_BADGE_COLORS[animal.status]}>
                            {animal.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-foreground">{animal.lastSeen}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedAnimal(animal)
                            }}
                            className="text-accent hover:text-[#10b981]"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="tracked" className="mt-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-secondary">
                      <TableHead className="text-foreground">ID</TableHead>
                      <TableHead className="text-foreground">Name</TableHead>
                      <TableHead className="text-foreground">Species</TableHead>
                      <TableHead className="text-foreground">Location</TableHead>
                      <TableHead className="text-foreground">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAnimals
                      .filter((a) => a.tracked)
                      .map((animal) => (
                        <TableRow key={animal.id} className="cursor-pointer hover:bg-secondary border-border">
                          <TableCell className="text-foreground">{animal.id}</TableCell>
                          <TableCell className="text-foreground">{animal.name}</TableCell>
                          <TableCell className="text-foreground">{animal.species}</TableCell>
                          <TableCell className="text-foreground">{animal.location}</TableCell>
                          <TableCell>
                            <Badge className={STATUS_BADGE_COLORS[animal.status]}>
                              {animal.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="alerts" className="mt-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-secondary">
                      <TableHead className="text-foreground">ID</TableHead>
                      <TableHead className="text-foreground">Name</TableHead>
                      <TableHead className="text-foreground">Species</TableHead>
                      <TableHead className="text-foreground">Alert Type</TableHead>
                      <TableHead className="text-foreground">Severity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAnimals
                      .filter((a) => a.hasAlert || a.status === "Poor" || a.status === "Critical")
                      .map((animal) => (
                        <TableRow key={animal.id} className="cursor-pointer hover:bg-secondary border-border">
                          <TableCell className="text-foreground">{animal.id}</TableCell>
                          <TableCell className="text-foreground">{animal.name}</TableCell>
                          <TableCell className="text-foreground">{animal.species}</TableCell>
                          <TableCell className="text-foreground">Health</TableCell>
                          <TableCell>
                            <Badge className={STATUS_BADGE_COLORS[animal.status]}>
                              {animal.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Health Interventions and Trends - Only show when animal is selected */}
      {selectedAnimal && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-border bg-background">
            <CardHeader>
              <CardTitle className="text-foreground">Health Interventions</CardTitle>
              <CardDescription className="text-muted-foreground">
                Medical treatments for {selectedAnimal.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={healthInterventions}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#14532D" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip contentStyle={{ backgroundColor: "#111827", border: "1px solid #14532D", color: "#E5E7EB" }} itemStyle={{ color: "#E5E7EB" }} />
                    <Legend wrapperStyle={{ color: "#E5E7EB" }} />
                    <Bar dataKey="Preventative" fill="#10b981" />
                    <Bar dataKey="Emergency" fill="#ef4444" />
                    <Bar dataKey="Routine" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-background">
            <CardHeader>
              <CardTitle className="text-foreground">Health Trends Analysis</CardTitle>
              <CardDescription className="text-muted-foreground">
                4-week health trend for {selectedAnimal.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={healthTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#14532D" />
                    <XAxis dataKey="week" stroke="#9CA3AF" />
                    <YAxis domain={[0, 100]} stroke="#9CA3AF" />
                    <Tooltip contentStyle={{ backgroundColor: "#111827", border: "1px solid #14532D", color: "#E5E7EB" }} itemStyle={{ color: "#E5E7EB" }} />
                    <Legend wrapperStyle={{ color: "#E5E7EB" }} />
                    <Line
                      type="monotone"
                      dataKey="health"
                      stroke="#10b981"
                      strokeWidth={2}
                      name="Health Score"
                    />
                    <Line
                      type="monotone"
                      dataKey="activity"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="Activity Level"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Status Filter Drawer */}
      <Drawer open={statusDrawerOpen} onOpenChange={setStatusDrawerOpen}>
        <DrawerContent className="bg-background border-border">
          <DrawerHeader>
            <DrawerTitle className="text-foreground">Filter by Health Status</DrawerTitle>
            <DrawerDescription className="text-muted-foreground">
              Select a health status to view animals with that status
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-6 space-y-3">
            {statuses.map((status) => {
              const count = (animals as Animal[]).filter((a) => a.status === status).length
              return (
                <Button
                  key={status}
                  variant="outline"
                  className="w-full justify-between border-border text-foreground hover:bg-secondary"
                  onClick={() => handleSelectStatusFromDrawer(status)}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: STATUS_COLORS[status] }}
                    />
                    {status}
                  </div>
                  <span className="text-sm text-muted-foreground">{count} animals</span>
                </Button>
              )
            })}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
