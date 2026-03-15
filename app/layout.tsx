import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"

import { ThemeProvider } from "@/components/theme-provider"
import { LayoutWrapper } from "@/components/layout-wrapper"

import { LanguageProvider } from "@/contexts/language-context"
import { ViewportProvider } from "@/contexts/viewport-context"
import { AuthProvider } from "@/contexts/auth-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "W.A.T.C.H | Wildlife AI Tracking and Conservation Hub",
  description: "Track and monitor wildlife with AI-powered insights",
  icons: {
    icon: "/favicon.ico",
  },
  manifest: "/manifest.json",
  generator: "v0.app",
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#10b981",
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>

        <AuthProvider>
          <LanguageProvider>
            <ViewportProvider>

              <ThemeProvider
                attribute="class"
                defaultTheme="light"
                enableSystem
                disableTransitionOnChange
              >
                <LayoutWrapper>
                  {children}
                </LayoutWrapper>
              </ThemeProvider>

            </ViewportProvider>
          </LanguageProvider>
        </AuthProvider>

      </body>
    </html>
  )
}