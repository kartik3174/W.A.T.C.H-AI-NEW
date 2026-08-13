"use client"

import { usePathname } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import { ConservationSidebar } from "@/components/conservation-sidebar"
import { MobileNavigation } from "@/components/mobile-navigation"
import { LoadingAnimation } from "@/components/loading-animation"
import { WatchAIAssistant } from "@/components/ai/watch-ai-assistant"
import { SidebarBreachAlert } from "@/components/geofence/sidebar-breach-alert"
import { Toaster } from "@/components/ui/toaster"

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Don't show sidebar on auth pages
  const isAuthPage = pathname === "/login" || pathname === "/signup"
  
  // Command center layout for dashboard - no sidebar
  const isCommandCenter = pathname === "/dashboard"

  if (isAuthPage) {
    return (
      <SidebarProvider>
        <main className="w-full min-h-screen overflow-x-hidden bg-gradient-to-b from-[#0F172A] to-[#111827]">
          {children}
        </main>
        <Toaster />
      </SidebarProvider>
    )
  }

  if (isCommandCenter) {
    return (
      <SidebarProvider>
        <LoadingAnimation />
        <main className="w-full min-h-screen overflow-hidden bg-gradient-to-b from-[#0F172A] to-[#111827]">
          {children}
        </main>
        <Toaster />
        <SidebarBreachAlert />
        <WatchAIAssistant />
      </SidebarProvider>
    )
  }

  return (
    <SidebarProvider>
      <LoadingAnimation />
      <div className="flex min-h-screen relative bg-gradient-to-b from-[#0F172A] to-[#111827]">
        {/* Desktop Sidebar - Only for authenticated users */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <ConservationSidebar />
        </div>

        {/* Mobile Navigation - Only for authenticated users */}
        <MobileNavigation />

        {/* Main Content */}
        <main className="flex-1 pt-16 md:pt-6 px-4 pb-6 w-full overflow-x-hidden min-h-screen">
          <div className="max-w-[1600px] mx-auto w-full">{children}</div>
        </main>
      </div>
      <Toaster />

      {/* Geofence Breach Alert - Shows in sidebar/corner */}
      <SidebarBreachAlert />

      {/* W.A.T.C.H AI Assistant - available globally */}
      <WatchAIAssistant />
    </SidebarProvider>
  )
}
