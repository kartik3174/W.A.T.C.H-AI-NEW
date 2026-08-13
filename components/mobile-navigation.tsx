"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Menu, X, Maximize, Minimize } from "lucide-react"
import { WatchLogo } from "@/components/watch-logo"
import {
  Activity,
  AlertTriangle,
  BarChart3,
  FileText,
  Heart,
  Home,
  Map,
  Search,
  Settings,
  Shield,
  User,
  Users,
  Database,
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useViewport } from "@/contexts/viewport-context"
import { Button } from "@/components/ui/button"

interface NavItem {
  name: string
  href: string
  icon: React.ElementType
}

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { t } = useLanguage()
  const { isFullScreen, toggleFullScreen } = useViewport()

  // Close the menu when the route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const mainNavItems: NavItem[] = [
    { name: t("dashboard"), href: "/dashboard", icon: Home },
    { name: t("tracking"), href: "/tracking", icon: Map },
    { name: t("animalCare"), href: "/animal-care", icon: Heart },
    { name: t("aiMonitoring"), href: "/ai-monitoring", icon: Activity },
    { name: t("staff"), href: "/staff", icon: Users },
  ]

  const toolsNavItems: NavItem[] = [
    { name: t("reports"), href: "/reports", icon: FileText },
    { name: t("alerts"), href: "/alerts", icon: AlertTriangle },
    { name: t("analytics"), href: "/analytics", icon: BarChart3 },
    { name: t("search"), href: "/search", icon: Search },
    { name: t("database"), href: "/database", icon: Database },
  ]

  const userNavItems: NavItem[] = [
    { name: t("profile"), href: "/profile", icon: User },
    { name: t("settings"), href: "/settings", icon: Settings },
  ]

  return (
    <>
      {/* Mobile header bar */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-background/95 backdrop-blur-sm border-b z-40 md:hidden flex items-center px-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)} aria-label="Open navigation menu">
              <Menu className="h-5 w-5" />
            </Button>
            <WatchLogo size={32} showText={true} />
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullScreen}
            aria-label={isFullScreen ? "Exit full screen" : "Enter full screen"}
          >
            {isFullScreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Navigation panel */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-[280px] max-w-[80vw] bg-background/95 backdrop-blur-sm border-r shadow-xl md:hidden transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b h-16">
            <div className="flex items-center gap-3">
              <WatchLogo size={32} showText={true} />
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} aria-label="Close navigation menu">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation items */}
          <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
            <nav className="space-y-6">
              <div>
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  {t("main")}
                </h2>
                <ul className="space-y-1">
                  {mainNavItems.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium ${
                          pathname === item.href
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-accent hover:text-accent-foreground"
                        }`}
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        <span className="truncate">{item.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  {t("tools")}
                </h2>
                <ul className="space-y-1">
                  {toolsNavItems.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium ${
                          pathname === item.href
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-accent hover:text-accent-foreground"
                        }`}
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        <span className="truncate">{item.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  {t("account")}
                </h2>
                <ul className="space-y-1">
                  {userNavItems.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium ${
                          pathname === item.href
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-accent hover:text-accent-foreground"
                        }`}
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        <span className="truncate">{item.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
          </div>

          {/* Footer */}
          <div className="p-4 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Wildlife AI Hub</span>
              </div>
              <span className="text-xs text-muted-foreground">v1.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
