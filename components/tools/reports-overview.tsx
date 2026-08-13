"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { CalendarIcon, Download, FileDown, Filter, Printer, Share2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function ReportsOverview() {
  const [reportType, setReportType] = useState<string>("health")
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [region, setRegion] = useState<string>("all")
  const [species, setSpecies] = useState<string>("all")
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState<any>(null)
  const [showMoreFilters, setShowMoreFilters] = useState(false)
  const { toast } = useToast()

  const recentReports = [
    {
      id: "REP-001",
      title: "Monthly Health Assessment - March 2024",
      type: "Health",
      date: "2024-03-31",
      author: "Dr. Sarah Johnson",
      status: "Complete",
    },
    {
      id: "REP-002",
      title: "Quarterly Migration Patterns Q1 2024",
      type: "Movement",
      date: "2024-03-30",
      author: "Dr. Michael Chen",
      status: "Complete",
    },
    {
      id: "REP-003",
      title: "Poaching Threat Analysis - March 2024",
      type: "Threat",
      date: "2024-03-29",
      author: "Security Team",
      status: "Complete",
    },
    {
      id: "REP-004",
      title: "Habitat Health Assessment - East Region",
      type: "Environment",
      date: "2024-03-25",
      author: "Environmental Team",
      status: "Complete",
    },
    {
      id: "REP-005",
      title: "Veterinary Interventions Summary - Q1 2024",
      type: "Medical",
      date: "2024-03-20",
      author: "Veterinary Team",
      status: "Complete",
    },
  ]

  const scheduledReports = [
    {
      id: "SCH-001",
      title: "Monthly Health Assessment - April 2024",
      type: "Health",
      scheduledDate: "2024-04-30",
      frequency: "Monthly",
      recipients: "Conservation Team, Veterinary Staff",
    },
    {
      id: "SCH-002",
      title: "Quarterly Migration Patterns Q2 2024",
      type: "Movement",
      scheduledDate: "2024-06-30",
      frequency: "Quarterly",
      recipients: "Research Team, Park Management",
    },
    {
      id: "SCH-003",
      title: "Annual Species Census 2024",
      type: "Population",
      scheduledDate: "2024-12-15",
      frequency: "Annually",
      recipients: "All Staff, Government Agencies",
    },
  ]

  const reportTemplates = [
    {
      id: "TEMP-001",
      name: "Health Assessment",
      description: "Comprehensive health metrics for all monitored animals",
      lastUsed: "2024-03-31",
    },
    {
      id: "TEMP-002",
      name: "Migration Patterns",
      description: "Movement tracking and territory analysis",
      lastUsed: "2024-03-30",
    },
    {
      id: "TEMP-003",
      name: "Threat Analysis",
      description: "Security incidents and potential threats to wildlife",
      lastUsed: "2024-03-29",
    },
    {
      id: "TEMP-004",
      name: "Environmental Assessment",
      description: "Habitat conditions and environmental factors",
      lastUsed: "2024-03-25",
    },
    {
      id: "TEMP-005",
      name: "Veterinary Interventions",
      description: "Medical treatments and interventions performed",
      lastUsed: "2024-03-20",
    },
  ]

  const handleGenerateReport = async () => {
    try {
      const { jsPDF } = await import("jspdf")
      const doc = new jsPDF()

      doc.setFontSize(20)
      doc.text("Wildlife Conservation Report", 20, 20)

      doc.setFontSize(16)
      doc.text(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Assessment`, 20, 35)

      doc.setFontSize(10)
      doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 45)
      doc.text(`Date: ${date ? format(date, "PPP") : "Not selected"}`, 20, 51)
      doc.text(`Region: ${region === "all" ? "All Regions" : region}`, 20, 57)
      doc.text(`Species: ${species === "all" ? "All Species" : species}`, 20, 63)

      doc.setFontSize(14)
      doc.text("Report Summary:", 20, 78)
      doc.setFontSize(10)
      let yPos = 85

      if (reportType === "health") {
        doc.text("Health Assessment Data:", 20, yPos)
        yPos += 6
        doc.text("- Overall health distribution analyzed across all monitored animals", 20, yPos)
        yPos += 6
        doc.text("- Vital signs monitoring systems operating normally", 20, yPos)
        yPos += 6
        doc.text("- Health trends show stable population with minor seasonal variations", 20, yPos)
        yPos += 6
        doc.text("- 35% of animals in excellent health, 40% in good health", 20, yPos)
        yPos += 6
        doc.text("- 3% of animals require immediate medical attention", 20, yPos)
      } else if (reportType === "movement") {
        doc.text("Migration Patterns Data:", 20, yPos)
        yPos += 6
        doc.text("- Movement tracking shows normal seasonal patterns", 20, yPos)
        yPos += 6
        doc.text("- Territory analysis indicates stable home ranges", 20, yPos)
        yPos += 6
        doc.text("- Seasonal patterns align with historical data", 20, yPos)
        yPos += 6
        doc.text("- Average daily movement ranges: Elephants 5-10km, Lions 2-5km", 20, yPos)
        yPos += 6
        doc.text("- Tigers showing increased nocturnal activity (90% at night)", 20, yPos)
      } else if (reportType === "threat") {
        doc.text("Threat Analysis Data:", 20, yPos)
        yPos += 6
        doc.text("- Security incidents reviewed and categorized", 20, yPos)
        yPos += 6
        doc.text("- Potential threats identified and risk assessment completed", 20, yPos)
        yPos += 6
        doc.text("- No major poaching incidents reported this period", 20, yPos)
        yPos += 6
        doc.text("- Perimeter security patrols increased in high-risk zones", 20, yPos)
        yPos += 6
        doc.text("- Community engagement programs showing positive results", 20, yPos)
      } else if (reportType === "environment") {
        doc.text("Environmental Assessment Data:", 20, yPos)
        yPos += 6
        doc.text("- Habitat conditions evaluated across all regions", 20, yPos)
        yPos += 6
        doc.text("- Environmental factors monitored and within acceptable ranges", 20, yPos)
        yPos += 6
        doc.text("- Ecosystem health indicators show stable biodiversity", 20, yPos)
        yPos += 6
        doc.text("- Water sources adequate and quality maintained", 20, yPos)
        yPos += 6
        doc.text("- Vegetation density supporting current animal populations", 20, yPos)
      } else if (reportType === "medical") {
        doc.text("Veterinary Interventions Data:", 20, yPos)
        yPos += 6
        doc.text("- Medical treatments administered to 12 animals this period", 20, yPos)
        yPos += 6
        doc.text("- Intervention summary shows high success rate (94%)", 20, yPos)
        yPos += 6
        doc.text("- Outcomes analysis indicates improved health protocols", 20, yPos)
        yPos += 6
        doc.text("- Preventive care programs reaching all monitored animals", 20, yPos)
        yPos += 6
        doc.text("- Emergency response times averaging under 30 minutes", 20, yPos)
      }

      yPos += 12
      doc.setFontSize(14)
      doc.text("Recommendations:", 20, yPos)
      yPos += 7
      doc.setFontSize(10)
      doc.text("- Continue current monitoring protocols", 20, yPos)
      yPos += 6
      doc.text("- Increase observation frequency for animals in poor health", 20, yPos)
      yPos += 6
      doc.text("- Maintain regular veterinary check-ups and interventions", 20, yPos)
      yPos += 6
      doc.text("- Enhance habitat preservation efforts in identified areas", 20, yPos)

      doc.setFontSize(8)
      doc.text("This report contains comprehensive data for the selected parameters.", 20, 280)
      doc.text("Wildlife Conservation Dashboard - Confidential", 20, 285)

      doc.save(`${reportType}-report-${Date.now()}.pdf`)

      toast({
        title: "Report Generated",
        description: "Your PDF report has been generated and downloaded",
      })
    } catch (error) {
      console.error("PDF generation error:", error)
      toast({
        title: "Generation Failed",
        description: "Failed to generate the PDF report",
        variant: "destructive",
      })
    }
  }

  const handlePrint = () => {
    toast({
      title: "Print Preview",
      description: "Opening print dialog...",
    })
    window.print()
  }

  const handleDownloadReport = (reportId: string, reportTitle: string) => {
    toast({
      title: "Downloading Report",
      description: `Downloading ${reportTitle}...`,
    })
    // Simulate download
    setTimeout(() => {
      toast({
        title: "Download Complete",
        description: `${reportTitle} has been downloaded`,
      })
    }, 1000)
  }

  const handleShareReport = (reportId: string, reportTitle: string) => {
    toast({
      title: "Share Report",
      description: `Sharing options for ${reportTitle}`,
    })
  }

  const handleScheduleReport = () => {
    setScheduleDialogOpen(false)
    toast({
      title: "Report Scheduled",
      description: "Your report has been scheduled successfully",
    })
  }

  const handleEditScheduledReport = (report: any) => {
    setSelectedReport(report)
    setEditDialogOpen(true)
  }

  const handleUpdateScheduledReport = () => {
    setEditDialogOpen(false)
    toast({
      title: "Schedule Updated",
      description: `Schedule for ${selectedReport?.title} has been updated`,
    })
  }

  const handleUseTemplate = (templateName: string) => {
    toast({
      title: "Template Applied",
      description: `${templateName} template is now active`,
    })
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="generate" className="space-y-6">
        <TabsList>
          <TabsTrigger value="generate">Generate Report</TabsTrigger>
          <TabsTrigger value="recent">Recent Reports</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
          <TabsTrigger value="templates">Report Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate New Report</CardTitle>
              <CardDescription>Create a customized report based on conservation data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Report Type</label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="health">Health Assessment</SelectItem>
                      <SelectItem value="movement">Migration Patterns</SelectItem>
                      <SelectItem value="threat">Threat Analysis</SelectItem>
                      <SelectItem value="environment">Environmental Assessment</SelectItem>
                      <SelectItem value="medical">Veterinary Interventions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Date Range</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left bg-transparent">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Region</label>
                  <Select value={region} onValueChange={setRegion}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select region" />
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

                <div className="space-y-2">
                  <label className="text-sm font-medium">Species</label>
                  <Select value={species} onValueChange={setSpecies}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select species" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Species</SelectItem>
                      <SelectItem value="elephant">Elephant</SelectItem>
                      <SelectItem value="lion">Lion</SelectItem>
                      <SelectItem value="rhino">Rhino</SelectItem>
                      <SelectItem value="tiger">Tiger</SelectItem>
                      <SelectItem value="gorilla">Gorilla</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {showMoreFilters && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Age Group</label>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue placeholder="Select age group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Ages</SelectItem>
                        <SelectItem value="juvenile">Juvenile</SelectItem>
                        <SelectItem value="adult">Adult</SelectItem>
                        <SelectItem value="senior">Senior</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Health Status</label>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue placeholder="Select health status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="poor">Poor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <div className="bg-muted/50 p-4 rounded-md border">
                <h3 className="font-medium mb-2">Report Preview</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {reportType === "health" &&
                    "This report will include health metrics, vital signs, and health trends for all monitored animals."}
                  {reportType === "movement" &&
                    "This report will include migration patterns, territory changes, and movement analysis."}
                  {reportType === "threat" &&
                    "This report will include security incidents, potential threats, and risk assessments."}
                  {reportType === "environment" &&
                    "This report will include habitat conditions, environmental factors, and ecosystem health."}
                  {reportType === "medical" &&
                    "This report will include veterinary interventions, treatments, and medical outcomes."}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Date: {date ? format(date, "PPP") : "Not selected"}</Badge>
                  <Badge variant="outline">
                    Region:{" "}
                    {region === "all" ? "All Regions" : `${region.charAt(0).toUpperCase() + region.slice(1)} Region`}
                  </Badge>
                  <Badge variant="outline">
                    Species: {species === "all" ? "All Species" : species.charAt(0).toUpperCase() + species.slice(1)}
                  </Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setShowMoreFilters(!showMoreFilters)}>
                <Filter className="mr-2 h-4 w-4" />
                {showMoreFilters ? "Hide" : "More"} Filters
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handlePrint}>
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </Button>
                <Button onClick={handleGenerateReport}>
                  <FileDown className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="recent" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>Access and download recently generated reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.id}</TableCell>
                        <TableCell>{report.title}</TableCell>
                        <TableCell>{report.type}</TableCell>
                        <TableCell>{report.date}</TableCell>
                        <TableCell>{report.author}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-500">{report.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleShareReport(report.id, report.title)}
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownloadReport(report.id, report.title)}
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

        <TabsContent value="scheduled" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Scheduled Reports</CardTitle>
                  <CardDescription>Manage your automated report schedules</CardDescription>
                </div>
                <Button onClick={() => setScheduleDialogOpen(true)}>Schedule New Report</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Scheduled Date</TableHead>
                      <TableHead>Frequency</TableHead>
                      <TableHead>Recipients</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scheduledReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.id}</TableCell>
                        <TableCell>{report.title}</TableCell>
                        <TableCell>{report.type}</TableCell>
                        <TableCell>{report.scheduledDate}</TableCell>
                        <TableCell>{report.frequency}</TableCell>
                        <TableCell>{report.recipients}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleEditScheduledReport(report)}>
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Report Templates</CardTitle>
              <CardDescription>Standardized report formats for quick generation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportTemplates.map((template) => (
                  <Card key={template.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">Last used: {template.lastUsed}</p>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="outline"
                        className="w-full bg-transparent"
                        onClick={() => handleUseTemplate(template.name)}
                      >
                        Use Template
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Schedule New Report</DialogTitle>
            <DialogDescription>Configure automatic report generation and distribution</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="report-title">Report Title</Label>
              <Input id="report-title" placeholder="Monthly Health Assessment" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="report-type">Report Type</Label>
              <Select defaultValue="health">
                <SelectTrigger id="report-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="health">Health Assessment</SelectItem>
                  <SelectItem value="movement">Migration Patterns</SelectItem>
                  <SelectItem value="threat">Threat Analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="frequency">Frequency</Label>
              <Select defaultValue="monthly">
                <SelectTrigger id="frequency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="recipients">Recipients</Label>
              <Textarea id="recipients" placeholder="Enter email addresses separated by commas" rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setScheduleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleScheduleReport}>Schedule Report</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Scheduled Report</DialogTitle>
            <DialogDescription>Update the settings for your automated report</DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Report Title</Label>
                <Input id="edit-title" defaultValue={selectedReport.title} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-frequency">Frequency</Label>
                  <Select defaultValue={selectedReport.frequency.toLowerCase()}>
                    <SelectTrigger id="edit-frequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-date">Next Run Date</Label>
                  <Input id="edit-date" type="date" defaultValue={selectedReport.scheduledDate} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-recipients">Recipients (comma separated)</Label>
                <Input id="edit-recipients" defaultValue={selectedReport.recipients} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateScheduledReport}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
