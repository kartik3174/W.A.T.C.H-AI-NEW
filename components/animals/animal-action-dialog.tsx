"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Check } from "lucide-react"

type Animal = {
  id: string
  name: string
  species: string
  status: string
}

type AnimalActionDialogProps = {
  animal: Animal
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AnimalActionDialog({ animal, open, onOpenChange }: AnimalActionDialogProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [actionType, setActionType] = useState<string>("")
  const [notes, setNotes] = useState<string>("")
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = () => {
    setSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setSubmitting(false)
      setSuccess(true)

      // Reset form after showing success message
      setTimeout(() => {
        setSuccess(false)
        setActionType("")
        setNotes("")
        onOpenChange(false)
      }, 2000)
    }, 1500)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Record Action for {animal.name}</DialogTitle>
          <DialogDescription>
            Document conservation actions, treatments, or observations for this animal.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center justify-center py-6 space-y-2">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Check className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium">Action Recorded</h3>
            <p className="text-sm text-muted-foreground text-center">
              Your action has been successfully recorded for {animal.name}.
            </p>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="action-type">Action Type</Label>
              <Select value={actionType} onValueChange={setActionType}>
                <SelectTrigger id="action-type">
                  <SelectValue placeholder="Select action type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="medical">Medical Treatment</SelectItem>
                  <SelectItem value="observation">Field Observation</SelectItem>
                  <SelectItem value="relocation">Relocation</SelectItem>
                  <SelectItem value="feeding">Supplemental Feeding</SelectItem>
                  <SelectItem value="tracking">Tracking Device Maintenance</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Describe the action taken, observations, or treatment details..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={5}
              />
            </div>
          </div>
        )}

        <DialogFooter>
          {!success && (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!date || !actionType || !notes || submitting}
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
              >
                {submitting ? "Saving..." : "Save Action"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
