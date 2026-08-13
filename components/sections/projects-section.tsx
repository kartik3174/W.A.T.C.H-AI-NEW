"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ExternalLink, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample project data
const projects = [
  {
    id: 1,
    title: "E-commerce Platform",
    description: "A fully responsive e-commerce platform built with Next.js and Tailwind CSS.",
    image: "/placeholder.svg?height=600&width=800",
    tags: ["Next.js", "React", "Tailwind CSS", "Responsive"],
    demoUrl: "#",
    repoUrl: "#",
    category: "web",
  },
  {
    id: 2,
    title: "Task Management App",
    description: "A mobile-first task management application with drag-and-drop functionality.",
    image: "/placeholder.svg?height=600&width=800",
    tags: ["React", "TypeScript", "Mobile-First", "PWA"],
    demoUrl: "#",
    repoUrl: "#",
    category: "mobile",
  },
  {
    id: 3,
    title: "Portfolio Website",
    description: "A responsive portfolio website with dark mode and animations.",
    image: "/placeholder.svg?height=600&width=800",
    tags: ["Next.js", "Framer Motion", "Dark Mode", "Responsive"],
    demoUrl: "#",
    repoUrl: "#",
    category: "web",
  },
  {
    id: 4,
    title: "Weather Dashboard",
    description: "A weather dashboard that adapts to different screen sizes and devices.",
    image: "/placeholder.svg?height=600&width=800",
    tags: ["React", "API Integration", "Responsive", "Charts"],
    demoUrl: "#",
    repoUrl: "#",
    category: "web",
  },
  {
    id: 5,
    title: "Fitness Tracker",
    description: "A mobile fitness tracking app with progress visualization.",
    image: "/placeholder.svg?height=600&width=800",
    tags: ["React Native", "Mobile", "Charts", "Health"],
    demoUrl: "#",
    repoUrl: "#",
    category: "mobile",
  },
  {
    id: 6,
    title: "Recipe Finder",
    description: "A responsive recipe finder app with filtering and search functionality.",
    image: "/placeholder.svg?height=600&width=800",
    tags: ["Next.js", "API Integration", "Responsive", "Search"],
    demoUrl: "#",
    repoUrl: "#",
    category: "web",
  },
]

export function ProjectsSection() {
  const [activeTab, setActiveTab] = useState("all")

  const filteredProjects = activeTab === "all" ? projects : projects.filter((project) => project.category === activeTab)

  return (
    <section id="projects" className="section-padding bg-muted/30">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="heading-lg mb-4">Featured Projects</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A collection of responsive websites and applications that showcase my skills in creating adaptive user
            interfaces.
          </p>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <div className="flex justify-center">
            <TabsList>
              <TabsTrigger value="all">All Projects</TabsTrigger>
              <TabsTrigger value="web">Web</TabsTrigger>
              <TabsTrigger value="mobile">Mobile</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="mt-8">
            <ProjectGrid projects={filteredProjects} />
          </TabsContent>
          <TabsContent value="web" className="mt-8">
            <ProjectGrid projects={filteredProjects} />
          </TabsContent>
          <TabsContent value="mobile" className="mt-8">
            <ProjectGrid projects={filteredProjects} />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}

function ProjectGrid({ projects }: { projects: typeof projects }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <ProjectCard project={project} />
        </motion.div>
      ))}
    </div>
  )
}

function ProjectCard({ project }: { project: (typeof projects)[0] }) {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={project.image || "/placeholder.svg"}
          alt={project.title}
          fill
          className="object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardHeader>
        <CardTitle>{project.title}</CardTitle>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" asChild>
          <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
            <Github className="mr-2 h-4 w-4" />
            Code
          </a>
        </Button>
        <Button size="sm" asChild>
          <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            Demo
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}
