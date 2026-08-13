"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, ArrowUpDown } from "lucide-react"
import Link from "next/link"
import { LeafDecoration } from "@/components/leaf-decoration"

// Mock data for animals - export this so other components can use it
export const animals = [
  {
    id: "EL-001",
    name: "Tembo",
    species: "Elephant",
    age: 15,
    gender: "Male",
    location: "North Region",
    status: "Excellent",
    lastSeen: "2 hours ago",
    tracked: true,
    hasAlert: false,
    image: "/images/elephant.jpg",
    description:
      "Tembo is a healthy adult male elephant with a calm temperament. He leads a small family group and has been successfully tracked for over 3 years.",
    vitals: {
      heartRate: "65 bpm",
      temperature: "36.2°C",
      activity: "Normal",
      lastChecked: "2 hours ago",
    },
    activityPattern: "Mostly active in the morning (60%) and evening (50%).",
    movementRange: "5-10 km per day, with peak movement in evening (5 km).",
    restActivity: "70% Rest, 30% Activity",
    activityByTime: [
      { timeOfDay: "Morning", activity: 60, movement: 3 },
      { timeOfDay: "Afternoon", activity: 20, movement: 1 },
      { timeOfDay: "Evening", activity: 50, movement: 5 },
      { timeOfDay: "Night", activity: 10, movement: 0.5 },
    ],
    history: [
      { date: "2023-12-15", event: "Annual health check", notes: "All vitals normal" },
      { date: "2023-09-10", event: "Tusk examination", notes: "Minor wear on right tusk" },
      { date: "2023-06-22", event: "Family group observation", notes: "New calf observed in group" },
    ],
  },
  {
    id: "LI-002",
    name: "Simba",
    species: "Lion",
    age: 8,
    gender: "Male",
    location: "East Region",
    status: "Good",
    lastSeen: "1 day ago",
    tracked: true,
    hasAlert: false,
    image: "/images/lion.jpg",
    description:
      "Simba is the dominant male in his pride, showing typical territorial behavior. He has been tracked since reaching maturity at age 4.",
    vitals: {
      heartRate: "70 bpm",
      temperature: "38.1°C",
      activity: "Normal",
      lastChecked: "1 hour ago",
    },
    activityPattern: "Active during early morning (70%) and evening (80%).",
    movementRange: "2-5 km per day, with peak movement in evening (3 km).",
    restActivity: "80% Rest, 20% Activity",
    activityByTime: [
      { timeOfDay: "Morning", activity: 70, movement: 1 },
      { timeOfDay: "Afternoon", activity: 10, movement: 0.5 },
      { timeOfDay: "Evening", activity: 80, movement: 3 },
      { timeOfDay: "Night", activity: 20, movement: 1 },
    ],
    history: [
      { date: "2024-01-10", event: "Vaccination", notes: "Annual vaccines administered" },
      { date: "2023-11-05", event: "Territorial dispute", notes: "Conflict with neighboring pride" },
      { date: "2023-08-18", event: "Minor injury", notes: "Scratch on left flank, treated" },
    ],
  },
  {
    id: "RH-003",
    name: "Kifaru",
    species: "Rhino",
    age: 12,
    gender: "Female",
    location: "South Region",
    status: "Fair",
    lastSeen: "3 days ago",
    tracked: false,
    hasAlert: true,
    image: "/images/rhino.jpg",
    description:
      "Kifaru is a female rhino who has successfully raised two calves. She shows signs of mild joint discomfort but maintains normal activity levels.",
    vitals: {
      heartRate: "75 bpm",
      temperature: "37.5°C",
      activity: "Reduced",
      lastChecked: "3 hours ago",
    },
    activityPattern: "Active during early morning (40%) and late evening (50%).",
    movementRange: "3-7 km per day, with peak movement in evening (4 km).",
    restActivity: "75% Rest, 25% Activity",
    activityByTime: [
      { timeOfDay: "Morning", activity: 40, movement: 2 },
      { timeOfDay: "Afternoon", activity: 10, movement: 1 },
      { timeOfDay: "Evening", activity: 50, movement: 4 },
      { timeOfDay: "Night", activity: 20, movement: 1 },
    ],
    history: [
      { date: "2024-02-05", event: "Treatment", notes: "Minor skin infection treated" },
      { date: "2023-10-12", event: "Horn measurement", notes: "Normal growth pattern" },
      { date: "2023-07-30", event: "Nutritional assessment", notes: "Diet supplementation recommended" },
    ],
  },
  {
    id: "TI-004",
    name: "Raja",
    species: "Tiger",
    age: 6,
    gender: "Male",
    location: "West Region",
    status: "Poor",
    lastSeen: "5 hours ago",
    tracked: true,
    hasAlert: true,
    image: "/images/tiger.jpg",
    description:
      "Raja is a solitary male tiger showing recent signs of respiratory distress. His hunting success has declined in the past month.",
    vitals: {
      heartRate: "90 bpm",
      temperature: "39.2°C",
      activity: "Low",
      lastChecked: "30 minutes ago",
    },
    activityPattern: "Nocturnal; peak activity at night (90%).",
    movementRange: "8-12 km per day, with peak movement at night (7 km).",
    restActivity: "60% Rest, 40% Activity",
    activityByTime: [
      { timeOfDay: "Morning", activity: 30, movement: 2 },
      { timeOfDay: "Afternoon", activity: 10, movement: 1 },
      { timeOfDay: "Evening", activity: 60, movement: 5 },
      { timeOfDay: "Night", activity: 90, movement: 7 },
    ],
    history: [
      { date: "2024-02-28", event: "Emergency treatment", notes: "Respiratory infection diagnosed" },
      { date: "2024-02-15", event: "Behavior change noted", notes: "Decreased hunting activity" },
      { date: "2023-12-03", event: "Territorial marking", notes: "Normal territory maintenance" },
    ],
  },
  {
    id: "GO-005",
    name: "Zuri",
    species: "Gorilla",
    age: 10,
    gender: "Female",
    location: "North Region",
    status: "Critical",
    lastSeen: "Just now",
    tracked: true,
    hasAlert: true,
    image: "/images/gorilla.jpg",
    description:
      "Zuri is a female gorilla who has recently shown significant health decline. She has separated from her social group and shows minimal activity.",
    vitals: {
      heartRate: "95 bpm",
      temperature: "39.5°C",
      activity: "Very Low",
      lastChecked: "4 hours ago",
    },
    activityPattern: "Active during the day, especially midday (60%).",
    movementRange: "1-3 km per day, with peak movement in afternoon (1.2 km).",
    restActivity: "60% Rest, 40% Activity",
    activityByTime: [
      { timeOfDay: "Morning", activity: 50, movement: 0.8 },
      { timeOfDay: "Afternoon", activity: 60, movement: 1.2 },
      { timeOfDay: "Evening", activity: 40, movement: 0.5 },
      { timeOfDay: "Night", activity: 10, movement: 0.2 },
    ],
    history: [
      { date: "2024-03-10", event: "Emergency assessment", notes: "Possible infection, blood samples taken" },
      { date: "2024-03-05", event: "Social isolation observed", notes: "Separated from group" },
      { date: "2024-02-20", event: "Appetite decrease", notes: "Reduced food intake by 40%" },
    ],
  },
]

