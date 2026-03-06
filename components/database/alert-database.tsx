"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Check, Search } from "lucide-react"
import { type Alert as AlertType, getAlerts, resolveAlert } from "@/app/actions/alert-actions"
import { useToast } from "@/hooks/use-toast"

export function AlertDatabase() {
  const [alerts, setAlerts] = useState<AlertType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [includeResolved, setIncludeResolved] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const data = await getAlerts(50, includeResolved)
        setAlerts(data)
      } catch (error) {
        console.error("Failed to load alerts:", error)
        toast({
          title: "Error",
          description: "Failed to load alerts from the database",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadAlerts()
  }, [includeResolved, toast])

  const handleResolveAlert = async (alertId: number) => {
    try {
      await resolveAlert(alertId)
      toast({
        title: "Success",
        description: "Alert marked as resolved",
      })

      // Refresh the alerts list
      const updatedAlerts = await getAlerts(50, includeResolved)
      setAlerts(updatedAlerts)
    } catch (error) {
      console.error("Failed to resolve alert:", error)
      toast({
        title: "Error",
        description: "Failed to resolve the alert",
        variant: "destructive",
      })
    }
  }

  const filteredAlerts = alerts.filter(
    (alert) =>
      alert.alert_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.animal_name?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getSeverityColor = (severity?: string) => {
    if (!severity) return "bg-gray-500 hover:bg-gray-600"

    switch (severity.toLowerCase()) {
      case "critical":
        return "bg-red-500 hover:bg-red-600"
      case "high":
        return "bg-orange-500 hover:bg-orange-600"
      case "medium":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "low":
        return "bg-green-500 hover:bg-green-600"
      default:
        return "bg-blue-500 hover:bg-blue-600"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Alert Database</CardTitle>
            <CardDescription>View and manage system alerts</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="include-resolved" checked={includeResolved} onCheckedChange={setIncludeResolved} />
            <Label htmlFor="include-resolved">Include Resolved</Label>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search alerts..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading alerts...</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Animal</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAlerts.length > 0 ? (
                  filteredAlerts.map((alert) => (
                    <TableRow key={alert.id} className={alert.status === "resolved" ? "opacity-60" : ""}>
                      <TableCell className="font-medium">{alert.id}</TableCell>
                      <TableCell>{alert.alert_type}</TableCell>
                      <TableCell>
                        <Badge className={getSeverityColor(alert.severity)}>{alert.severity || "Unknown"}</Badge>
                      </TableCell>
                      <TableCell>{alert.animal_name || `Animal #${alert.animal_id || "N/A"}`}</TableCell>
                      <TableCell className="max-w-xs truncate">{alert.message || "No message"}</TableCell>
                      <TableCell>{alert.location || "N/A"}</TableCell>
                      <TableCell>{alert.created_at}</TableCell>
                      <TableCell>
                        <Badge variant={alert.status === "resolved" ? "outline" : "default"}>
                          {alert.status === "resolved" ? "Resolved" : "Active"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {alert.status !== "resolved" && (
                          <Button variant="outline" size="sm" onClick={() => handleResolveAlert(alert.id)}>
                            <Check className="mr-2 h-4 w-4" />
                            Resolve
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      {searchQuery
                        ? "No alerts match your search"
                        : includeResolved
                          ? "No alerts found in the database"
                          : "No active alerts found"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
