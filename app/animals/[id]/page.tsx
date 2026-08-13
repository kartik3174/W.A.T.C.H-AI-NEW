import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { animals } from "@/components/dashboard/animal-table"
import { AnimalProfile } from "@/components/animals/animal-profile"
import { PageHeader } from "@/components/dashboard/page-header"
import { LeafDecoration } from "@/components/leaf-decoration"

type AnimalPageProps = {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: AnimalPageProps): Promise<Metadata> {
  const animal = animals.find((a) => a.id === params.id)

  if (!animal) {
    return {
      title: "Animal Not Found | Wildlife Watch",
    }
  }

  return {
    title: `${animal.name} (${animal.id}) | Wildlife Watch`,
    description: `Detailed profile and monitoring data for ${animal.name}, a ${animal.age} year old ${animal.gender.toLowerCase()} ${animal.species.toLowerCase()}.`,
  }
}

export default function AnimalPage({ params }: AnimalPageProps) {
  const animal = animals.find((a) => a.id === params.id)

  if (!animal) {
    notFound()
  }

  return (
    <div className="container mx-auto py-6 relative">
      <LeafDecoration className="absolute -top-6 -left-6 w-16 h-16 text-green-600/20 rotate-45" />
      <LeafDecoration className="absolute -bottom-6 -right-6 w-16 h-16 text-green-600/20 -rotate-45" />

      <PageHeader
        title={`${animal.name} (${animal.id})`}
        description={`${animal.age} year old ${animal.gender} ${animal.species}`}
      />
      <AnimalProfile animal={animal} />
    </div>
  )
}
