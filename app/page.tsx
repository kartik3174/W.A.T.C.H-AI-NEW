"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, BarChart3, Bell, Camera, Heart, MapPin, ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"
import { useLanguage } from "@/contexts/language-context"

export default function Home() {
  const router = useRouter()
  const { t } = useLanguage()
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)

  useEffect(() => {
    const auth = localStorage.getItem("watch_auth") || sessionStorage.getItem("watch_auth")
    if (!auth) {
      router.push("/login")
    } else {
      setIsLoggedIn(true)
    }
  }, [router])

  // Don't render anything while checking auth
  if (isLoggedIn === null) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-wildlife-green/5">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-wildlife-green border-t-transparent animate-spin"></div>
          <p className="text-wildlife-green font-medium animate-pulse">{t("authenticating") || "Authenticating..."}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <Badge variant="secondary" className="mb-4">
          {t("platforms.badge")}
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance text-wildlife-green">W.A.T.C.H</h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto text-balance">
          {t("app.title")}
        </p>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t("home.welcome")}
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Button
            size="lg"
            onClick={() => router.push("/dashboard")}
            className="bg-wildlife-green hover:bg-wildlife-green/90 px-8"
          >
            {t("home.enter")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
        <Card className="hover:shadow-lg transition-shadow border-wildlife-green/20">
          <CardHeader>
            <Activity className="h-8 w-8 text-wildlife-green mb-2" />
            <CardTitle>{t("card.dashboard.title")}</CardTitle>
            <CardDescription>{t("card.dashboard.desc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="ghost"
              onClick={() => router.push("/dashboard")}
              className="w-full text-wildlife-green hover:text-wildlife-green hover:bg-wildlife-green/10"
            >
              {t("view.analytics")}
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-amber-600/20">
          <CardHeader>
            <Bell className="h-8 w-8 text-amber-600 mb-2" />
            <CardTitle>{t("card.alerts.title")}</CardTitle>
            <CardDescription>{t("card.alerts.desc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="ghost"
              onClick={() => router.push("/alerts")}
              className="w-full text-amber-600 hover:text-amber-600 hover:bg-amber-600/10"
            >
              {t("view.analytics")}
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-blue-600/20">
          <CardHeader>
            <MapPin className="h-8 w-8 text-blue-600 mb-2" />
            <CardTitle>{t("card.gps.title")}</CardTitle>
            <CardDescription>{t("card.gps.desc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="ghost"
              onClick={() => router.push("/tracking")}
              className="w-full text-blue-600 hover:text-blue-600 hover:bg-blue-600/10"
            >
              {t("tracking")}
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-purple-600/20">
          <CardHeader>
            <Camera className="h-8 w-8 text-purple-600 mb-2" />
            <CardTitle>{t("card.ai.title")}</CardTitle>
            <CardDescription>{t("card.ai.desc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="ghost"
              onClick={() => router.push("/ai-monitoring")}
              className="w-full text-purple-600 hover:text-purple-600 hover:bg-purple-600/10"
            >
              {t("ai.monitoring")}
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-cyan-600/20">
          <CardHeader>
            <BarChart3 className="h-8 w-8 text-cyan-600 mb-2" />
            <CardTitle>{t("card.analytics.title")}</CardTitle>
            <CardDescription>{t("card.analytics.desc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="ghost"
              onClick={() => router.push("/analytics")}
              className="w-full text-cyan-600 hover:text-cyan-600 hover:bg-cyan-600/10"
            >
              {t("view.analytics")}
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-rose-600/20">
          <CardHeader>
            <Heart className="h-8 w-8 text-rose-600 mb-2" />
            <CardTitle>{t("card.care.title")}</CardTitle>
            <CardDescription>{t("card.care.desc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="ghost"
              onClick={() => router.push("/animal-care")}
              className="w-full text-rose-600 hover:text-rose-600 hover:bg-rose-600/10"
            >
              {t("animal.care")}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Footer Info */}
      <div className="text-center py-8 opacity-60">
        <p className="text-sm">Protected by W.A.T.C.H Security Protocols</p>
      </div>
    </div>
  )
}
