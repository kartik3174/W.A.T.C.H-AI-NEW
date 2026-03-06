"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Search,
  AlertTriangle,
  MapPin,
  Navigation,
  Heart,
  Activity,
  Shield,
  X,
  Bell,
  Pause,
  Play,
  ZoomIn,
  ZoomOut,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { LeafDecoration } from "@/components/leaf-decoration"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import Image from "next/image"

// --- Data Types ---
interface AnimalData {
  id: string
  name: string
  species: string
  x: number
  y: number
  status: "Excellent" | "Good" | "Fair" | "Poor" | "Critical"
  image: string
  habitat: string
  location: string
  coordinates: string
  lastSeen: string
  vitals: { heartRate: string; temperature: string; activity: string }
  alert: boolean
  alertMessage?: string
  color: string
  speed: number
  angle: number
}

interface BoundaryAlert {
  id: string
  animalId: string
  animalName: string
  species: string
  timestamp: Date
  direction: string
  zone: string
}

// --- Reserve boundary polygon (percentage-based, irregular shape) ---
const RESERVE_BOUNDARY = [
  { x: 15, y: 8 },
  { x: 40, y: 5 },
  { x: 65, y: 7 },
  { x: 85, y: 15 },
  { x: 90, y: 35 },
  { x: 88, y: 55 },
  { x: 82, y: 72 },
  { x: 70, y: 85 },
  { x: 50, y: 92 },
  { x: 30, y: 88 },
  { x: 15, y: 75 },
  { x: 8, y: 55 },
  { x: 10, y: 30 },
]

// Inner safe zone (warning zone between inner and outer)
const INNER_ZONE = [
  { x: 22, y: 16 },
  { x: 42, y: 13 },
  { x: 62, y: 15 },
  { x: 78, y: 22 },
  { x: 82, y: 38 },
  { x: 80, y: 52 },
  { x: 75, y: 66 },
  { x: 64, y: 77 },
  { x: 48, y: 83 },
  { x: 33, y: 80 },
  { x: 22, y: 68 },
  { x: 16, y: 52 },
  { x: 17, y: 35 },
]

// Zones inside the reserve
const ZONES = [
  { name: "Savanna", cx: 35, cy: 30, rx: 15, ry: 12 },
  { name: "Wetlands", cx: 65, cy: 25, rx: 12, ry: 10 },
  { name: "Dense Forest", cx: 55, cy: 55, rx: 14, ry: 12 },
  { name: "Mountain", cx: 28, cy: 65, rx: 10, ry: 10 },
  { name: "Grasslands", cx: 50, cy: 42, rx: 10, ry: 8 },
]

// Water features
const RIVERS = [
  "M 20,20 Q 35,35 30,50 T 40,75",
  "M 60,15 Q 70,30 65,45 T 72,65",
]

// Point-in-polygon (ray casting)
function isInsidePolygon(
  px: number,
  py: number,
  polygon: { x: number; y: number }[]
): boolean {
  let inside = false
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x
    const yi = polygon[i].y
    const xj = polygon[j].x
    const yj = polygon[j].y
    const intersect =
      yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi
    if (intersect) inside = !inside
  }
  return inside
}

function polyToSvgPath(poly: { x: number; y: number }[]): string {
  return (
    poly.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") +
    " Z"
  )
}

