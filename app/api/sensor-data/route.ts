import { NextResponse } from "next/server"
import { readFile } from "fs/promises"
import path from "path"

// Animal profiles matching the Python simulation
const ANIMALS = [
  { id: "EL-001", name: "Tembo", species: "Elephant", location: "North Region, Sector 1", normalHr: [35, 50], stressedHr: [55, 80] },
  { id: "LI-002", name: "Simba", species: "Lion", location: "East Region, Sector 5", normalHr: [60, 80], stressedHr: [90, 140] },
  { id: "RH-003", name: "Kifaru", species: "Rhino", location: "South Region, Sector 3", normalHr: [35, 50], stressedHr: [55, 75] },
  { id: "TI-004", name: "Raja", species: "Tiger", location: "West Region, Sector 8", normalHr: [60, 80], stressedHr: [110, 160] },
  { id: "GO-005", name: "Zuri", species: "Gorilla", location: "North Region, Sector 2", normalHr: [60, 80], stressedHr: [90, 130] },
]

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randFloat(min: number, max: number, decimals: number = 1) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals))
}

function generateSimulatedData() {
  const now = new Date()
  const timestamp = now.toISOString().replace("T", " ").slice(0, 19)

  const readings = ANIMALS.map((animal) => {
    const isStressed = Math.random() > 0.8
    const isCritical = isStressed && Math.random() > 0.7

    let status: string
    let heartRate: number
    let bodyTemp: number
    let stressLevel: number

    if (isCritical) {
      status = "Critical"
      heartRate = randInt(animal.stressedHr[0] + 20, animal.stressedHr[1] + 30)
      bodyTemp = randFloat(39.5, 41.0)
      stressLevel = randInt(75, 100)
    } else if (isStressed) {
      status = "High Stress/Threat"
      heartRate = randInt(animal.stressedHr[0], animal.stressedHr[1])
      bodyTemp = randFloat(38.5, 39.5)
      stressLevel = randInt(50, 80)
    } else {
      status = "Normal"
      heartRate = randInt(animal.normalHr[0], animal.normalHr[1])
      bodyTemp = randFloat(36.5, 38.0)
      stressLevel = randInt(5, 30)
    }

    return {
      animal_id: animal.id,
      name: animal.name,
      species: animal.species,
      location: animal.location,
      timestamp,
      heart_rate: heartRate,
      body_temp: bodyTemp,
      stress_level: stressLevel,
      status,
      battery_level: `${randInt(60, 100)}%`,
      signal_strength: `${randInt(70, 100)}%`,
      gps_accuracy: `${randFloat(1.0, 5.0)}m`,
    }
  })

  return {
    timestamp,
    total_animals: readings.length,
    alerts: readings.filter((r) => r.status !== "Normal").length,
    readings,
    source: "live-simulation",
  }
}

export async function GET() {
  // First, try to read from the file written by the Python script
  try {
    const filePath = path.join(process.cwd(), "public", "sensor_data.json")
    const fileContent = await readFile(filePath, "utf-8")
    const data = JSON.parse(fileContent)

    // Check if data is fresh (within last 10 seconds)
    const dataTime = new Date(data.timestamp).getTime()
    const now = Date.now()
    if (now - dataTime < 10000) {
      return NextResponse.json({ ...data, source: "python-simulation" })
    }
  } catch {
    // File doesn't exist or is stale, fall through to JS simulation
  }

  // Fallback: generate data server-side
  const data = generateSimulatedData()
  return NextResponse.json(data)
}
