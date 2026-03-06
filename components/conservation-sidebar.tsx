"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { WatchLogo } from "@/components/watch-logo"
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Database,
  FileText,
  Heart,
  Home,
  Map,
  Search,
  Settings,
  Shield,
  User,
  ChevronUp,
  ChevronDown,
  Maximize,
  Minimize,
  Zap,
  Cpu,
  AlertCircle,
  Brain,
  Eye,
  Siren,
} from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useViewport } from "@/contexts/viewport-context"
import { toast } from "@/components/ui/use-toast"

interface NavItem {
  name: string
  href: string
  icon: React.ElementType
}

const mainNavItems: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Tracking", href: "/tracking", icon: Map },
  { name: "Animal Care", href: "/animal-care", icon: Heart },
  { name: "AI Monitoring", href: "/ai-monitoring", icon: Brain },
]

const toolsNavItems: NavItem[] = [
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Alerts", href: "/alerts", icon: AlertTriangle },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Search", href: "/search", icon: Search },
  { name: "Database", href: "/database", icon: Database },
]

const advancedNavItems: NavItem[] = [
  { name: "Action View", href: "/action-view", icon: Eye },
  { name: "Drone Response", href: "/drone-response", icon: Cpu },
  { name: "Anti-Poaching", href: "/anti-poaching", icon: Siren },
  { name: "Research", href: "/research", icon: Brain },
  { name: "Disaster Management", href: "/disaster-management", icon: AlertCircle },
]

const userNavItems: NavItem[] = [
  { name: "Profile", href: "/profile", icon: User },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function ConservationSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { isFullScreen, toggleFullScreen } = useViewport()
  const navRef = useRef<HTMLDivElement>(null)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [showScrollBottom, setShowScrollBottom] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  // Check if scroll buttons should be visible
  const checkScroll = () => {
    if (navRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = navRef.current
      setShowScrollTop(scrollTop > 20)
      setShowScrollBottom(scrollTop + clientHeight < scrollHeight - 20)
    }
  }

  // Scroll handlers
  const scrollUp = () => {
    if (navRef.current) {
      navRef.current.scrollBy({ top: -100, behavior: "smooth" })
    }
  }

  const scrollDown = () => {
    if (navRef.current) {
      navRef.current.scrollBy({ top: 100, behavior: "smooth" })
    }
  }

  // Add scroll event listener
  useEffect(() => {
    const navElement = navRef.current
    if (navElement) {
      navElement.addEventListener("scroll", checkScroll)
      // Initial check
      checkScroll()

      return () => {
        navElement.removeEventListener("scroll", checkScroll)
      }
    }
  }, [])

  useEffect(() => {
    const loadAuth = () => {
      const auth = localStorage.getItem("watch_auth") || sessionStorage.getItem("watch_auth")
      if (auth) {
        try {
          const parsed = JSON.parse(auth)
          setUserEmail(parsed.email)
        } catch (e) {
          console.error("[v0] Auth parse error", e)
        }
      } else {
        setUserEmail(null)
      }
    }

    loadAuth()

    // Listen for storage changes in other tabs
    window.addEventListener("storage", loadAuth)
    return () => window.removeEventListener("storage", loadAuth)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("watch_auth")
    sessionStorage.removeItem("watch_auth")
    // Double check with clear if needed, but remove should be enough

    setUserEmail(null)

    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    })

    router.replace("/login")
  }

  return (
    <div className="fixed left-0 top-0 h-screen w-64 border-r border-[#14532D] bg-[#0F172A]/95 backdrop-blur-sm shadow-lg z-30">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#14532D] h-16 bg-gradient-to-r from-[#0B3D2E] to-[#14532D]">
        <div className="flex items-center gap-3">
          <WatchLogo size={32} showText={true} />
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleFullScreen}
          className="ml-auto text-[#E5E7EB] hover:bg-[#14532D]"
          aria-label={isFullScreen ? "Exit full screen" : "Enter full screen"}
        >
          {isFullScreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
        </Button>
      </div>

      {/* Scroll Up Button */}
      {showScrollTop && (
        <Button
          variant="ghost"
          size="sm"
          onClick={scrollUp}
          className="absolute left-1/2 top-16 z-10 -translate-x-1/2 transform rounded-full bg-background/80 p-1 shadow-md"
          aria-label="Scroll up"
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
      )}

      {/* Navigation items - This div needs to be scrollable */}
      <div ref={navRef} className="h-[calc(100vh-12rem)] overflow-y-auto p-4 scrollbar-thin" onScroll={checkScroll}>
        <nav className="space-y-6">
          <div>
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Main</h2>
            <ul className="space-y-1">
              {mainNavItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      pathname === item.href || pathname.startsWith(item.href.split('/')[1] !== undefined ? '/' + item.href.split('/')[1] : item.href)
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Tools</h2>
            <ul className="space-y-1">
              {toolsNavItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Advanced</h2>
            <ul className="space-y-1">
              {advancedNavItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Account</h2>
            <ul className="space-y-1">
              {userNavItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>

      {/* Scroll Down Button */}
      {showScrollBottom && (
        <Button
          variant="ghost"
          size="sm"
          onClick={scrollDown}
          className="absolute bottom-16 left-1/2 z-10 -translate-x-1/2 transform rounded-full bg-background/80 p-1 shadow-md"
          aria-label="Scroll down"
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      )}

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-[#14532D] bg-[#0F172A]/95 flex flex-col">
        {userEmail && (
          <div className="px-4 py-2 border-b border-[#14532D] bg-[#14532D]/30">
            <p className="text-[10px] text-[#9CA3AF] uppercase font-bold truncate">Logged in as</p>
            <p className="text-xs font-medium truncate text-[#E5E7EB]">{userEmail}</p>
          </div>
        )}
        <div className="p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Wildlife AI Hub</span>
            </div>
            <span className="text-xs text-muted-foreground">v1.0.0</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout} className="w-full text-xs h-8 bg-transparent">
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}