const INITIAL_ANIMALS: AnimalData[] = [
  {
    id: "EL-001",
    name: "Tembo",
    species: "Elephant",
    x: 35,
    y: 30,
    status: "Excellent",
    image: "/images/elephant.jpg",
    habitat: "Savanna Grasslands",
    location: "North Region, Sector 3",
    coordinates: "2.4567 N, 34.8901 E",
    lastSeen: "Live",
    vitals: { heartRate: "65 bpm", temperature: "36.2 C", activity: "Normal" },
    alert: false,
    color: "#22c55e",
    speed: 0.3,
    angle: Math.random() * Math.PI * 2,
  },
  {
    id: "LI-002",
    name: "Simba",
    species: "Lion",
    x: 55,
    y: 45,
    status: "Good",
    image: "/images/lion.jpg",
    habitat: "Open Woodland",
    location: "East Region, Sector 5",
    coordinates: "2.1234 N, 35.5678 E",
    lastSeen: "Live",
    vitals: { heartRate: "70 bpm", temperature: "38.1 C", activity: "Normal" },
    alert: false,
    color: "#f59e0b",
    speed: 0.45,
    angle: Math.random() * Math.PI * 2,
  },
  {
    id: "RH-003",
    name: "Kifaru",
    species: "Rhino",
    x: 30,
    y: 60,
    status: "Fair",
    image: "/images/rhino.jpg",
    habitat: "Wetland Marshes",
    location: "South Region, Sector 2",
    coordinates: "1.8765 N, 34.2109 E",
    lastSeen: "Live",
    vitals: {
      heartRate: "75 bpm",
      temperature: "37.5 C",
      activity: "Reduced",
    },
    alert: false,
    color: "#6366f1",
    speed: 0.2,
    angle: Math.random() * Math.PI * 2,
  },
  {
    id: "TI-004",
    name: "Raja",
    species: "Tiger",
    x: 68,
    y: 50,
    status: "Poor",
    image: "/images/tiger.jpg",
    habitat: "Dense Forest",
    location: "West Region, Sector 7",
    coordinates: "2.6543 N, 34.1098 E",
    lastSeen: "Live",
    vitals: { heartRate: "90 bpm", temperature: "39.2 C", activity: "Low" },
    alert: true,
    alertMessage: "Elevated temperature and heart rate",
    color: "#ef4444",
    speed: 0.55,
    angle: Math.random() * Math.PI * 2,
  },
  {
    id: "GO-005",
    name: "Zuri",
    species: "Gorilla",
    x: 28,
    y: 42,
    status: "Critical",
    image: "/images/gorilla.jpg",
    habitat: "Mountain Forest",
    location: "North Region, Sector 1",
    coordinates: "2.9876 N, 33.5432 E",
    lastSeen: "Live",
    vitals: {
      heartRate: "95 bpm",
      temperature: "39.5 C",
      activity: "Very Low",
    },
    alert: true,
    alertMessage: "Significantly reduced activity and elevated vitals",
    color: "#a855f7",
    speed: 0.15,
    angle: Math.random() * Math.PI * 2,
  },
]

