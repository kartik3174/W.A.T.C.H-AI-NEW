"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Activity,
  AlertTriangle,
  Calendar,
  Clock,
  Download,
  Eye,
  FileText,
  Filter,
  MapPin,
  Search,
  User,
} from "lucide-react"

export function SearchInterface() {
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const [hasSearched, setHasSearched] = useState<boolean>(false)

  // Sample search results
  const animalResults = [
    {
      id: "EL-001",
      name: "Tembo",
      species: "Elephant",
      age: 15,
      gender: "Male",
      location: "North Region",
      status: "Excellent",
      lastSeen: "2 hours ago",
    },
    {
      id: "LI-002",
      name: "Simba",
      species: "Lion",
      age: 8,
      gender: "Male",
      location: "East Region",
      status: "Good",
      lastSeen: "1 hour ago",
    },
    {
      id: "RH-003",
      name: "Kifaru",
      species: "Rhino",
      age: 12,
      gender: "Female",
      location: "South Region",
      status: "Fair",
      lastSeen: "3 hours ago",
    },
    {
      id: "TI-004",
      name: "Raja",
      species: "Tiger",
      age: 6,
      gender: "Male",
      location: "West Region",
      status: "Poor",
      lastSeen: "30 minutes ago",
    },
    {
      id: "GO-005",
      name: "Zuri",
      species: "Gorilla",
      age: 10,
      gender: "Female",
      location: "North Region",
      status: "Critical",
      lastSeen: "4 hours ago",
    },
  ]

  const reportResults = [
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
  ]

  const alertResults = [
    {
      id: "ALERT-001",
      title: "Poaching Risk Detected",
      type: "Security",
      priority: "High",
      status: "Active",
      timestamp: "Today, 08:23 AM",
      location: "South Region, Sector 3",
    },
    {
      id: "ALERT-003",
      title: "Animal Health Critical",
      type: "Health",
      priority: "Critical",
      status: "Active",
      timestamp: "Today, 10:15 AM",
      location: "West Region, Sector 4",
    },
    {
      id: "ALERT-004",
      title: "Predator Intrusion",
      type: "Security",
      priority: "Medium",
      status: "Monitoring",
      timestamp: "Yesterday, 11:30 PM",
      location: "North Region, Sector 1",
    },
  ]

  const eventResults = [
    {
      id: "EVENT-001",
      title: "Veterinary Intervention",
      description: "Medical treatment for Raja (TI-004)",
      date: "2024-03-15",
      time: "10:30 AM",
      location: "West Region, Sector 4",
      staff: "Dr. James Wilson",
    },
    {
      id: "EVENT-002",
      title: "New Birth Recorded",
      description: "Elephant calf born to Tembo's herd",
      date: "2024-03-10",
      time: "06:45 AM",
      location: "North Region, Sector 2",
      staff: "Research Team",
    },
    {
      id: "EVENT-003",
      title: "Security Patrol",
      description: "Response to potential poaching threat",
      date: "2024-03-15",
      time: "09:15 AM",
      location: "South Region, Sector 3",
      staff: "Security Team",
    },
  ]

  const handleSearch = () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setHasSearched(true)

    // Simulate search delay
    setTimeout(() => {
      setSearchResults([...animalResults, ...reportResults, ...alertResults, ...eventResults])
      setIsSearching(false)
    }, 1000)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "excellent":
        return "bg-green-500 hover:bg-green-600"
      case "good":
        return "bg-blue-500 hover:bg-blue-600"
      case "fair":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "poor":
        return "bg-red-500 hover:bg-red-600"
      case "critical":
        return "bg-purple-500 hover:bg-purple-600"
      case "active":
        return "bg-red-500 hover:bg-red-600"
      case "monitoring":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "complete":
        return "bg-green-500 hover:bg-green-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Search Conservation Data</CardTitle>
          <CardDescription>Find animals, reports, alerts, and events across the conservation database</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by ID, name, species, location..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} disabled={isSearching}>
              {isSearching ? "Searching..." : "Search"}
            </Button>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Advanced Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {hasSearched && (
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Results ({searchResults.length})</TabsTrigger>
            <TabsTrigger value="animals">Animals ({animalResults.length})</TabsTrigger>
            <TabsTrigger value="reports">Reports ({reportResults.length})</TabsTrigger>
            <TabsTrigger value="alerts">Alerts ({alertResults.length})</TabsTrigger>
            <TabsTrigger value="events">Events ({eventResults.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Search Results</CardTitle>
                <CardDescription>
                  Showing {searchResults.length} results for "{searchQuery}"
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h3 className="font-medium">Animals</h3>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Species</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {animalResults.slice(0, 3).map((animal) => (
                          <TableRow key={animal.id}>
                            <TableCell className="font-medium">{animal.id}</TableCell>
                            <TableCell>{animal.name}</TableCell>
                            <TableCell>{animal.species}</TableCell>
                            <TableCell>{animal.location}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(animal.status)}>{animal.status}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  {animalResults.length > 3 && (
                    <div className="text-center">
                      <Button variant="link">View all {animalResults.length} animal results</Button>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Reports</h3>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reportResults.slice(0, 3).map((report) => (
                          <TableRow key={report.id}>
                            <TableCell className="font-medium">{report.id}</TableCell>
                            <TableCell>{report.title}</TableCell>
                            <TableCell>{report.type}</TableCell>
                            <TableCell>{report.date}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Alerts</h3>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {alertResults.slice(0, 3).map((alert) => (
                          <TableRow key={alert.id}>
                            <TableCell className="font-medium">{alert.id}</TableCell>
                            <TableCell>{alert.title}</TableCell>
                            <TableCell>{alert.type}</TableCell>
                            <TableCell>
                              <Badge className={getPriorityColor(alert.priority)}>{alert.priority}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(alert.status)}>{alert.status}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="animals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Animal Results</CardTitle>
                <CardDescription>
                  Showing {animalResults.length} animal results for "{searchQuery}"
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Species</TableHead>
                        <TableHead>Age</TableHead>
                        <TableHead>Gender</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Seen</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {animalResults.map((animal) => (
                        <TableRow key={animal.id}>
                          <TableCell className="font-medium">{animal.id}</TableCell>
                          <TableCell>{animal.name}</TableCell>
                          <TableCell>{animal.species}</TableCell>
                          <TableCell>{animal.age}</TableCell>
                          <TableCell>{animal.gender}</TableCell>
                          <TableCell>{animal.location}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(animal.status)}>{animal.status}</Badge>
                          </TableCell>
                          <TableCell>{animal.lastSeen}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
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

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Report Results</CardTitle>
                <CardDescription>
                  Showing {reportResults.length} report results for "{searchQuery}"
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportResults.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">{report.id}</TableCell>
                          <TableCell>{report.title}</TableCell>
                          <TableCell>{report.type}</TableCell>
                          <TableCell>{report.date}</TableCell>
                          <TableCell>{report.author}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
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

          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Alert Results</CardTitle>
                <CardDescription>
                  Showing {alertResults.length} alert results for "{searchQuery}"
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {alertResults.map((alert) => (
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
                          <CardTitle className="text-base">{alert.title}</CardTitle>
                          <Badge className={getPriorityColor(alert.priority)}>{alert.priority}</Badge>
                        </div>
                        <CardDescription>
                          {alert.id} • {alert.type}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2 space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{alert.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{alert.timestamp}</span>
                        </div>
                        <Badge className={getStatusColor(alert.status)}>{alert.status}</Badge>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm" className="w-full">
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Event Results</CardTitle>
                <CardDescription>
                  Showing {eventResults.length} event results for "{searchQuery}"
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {eventResults.map((event) => (
                    <div key={event.id} className="flex flex-col md:flex-row gap-4 p-4 border rounded-md">
                      <div className="md:w-1/4">
                        <h3 className="font-medium">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">{event.id}</p>
                      </div>
                      <div className="md:w-2/4">
                        <p className="text-sm">{event.description}</p>
                        <div className="flex flex-wrap gap-4 mt-2">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {event.date}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {event.time}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {event.location}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <User className="h-3 w-3" />
                            {event.staff}
                          </div>
                        </div>
                      </div>
                      <div className="md:w-1/4 flex md:justify-end items-center">
                        <Button variant="outline" size="sm">
                          <FileText className="mr-2 h-4 w-4" />
                          View Record
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {!hasSearched && (
        <Card className="bg-muted/30">
          <CardContent className="pt-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-lg font-medium">Search the Conservation Database</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Enter a search term to find animals, reports, alerts, and events.
            </p>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <span className="text-sm">Search for animals by ID, name, or species</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <span className="text-sm">Find reports by title, type, or date</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-primary" />
                <span className="text-sm">Locate alerts by priority, status, or location</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                <span className="text-sm">Discover events by title, description, or date</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
