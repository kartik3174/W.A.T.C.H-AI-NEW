"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Eye, Plus, Search } from "lucide-react"
import { type Animal, getAnimals, addAnimal } from "@/app/actions/animal-actions"
import { useToast } from "@/hooks/use-toast"
import { type Species, getSpecies } from "@/app/actions/species-actions"
import { Separator } from "@/components/ui/separator"

export function AnimalDatabase() {
  const [animals, setAnimals] = useState<Animal[]>([])
  const [species, setSpecies] = useState<Species[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null)
  const { toast } = useToast()

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    tag_id: "",
    gender: "Male",
    age_estimate: "",
    health_status: "Unknown",
    species_id: species.length > 0 ? species[0].id : 0,
    notes: "",
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [animalData, speciesData] = await Promise.all([getAnimals(), getSpecies()])
        setAnimals(animalData)
        setSpecies(speciesData)
      } catch (error) {
        console.error("Failed to load animals or species:", error)
        toast({
          title: "Error",
          description: "Failed to load animals or species from the database",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (!formData.species_id) {
        toast({
          title: "Validation Error",
          description: "Please select a species",
          variant: "destructive",
        })
        return
      }

      await addAnimal({
        ...formData,
        species_id: Number(formData.species_id),
      })

      toast({
        title: "Success",
        description: "Animal added successfully",
      })

      // Refresh the animal list
      const updatedAnimals = await getAnimals()
      setAnimals(updatedAnimals)

      // Reset form and close dialog
      setFormData({
        name: "",
        tag_id: "",
        gender: "Male",
        age_estimate: "",
        health_status: "Unknown",
        species_id: species.length > 0 ? species[0].id : 0,
        notes: "",
      })
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error("Failed to add animal:", error)
      toast({
        title: "Error",
        description: "Failed to add animal to the database",
        variant: "destructive",
      })
    }
  }

  const handleViewAnimal = (animal: Animal) => {
    setSelectedAnimal(animal)
    setIsViewDialogOpen(true)
  }

  const filteredAnimals = animals.filter(
    (animal) =>
      animal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      animal.tag_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (animal.species_name && animal.species_name.toLowerCase().includes(searchQuery.toLowerCase())),
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
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Animal Database</CardTitle>
              <CardDescription>Manage and track wildlife in the conservation area</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Animal
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Animal</DialogTitle>
                  <DialogDescription>Enter the details of the animal to add to the database.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="tag_id" className="text-right">
                        Tag ID
                      </Label>
                      <Input
                        id="tag_id"
                        name="tag_id"
                        value={formData.tag_id}
                        onChange={handleInputChange}
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="gender" className="text-right">
                        Gender
                      </Label>
                      <Select value={formData.gender} onValueChange={(value) => handleSelectChange("gender", value)}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Unknown">Unknown</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="age_estimate" className="text-right">
                        Age Estimate
                      </Label>
                      <Input
                        id="age_estimate"
                        name="age_estimate"
                        value={formData.age_estimate}
                        onChange={handleInputChange}
                        className="col-span-3"
                        placeholder="e.g., 5 years"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="health_status" className="text-right">
                        Health Status
                      </Label>
                      <Select
                        value={formData.health_status}
                        onValueChange={(value) => handleSelectChange("health_status", value)}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select health status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Excellent">Excellent</SelectItem>
                          <SelectItem value="Good">Good</SelectItem>
                          <SelectItem value="Fair">Fair</SelectItem>
                          <SelectItem value="Poor">Poor</SelectItem>
                          <SelectItem value="Critical">Critical</SelectItem>
                          <SelectItem value="Unknown">Unknown</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="species_id" className="text-right">
                        Species
                      </Label>
                      <Select
                        value={formData.species_id.toString()}
                        onValueChange={(value) => handleSelectChange("species_id", value)}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select species" />
                        </SelectTrigger>
                        <SelectContent>
                          {species.map((s) => (
                            <SelectItem key={s.id} value={s.id.toString()}>
                              {s.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="notes" className="text-right">
                        Notes
                      </Label>
                      <Input
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Add Animal</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search animals..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading animals...</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tag ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Species</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Health Status</TableHead>
                    <TableHead>Last Seen</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAnimals.length > 0 ? (
                    filteredAnimals.map((animal) => (
                      <TableRow key={animal.id}>
                        <TableCell className="font-medium">{animal.tag_id}</TableCell>
                        <TableCell>{animal.name}</TableCell>
                        <TableCell>{animal.species_name || "Unknown"}</TableCell>
                        <TableCell>{animal.gender}</TableCell>
                        <TableCell>{animal.age_estimate}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(animal.health_status)}>{animal.health_status}</Badge>
                        </TableCell>
                        <TableCell>{animal.last_seen}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => handleViewAnimal(animal)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        {searchQuery ? "No animals match your search" : "No animals found in the database"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Animal Details: {selectedAnimal?.name}</DialogTitle>
            <DialogDescription>Complete information for {selectedAnimal?.tag_id}</DialogDescription>
          </DialogHeader>

          {selectedAnimal && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Tag ID</p>
                  <p className="font-medium">{selectedAnimal.tag_id}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{selectedAnimal.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Species</p>
                  <p className="font-medium">{selectedAnimal.species_name || "Unknown"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Gender</p>
                  <p className="font-medium">{selectedAnimal.gender}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Age Estimate</p>
                  <p className="font-medium">{selectedAnimal.age_estimate || "Unknown"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Health Status</p>
                  <Badge className={getStatusColor(selectedAnimal.health_status)}>{selectedAnimal.health_status}</Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Last Seen</p>
                  <p className="font-medium">{selectedAnimal.last_seen || "Never"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Date Added</p>
                  <p className="font-medium">{selectedAnimal.date_added}</p>
                </div>
              </div>

              {selectedAnimal.notes && (
                <>
                  <Separator />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Notes</p>
                    <p className="text-sm text-muted-foreground">{selectedAnimal.notes}</p>
                  </div>
                </>
              )}

              <Separator />

              <div className="space-y-1">
                <p className="text-sm font-medium">Database Information</p>
                <p className="text-xs text-muted-foreground">ID: {selectedAnimal.id}</p>
                <p className="text-xs text-muted-foreground">Species ID: {selectedAnimal.species_id}</p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