export function TrackingMap() {
  const [animals, setAnimals] = useState<AnimalData[]>(INITIAL_ANIMALS)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalData | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [boundaryAlerts, setBoundaryAlerts] = useState<BoundaryAlert[]>([])
  const [isSimulating, setIsSimulating] = useState(true)
  const [showZones, setShowZones] = useState(true)
  const [zoom, setZoom] = useState(1)
  const alertedRef = useRef<Set<string>>(new Set())
  const svgRef = useRef<SVGSVGElement>(null)

  // Move animals and check boundaries
  const simulateMovement = useCallback(() => {
    setAnimals((prev) =>
      prev.map((animal) => {
        // Slight random angle drift
        let newAngle =
          animal.angle + (Math.random() - 0.5) * 0.6
        let newX = animal.x + Math.cos(newAngle) * animal.speed
        let newY = animal.y + Math.sin(newAngle) * animal.speed

        // Soft bounce off SVG edges
        if (newX < 3 || newX > 97) {
          newAngle = Math.PI - newAngle
          newX = Math.max(3, Math.min(97, newX))
        }
        if (newY < 3 || newY > 97) {
          newAngle = -newAngle
          newY = Math.max(3, Math.min(97, newY))
        }

        const insideBoundary = isInsidePolygon(newX, newY, RESERVE_BOUNDARY)
        const insideInner = isInsidePolygon(newX, newY, INNER_ZONE)
        const wasInside = isInsidePolygon(animal.x, animal.y, RESERVE_BOUNDARY)

        // Crossed boundary outward
        if (wasInside && !insideBoundary && !alertedRef.current.has(animal.id)) {
          alertedRef.current.add(animal.id)
          const direction =
            newX > animal.x
              ? newY > animal.y
                ? "Southeast"
                : "Northeast"
              : newY > animal.y
                ? "Southwest"
                : "Northwest"

          setBoundaryAlerts((a) => [
            {
              id: `${animal.id}-${Date.now()}`,
              animalId: animal.id,
              animalName: animal.name,
              species: animal.species,
              timestamp: new Date(),
              direction,
              zone: "Reserve Perimeter",
            },
            ...a.slice(0, 9),
          ])
        }

        // Re-entered boundary
        if (!wasInside && insideBoundary) {
          alertedRef.current.delete(animal.id)
        }

        // Determine zone
        let zone = "Open Area"
        if (!insideBoundary) zone = "OUTSIDE RESERVE"
        else if (!insideInner) zone = "Warning Zone"
        else {
          for (const z of ZONES) {
            const dx = (newX - z.cx) / z.rx
            const dy = (newY - z.cy) / z.ry
            if (dx * dx + dy * dy <= 1) {
              zone = z.name
              break
            }
          }
        }

        return {
          ...animal,
          x: newX,
          y: newY,
          angle: newAngle,
          location: zone,
          lastSeen: "Live",
        }
      })
    )
  }, [])

  useEffect(() => {
    if (!isSimulating) return
    const interval = setInterval(simulateMovement, 800)
    return () => clearInterval(interval)
  }, [isSimulating, simulateMovement])

  const handleAnimalClick = (animal: AnimalData) => {
    setSelectedAnimal(animal)
    setIsDialogOpen(true)
  }

  const dismissAlert = (alertId: string) => {
    setBoundaryAlerts((prev) => prev.filter((a) => a.id !== alertId))
  }

  const filteredAnimals = animals.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.species.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  return (
    <div className="space-y-6 relative">
      <LeafDecoration
        position="top-right"
        size="sm"
        opacity={0.1}
      />

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by animal name, ID, or species..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Switch
              id="simulate"
              checked={isSimulating}
              onCheckedChange={setIsSimulating}
            />
            <label
              htmlFor="simulate"
              className="text-sm font-medium cursor-pointer flex items-center gap-1"
            >
              {isSimulating ? (
                <Pause className="h-3.5 w-3.5" />
              ) : (
                <Play className="h-3.5 w-3.5" />
              )}
              {isSimulating ? "Tracking" : "Paused"}
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="zones"
              checked={showZones}
              onCheckedChange={setShowZones}
            />
            <label
              htmlFor="zones"
              className="text-sm font-medium cursor-pointer"
            >
              Zones
            </label>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
              onClick={() => setZoom((z) => Math.min(z + 0.25, 2))}
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
              onClick={() => setZoom((z) => Math.max(z - 0.25, 0.75))}
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Boundary Alerts Banner */}
      {boundaryAlerts.length > 0 && (
        <div className="space-y-2">
          {boundaryAlerts.slice(0, 3).map((alert) => (
            <Alert
              key={alert.id}
              variant="destructive"
              className="animate-in fade-in slide-in-from-top-2"
            >
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="flex items-center justify-between">
                <span>Boundary Breach - {alert.animalName}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 -mr-2"
                  onClick={() => dismissAlert(alert.id)}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </AlertTitle>
              <AlertDescription>
                {alert.species} ({alert.animalId}) has crossed the reserve
                boundary heading {alert.direction} at{" "}
                {alert.timestamp.toLocaleTimeString()}.
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Map Card */}
      <Card className="border-2 overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Reserve Geofence Map
              </CardTitle>
              <CardDescription>
                Live animal positions with boundary monitoring. Animals
                crossing the red perimeter trigger alerts.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={isSimulating ? "default" : "secondary"}
                className={isSimulating ? "animate-pulse" : ""}
              >
                {isSimulating ? "LIVE" : "PAUSED"}
              </Badge>
              {boundaryAlerts.length > 0 && (
                <Badge variant="destructive" className="animate-pulse">
                  <Bell className="h-3 w-3 mr-1" />
                  {boundaryAlerts.length}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-2 sm:p-4">
          <div
            className="relative w-full overflow-hidden rounded-lg border-2 border-muted"
            style={{ paddingBottom: "75%" }}
          >
            <svg
              ref={svgRef}
              viewBox="0 0 100 100"
              className="absolute inset-0 w-full h-full"
              style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <pattern
                  id="mapGrid"
                  width="5"
                  height="5"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 5 0 L 0 0 0 5"
                    fill="none"
                    stroke="hsl(142 20% 60%)"
                    strokeWidth="0.08"
                    opacity="0.4"
                  />
                </pattern>
                <radialGradient id="terrainGrad" cx="50%" cy="50%" r="55%">
                  <stop offset="0%" stopColor="hsl(120 35% 88%)" />
                  <stop offset="60%" stopColor="hsl(120 30% 82%)" />
                  <stop offset="100%" stopColor="hsl(120 25% 75%)" />
                </radialGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="0.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="alertGlow">
                  <feGaussianBlur stdDeviation="1" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Background terrain */}
              <rect
                width="100"
                height="100"
                fill="url(#terrainGrad)"
                rx="2"
              />
              <rect width="100" height="100" fill="url(#mapGrid)" />

              {/* Rivers */}
              {RIVERS.map((d, i) => (
                <path
                  key={`river-${i}`}
                  d={d}
                  fill="none"
                  stroke="hsl(200 60% 65%)"
                  strokeWidth="0.6"
                  opacity="0.5"
                  strokeLinecap="round"
                />
              ))}

              {/* Zones */}
              {showZones &&
                ZONES.map((zone) => (
                  <g key={zone.name}>
                    <ellipse
                      cx={zone.cx}
                      cy={zone.cy}
                      rx={zone.rx}
                      ry={zone.ry}
                      fill="hsl(120 30% 60%)"
                      opacity="0.12"
                      stroke="hsl(120 30% 50%)"
                      strokeWidth="0.15"
                      strokeDasharray="1 0.5"
                    />
                    <text
                      x={zone.cx}
                      y={zone.cy}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="hsl(120 25% 35%)"
                      fontSize="2"
                      fontWeight="600"
                      opacity="0.6"
                    >
                      {zone.name}
                    </text>
                  </g>
                ))}

              {/* Inner (warning) zone */}
              <path
                d={polyToSvgPath(INNER_ZONE)}
                fill="none"
                stroke="hsl(45 90% 55%)"
                strokeWidth="0.25"
                strokeDasharray="1.5 1"
                opacity="0.6"
              />

              {/* Reserve boundary (danger line) */}
              <path
                d={polyToSvgPath(RESERVE_BOUNDARY)}
                fill="none"
                stroke="hsl(0 80% 55%)"
                strokeWidth="0.4"
                opacity="0.8"
              />
              <path
                d={polyToSvgPath(RESERVE_BOUNDARY)}
                fill="hsl(0 80% 55%)"
                opacity="0.04"
              />

              {/* Compass */}
              <g transform="translate(92, 8)">
                <circle
                  r="3.5"
                  fill="hsl(0 0% 100%)"
                  opacity="0.8"
                  stroke="hsl(0 0% 40%)"
                  strokeWidth="0.15"
                />
                <text
                  textAnchor="middle"
                  y="-0.5"
                  fontSize="2.5"
                  fontWeight="bold"
                  fill="hsl(0 70% 50%)"
                >
                  N
                </text>
                <line
                  x1="0"
                  y1="1"
                  x2="0"
                  y2="2.5"
                  stroke="hsl(0 0% 50%)"
                  strokeWidth="0.2"
                />
              </g>

              {/* Legend box */}
              <g transform="translate(3, 88)">
                <rect
                  width="28"
                  height="10"
                  rx="0.8"
                  fill="hsl(0 0% 100%)"
                  opacity="0.85"
                  stroke="hsl(0 0% 70%)"
                  strokeWidth="0.1"
                />
                <line
                  x1="1.5"
                  y1="3"
                  x2="5"
                  y2="3"
                  stroke="hsl(0 80% 55%)"
                  strokeWidth="0.35"
                />
                <text x="6" y="3.5" fontSize="1.6" fill="hsl(0 0% 30%)">
                  Reserve Boundary
                </text>
                <line
                  x1="1.5"
                  y1="6"
                  x2="5"
                  y2="6"
                  stroke="hsl(45 90% 55%)"
                  strokeWidth="0.25"
                  strokeDasharray="1 0.5"
                />
                <text x="6" y="6.5" fontSize="1.6" fill="hsl(0 0% 30%)">
                  Warning Zone
                </text>
                <circle cx="2.5" cy="8.5" r="0.6" fill="#22c55e" />
                <text x="4" y="9" fontSize="1.6" fill="hsl(0 0% 30%)">
                  Animal Marker
                </text>
              </g>

              {/* Animal markers */}
              {filteredAnimals.map((animal) => {
                const outside = !isInsidePolygon(
                  animal.x,
                  animal.y,
                  RESERVE_BOUNDARY
                )
                const inWarning =
                  !outside &&
                  !isInsidePolygon(animal.x, animal.y, INNER_ZONE)
                return (
                  <g
                    key={animal.id}
                    transform={`translate(${animal.x}, ${animal.y})`}
                    className="cursor-pointer"
                    onClick={() => handleAnimalClick(animal)}
                    style={{ transition: "transform 0.7s ease-out" }}
                  >
                    {/* Danger ring if outside */}
                    {outside && (
                      <circle
                        r="2.8"
                        fill="none"
                        stroke="hsl(0 80% 55%)"
                        strokeWidth="0.3"
                        opacity="0.8"
                        filter="url(#alertGlow)"
                      >
                        <animate
                          attributeName="r"
                          values="2.8;3.5;2.8"
                          dur="1s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          values="0.8;0.3;0.8"
                          dur="1s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}
                    {/* Warning ring */}
                    {inWarning && !outside && (
                      <circle
                        r="2.5"
                        fill="none"
                        stroke="hsl(45 90% 55%)"
                        strokeWidth="0.25"
                        opacity="0.7"
                      >
                        <animate
                          attributeName="opacity"
                          values="0.7;0.3;0.7"
                          dur="1.5s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}
                    {/* Core dot */}
                    <circle
                      r="1.6"
                      fill={animal.color}
                      stroke="white"
                      strokeWidth="0.35"
                      filter="url(#glow)"
                    />
                    {/* Label */}
                    <rect
                      x="-5"
                      y="-4.5"
                      width="10"
                      height="2.2"
                      rx="0.5"
                      fill="hsl(0 0% 100%)"
                      opacity="0.9"
                      stroke={animal.color}
                      strokeWidth="0.12"
                    />
                    <text
                      textAnchor="middle"
                      y="-2.9"
                      fontSize="1.5"
                      fontWeight="600"
                      fill="hsl(0 0% 20%)"
                    >
                      {animal.name}
                    </text>
                    {/* Status icon if outside */}
                    {outside && (
                      <text
                        textAnchor="middle"
                        y="4"
                        fontSize="2.2"
                        fill="hsl(0 80% 55%)"
                      >
                        !
                      </text>
                    )}
                  </g>
                )
              })}
            </svg>
          </div>

          {/* Animal status strip */}
          <div className="mt-4 flex flex-wrap gap-2">
            {animals.map((animal) => {
              const outside = !isInsidePolygon(
                animal.x,
                animal.y,
                RESERVE_BOUNDARY
              )
              const inWarning =
                !outside &&
                !isInsidePolygon(animal.x, animal.y, INNER_ZONE)
              return (
                <button
                  key={animal.id}
                  onClick={() => handleAnimalClick(animal)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium transition-colors ${
                    outside
                      ? "border-red-500 bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                      : inWarning
                        ? "border-yellow-500 bg-yellow-50 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400"
                        : "border-border bg-muted/50 text-foreground hover:bg-muted"
                  }`}
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: animal.color }}
                  />
                  {animal.name}
                  {outside && (
                    <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
                  )}
                  {inWarning && !outside && (
                    <AlertTriangle className="h-3.5 w-3.5 text-yellow-500" />
                  )}
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Alert history */}
      {boundaryAlerts.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="h-4 w-4 text-destructive" />
              Boundary Alert History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {boundaryAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-2 rounded-md bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900"
                >
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {alert.animalName} ({alert.animalId})
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Heading {alert.direction} at{" "}
                        {alert.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => dismissAlert(alert.id)}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Animal detail dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {selectedAnimal?.name} - Tracking Report
            </DialogTitle>
            <DialogDescription>
              {selectedAnimal?.species} ({selectedAnimal?.id}) - Real-time
              Monitoring
            </DialogDescription>
          </DialogHeader>

          {selectedAnimal && (
            <div className="space-y-6">
              <div className="relative aspect-video w-full overflow-hidden rounded-lg border-2">
                <Image
                  src={selectedAnimal.image || "/placeholder.svg"}
                  alt={selectedAnimal.name}
                  fill
                  className="object-cover"
                />
                <Badge
                  className={`absolute top-3 right-3 ${getStatusColor(selectedAnimal.status)}`}
                >
                  {selectedAnimal.status}
                </Badge>
                {!isInsidePolygon(
                  selectedAnimal.x,
                  selectedAnimal.y,
                  RESERVE_BOUNDARY
                ) && (
                  <Badge
                    variant="destructive"
                    className="absolute top-3 left-3 animate-pulse"
                  >
                    OUTSIDE RESERVE
                  </Badge>
                )}
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Location Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg border">
                    <p className="text-sm text-muted-foreground mb-1">
                      Current Zone
                    </p>
                    <p className="font-medium">{selectedAnimal.location}</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg border">
                    <p className="text-sm text-muted-foreground mb-1">
                      Coordinates
                    </p>
                    <p className="font-medium font-mono text-sm">
                      {selectedAnimal.x.toFixed(2)},{" "}
                      {selectedAnimal.y.toFixed(2)}
                    </p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg border">
                    <p className="text-sm text-muted-foreground mb-1">
                      Habitat Type
                    </p>
                    <p className="font-medium">{selectedAnimal.habitat}</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg border">
                    <p className="text-sm text-muted-foreground mb-1">
                      Tracking Status
                    </p>
                    <p className="font-medium">{selectedAnimal.lastSeen}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Current Vital Signs
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg border flex items-center gap-3">
                    <Heart className="h-8 w-8 text-red-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Heart Rate
                      </p>
                      <p className="font-semibold text-lg">
                        {selectedAnimal.vitals.heartRate}
                      </p>
                    </div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg border flex items-center gap-3">
                    <Activity className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Temperature
                      </p>
                      <p className="font-semibold text-lg">
                        {selectedAnimal.vitals.temperature}
                      </p>
                    </div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg border flex items-center gap-3">
                    <Navigation className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Activity</p>
                      <p className="font-semibold text-lg">
                        {selectedAnimal.vitals.activity}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {selectedAnimal.alert && (
                <>
                  <Separator />
                  <Alert variant="destructive">
                    <AlertTriangle className="h-5 w-5" />
                    <AlertTitle className="text-lg">
                      Active Health Alert
                    </AlertTitle>
                    <AlertDescription className="text-base mt-2">
                      {selectedAnimal.alertMessage}
                    </AlertDescription>
                  </Alert>
                </>
              )}

              <Separator />

              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="flex-1" asChild>
                  <a href={`/animals/${selectedAnimal.id}`}>
                    View Full Profile
                  </a>
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent"
                >
                  Download Report
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
