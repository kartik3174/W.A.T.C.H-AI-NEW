"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useEffect } from "react"
import type { User, AuthContext as AuthContextType } from "@/types/rbac"
import { UserRole, RolePermissions, type Permission } from "@/types/rbac"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check if user is logged in (from localStorage or session)
  useEffect(() => {
    const storedUser = localStorage.getItem("watch_user")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
      } catch (error) {
        console.error("[v0] Failed to parse stored user:", error)
        localStorage.removeItem("watch_user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // In production, this would call your authentication endpoint
      // For now, we'll create a mock user based on email
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name: email.split("@")[0],
        role: determineRoleFromEmail(email),
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      setUser(mockUser)
      localStorage.setItem("watch_user", JSON.stringify(mockUser))
    } catch (error) {
      console.error("[v0] Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem("watch_user")
  }, [])

  const hasPermission = useCallback(
    (permission: Permission): boolean => {
      if (!user) return false
      const userPermissions = RolePermissions[user.role] || []
      return userPermissions.includes(permission)
    },
    [user]
  )

  const hasRole = useCallback(
    (role: UserRole): boolean => {
      return user?.role === role
    },
    [user]
  )

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    hasPermission,
    hasRole,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Determine user role from email domain or prefix
 * In production, this would come from your backend
 */
function determineRoleFromEmail(email: string): UserRole {
  const prefix = email.split("@")[0].toLowerCase()

  if (prefix.includes("admin")) return UserRole.ADMIN
  if (prefix.includes("ranger")) return UserRole.RANGER
  if (prefix.includes("researcher")) return UserRole.RESEARCHER
  if (prefix.includes("drone")) return UserRole.DRONE_OPERATOR
  if (prefix.includes("vet")) return UserRole.VETERINARIAN

  return UserRole.VIEWER
}
