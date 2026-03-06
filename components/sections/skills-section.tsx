"use client"

import { motion } from "framer-motion"
import { Code, Layout, Smartphone, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const skills = [
  {
    title: "Responsive Web Design",
    description: "Creating websites that work seamlessly across all devices and screen sizes.",
    icon: <Layout className="h-10 w-10 text-primary" />,
    items: ["Mobile-First Approach", "Fluid Layouts", "Media Queries", "Viewport Units", "Flexible Images"],
  },
  {
    title: "Frontend Development",
    description: "Building modern, interactive user interfaces with the latest technologies.",
    icon: <Code className="h-10 w-10 text-primary" />,
    items: ["React & Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Accessibility"],
  },
  {
    title: "Mobile Development",
    description: "Developing native-like mobile experiences that work across platforms.",
    icon: <Smartphone className="h-10 w-10 text-primary" />,
    items: ["React Native", "Progressive Web Apps", "Touch Interactions", "Offline Support", "Native Features"],
  },
  {
    title: "Performance Optimization",
    description: "Ensuring fast, smooth experiences on all devices, especially on mobile.",
    icon: <Zap className="h-10 w-10 text-primary" />,
    items: ["Image Optimization", "Code Splitting", "Lazy Loading", "Bundle Size Reduction", "Core Web Vitals"],
  },
]

export function SkillsSection() {
  return (
    <section id="skills" className="section-padding">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="heading-lg mb-4">Skills & Expertise</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Specialized in creating responsive, accessible, and performant web experiences that work across all devices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <SkillCard skill={skill} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function SkillCard({ skill }: { skill: (typeof skills)[0] }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="mb-4">{skill.icon}</div>
        <CardTitle>{skill.title}</CardTitle>
        <CardDescription>{skill.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {skill.items.map((item) => (
            <li key={item} className="flex items-center">
              <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
