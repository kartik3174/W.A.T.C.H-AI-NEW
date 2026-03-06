"use server"

export type Species = {
  id: number
  name: string
  scientific_name?: string
  conservation_status?: string
  description?: string
}

// Mock species data for fallback
const MOCK_SPECIES: Species[] = [
  {
    id: 1,
    name: "African Elephant",
    scientific_name: "Loxodonta africana",
    conservation_status: "Vulnerable",
    description: "The largest land animal",
  },
  {
    id: 2,
    name: "Lion",
    scientific_name: "Panthera leo",
    conservation_status: "Vulnerable",
    description: "The king of beasts",
  },
  {
    id: 3,
    name: "Black Rhino",
    scientific_name: "Diceros bicornis",
    conservation_status: "Critically Endangered",
    description: "Two-horned rhinoceros",
  },
  {
    id: 4,
    name: "Bengal Tiger",
    scientific_name: "Panthera tigris tigris",
    conservation_status: "Endangered",
    description: "Orange and black striped big cat",
  },
  {
    id: 5,
    name: "Western Lowland Gorilla",
    scientific_name: "Gorilla gorilla gorilla",
    conservation_status: "Critically Endangered",
    description: "Largest living primate",
  },
]

export async function getSpecies(): Promise<Species[]> {
  try {
    // Return mock data for now - in production this would connect to Supabase
    return MOCK_SPECIES
  } catch (err) {
    console.error("Error in getSpecies:", err)
    return MOCK_SPECIES
  }
}
