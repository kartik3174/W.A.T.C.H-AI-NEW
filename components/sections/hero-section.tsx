"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background -z-10" />

      <div className="container-custom min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12 md:py-24">
        <div className="max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="heading-xl text-balance mb-6">
              Crafting <span className="text-primary">responsive</span> digital experiences
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-xl text-muted-foreground mb-8 text-balance">
              I build modern, responsive websites and applications that work seamlessly across all devices, from mobile
              to desktop.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button size="lg" asChild>
              <a href="#projects">
                View Projects
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#contact">Contact Me</a>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
