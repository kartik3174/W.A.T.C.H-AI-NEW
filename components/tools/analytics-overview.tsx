"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Download, Filter } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts"

export function AnalyticsOverview() {
  const [timeRange, setTimeRange] = useState<string>("6m")
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [region, setRegion] = useState<string>("all")
  const [species, setSpecies] = useState<string>("all")
  const [filtersDialogOpen, setFiltersDialogOpen] = useState(false)
  const { toast } = useToast()

  // Population data
  const populationData = useMemo(() => {
    const fullData = [
      { month: "Jan", elephant: 120, lion: 45, rhino: 28, tiger: 32, gorilla: 18 },
      { month: "Feb", elephant: 122, lion: 46, rhino: 28, tiger: 31, gorilla: 19 },
      { month: "Mar", elephant: 125, lion: 48, rhino: 29, tiger: 30, gorilla: 20 },
      { month: "Apr", elephant: 130, lion: 50, rhino: 30, tiger: 28, gorilla: 22 },
      { month: "May", elephant: 132, lion: 52, rhino: 31, tiger: 27, gorilla: 23 },
      { month: "Jun", elephant: 135, lion: 53, rhino: 32, tiger: 26, gorilla: 24 },
      { month: "Jul", elephant: 138, lion: 55, rhino: 33, tiger: 25, gorilla: 25 },
      { month: "Aug", elephant: 140, lion: 58, rhino: 34, tiger: 24, gorilla: 26 },
      { month: "Sep", elephant: 142, lion: 60, rhino: 35, tiger: 23, gorilla: 28 },
      { month: "Oct", elephant: 145, lion: 62, rhino: 36, tiger: 22, gorilla: 30 },
      { month: "Nov", elephant: 148, lion: 65, rhino: 38, tiger: 21, gorilla: 32 },
      { month: "Dec", elephant: 152, lion: 68, rhino: 40, tiger: 20, gorilla: 35 },
    ]

    // If a specific date is selected, simulate a data point for that date
    if (date) {
      console.log("[v0] Filtering data for date:", date.toLocaleDateString())
      // Simulate data for the selected date
      const simulatedData = {
        month: format(date, "MMM"),
        elephant: Math.floor(Math.random() * 50) + 100,
        lion: Math.floor(Math.random() * 30) + 40,
        rhino: Math.floor(Math.random() * 15) + 20,
        tiger: Math.floor(Math.random() * 10) + 20,
        gorilla: Math.floor(Math.random() * 10) + 10,
      }
      fullData.push(simulatedData)
    }

    switch (timeRange) {
      case "1m":
        return fullData.slice(-1)
      case "3m":
        return fullData.slice(-3)
      case "6m":
        return fullData.slice(-6)
      case "1y":
      case "all":
        return fullData
      default:
        return fullData
    }
  }, [timeRange, date])

  const threatData = useMemo(() => {
    const fullData = [
      { month: "Jan", poaching: 5, habitat: 3, predator: 7, disease: 2 },
      { month: "Feb", poaching: 4, habitat: 4, predator: 6, disease: 3 },
      { month: "Mar", poaching: 6, habitat: 5, predator: 4, disease: 2 },
      { month: "Apr", poaching: 3, habitat: 7, predator: 5, disease: 1 },
      { month: "May", poaching: 2, habitat: 6, predator: 8, disease: 4 },
      { month: "Jun", poaching: 4, habitat: 5, predator: 6, disease: 3 },
      { month: "Jul", poaching: 3, habitat: 4, predator: 5, disease: 2 },
      { month: "Aug", poaching: 5, habitat: 3, predator: 4, disease: 1 },
      { month: "Sep", poaching: 4, habitat: 5, predator: 6, disease: 3 },
      { month: "Oct", poaching: 2, habitat: 6, predator: 7, disease: 4 },
      { month: "Nov", poaching: 3, habitat: 5, predator: 6, disease: 2 },
      { month: "Dec", poaching: 4, habitat: 4, predator: 5, disease: 1 },
    ]

    switch (timeRange) {
      case "1m":
        return fullData.slice(-1)
      case "3m":
        return fullData.slice(-3)
      case "6m":
        return fullData.slice(-6)
      case "1y":
      case "all":
        return fullData
      default:
        return fullData
    }
  }, [timeRange])

  const conservationData = useMemo(() => {
    const fullData = [
      { year: "2019", births: 12, reintroductions: 5, habitatRestored: 120 },
      { year: "2020", births: 15, reintroductions: 7, habitatRestored: 150 },
      { year: "2021", births: 18, reintroductions: 8, habitatRestored: 200 },
      { year: "2022", births: 22, reintroductions: 10, habitatRestored: 250 },
      { year: "2023", births: 25, reintroductions: 12, habitatRestored: 300 },
      { year: "2024", births: 15, reintroductions: 8, habitatRestored: 180 },
    ]
    // Year-based data doesn't change as much with 1-6m ranges, but we can simulate sensitivity
    if (timeRange === "1m" || timeRange === "3m") return fullData.slice(-1)
    return fullData
  }, [timeRange])

  const healthData = [
    { name: "Excellent", value: 35, color: "#10b981" },
    { name: "Good", value: 40, color: "#3b82f6" },
    { name: "Fair", value: 15, color: "#f59e0b" },
    { name: "Poor", value: 7, color: "#ef4444" },
    { name: "Critical", value: 3, color: "#7c3aed" },
  ]

  const handleExportData = () => {
    try {
      const csvContent = `Wildlife Analytics Report
Generated: ${new Date().toLocaleString()}
Time Range: ${timeRange}
Region: ${region}
Species: ${species}

Population Trends:
Month,Elephant,Lion,Rhino,Tiger,Gorilla
${populationData.map((row) => `${row.month},${row.elephant},${row.lion},${row.rhino},${row.tiger},${row.gorilla}`).join("\n")}

Health Status Distribution:
Status,Count,Percentage
${healthData.map((row) => `${row.name},${row.value},${((row.value / healthData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%`).join("\n")}

Threat Incidents:
Month,Poaching,Habitat,Predator,Disease
${threatData.map((row) => `${row.month},${row.poaching},${row.habitat},${row.predator},${row.disease}`).join("\n")}

Conservation Metrics:
Year,Births,Reintroductions,Habitat Restored (ha)
${conservationData.map((row) => `${row.year},${row.births},${row.reintroductions},${row.habitatRestored}`).join("\n")}
`

      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `wildlife-analytics-${Date.now()}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast({
        title: "Export Successful",
        description: "Analytics data has been exported to CSV",
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export analytics data",
        variant: "destructive",
      })
    }
  }

  const handleApplyFilters = () => {
    setFiltersDialogOpen(false)
    toast({
      title: "Filters Applied",
      description: "Analytics data has been filtered based on your selections",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">Last Month</SelectItem>
              <SelectItem value="3m">Last 3 Months</SelectItem>
              <SelectItem value="6m">Last 6 Months</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[180px] justify-start text-left bg-transparent">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>

          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="north">North Region</SelectItem>
              <SelectItem value="south">South Region</SelectItem>
              <SelectItem value="east">East Region</SelectItem>
              <SelectItem value="west">West Region</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Dialog open={filtersDialogOpen} onOpenChange={setFiltersDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                More Filters
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Advanced Filters</DialogTitle>
                <DialogDescription>Refine your analytics data with additional filtering options</DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="space-y-4">
                  <Label className="text-base font-medium">Species</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="elephant" defaultChecked />
                      <label htmlFor="elephant" className="text-sm cursor-pointer">
                        Elephant
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="lion" defaultChecked />
                      <label htmlFor="lion" className="text-sm cursor-pointer">
                        Lion
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="rhino" defaultChecked />
                      <label htmlFor="rhino" className="text-sm cursor-pointer">
                        Rhino
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="tiger" defaultChecked />
                      <label htmlFor="tiger" className="text-sm cursor-pointer">
                        Tiger
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="gorilla" defaultChecked />
                      <label htmlFor="gorilla" className="text-sm cursor-pointer">
                        Gorilla
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-medium">Health Status</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="excellent" defaultChecked />
                      <label htmlFor="excellent" className="text-sm cursor-pointer">
                        Excellent
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="good" defaultChecked />
                      <label htmlFor="good" className="text-sm cursor-pointer">
                        Good
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="fair" defaultChecked />
                      <label htmlFor="fair" className="text-sm cursor-pointer">
                        Fair
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="poor" defaultChecked />
                      <label htmlFor="poor" className="text-sm cursor-pointer">
                        Poor
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-medium">Threat Types</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="poaching" defaultChecked />
                      <label htmlFor="poaching" className="text-sm cursor-pointer">
                        Poaching
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="habitat-disturbance" defaultChecked />
                      <label htmlFor="habitat-disturbance" className="text-sm cursor-pointer">
                        Habitat Disturbance
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="predator" defaultChecked />
                      <label htmlFor="predator" className="text-sm cursor-pointer">
                        Predator Intrusion
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setFiltersDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleApplyFilters}>Apply Filters</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button onClick={handleExportData}>
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      <Tabs defaultValue="population" className="space-y-6">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-4">
          <TabsTrigger value="population">Population Trends</TabsTrigger>
          <TabsTrigger value="health">Health Analytics</TabsTrigger>
          <TabsTrigger value="threats">Threat Analysis</TabsTrigger>
          <TabsTrigger value="conservation">Conservation Impact</TabsTrigger>
        </TabsList>

        <TabsContent value="population" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Population Trends</CardTitle>
              <CardDescription>Animal population changes over time by species</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={populationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="elephant" name="Elephant" stroke="#10b981" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="lion" name="Lion" stroke="#f59e0b" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="rhino" name="Rhino" stroke="#3b82f6" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="tiger" name="Tiger" stroke="#ef4444" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="gorilla" name="Gorilla" stroke="#7c3aed" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 p-4 bg-muted/30 rounded-md border">
                <h3 className="font-medium mb-2">Population Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Elephant and gorilla populations show steady growth over the past 6 months, with a 12.5% increase in
                  elephant numbers and a 33% increase in gorilla numbers. Lion populations have increased by 17.8%,
                  while rhino populations have grown by 14.3%. Tiger populations have declined by 18.8%, likely due to
                  health issues identified in the West Region.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Health Status Distribution</CardTitle>
                <CardDescription>Current health status of monitored animals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={healthData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        innerRadius={60}
                        paddingAngle={2}
                        dataKey="value"
                        nameKey="name"
                      >
                        {healthData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Health Interventions</CardTitle>
                <CardDescription>Medical treatments and interventions by month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={threatData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="poaching" name="Preventative" fill="#10b981" />
                      <Bar dataKey="habitat" name="Emergency" fill="#ef4444" />
                      <Bar dataKey="disease" name="Routine" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Health Trends Analysis</CardTitle>
              <CardDescription>Insights from health monitoring data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-md border border-green-200 dark:border-green-900">
                  <h3 className="font-medium text-green-800 dark:text-green-300 mb-1">Positive Trends</h3>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    75% of monitored animals are in excellent or good health, representing a 5% improvement from the
                    previous quarter. Preventative health interventions have increased by 20%, resulting in fewer
                    emergency treatments.
                  </p>
                </div>

                <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-md border border-red-200 dark:border-red-900">
                  <h3 className="font-medium text-red-800 dark:text-red-300 mb-1">Areas of Concern</h3>
                  <p className="text-sm text-red-700 dark:text-red-400">
                    10% of animals are in poor or critical condition, with tigers showing the highest rate of health
                    issues. Respiratory infections have been identified as the primary concern, particularly in the West
                    Region.
                  </p>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-md border border-blue-200 dark:border-blue-900">
                  <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-1">Recommendations</h3>
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    Increase health monitoring frequency for tigers in the West Region. Implement additional
                    preventative measures for respiratory conditions. Continue successful vaccination program that has
                    reduced disease outbreaks by 30%.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="threats" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Threat Incidents</CardTitle>
              <CardDescription>Security and environmental threats by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={threatData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="poaching" name="Poaching Attempts" fill="#ef4444" stroke="#ef4444" />
                    <Area
                      type="monotone"
                      dataKey="habitat"
                      name="Habitat Disturbance"
                      fill="#f59e0b"
                      stroke="#f59e0b"
                    />
                    <Area
                      type="monotone"
                      dataKey="predator"
                      name="Predator Intrusions"
                      fill="#3b82f6"
                      stroke="#3b82f6"
                    />
                    <Area type="monotone" dataKey="disease" name="Disease Outbreaks" fill="#7c3aed" stroke="#7c3aed" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted/30 rounded-md border">
                  <h3 className="font-medium mb-2">Threat Hotspots</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-red-500"></span>
                      <span className="font-medium">South Region, Sector 3:</span>
                      <span className="text-muted-foreground">Highest poaching risk (60% of incidents)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-orange-500"></span>
                      <span className="font-medium">East Region, Sector 5:</span>
                      <span className="text-muted-foreground">Significant habitat disturbance (logging)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                      <span className="font-medium">North Region, Sector 1:</span>
                      <span className="text-muted-foreground">Frequent predator intrusions</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                      <span className="font-medium">West Region, Sector 4:</span>
                      <span className="text-muted-foreground">Disease cluster (respiratory infections)</span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-muted/30 rounded-md border">
                  <h3 className="font-medium mb-2">Threat Trends</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">▼ 20%</span>
                      <span className="font-medium">Poaching attempts</span>
                      <span className="text-muted-foreground">Decreased due to enhanced security</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-red-500">▲ 40%</span>
                      <span className="font-medium">Habitat disturbance</span>
                      <span className="text-muted-foreground">Increased logging activity</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-red-500">▲ 15%</span>
                      <span className="font-medium">Predator intrusions</span>
                      <span className="text-muted-foreground">Seasonal variation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">▼ 50%</span>
                      <span className="font-medium">Disease outbreaks</span>
                      <span className="text-muted-foreground">Improved preventative care</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conservation" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Conservation Success Metrics</CardTitle>
                <CardDescription>Key indicators of conservation program success</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={conservationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="births" name="New Births" fill="#10b981" />
                      <Bar dataKey="reintroductions" name="Reintroductions" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Habitat Restoration</CardTitle>
                <CardDescription>Land restored and improved (hectares)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={conservationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="habitatRestored"
                        name="Habitat Restored (ha)"
                        fill="#10b981"
                        stroke="#10b981"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Conservation Impact Summary</CardTitle>
              <CardDescription>Overall program effectiveness and outcomes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-md border border-green-200 dark:border-green-900">
                  <h3 className="font-medium text-green-800 dark:text-green-300 mb-1">Population Growth</h3>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">+15.2%</p>
                  <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                    Overall increase in protected species populations since program inception
                  </p>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-md border border-blue-200 dark:border-blue-900">
                  <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-1">Habitat Protected</h3>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">1,200 ha</p>
                  <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                    Total habitat restored and protected through conservation efforts
                  </p>
                </div>

                <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-md border border-purple-200 dark:border-purple-900">
                  <h3 className="font-medium text-purple-800 dark:text-purple-300 mb-1">Success Rate</h3>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">94%</p>
                  <p className="text-sm text-purple-700 dark:text-purple-400 mt-1">
                    Survival rate of reintroduced animals and successful breeding programs
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
