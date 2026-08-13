"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"
import { Bell, Eye, Globe, Lock, Monitor, Moon, Save, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useLanguage } from "@/contexts/language-context"

export function SettingsPanel() {
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const [isSaving, setIsSaving] = useState(false)
  const { currentLanguage, setLanguage, languages, t } = useLanguage()

  const [settings, setSettings] = useState({
    appearance: {
      theme: theme || "system",
      fontSize: 16,
      reducedMotion: false,
      highContrast: false,
    },
    privacy: {
      locationTracking: true,
      activityLogging: true,
      dataSharingWithPartners: false,
      anonymousAnalytics: true,
    },
    notifications: {
      emailAlerts: true,
      pushNotifications: true,
      soundAlerts: true,
      criticalAlertsOnly: false,
      doNotDisturb: {
        enabled: false,
        startTime: "22:00",
        endTime: "06:00",
      },
    },
  })

  const handleThemeChange = (value: string) => {
    setTheme(value)
    setSettings((prev) => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        theme: value,
      },
    }))
  }

  const handleFontSizeChange = (value: number[]) => {
    setSettings((prev) => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        fontSize: value[0],
      },
    }))
  }

  const handleToggleChange = (section: string, key: string, checked: boolean) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: checked,
      },
    }))
  }

  const handleNestedToggleChange = (section: string, parent: string, key: string, checked: boolean) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [parent]: {
          ...prev[section as keyof typeof prev][parent as keyof (typeof prev)[keyof typeof prev]],
          [key]: checked,
        },
      },
    }))
  }

  const handleTimeChange = (section: string, parent: string, key: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [parent]: {
          ...prev[section as keyof typeof prev][parent as keyof (typeof prev)[keyof typeof prev]],
          [key]: value,
        },
      },
    }))
  }

  const handleSave = () => {
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)

      toast({
        title: "Settings saved",
        description: "Your settings have been successfully updated.",
      })
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="appearance" className="space-y-6">
        <TabsList className="w-full grid grid-cols-4 md:w-auto md:inline-flex">
          <TabsTrigger value="appearance" className="py-2">
            <Eye className="h-4 w-4 mr-2 hidden md:inline-block" />
            {t("settings.appearance")}
          </TabsTrigger>
          <TabsTrigger value="privacy" className="py-2">
            <Lock className="h-4 w-4 mr-2 hidden md:inline-block" />
            {t("settings.privacy")}
          </TabsTrigger>
          <TabsTrigger value="notifications" className="py-2">
            <Bell className="h-4 w-4 mr-2 hidden md:inline-block" />
            {t("settings.notifications")}
          </TabsTrigger>
          <TabsTrigger value="language" className="py-2">
            <Globe className="h-4 w-4 mr-2 hidden md:inline-block" />
            {t("settings.language")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize how the application looks and feels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 ${settings.appearance.theme === "light" ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-background"}`}
                        onClick={() => handleThemeChange("light")}
                      >
                        <Sun className="h-4 w-4 mr-2" />
                        {t("theme.light")}
                      </button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 ${settings.appearance.theme === "dark" ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-background"}`}
                        onClick={() => handleThemeChange("dark")}
                      >
                        <Moon className="h-4 w-4 mr-2" />
                        {t("theme.dark")}
                      </button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 ${settings.appearance.theme === "system" ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-background"}`}
                        onClick={() => handleThemeChange("system")}
                      >
                        <Monitor className="h-4 w-4 mr-2" />
                        {t("theme.system")}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="font-size">Font Size ({settings.appearance.fontSize}px)</Label>
                  </div>
                  <Slider
                    id="font-size"
                    min={12}
                    max={24}
                    step={1}
                    defaultValue={[settings.appearance.fontSize]}
                    onValueChange={handleFontSizeChange}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Small</span>
                    <span>Default</span>
                    <span>Large</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="reduced-motion" className="flex-1">
                      Reduced Motion
                    </Label>
                    <Switch
                      id="reduced-motion"
                      checked={settings.appearance.reducedMotion}
                      onCheckedChange={(checked) => handleToggleChange("appearance", "reducedMotion", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="high-contrast" className="flex-1">
                      High Contrast Mode
                    </Label>
                    <Switch
                      id="high-contrast"
                      checked={settings.appearance.highContrast}
                      onCheckedChange={(checked) => handleToggleChange("appearance", "highContrast", checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave} className="ml-auto" disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : t("save.changes")}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Manage your data and privacy preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between space-x-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="location-tracking">Location Tracking</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow the application to track your location for improved services
                    </p>
                  </div>
                  <Switch
                    id="location-tracking"
                    checked={settings.privacy.locationTracking}
                    onCheckedChange={(checked) => handleToggleChange("privacy", "locationTracking", checked)}
                  />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="activity-logging">Activity Logging</Label>
                    <p className="text-sm text-muted-foreground">
                      Record your activity within the application for better recommendations
                    </p>
                  </div>
                  <Switch
                    id="activity-logging"
                    checked={settings.privacy.activityLogging}
                    onCheckedChange={(checked) => handleToggleChange("privacy", "activityLogging", checked)}
                  />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="data-sharing">Data Sharing with Partners</Label>
                    <p className="text-sm text-muted-foreground">
                      Share your data with our conservation partners for research purposes
                    </p>
                  </div>
                  <Switch
                    id="data-sharing"
                    checked={settings.privacy.dataSharingWithPartners}
                    onCheckedChange={(checked) => handleToggleChange("privacy", "dataSharingWithPartners", checked)}
                  />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="anonymous-analytics">Anonymous Analytics</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow anonymous usage data collection to improve the application
                    </p>
                  </div>
                  <Switch
                    id="anonymous-analytics"
                    checked={settings.privacy.anonymousAnalytics}
                    onCheckedChange={(checked) => handleToggleChange("privacy", "anonymousAnalytics", checked)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave} className="ml-auto" disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : t("save.changes")}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="email-alerts" className="flex-1">
                    Email Alerts
                  </Label>
                  <Switch
                    id="email-alerts"
                    checked={settings.notifications.emailAlerts}
                    onCheckedChange={(checked) => handleToggleChange("notifications", "emailAlerts", checked)}
                  />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="push-notifications" className="flex-1">
                    Push Notifications
                  </Label>
                  <Switch
                    id="push-notifications"
                    checked={settings.notifications.pushNotifications}
                    onCheckedChange={(checked) => handleToggleChange("notifications", "pushNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="sound-alerts" className="flex-1">
                    Sound Alerts
                  </Label>
                  <Switch
                    id="sound-alerts"
                    checked={settings.notifications.soundAlerts}
                    onCheckedChange={(checked) => handleToggleChange("notifications", "soundAlerts", checked)}
                  />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="critical-alerts" className="flex-1">
                    Critical Alerts Only
                  </Label>
                  <Switch
                    id="critical-alerts"
                    checked={settings.notifications.criticalAlertsOnly}
                    onCheckedChange={(checked) => handleToggleChange("notifications", "criticalAlertsOnly", checked)}
                  />
                </div>

                <div className="space-y-4 border-t pt-4">
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="do-not-disturb" className="flex-1">
                      Do Not Disturb
                    </Label>
                    <Switch
                      id="do-not-disturb"
                      checked={settings.notifications.doNotDisturb.enabled}
                      onCheckedChange={(checked) =>
                        handleNestedToggleChange("notifications", "doNotDisturb", "enabled", checked)
                      }
                    />
                  </div>

                  {settings.notifications.doNotDisturb.enabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6 mt-2">
                      <div className="space-y-2">
                        <Label htmlFor="start-time">Start Time</Label>
                        <Select
                          value={settings.notifications.doNotDisturb.startTime}
                          onValueChange={(value) =>
                            handleTimeChange("notifications", "doNotDisturb", "startTime", value)
                          }
                        >
                          <SelectTrigger id="start-time">
                            <SelectValue placeholder="Select start time" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 24 }).map((_, i) => {
                              const hour = i.toString().padStart(2, "0")
                              return <SelectItem key={`${hour}:00`} value={`${hour}:00`}>{`${hour}:00`}</SelectItem>
                            })}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="end-time">End Time</Label>
                        <Select
                          value={settings.notifications.doNotDisturb.endTime}
                          onValueChange={(value) => handleTimeChange("notifications", "doNotDisturb", "endTime", value)}
                        >
                          <SelectTrigger id="end-time">
                            <SelectValue placeholder="Select end time" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 24 }).map((_, i) => {
                              const hour = i.toString().padStart(2, "0")
                              return <SelectItem key={`${hour}:00`} value={`${hour}:00`}>{`${hour}:00`}</SelectItem>
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave} className="ml-auto" disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : t("save.changes")}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="language" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.language")}</CardTitle>
              <CardDescription>Choose your preferred language for the interface</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {languages.map((language) => (
                  <button
                    key={language.code}
                    className={`flex items-center justify-between p-4 rounded-md border ${
                      currentLanguage.code === language.code
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-input hover:bg-accent hover:text-accent-foreground"
                    }`}
                    onClick={() => setLanguage(language)}
                  >
                    <div className="flex items-center">
                      <span className="text-lg mr-2">{language.code === "ur" ? "🇵🇰" : `🇮🇳`}</span>
                      <div className="flex flex-col">
                        <span className="font-medium">{language.name}</span>
                        <span className="text-sm opacity-80">{language.nativeName}</span>
                      </div>
                    </div>
                    {currentLanguage.code === language.code && (
                      <div className="h-3 w-3 rounded-full bg-primary-foreground" />
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave} className="ml-auto" disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? t("saving") : t("save.changes")}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
