"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, FileText } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export function VeterinaryHistory() {
  const [selectedRecord, setSelectedRecord] = useState<(typeof records)[0] | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const records = [
    {
      date: "2024-03-15",
      animal: "Raja (TI-004)",
      treatment: "Administered antibiotics for respiratory infection",
      vet: "Dr. Michael Chen",
      notes: "Tiger showing improved breathing after treatment",
      fullHistory: {
        diagnosis: "Acute respiratory infection with mild fever",
        medications: ["Amoxicillin 500mg - 2x daily for 7 days", "Anti-inflammatory - 1x daily"],
        vitals: {
          temperature: "102.5°F",
          heartRate: "88 bpm",
          respiratoryRate: "24 breaths/min",
          weight: "220 kg",
        },
        followUp: "Schedule recheck in 7 days to assess recovery",
        cost: "$450",
      },
    },
    {
      date: "2024-03-10",
      animal: "Simba (LI-002)",
      treatment: "Tracking collar battery replacement",
      vet: "Sarah Johnson",
      notes: "Replaced battery and checked collar fit",
      fullHistory: {
        diagnosis: "Routine maintenance - tracking equipment",
        medications: [],
        vitals: {
          temperature: "100.8°F",
          heartRate: "75 bpm",
          respiratoryRate: "18 breaths/min",
          weight: "190 kg",
        },
        followUp: "Next battery replacement in 6 months",
        cost: "$120",
      },
    },
    {
      date: "2024-03-05",
      animal: "Zuri (GO-005)",
      treatment: "Blood sample collection for analysis",
      vet: "Dr. Michael Chen",
      notes: "Samples sent to lab for analysis",
      fullHistory: {
        diagnosis: "Routine health screening",
        medications: [],
        vitals: {
          temperature: "98.6°F",
          heartRate: "65 bpm",
          respiratoryRate: "16 breaths/min",
          weight: "160 kg",
        },
        followUp: "Results expected in 3-5 business days",
        cost: "$280",
      },
    },
    {
      date: "2024-02-28",
      animal: "Tembo (EL-001)",
      treatment: "Routine health check",
      vet: "Sarah Johnson",
      notes: "All vitals within normal range",
      fullHistory: {
        diagnosis: "Healthy - no concerns",
        medications: [],
        vitals: {
          temperature: "97.2°F",
          heartRate: "28 bpm",
          respiratoryRate: "8 breaths/min",
          weight: "5400 kg",
        },
        followUp: "Next routine check in 3 months",
        cost: "$350",
      },
    },
  ]

  const handleViewFullRecord = (record: (typeof records)[0]) => {
    setSelectedRecord(record)
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="text-muted-foreground">
        A comprehensive record of veterinary treatments, health checks, and medical observations
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {records.map((record) => (
          <Card key={record.date} className="border-2">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{record.treatment}</CardTitle>
                  <CardDescription>
                    {record.animal} - {record.date}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{record.notes}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Date: {record.date}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span>Veterinarian: {record.vet}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={() => handleViewFullRecord(record)}>
                View Full Record
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Full Veterinary Record</DialogTitle>
            <DialogDescription>Complete medical history and examination details</DialogDescription>
          </DialogHeader>

          {selectedRecord && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg">{selectedRecord.treatment}</h3>
                <p className="text-sm text-muted-foreground">{selectedRecord.animal}</p>
                <Badge variant="outline" className="mt-2">
                  {selectedRecord.date}
                </Badge>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-2">Diagnosis</h4>
                <p className="text-sm">{selectedRecord.fullHistory.diagnosis}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Vital Signs</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Temperature:</span>
                    <p className="font-medium">{selectedRecord.fullHistory.vitals.temperature}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Heart Rate:</span>
                    <p className="font-medium">{selectedRecord.fullHistory.vitals.heartRate}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Respiratory Rate:</span>
                    <p className="font-medium">{selectedRecord.fullHistory.vitals.respiratoryRate}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Weight:</span>
                    <p className="font-medium">{selectedRecord.fullHistory.vitals.weight}</p>
                  </div>
                </div>
              </div>

              {selectedRecord.fullHistory.medications.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Medications Prescribed</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {selectedRecord.fullHistory.medications.map((med, idx) => (
                      <li key={idx}>{med}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h4 className="font-semibold mb-2">Veterinarian Notes</h4>
                <p className="text-sm">{selectedRecord.notes}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Follow-up</h4>
                <p className="text-sm">{selectedRecord.fullHistory.followUp}</p>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Veterinarian</p>
                  <p className="font-medium">{selectedRecord.vet}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Cost</p>
                  <p className="font-medium">{selectedRecord.fullHistory.cost}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
