"use server"

export type Animal = {
  id: number
  name: string
  tag_id: string
  gender: string
  age_estimate: string
  health_status: string
  last_seen: string
  species_name?: string
  species_id?: number
  date_added?: string
  notes?: string
  image_url?: string
}

// Mock animals data for fallback
const MOCK_ANIMALS: Animal[] = [
  {
    id: 1,
    name: "Jumbo",
    tag_id: "ELE-001",
    gender: "Male",
    age_estimate: "25 years",
    health_status: "Healthy",
    last_seen: new Date().toLocaleString(),
    species_name: "African Elephant",
    species_id: 1,
    image_url: "/images/elephant.jpeg",
    notes: "Large bull elephant",
  },
  {
    id: 2,
    name: "Simba",
    tag_id: "LION-001",
    gender: "Male",
    age_estimate: "8 years",
    health_status: "Healthy",
    last_seen: new Date().toLocaleString(),
    species_name: "Lion",
    species_id: 2,
    image_url: "/images/asian-20lion.jpeg",
    notes: "Pride leader",
  },
  {
    id: 3,
    name: "Rajah",
    tag_id: "TIGER-001",
    gender: "Male",
    age_estimate: "12 years",
    health_status: "Healthy",
    last_seen: new Date().toLocaleString(),
    species_name: "Bengal Tiger",
    species_id: 4,
    image_url: "/images/tiger.jpeg",
    notes: "Solitary male",
  },
  {
    id: 4,
    name: "Kali",
    tag_id: "RHINO-001",
    gender: "Female",
    age_estimate: "18 years",
    health_status: "Monitored",
    last_seen: new Date().toLocaleString(),
    species_name: "Black Rhino",
    species_id: 3,
    image_url: "/images/rhino.jpeg",
    notes: "Critically endangered female",
  },
  {
    id: 5,
    name: "Kali",
    tag_id: "GORILLA-001",
    gender: "Male",
    age_estimate: "30 years",
    health_status: "Healthy",
    last_seen: new Date().toLocaleString(),
    species_name: "Western Lowland Gorilla",
    species_id: 5,
    image_url: "/images/gorilla.jpeg",
    notes: "Silverback group leader",
  },
]

export async function getAnimals(): Promise<Animal[]> {
  try {
    // Return mock data for now - in production this would connect to Supabase
    return MOCK_ANIMALS
  } catch (err) {
    console.error("Error in getAnimals:", err)
    return MOCK_ANIMALS
  }
}

export async function addAnimal(animalData: Omit<Animal, "id">) {
  try {
    // Mock implementation - in production this would save to Supabase
    const newAnimal: Animal = {
      ...animalData,
      id: Math.max(...MOCK_ANIMALS.map((a) => a.id), 0) + 1,
    }
    MOCK_ANIMALS.push(newAnimal)
    return newAnimal
  } catch (err) {
    console.error("Error in addAnimal:", err)
    throw err
  }
}
