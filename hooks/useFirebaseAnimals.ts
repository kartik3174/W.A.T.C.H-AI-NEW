"use client"

import { useEffect, useState } from "react"
import { watchAnimals, type FirebaseAnimal } from "@/lib/firebase-rtdb"
import { type Animal } from "@/app/actions/animal-actions"

function mapToAnimal(fbAnimal: FirebaseAnimal & { key: string }, index: number): Animal {
  return {
    id: index + 1,
    name: fbAnimal.name,
    tag_id: fbAnimal.tagId || fbAnimal.key,
    gender: fbAnimal.gender,
    age_estimate: `${fbAnimal.age} years`,
    health_status: fbAnimal.healthStatus,
    last_seen: fbAnimal.lastSeen
      ? new Date(fbAnimal.lastSeen).toLocaleString()
      : "Unknown",
    species_name: fbAnimal.species,
    date_added: fbAnimal.createdAt
      ? new Date(fbAnimal.createdAt).toLocaleDateString()
      : undefined,
    notes: fbAnimal.notes,
    image_url: fbAnimal.image_url,
  }
}

export function useFirebaseAnimals() {
  const [animals, setAnimals] = useState<Animal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const unsubscribe = watchAnimals((fbAnimals) => {
        setAnimals(fbAnimals.map(mapToAnimal))
        setLoading(false)
      })
      return unsubscribe
    } catch (err) {
      setError("Failed to connect to Firebase")
      setLoading(false)
    }
  }, [])

  return { animals, loading, error }
}
