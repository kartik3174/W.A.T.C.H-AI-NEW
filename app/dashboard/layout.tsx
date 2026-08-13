"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { LoadingAnimation } from "@/components/loading-animation"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const auth = localStorage.getItem("watch_auth") || sessionStorage.getItem("watch_auth")

    let isValid = false
    if (auth) {
      try {
        const parsed = JSON.parse(auth)
        if (parsed && parsed.loggedIn) {
          isValid = true
        }
      } catch (e) {
        isValid = false
      }
    }

    if (!isValid) {
      localStorage.removeItem("watch_auth")
      sessionStorage.removeItem("watch_auth")
      router.replace("/login")
    } else {
      setIsAuthorized(true)
    }
  }, [router, pathname])

  if (!isAuthorized) {
    return <LoadingAnimation />
  }

  return <>{children}</>
}
