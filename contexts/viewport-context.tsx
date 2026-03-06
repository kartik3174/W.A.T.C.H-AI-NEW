"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type ViewportSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
type DeviceType = "mobile" | "tablet" | "laptop" | "desktop"

interface ViewportContextType {
  width: number
  height: number
  size: ViewportSize
  device: DeviceType
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isLandscape: boolean
  isPortrait: boolean
  isFullScreen: boolean
  toggleFullScreen: () => void
}

const ViewportContext = createContext<ViewportContextType>({
  width: 0,
  height: 0,
  size: "md",
  device: "desktop",
  isMobile: false,
  isTablet: false,
  isDesktop: false,
  isLandscape: false,
  isPortrait: true,
  isFullScreen: false,
  toggleFullScreen: () => {},
})

export const useViewport = () => useContext(ViewportContext)

export const ViewportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1024)
  const [height, setHeight] = useState(typeof window !== "undefined" ? window.innerHeight : 768)
  const [isFullScreen, setIsFullScreen] = useState(false)

  useEffect(() => {
    // Set initial values
    setWidth(window.innerWidth)
    setHeight(window.innerHeight)

    // Update on resize
    const handleResize = () => {
      setWidth(window.innerWidth)
      setHeight(window.innerHeight)
    }

    // Update fullscreen status
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement)
    }

    window.addEventListener("resize", handleResize)
    document.addEventListener("fullscreenchange", handleFullScreenChange)

    return () => {
      window.removeEventListener("resize", handleResize)
      document.removeEventListener("fullscreenchange", handleFullScreenChange)
    }
  }, [])

  // Determine viewport size based on width
  const getViewportSize = (): ViewportSize => {
    if (width < 640) return "xs"
    if (width < 768) return "sm"
    if (width < 1024) return "md"
    if (width < 1280) return "lg"
    if (width < 1536) return "xl"
    return "2xl"
  }

  // Determine device type
  const getDeviceType = (): DeviceType => {
    if (width < 640) return "mobile"
    if (width < 1024) return "tablet"
    if (width < 1280) return "laptop"
    return "desktop"
  }

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`)
      })
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }

  const value = {
    width,
    height,
    size: getViewportSize(),
    device: getDeviceType(),
    isMobile: width < 768,
    isTablet: width >= 768 && width < 1024,
    isDesktop: width >= 1024,
    isLandscape: width > height,
    isPortrait: height >= width,
    isFullScreen,
    toggleFullScreen,
  }

  return <ViewportContext.Provider value={value}>{children}</ViewportContext.Provider>
}
