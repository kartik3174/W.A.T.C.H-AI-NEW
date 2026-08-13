"use client"

import type React from "react"
import { useAuth } from "@/contexts/auth-context"
import type { Permission } from "@/types/rbac"
import { UserRole } from "@/types/rbac"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ProtectedComponentProps {
  children: React.ReactNode
  permissions?: Permission[]
  roles?: UserRole[]
  requireAll?: boolean
  fallback?: React.ReactNode
}

/**
 * Protected Component Wrapper
 * Conditionally renders children based on user permissions/roles
 *
 * @example
 * ```tsx
 * <ProtectedComponent permissions={[Permission.MANAGE_USERS]}>
 *   <UserManagementPanel />
 * </ProtectedComponent>
 * ```
 */
export const ProtectedComponent: React.FC<ProtectedComponentProps> = ({
  children,
  permissions = [],
  roles = [],
  requireAll = false,
  fallback,
}) => {
  const { user, hasPermission, hasRole } = useAuth()

  // Check permissions
  if (permissions.length > 0) {
    const hasPerms = requireAll
      ? permissions.every((p) => hasPermission(p))
      : permissions.some((p) => hasPermission(p))

    if (!hasPerms) {
      return (
        fallback || (
          <Alert variant="destructive">
            <AlertDescription>You do not have permission to access this feature.</AlertDescription>
          </Alert>
        )
      )
    }
  }

  // Check roles
  if (roles.length > 0) {
    const hasRoles = requireAll
      ? roles.every((r) => hasRole(r))
      : roles.some((r) => hasRole(r))

    if (!hasRoles) {
      return (
        fallback || (
          <Alert variant="destructive">
            <AlertDescription>Your role does not have access to this feature.</AlertDescription>
          </Alert>
        )
      )
    }
  }

  return <>{children}</>
}
