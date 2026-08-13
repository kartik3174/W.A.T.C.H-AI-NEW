"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Eye, EyeOff, Lock, Mail, AlertCircle,
  ShieldCheck, Clock, AlertTriangle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { LeafDecoration } from "@/components/leaf-decoration"
import { auth, googleProvider } from "@/lib/Firebase"
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth"
import {
  getFirebaseErrorMessage,
  validatePassword,
  checkPasswordStrength,
  getLockoutRemaining,
  getAttemptCount,
  recordFailedAttempt,
  clearLoginAttempts,
  MAX_ATTEMPTS,
  type PasswordStrengthResult,
} from "@/lib/auth-helpers"

// ─── Types ─────────────────────────────────────────────────────────────────

interface FormErrors {
  email?: string
  password?: string
}

// ─── Sub-components ──────────────────────────────────────────────────────────

/** Animated strength bar shown while the user types their password */
function PasswordStrengthBar({ result }: { result: PasswordStrengthResult | null }) {
  if (!result) return null

  const segments = 4
  const filled = result.score

  return (
    <div className="space-y-1 mt-1">
      <div className="flex gap-1">
        {Array.from({ length: segments }).map((_, i) => (
          <div
            key={i}
            className="h-1.5 flex-1 rounded-full transition-all duration-300"
            style={{
              backgroundColor: i < filled ? result.color : "var(--border)",
            }}
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

/** Lockout countdown banner shown when the user is temporarily blocked */
function LockoutBanner({ remainingMs }: { remainingMs: number }) {
  const seconds = Math.ceil(remainingMs / 1000)
  return (
    <div className="flex items-center gap-2 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2.5 text-sm text-red-400">
      <Clock size={15} className="shrink-0" />
      <span>
        Too many failed attempts. Try again in{" "}
        <span className="font-bold tabular-nums">{seconds}s</span>.
      </span>
    </div>
  )
}

/** Warning shown after 3+ failed attempts but before lockout */
function AttemptWarning({ count }: { count: number }) {
  if (count < 3) return null
  const remaining = MAX_ATTEMPTS - count
  return (
    <div className="flex items-center gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-400">
      <AlertTriangle size={13} className="shrink-0" />
      <span>
        {remaining} attempt{remaining !== 1 ? "s" : ""} remaining before temporary lockout.
      </span>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function LoginForm() {
  const [email, setEmail]               = useState("")
  const [password, setPassword]         = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe]     = useState(false)
  const [isLoading, setIsLoading]       = useState(false)
  const [errors, setErrors]             = useState<FormErrors>({})
  const [strengthResult, setStrengthResult] = useState<PasswordStrengthResult | null>(null)

  // Rate limiting state
  const [lockoutMs, setLockoutMs]     = useState(0)
  const [attemptCount, setAttemptCount] = useState(0)
  const lockoutTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const router    = useRouter()
  const { toast } = useToast()

  // ── Sync lockout state from sessionStorage on mount ──
  useEffect(() => {
    const remaining = getLockoutRemaining()
    setLockoutMs(remaining)
    setAttemptCount(getAttemptCount())
  }, [])

  // ── Tick the lockout countdown every second ──
  useEffect(() => {
    if (lockoutMs <= 0) {
      if (lockoutTimerRef.current) clearInterval(lockoutTimerRef.current)
      return
    }
    lockoutTimerRef.current = setInterval(() => {
      const remaining = getLockoutRemaining()
      setLockoutMs(remaining)
      if (remaining <= 0) {
        setAttemptCount(0)
        if (lockoutTimerRef.current) clearInterval(lockoutTimerRef.current)
      }
    }, 500)
    return () => {
      if (lockoutTimerRef.current) clearInterval(lockoutTimerRef.current)
    }
  }, [lockoutMs])

  // ── Password strength meter ──
  const handlePasswordChange = (val: string) => {
    setPassword(val)
    setStrengthResult(val.length > 0 ? checkPasswordStrength(val) : null)
  }

  // ── Form Validation ──
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {}

    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      newErrors.email = "Email is required."
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      newErrors.email = "Please enter a valid email address."
    }

    const passwordError = validatePassword(password)
    if (passwordError) newErrors.password = passwordError

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [email, password])

  // ── Handle Email/Password Login ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Check lockout
    const remaining = getLockoutRemaining()
    if (remaining > 0) {
      setLockoutMs(remaining)
      return
    }

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const trimmedEmail = email.trim()

      // Set Firebase persistence based on "Remember Me"
      await setPersistence(
        auth,
        rememberMe ? browserLocalPersistence : browserSessionPersistence
      )

      // Authenticate with Firebase — no fallback, no bypass
      const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, password)
      const user = userCredential.user

      // Store only a minimal, non-sensitive reference (Firebase manages the real token)
      const sessionRef = {
        email: user.email,
        uid: user.uid,
        loggedIn: true,
        persistedAt: Date.now(),
      }
      const storage = rememberMe ? localStorage : sessionStorage
      storage.setItem("watch_auth", JSON.stringify(sessionRef))

      // Clear any failed attempt counters on success
      clearLoginAttempts()

      toast({
        title: "Welcome back!",
        description: "Signed in to the Wildlife Conservation Dashboard.",
      })

      router.push("/dashboard")
    } catch (error: any) {
      // Map Firebase error to safe message (no internal codes leaked)
      const safeMessage = getFirebaseErrorMessage(error)

      // Record failed attempt and check for lockout
      const isLockedOut = recordFailedAttempt()
      const newCount    = getAttemptCount()
      setAttemptCount(newCount)

      if (isLockedOut) {
        setLockoutMs(getLockoutRemaining())
        toast({
          variant: "destructive",
          title: "Account temporarily locked",
          description: `Too many failed attempts. Please wait 60 seconds.`,
        })
      } else {
        toast({
          variant: "destructive",
          title: "Sign in failed",
          description: safeMessage,
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  // ── Handle Google Login ──
  const handleGoogleLogin = async () => {
    // Check lockout
    const remaining = getLockoutRemaining()
    if (remaining > 0) {
      setLockoutMs(remaining)
      return
    }

    setIsLoading(true)
    try {
      await setPersistence(auth, browserLocalPersistence)
      const result = await signInWithPopup(auth, googleProvider)
      const user   = result.user

      const sessionRef = {
        email: user.email,
        uid: user.uid,
        loggedIn: true,
        persistedAt: Date.now(),
      }
      localStorage.setItem("watch_auth", JSON.stringify(sessionRef))

      clearLoginAttempts()

      toast({
        title: "Google Sign-In Successful",
        description: "Welcome to the W.A.T.C.H Dashboard.",
      })

      router.push("/dashboard")
    } catch (error: any) {
      const safeMessage = getFirebaseErrorMessage(error)
      toast({
        variant: "destructive",
        title: "Google sign-in failed",
        description: safeMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const isLockedOut = lockoutMs > 0

  return (
    <form onSubmit={handleSubmit} className="space-y-5 relative" noValidate>

      <LeafDecoration position="top-right" size="sm" rotation={-12} opacity={0.1} />
      <LeafDecoration position="bottom-left" size="sm" rotation={45} opacity={0.1} />

      {/* Lockout Banner */}
      {isLockedOut && <LockoutBanner remainingMs={lockoutMs} />}

      {/* Attempt Warning (3–4 failures) */}
      {!isLockedOut && <AttemptWarning count={attemptCount} />}

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
            disabled={isLoading || isLockedOut}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
        </div>
        {errors.email && (
          <div id="email-error" role="alert" className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" aria-hidden="true" />
            {errors.email}
          </div>
        )}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => handlePasswordChange(e.target.value)}
            className="pl-10 pr-10"
            disabled={isLoading || isLockedOut}
            aria-describedby={errors.password ? "password-error" : undefined}
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

        {/* Password Strength Meter */}
        <PasswordStrengthBar result={strengthResult} />

        {errors.password && (
          <div id="password-error" role="alert" className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" aria-hidden="true" />
            {errors.password}
          </div>
        )}
      </div>

      {/* Remember Me + Forgot Password */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="remember-me"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            disabled={isLockedOut}
          />
          <Label htmlFor="remember-me" className="text-sm cursor-pointer">
            Remember me
          </Label>
        </div>
        <Link
          href="/forgot-password"
          className="text-sm text-primary hover:underline hover:text-accent transition-colors"
          tabIndex={isLockedOut ? -1 : 0}
        >
          Forgot password?
        </Link>
      </div>

      {/* Sign In Button */}
      <Button
        type="submit"
        id="login-submit-btn"
        className="w-full btn-primary"
        disabled={isLoading || isLockedOut}
        aria-busy={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Signing in…
          </span>
        ) : isLockedOut ? (
          <span className="flex items-center gap-2">
            <Clock size={15} />
            Locked — wait {Math.ceil(lockoutMs / 1000)}s
          </span>
        ) : (
          "Sign in"
        )}
      </Button>

      {/* Divider */}
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <div className="flex-1 h-px bg-border" />
        OR
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Google Login */}
      <Button
        type="button"
        id="google-login-btn"
        variant="outline"
        onClick={handleGoogleLogin}
        disabled={isLoading || isLockedOut}
        className="w-full bg-background hover:bg-muted text-foreground border-border hover:border-primary transition-colors"
      >
        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Continue with Google
      </Button>

      {/* Sign Up Link */}
      <div className="text-center text-sm">
        Don't have an account?{" "}
        <Link href="/register" className="text-accent font-semibold hover:underline">
          Sign up
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