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
import { Plus, Search, Settings } from "lucide-react"
import { type Camera as CameraType, getCameras, addCamera, updateCamera } from "@/app/actions/camera-actions"
import { useToast } from "@/hooks/use-toast"

export function CameraDatabase() {
  const [cameras, setCameras] = useState<CameraType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false)
  const [selectedCamera, setSelectedCamera] = useState<CameraType | null>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    latitude: 0,
    longitude: 0,
    location_description: "",
    camera_type: "Standard",
    status: "Active",
    threshold_value: 50,
  })

  useEffect(() => {
    const loadCameras = async () => {
      try {
        const data = await getCameras()
        setCameras(data)
      } catch (error) {
        console.error("Failed to load cameras:", error)
        toast({
          title: "Error",
          description: "Failed to load cameras from the database",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadCameras()
  }, [toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "latitude" || name === "longitude" || name === "threshold_value" ? Number.parseFloat(value) : value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await addCamera(formData)

      toast({
        title: "Success",
        description: "Camera added successfully",
      })

      const updatedCameras = await getCameras()
      setCameras(updatedCameras)

      setFormData({
        name: "",
        latitude: 0,
        longitude: 0,
        location_description: "",
        camera_type: "Standard",
        status: "Active",
        threshold_value: 50,
      })
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error("Failed to add camera:", error)
      toast({
        title: "Error",
        description: "Failed to add camera to the database",
        variant: "destructive",
      })
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCamera) return

    try {
      await updateCamera(selectedCamera.id, formData)
      toast({ title: "Success", description: "Camera configuration updated" })
      const updatedCameras = await getCameras()
      setCameras(updatedCameras)
      setIsConfigDialogOpen(false)
    } catch (error) {
      toast({ title: "Error", description: "Failed to update configuration", variant: "destructive" })
    }
  }

  const openConfig = (camera: CameraType) => {
    setSelectedCamera(camera)
    setFormData({
      name: camera.name,
      latitude: camera.latitude,
      longitude: camera.longitude,
      location_description: camera.location_description || "",
      camera_type: camera.camera_type || "Standard",
      status: camera.status,
      threshold_value: camera.threshold_value,
    })
    setIsConfigDialogOpen(true)
  }

  const filteredCameras = cameras.filter(
    (camera) =>
      camera.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (camera.location_description && camera.location_description.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-500 hover:bg-green-600"
      case "inactive":
        return "bg-gray-500 hover:bg-gray-600"
      case "maintenance":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "error":
        return "bg-red-500 hover:bg-red-600"
      default:
        return "bg-blue-500 hover:bg-blue-600"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Camera Database</CardTitle>
            <CardDescription>Manage monitoring cameras in the conservation area</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Camera
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Camera</DialogTitle>
                <DialogDescription>Enter the details of the camera to add to the database.</DialogDescription>
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
                    <Label htmlFor="latitude" className="text-right">
                      Latitude
                    </Label>
                    <Input
                      id="latitude"
                      name="latitude"
                      type="number"
                      step="0.000001"
                      value={formData.latitude}
                      onChange={handleInputChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="longitude" className="text-right">
                      Longitude
                    </Label>
                    <Input
                      id="longitude"
                      name="longitude"
                      type="number"
                      step="0.000001"
                      value={formData.longitude}
                      onChange={handleInputChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="location_description" className="text-right">
                      Location Description
                    </Label>
                    <Input
                      id="location_description"
                      name="location_description"
                      value={formData.location_description}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="camera_type" className="text-right">
                      Camera Type
                    </Label>
                    <Select
                      value={formData.camera_type}
                      onValueChange={(value) => handleSelectChange("camera_type", value)}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select camera type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Standard">Standard</SelectItem>
                        <SelectItem value="Infrared">Infrared</SelectItem>
                        <SelectItem value="Thermal">Thermal</SelectItem>
                        <SelectItem value="Motion">Motion</SelectItem>
                        <SelectItem value="High-Resolution">High-Resolution</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">
                      Status
                    </Label>
                    <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                        <SelectItem value="Error">Error</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="threshold_value" className="text-right">
                      Threshold Value
                    </Label>
                    <Input
                      id="threshold_value"
                      name="threshold_value"
                      type="number"
                      value={formData.threshold_value}
                      onChange={handleInputChange}
                      className="col-span-3"
                      min="1"
                      max="100"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Add Camera</Button>
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
              placeholder="Search cameras..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading cameras...</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Threshold</TableHead>
                  <TableHead>Last Maintenance</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCameras.length > 0 ? (
                  filteredCameras.map((camera) => (
                    <TableRow key={camera.id}>
                      <TableCell className="font-medium">{camera.id}</TableCell>
                      <TableCell>{camera.name}</TableCell>
                      <TableCell>{camera.location_description || camera.location}</TableCell>
                      <TableCell>{camera.camera_type || "Standard"}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(camera.status)}>{camera.status}</Badge>
                      </TableCell>
                      <TableCell>{camera.threshold_value}%</TableCell>
                      <TableCell>{camera.last_maintenance}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => openConfig(camera)}>
                          <Settings className="mr-2 h-4 w-4" />
                          Configure
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      {searchQuery ? "No cameras match your search" : "No cameras found in the database"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configure Camera: {selectedCamera?.name}</DialogTitle>
            <DialogDescription>Update the settings for this monitoring station.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="config-status" className="text-right">
                  Status
                </Label>
                <Select value={formData.status} onValueChange={(v) => handleSelectChange("status", v)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Error">Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="config-threshold" className="text-right">
                  Threshold
                </Label>
                <Input
                  id="config-threshold"
                  type="number"
                  value={formData.threshold_value}
                  onChange={(e) => setFormData((p) => ({ ...p, threshold_value: Number(e.target.value) }))}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
