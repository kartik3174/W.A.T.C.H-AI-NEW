"use server"

export type Camera = {
  id: number
  name: string
  location: string
  location_description?: string
  camera_type?: string
  status: string
  threshold_value: number
  last_maintenance?: string
}

// Mock cameras data for fallback
const MOCK_CAMERAS: Camera[] = [
  {
    id: 1,
    name: "Ridge Point Camera",
    location: "North Ridge, Sector 1",
    location_description: "Rocky ridge overlooking watering hole",
    camera_type: "Motion-Activated",
    status: "Active",
    threshold_value: 45,
    last_maintenance: "2024-02-01",
  },
  {
    id: 2,
    name: "Watering Hole Monitor",
    location: "Central Zone, Sector 2",
    location_description: "Primary watering hole",
    camera_type: "24/7 Recording",
    status: "Active",
    threshold_value: 60,
    last_maintenance: "2024-01-28",
  },
  {
    id: 3,
    name: "Forest Trail Cam",
    location: "West Reserve, Sector 3",
    location_description: "Dense forest pathway",
    camera_type: "Motion-Activated",
    status: "Active",
    threshold_value: 35,
    last_maintenance: "2024-01-15",
  },
  {
    id: 4,
    name: "Perimeter Guard",
    location: "South Boundary, Sector 4",
    location_description: "Fence perimeter monitoring",
    camera_type: "Night Vision",
    status: "Active",
    threshold_value: 50,
    last_maintenance: "2024-02-05",
  },
  {
    id: 5,
    name: "Gorilla Sanctuary Cam",
    location: "Gorilla Zone, Sector 5",
    location_description: "Protected gorilla habitat",
    camera_type: "Wildlife Documentary",
    status: "Maintenance",
    threshold_value: 40,
    last_maintenance: "2024-01-20",
  },
]

export async function getCameras(): Promise<Camera[]> {
  try {
    // Return mock data for now - in production this would connect to Supabase
    return [...MOCK_CAMERAS]
  } catch (err) {
    console.error("Error in getCameras:", err)
    return []
  }
}

export async function addCamera(cameraData: Omit<Camera, "id" | "location"> & { latitude: number; longitude: number }) {
  try {
    // Mock implementation - in production this would save to Supabase
    const newCamera: Camera = {
      ...cameraData,
      id: Math.max(...MOCK_CAMERAS.map((c) => c.id), 0) + 1,
      location: `(${cameraData.longitude}, ${cameraData.latitude})`,
    }
    MOCK_CAMERAS.push(newCamera)
    return newCamera
  } catch (err) {
    console.error("Error in addCamera:", err)
    throw err
  }
}

export async function updateCamera(id: number, cameraData: Partial<Camera>) {
  try {
    // Mock implementation - in production this would save to Supabase
    const camera = MOCK_CAMERAS.find((c) => c.id === id)
    if (camera) {
      if (cameraData.status) camera.status = cameraData.status
      if (cameraData.threshold_value !== undefined) camera.threshold_value = cameraData.threshold_value
      return camera
    }
    throw new Error("Camera not found")
  } catch (err) {
    console.error("Error in updateCamera:", err)
    throw err
  }
}