type SortField = "name" | "species" | "age" | "location" | "status"
type SortDirection = "asc" | "desc"

interface AnimalTableProps {
  filter?: "all" | "tracked" | "alerts"
  animals?: any[] // Added animals prop for external filtering
}

export function AnimalTable({ filter = "all", animals: externalAnimals }: AnimalTableProps) {
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  const baseAnimals = externalAnimals || animals

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "excellent":
        return "bg-green-500 hover:bg-green-600"
      case "good":
        return "bg-emerald-500 hover:bg-emerald-600"
      case "fair":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "poor":
        return "bg-orange-500 hover:bg-orange-600"
      case "critical":
        return "bg-red-500 hover:bg-red-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  // Filter animals based on the selected filter
  const filteredAnimals = baseAnimals.filter((animal) => {
    if (filter === "tracked") return animal.tracked
    if (filter === "alerts") return animal.hasAlert
    return true
  })

  // Sort animals based on the selected sort field and direction
  const sortedAnimals = [...filteredAnimals].sort((a, b) => {
    let aValue = a[sortField]
    let bValue = b[sortField]

    if (typeof aValue === "string" && typeof bValue === "string") {
      aValue = aValue.toLowerCase()
      bValue = bValue.toLowerCase()
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  return (
    <div className="relative rounded-md border">
      <LeafDecoration className="absolute -top-6 -left-6 w-16 h-16 text-green-600/20 rotate-45" />
      <LeafDecoration className="absolute -bottom-6 -right-6 w-16 h-16 text-green-600/20 -rotate-45" />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort("name")} className="flex items-center">
                Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort("species")} className="flex items-center">
                Species
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort("age")} className="flex items-center">
                Age
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort("location")} className="flex items-center">
                Location
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort("status")} className="flex items-center">
                Status
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Last Seen</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedAnimals.map((animal) => (
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
              <TableCell>
                <Link href={`/animals/${animal.id}/health-records`}>
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    View Health Records
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
          {sortedAnimals.length === 0 && (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                No animals found matching the current filter.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
