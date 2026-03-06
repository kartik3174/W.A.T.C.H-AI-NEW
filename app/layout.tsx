import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { LanguageProvider } from "@/contexts/language-context"
import { ViewportProvider } from "@/contexts/viewport-context"

const inter = Inter({ subsets: ["latin"] })

// Update the metadata
export const metadata = {
  title: "W.A.T.C.H | Wildlife AI Tracking and Conservation Hub",
  description: "Track and monitor wildlife with AI-powered insights",
  icons: {
    icon: "/favicon.ico",
  },
  manifest: "/manifest.json",
  themeColor: "#10b981",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <LanguageProvider>
          <ViewportProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
              <LayoutWrapper>{children}</LayoutWrapper>
            </ThemeProvider>
          </ViewportProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
