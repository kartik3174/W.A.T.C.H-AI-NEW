"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { LeafDecoration } from "@/components/leaf-decoration"
import { loginUser } from "@/app/actions/auth-actions"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const router = useRouter()
  const { toast } = useToast()

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}

    if (!email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid"
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const result = await loginUser({ email, password })

      if (!result.success) {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: result.error || "Please check your credentials and try again",
        })
        setIsLoading(false)
        return
      }

      // Explicitly set loggedIn to true and clear any old data
      const authData = result.user || { email, loggedIn: true }

      // Clear both to ensure no stale data
      localStorage.removeItem("watch_auth")
      sessionStorage.removeItem("watch_auth")

      const storage = rememberMe ? localStorage : sessionStorage
      storage.setItem("watch_auth", JSON.stringify(authData))

      toast({
        title: "Login successful",
        description: "Welcome to the Wildlife Conservation Dashboard",
      })

      router.push("/dashboard")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Please check your credentials and try again",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 relative">
      {/* Leaf decorations */}
      <LeafDecoration position="top-right" size="sm" rotation={-12} opacity={0.1} className="z-0" />
      <LeafDecoration position="bottom-left" size="sm" rotation={45} opacity={0.1} className="z-0" />

      <div className="space-y-2 relative z-10">
        <Label htmlFor="email" className="text-foreground font-semibold">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`pl-10 ${errors.email ? "border-red-500 focus-visible:ring-red-500" : "border-wildlife-green/50 focus-visible:ring-wildlife-green"}`}
            disabled={isLoading}
          />
        </div>
        {errors.email && (
          <div className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {errors.email}
          </div>
        )}
      </div>

      <div className="space-y-2 relative z-10">
        <Label htmlFor="password" className="text-foreground font-semibold">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`pl-10 ${errors.password ? "border-red-500 focus-visible:ring-red-500" : "border-wildlife-green/50 focus-visible:ring-wildlife-green"}`}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
          </button>
        </div>
        {errors.password && (
          <div className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {errors.password}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="remember-me"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            className="border-wildlife-green/50 data-[state=checked]:bg-wildlife-green data-[state=checked]:border-wildlife-green"
          />
          <Label htmlFor="remember-me" className="text-sm font-normal text-foreground">
            Remember me
          </Label>
        </div>
        <Link href="/forgot-password" className="text-sm text-wildlife-orange hover:underline font-medium">
          Forgot password?
        </Link>
      </div>

      <Button
        type="submit"
        className="w-full bg-wildlife-green hover:bg-wildlife-green/90 relative z-10"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Signing in...
          </>
        ) : (
          "Sign in"
        )}
      </Button>

      <div className="text-center text-sm relative z-10 text-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-wildlife-green hover:underline font-semibold">
          Sign up
        </Link>
      </div>

      {/* Demo credentials helper */}
      <div className="text-xs text-center p-2 bg-wildlife-green/10 rounded-md border border-wildlife-green/20 relative z-10">
        <p className="font-medium text-wildlife-green mb-1">Demo Credentials:</p>
        <p>Use any valid email format and password (6+ characters)</p>
      </div>
    </form>
  )
}
