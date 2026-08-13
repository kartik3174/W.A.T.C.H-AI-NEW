"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { fieldRangerService } from "@/lib/field-ranger-service"
import { AlertCircle, CheckCircle2 } from "lucide-react"

type IncidentSeverity = "low" | "medium" | "high" | "critical"

const INCIDENT_TYPES = [
  { label: "Animal Injury", value: "injury" },
  { label: "Poaching Activity", value: "poaching" },
  { label: "Animal Illness", value: "illness" },
  { label: "Habitat Damage", value: "habitat_damage" },
  { label: "Human-Wildlife Conflict", value: "conflict" },
  { label: "Unusual Behavior", value: "behavior" },
  { label: "Equipment Issue", value: "equipment" },
  { label: "Other", value: "other" },
]

export const IncidentRecorder = () => {
  const [type, setType] = useState<string>("")
  const [description, setDescription] = useState("")
  const [animalId, setAnimalId] = useState("")
  const [severity, setSeverity] = useState<IncidentSeverity>("medium")
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = useCallback(async () => {
    if (!type || !description) {
      setErrorMessage("Please fill in all required fields")
      return
    }

    setIsLoading(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      const incident = await fieldRangerService.createIncident(
        type,
        description,
        severity,
        undefined,
        animalId || undefined
      )

      setSuccessMessage(
        `Incident #${incident.id} recorded. Will sync when connection is available.`
      )

      // Reset form
      setType("")
      setDescription("")
      setAnimalId("")
      setSeverity("medium")

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (error) {
      console.error("[v0] Failed to record incident:", error)
      setErrorMessage("Failed to record incident. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }, [type, description, animalId, severity])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Incident Report
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {successMessage && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
          </Alert>
        )}

        {errorMessage && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="incident-type">Incident Type *</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger id="incident-type">
              <SelectValue placeholder="Select incident type..." />
            </SelectTrigger>
            <SelectContent>
              {INCIDENT_TYPES.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="animal-id">Animal Tag/ID (Optional)</Label>
          <Input
            id="animal-id"
            placeholder="Enter animal tag or ID..."
            value={animalId}
            onChange={(e) => setAnimalId(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="severity">Severity Level *</Label>
          <Select value={severity} onValueChange={(v) => setSeverity(v as IncidentSeverity)}>
            <SelectTrigger id="severity">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            placeholder="Describe the incident in detail..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>

        <Button onClick={handleSubmit} disabled={isLoading} className="w-full">
          {isLoading ? "Recording..." : "Record Incident"}
        </Button>
      </CardContent>
    </Card>
  )
}
