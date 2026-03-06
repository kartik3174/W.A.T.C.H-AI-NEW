import type { Metadata } from "next"
import { PageHeader } from "@/components/dashboard/page-header"
import { AnimalCareHub } from "@/components/animal-care/animal-care-hub"
import { animals } from "@/components/dashboard/animal-table"
import { AnimalProfile } from "@/components/animals/animal-profile"
import { LeafDecoration } from "@/components/leaf-decoration"

export const metadata: Metadata = {
  title: "Animal Care | Owl Watch",
  description: "Health monitoring and care recommendations for wildlife",
}

export default function AnimalCarePage({ searchParams }: { searchParams: { id?: string } }) {
  const animalId = searchParams.id

  // If an animal ID is provided, show the animal profile
  if (animalId) {
    const animal = animals.find((a) => a.id === animalId)

    if (animal) {
      // Map the animal data to ensure it has the expected structure
      const mappedAnimal = {
        ...animal,
        // Ensure these properties exist to prevent undefined errors
        status: animal.status || "Unknown",
        image: animal.image || `/placeholder.svg?height=300&width=300`,
        description: animal.description || `No description available for ${animal.name}.`,
        // Add any other required properties with defaults
      }

      return (
        <div className="container mx-auto py-6 relative">
          <LeafDecoration position="top-right" size="lg" opacity={0.05} className="hidden lg:block" />
          <LeafDecoration position="bottom-left" size="md" rotation={45} opacity={0.05} className="hidden lg:block" />

          <PageHeader
            title={`${animal.name} (${animal.id})`}
            description={`${animal.age} year old ${animal.gender} ${animal.species}`}
          />
          <AnimalProfile animal={mappedAnimal} />
        </div>
      )
    }
  }

  // Otherwise show the regular animal care hub
  return (
    <div className="container mx-auto py-6 relative">
      <LeafDecoration position="top-right" size="lg" opacity={0.05} className="hidden lg:block" />
      <LeafDecoration position="bottom-left" size="md" rotation={45} opacity={0.05} className="hidden lg:block" />

      <PageHeader title="Animal Care" description="Health monitoring and care recommendations" />
      <AnimalCareHub />
    </div>
  )
}
