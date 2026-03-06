"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, Clipboard, Lightbulb, ThumbsUp, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

export function CareRecommendations() {
  const { toast } = useToast()
  const [implementedRecs, setImplementedRecs] = useState<Set<string>>(new Set())

  const recommendations = [
    {
      id: "REC-001",
      animalId: "TI-004",
      animalName: "Raja",
      species: "Tiger",
      title: "Reduce Physical Activity",
      description: "Based on elevated vitals, recommend limiting physical exertion for the next 48 hours.",
      priority: "High",
      aiConfidence: "92%",
      actions: [
        "Monitor temperature every 4 hours",
        "Provide additional shade and water",
        "Observe for signs of distress",
      ],
    },
    {
      id: "REC-002",
      animalId: "GO-005",
      animalName: "Zuri",
      species: "Gorilla",
      title: "Immediate Veterinary Attention",
      description:
        "Critical vital signs indicate potential infection. Veterinary examination recommended within 12 hours.",
      priority: "Urgent",
      aiConfidence: "97%",
      actions: [
        "Schedule veterinary visit",
        "Prepare isolation area if needed",
        "Monitor food and water intake",
        "Check for visible symptoms",
      ],
    },
    {
      id: "REC-003",
      animalId: "RH-003",
      animalName: "Kifaru",
      species: "Rhino",
      title: "Dietary Adjustment",
      description: "Recent activity patterns suggest potential nutritional deficiency. Consider dietary supplements.",
      priority: "Medium",
      aiConfidence: "85%",
      actions: ["Introduce mineral supplements", "Increase variety of vegetation", "Monitor feeding behavior"],
    },
    {
      id: "REC-004",
      animalId: "EL-001",
      animalName: "Tembo",
      species: "Elephant",
      title: "Preventative Health Check",
      description: "Regular health assessment due based on age and seasonal patterns.",
      priority: "Low",
      aiConfidence: "88%",
      actions: ["Schedule routine examination", "Check tusk and foot condition", "Update vaccination records"],
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "urgent":
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

  const handleCopy = (rec: (typeof recommendations)[0]) => {
    const text = `
Care Recommendation: ${rec.title}
Animal: ${rec.animalName} (${rec.animalId}) - ${rec.species}
Priority: ${rec.priority}
AI Confidence: ${rec.aiConfidence}

Description:
${rec.description}

Recommended Actions:
${rec.actions.map((action, i) => `${i + 1}. ${action}`).join("\n")}
    `.trim()

    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast({
          title: "Copied to clipboard",
          description: "Care recommendation has been copied to your clipboard.",
        })
      })
      .catch(() => {
        toast({
          title: "Copy failed",
          description: "Unable to copy to clipboard. Please try again.",
          variant: "destructive",
        })
      })
  }

  const handleImplement = (recId: string, recTitle: string) => {
    setImplementedRecs((prev) => new Set([...prev, recId]))
    toast({
      title: "Recommendation Implemented",
      description: `"${recTitle}" has been marked as implemented and added to the action log.`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Lightbulb className="h-5 w-5" />
        <p>AI-generated care recommendations based on health data and behavioral patterns</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {recommendations.map((rec) => (
          <Card
            key={rec.id}
            className="border-l-4"
            style={{
              borderLeftColor:
                rec.priority.toLowerCase() === "urgent"
                  ? "rgb(239, 68, 68)"
                  : rec.priority.toLowerCase() === "high"
                    ? "rgb(249, 115, 22)"
                    : rec.priority.toLowerCase() === "medium"
                      ? "rgb(234, 179, 8)"
                      : "rgb(34, 197, 94)",
            }}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{rec.title}</CardTitle>
                  <CardDescription>
                    {rec.animalName} ({rec.animalId}) - {rec.species}
                  </CardDescription>
                </div>
                <Badge className={getPriorityColor(rec.priority)}>{rec.priority} Priority</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{rec.description}</p>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="h-4 w-4" />
                <span>AI Confidence: {rec.aiConfidence}</span>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Recommended Actions:</h4>
                <ul className="space-y-1">
                  {rec.actions.map((action, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm" onClick={() => handleCopy(rec)}>
                <Clipboard className="mr-2 h-4 w-4" />
                Copy
              </Button>
              <Button
                size="sm"
                onClick={() => handleImplement(rec.id, rec.title)}
                disabled={implementedRecs.has(rec.id)}
              >
                <ThumbsUp className="mr-2 h-4 w-4" />
                {implementedRecs.has(rec.id) ? "Implemented" : "Implement"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
