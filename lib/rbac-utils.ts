/**
 * RBAC Utility Functions
 * Helper functions for role and permission checks
 */

import type { User } from "@/types/rbac"
import { RolePermissions, UserRole, type Permission } from "@/types/rbac"

export function hasPermission(user: User | null, permission: Permission): boolean {
  if (!user) return false
  const userPermissions = RolePermissions[user.role] || []
  return userPermissions.includes(permission)
}

export function hasRole(user: User | null, role: UserRole): boolean {
  return user?.role === role
}

export function hasAnyRole(user: User | null, roles: UserRole[]): boolean {
  if (!user) return false
  return roles.includes(user.role)
}

export function hasAllPermissions(user: User | null, permissions: Permission[]): boolean {
  if (!user) return false
  const userPermissions = RolePermissions[user.role] || []
  return permissions.every((perm) => userPermissions.includes(perm))
}

export function hasAnyPermission(user: User | null, permissions: Permission[]): boolean {
  if (!user) return false
  const userPermissions = RolePermissions[user.role] || []
  return permissions.some((perm) => userPermissions.includes(perm))
}

export function getRoleDisplayName(role: UserRole): string {
  const displayNames: Record<UserRole, string> = {
    [UserRole.ADMIN]: "Administrator",
    [UserRole.RANGER]: "Field Ranger",
    [UserRole.RESEARCHER]: "Researcher",
    [UserRole.DRONE_OPERATOR]: "Drone Operator",
    [UserRole.VETERINARIAN]: "Veterinarian",
    [UserRole.VIEWER]: "Viewer",
  }
  return displayNames[role] || role
}

export function getRoleColor(role: UserRole): string {
  const colors: Record<UserRole, string> = {
    [UserRole.ADMIN]: "bg-red-100 text-red-800",
    [UserRole.RANGER]: "bg-green-100 text-green-800",
    [UserRole.RESEARCHER]: "bg-blue-100 text-blue-800",
    [UserRole.DRONE_OPERATOR]: "bg-purple-100 text-purple-800",
    [UserRole.VETERINARIAN]: "bg-amber-100 text-amber-800",
    [UserRole.VIEWER]: "bg-gray-100 text-gray-800",
  }
  return colors[role] || "bg-gray-100 text-gray-800"
}

export function getPermissionCategory(permission: Permission): string {
  if (
    permission.startsWith("manage_") ||
    permission.startsWith("system_") ||
    permission.startsWith("view_audit_")
  ) {
    return "Administration"
  }
  if (permission.startsWith("access_field_") || permission === "record_observations") {
    return "Field Operations"
  }
  if (
    permission.startsWith("access_analytics") ||
    permission.startsWith("view_migration_") ||
    permission.startsWith("generate_") ||
    permission.startsWith("access_population_") ||
    permission.startsWith("view_seasonal_")
  ) {
    return "Research & Analytics"
  }
  if (permission.startsWith("operate_") || permission.startsWith("schedule_")) {
    return "Drone Operations"
  }
  if (
    permission.startsWith("view_animal_") ||
    permission.startsWith("record_") ||
    permission.startsWith("access_medical_") ||
    permission.startsWith("manage_care_")
  ) {
    return "Veterinary Care"
  }
  return "General"
}
