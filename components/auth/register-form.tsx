"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Eye, EyeOff, Lock, Mail, User,
  AlertCircle, ShieldCheck,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { auth, googleProvider } from "@/lib/Firebase"
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  setPersistence,
  browserSessionPersistence,
  browserLocalPersistence,
} from "firebase/auth"
import {
  getFirebaseErrorMessage,
  validatePassword,
  checkPasswordStrength,
  type PasswordStrengthResult,
} from "@/lib/auth-helpers"

// ─── Types ─────────────────────────────────────────────────────────────────

interface FormErrors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
}

// ─── Password Strength Bar ────────────────────────────────────────────────────

function PasswordStrengthBar({ result }: { result: PasswordStrengthResult | null }) {
  if (!result) return null
  const segments = 4
  return (
    <div className="space-y-1 mt-1">
      <div className="flex gap-1">
        {Array.from({ length: segments }).map((_, i) => (
          <div
            key={i}
            className="h-1.5 flex-1 rounded-full transition-all duration-300"
            style={{ backgroundColor: i < result.score ? result.color : "var(--border)" }}
          />
        ))}
      </div>
      <p className="text-xs flex items-center gap-1" style={{ color: result.color }}>
        <ShieldCheck size={11} />
        {result.label}
        {result.suggestions.length > 0 && (
          <span className="text-muted-foreground ml-1">— {result.suggestions[0]}</span>
        )}
      </p>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function RegisterForm() {
  const [name, setName]                     = useState("")
  const [email, setEmail]                   = useState("")
  const [password, setPassword]             = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword]     = useState(false)
  const [showConfirm, setShowConfirm]       = useState(false)
  const [isLoading, setIsLoading]           = useState(false)
  const [errors, setErrors]                 = useState<FormErrors>({})
  const [strengthResult, setStrengthResult] = useState<PasswordStrengthResult | null>(null)

  const router    = useRouter()
  const { toast } = useToast()

  const handlePasswordChange = (val: string) => {
    setPassword(val)
    setStrengthResult(val.length > 0 ? checkPasswordStrength(val) : null)
  }

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {}

    if (!name.trim()) newErrors.name = "Full name is required."
    else if (name.trim().length < 2) newErrors.name = "Name must be at least 2 characters."

    const trimmedEmail = email.trim()
    if (!trimmedEmail) newErrors.email = "Email is required."
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail))
      newErrors.email = "Please enter a valid email address."

    const passwordError = validatePassword(password)
    if (passwordError) newErrors.password = passwordError

    if (!confirmPassword) newErrors.confirmPassword = "Please confirm your password."
    else if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match."

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [name, email, password, confirmPassword])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsLoading(true)

    try {
      const trimmedEmail = email.trim()
      await setPersistence(auth, browserSessionPersistence)

      const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, password)

      // Set display name on the Firebase profile
      await updateProfile(userCredential.user, { displayName: name.trim() })

      const sessionRef = {
        email: userCredential.user.email,
        uid: userCredential.user.uid,
        displayName: name.trim(),
        loggedIn: true,
        persistedAt: Date.now(),
      }
      sessionStorage.setItem("watch_auth", JSON.stringify(sessionRef))

      toast({
        title: "Account created!",
        description: `Welcome to W.A.T.C.H, ${name.trim()}!`,
      })

      router.push("/dashboard")
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: getFirebaseErrorMessage(error),
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setIsLoading(true)
    try {
      await setPersistence(auth, browserLocalPersistence)
      const result = await signInWithPopup(auth, googleProvider)
      const user   = result.user

      const sessionRef = {
        email: user.email,
        uid: user.uid,
        displayName: user.displayName,
        loggedIn: true,
        persistedAt: Date.now(),
      }
      localStorage.setItem("watch_auth", JSON.stringify(sessionRef))

      toast({
        title: "Account created with Google!",
        description: `Welcome to W.A.T.C.H, ${user.displayName || ""}!`,
      })

      router.push("/dashboard")
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Google sign-up failed",
        description: getFirebaseErrorMessage(error),
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>

      {/* Full Name */}
      <div className="space-y-2">
        <Label htmlFor="reg-name">Full Name</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="reg-name"
            type="text"
            autoComplete="name"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="pl-10"
            disabled={isLoading}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
        </div>
        {errors.name && (
          <div id="name-error" role="alert" className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {errors.name}
          </div>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="reg-email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="reg-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
            disabled={isLoading}
            aria-describedby={errors.email ? "reg-email-error" : undefined}
          />
        </div>
        {errors.email && (
          <div id="reg-email-error" role="alert" className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {errors.email}
          </div>
        )}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="reg-password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="reg-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => handlePasswordChange(e.target.value)}
            className="pl-10 pr-10"
            disabled={isLoading}
            aria-describedby={errors.password ? "reg-password-error" : undefined}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Strength Meter */}
        <PasswordStrengthBar result={strengthResult} />

        {errors.password && (
          <div id="reg-password-error" role="alert" className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {errors.password}
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label htmlFor="reg-confirm-password">Confirm Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="reg-confirm-password"
            type={showConfirm ? "text" : "password"}
            autoComplete="new-password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="pl-10 pr-10"
            disabled={isLoading}
            aria-describedby={errors.confirmPassword ? "confirm-error" : undefined}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showConfirm ? "Hide password" : "Show password"}
            tabIndex={-1}
          >
            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.confirmPassword && (
          <div id="confirm-error" role="alert" className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {errors.confirmPassword}
          </div>
        )}
      </div>

      {/* Submit */}
      <Button
        type="submit"
        id="register-submit-btn"
        className="w-full btn-primary"
        disabled={isLoading}
        aria-busy={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Creating account…
          </span>
        ) : (
          "Create Account"
        )}
      </Button>

      {/* Divider */}
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <div className="flex-1 h-px bg-border" />
        OR
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Google Sign Up */}
      <Button
        type="button"
        id="google-signup-btn"
        variant="outline"
        onClick={handleGoogleSignUp}
        disabled={isLoading}
        className="w-full bg-background hover:bg-muted text-foreground border-border hover:border-primary transition-colors"
      >
        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        Sign up with Google
      </Button>

      {/* Login Link */}
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="text-accent font-semibold hover:underline">
          Sign in
        </Link>
      </div>

      {/* Security Badge */}
      <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground pt-1">
        <ShieldCheck size={12} className="text-green-500" />
        <span>Secured with Firebase Authentication</span>
      </div>

    </form>
  )
}
