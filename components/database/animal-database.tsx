"use client"

import type React from "react"
import { useState } from "react"
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
import { type Animal } from "@/app/actions/animal-actions"
import { addAnimalToDb } from "@/lib/firebase-rtdb"
import { useFirebaseAnimals } from "@/hooks/useFirebaseAnimals"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"

export function AnimalDatabase() {
  const { animals, loading } = useFirebaseAnimals()
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    tagId: "",
    name: "",
    species: "",
    gender: "Male",
    age: "",
    healthStatus: "Healthy",
    notes: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.tagId || !formData.name || !formData.species) {
      toast({
        title: "Validation Error",
        description: "Tag ID, Name, and Species are required",
        variant: "destructive",
      })
      return
    }

    try {
      await addAnimalToDb({
        tagId: formData.tagId.toUpperCase(),
        name: formData.name,
        species: formData.species,
        gender: formData.gender,
        age: Number(formData.age) || 0,
        healthStatus: formData.healthStatus,
        lastSeen: new Date().toISOString(),
        notes: formData.notes,
      })

      toast({ title: "Success", description: `${formData.name} added to Firebase successfully` })

      setFormData({ tagId: "", name: "", species: "", gender: "Male", age: "", healthStatus: "Healthy", notes: "" })
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error("Failed to add animal:", error)
      toast({ title: "Error", description: "Failed to add animal to Firebase", variant: "destructive" })
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
      case "excellent": return "bg-green-500 hover:bg-green-600"
      case "good": return "bg-blue-500 hover:bg-blue-600"
      case "healthy": return "bg-emerald-500 hover:bg-emerald-600"
      case "monitored": return "bg-yellow-600 hover:bg-yellow-700"
      case "fair": return "bg-yellow-500 hover:bg-yellow-600"
      case "poor": return "bg-red-500 hover:bg-red-600"
      case "critical": return "bg-purple-500 hover:bg-purple-600"
      default: return "bg-gray-500 hover:bg-gray-600"
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
                  <DialogDescription>Enter the details of the animal to add to Firebase.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="tagId" className="text-right">Tag ID</Label>
                      <Input id="tagId" name="tagId" value={formData.tagId} onChange={handleInputChange} className="col-span-3" placeholder="e.g. ELE-002" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">Name</Label>
                      <Input id="name" name="name" value={formData.name} onChange={handleInputChange} className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="species" className="text-right">Species</Label>
                      <Input id="species" name="species" value={formData.species} onChange={handleInputChange} className="col-span-3" placeholder="e.g. African Elephant" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="gender" className="text-right">Gender</Label>
                      <Select value={formData.gender} onValueChange={(value) => handleSelectChange("gender", value)}>
                        <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Unknown">Unknown</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="age" className="text-right">Age (years)</Label>
                      <Input id="age" name="age" type="number" value={formData.age} onChange={handleInputChange} className="col-span-3" placeholder="e.g. 5" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="healthStatus" className="text-right">Health Status</Label>
                      <Select value={formData.healthStatus} onValueChange={(value) => handleSelectChange("healthStatus", value)}>
                        <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Healthy">Healthy</SelectItem>
                          <SelectItem value="Monitored">Monitored</SelectItem>
                          <SelectItem value="Fair">Fair</SelectItem>
                          <SelectItem value="Poor">Poor</SelectItem>
                          <SelectItem value="Critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="notes" className="text-right">Notes</Label>
                      <Input id="notes" name="notes" value={formData.notes} onChange={handleInputChange} className="col-span-3" />
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
              <p className="text-muted-foreground animate-pulse">Loading from Firebase...</p>
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
                      <TableRow key={animal.tag_id}>
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
                        {searchQuery ? "No animals match your search" : "No animals found in Firebase"}
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
                  <p className="font-medium">{selectedAnimal.date_added || "—"}</p>
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
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
