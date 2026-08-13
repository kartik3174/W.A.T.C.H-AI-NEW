/**
 * Auth Helper Utilities
 * Provides secure login utilities: safe error messages, password strength,
 * and client-side login attempt rate limiting.
 */

// ─── Firebase Error → Safe Message Mapping ────────────────────────────────────

const FIREBASE_ERROR_MAP: Record<string, string> = {
  "auth/user-not-found": "Invalid email or password.",
  "auth/wrong-password": "Invalid email or password.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/invalid-credential": "Invalid email or password.",
  "auth/user-disabled": "This account has been disabled. Please contact support.",
  "auth/too-many-requests": "Too many failed attempts. Please try again later.",
  "auth/network-request-failed": "Network error. Please check your connection.",
  "auth/popup-closed-by-user": "Google sign-in was cancelled.",
  "auth/popup-blocked": "Pop-up was blocked by your browser. Please allow pop-ups.",
  "auth/cancelled-popup-request": "Google sign-in was cancelled.",
  "auth/email-already-in-use": "An account with this email already exists.",
  "auth/requires-recent-login": "Please sign in again to complete this action.",
  "auth/account-exists-with-different-credential":
    "An account already exists with this email. Try a different sign-in method.",
}

/**
 * Converts a Firebase error into a safe, non-leaking user-facing message.
 */
export function getFirebaseErrorMessage(error: any): string {
  const code: string = error?.code || ""
  return FIREBASE_ERROR_MAP[code] || "An unexpected error occurred. Please try again."
}

// ─── Password Strength Checker ────────────────────────────────────────────────

export type PasswordStrength = "weak" | "fair" | "strong" | "very-strong"

export interface PasswordStrengthResult {
  strength: PasswordStrength
  score: number         // 0–4
  label: string
  color: string
  suggestions: string[]
}

/**
 * Evaluates password strength and returns a score, label, and improvement suggestions.
 */
export function checkPasswordStrength(password: string): PasswordStrengthResult {
  const suggestions: string[] = []
  let score = 0

  if (password.length >= 8) score++
  else suggestions.push("Use at least 8 characters")

  if (password.length >= 12) score++
  else if (password.length >= 8) suggestions.push("Use 12+ characters for a stronger password")

  if (/[A-Z]/.test(password)) score++
  else suggestions.push("Add an uppercase letter")

  if (/[0-9]/.test(password)) score++
  else suggestions.push("Add a number")

  if (/[^A-Za-z0-9]/.test(password)) score++
  else suggestions.push("Add a special character (!@#$%^&*)")

  // Clamp score to 0–4
  const clampedScore = Math.min(score, 4)

  const map: Record<number, Omit<PasswordStrengthResult, "suggestions" | "score">> = {
    0: { strength: "weak",        label: "Too Weak",    color: "#ef4444" },
    1: { strength: "weak",        label: "Weak",        color: "#ef4444" },
    2: { strength: "fair",        label: "Fair",        color: "#f97316" },
    3: { strength: "strong",      label: "Strong",      color: "#22c55e" },
    4: { strength: "very-strong", label: "Very Strong", color: "#16a34a" },
  }

  return { ...map[clampedScore], score: clampedScore, suggestions }
}

/**
 * Validates a password meets minimum security requirements.
 * Returns an error string or null if valid.
 */
export function validatePassword(password: string): string | null {
  if (!password) return "Password is required."
  if (password.length < 8) return "Password must be at least 8 characters."
  if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter."
  if (!/[0-9]/.test(password)) return "Password must contain at least one number."
  return null
}

// ─── Login Attempt Rate Limiter ───────────────────────────────────────────────

const ATTEMPT_KEY = "watch_login_attempts"
const LOCKOUT_KEY = "watch_login_lockout"
const MAX_ATTEMPTS = 5
const LOCKOUT_DURATION_MS = 60_000 // 60 seconds

interface AttemptData {
  count: number
  firstAttemptAt: number
}

function getAttemptData(): AttemptData {
  try {
    const raw = sessionStorage.getItem(ATTEMPT_KEY)
    if (!raw) return { count: 0, firstAttemptAt: Date.now() }
    return JSON.parse(raw) as AttemptData
  } catch {
    return { count: 0, firstAttemptAt: Date.now() }
  }
}

/**
 * Returns the remaining lockout time in milliseconds (0 = not locked out).
 */
export function getLockoutRemaining(): number {
  try {
    const raw = sessionStorage.getItem(LOCKOUT_KEY)
    if (!raw) return 0
    const lockedAt = parseInt(raw, 10)
    const elapsed = Date.now() - lockedAt
    if (elapsed >= LOCKOUT_DURATION_MS) {
      sessionStorage.removeItem(LOCKOUT_KEY)
      sessionStorage.removeItem(ATTEMPT_KEY)
      return 0
    }
    return LOCKOUT_DURATION_MS - elapsed
  } catch {
    return 0
  }
}

/**
 * Returns the current failed attempt count.
 */
export function getAttemptCount(): number {
  return getAttemptData().count
}

/**
 * Records a failed login attempt. Returns true if the user is now locked out.
 */
export function recordFailedAttempt(): boolean {
  const data = getAttemptData()
  const newCount = data.count + 1
  sessionStorage.setItem(ATTEMPT_KEY, JSON.stringify({ count: newCount, firstAttemptAt: data.firstAttemptAt }))

  if (newCount >= MAX_ATTEMPTS) {
    sessionStorage.setItem(LOCKOUT_KEY, String(Date.now()))
    return true
  }
  return false
}

/**
 * Clears all login attempt data (call on successful login).
 */
export function clearLoginAttempts(): void {
  sessionStorage.removeItem(ATTEMPT_KEY)
  sessionStorage.removeItem(LOCKOUT_KEY)
}

export { MAX_ATTEMPTS }
