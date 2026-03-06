"use client"

import type React from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import type { Permission } from "@/types/rbac"
import { Permission as PermissionEnum, UserRole } from "@/types/rbac"
import { cn } from "@/lib/utils"

interface NavItem {
  label: string
  href: string
  icon?: string
  permissions?: Permission[]
  roles?: UserRole[]
  requireAll?: boolean
  badge?: string | number
  children?: NavItem[]
}

interface RoleBasedSidebarProps {
  navigationItems: NavItem[]
  className?: string
}

/**
 * Role-Based Navigation Sidebar
 * Filters navigation items based on user permissions and roles
 */
export const RoleBasedSidebar: React.FC<RoleBasedSidebarProps> = ({ navigationItems, className }) => {
  const { hasPermission, hasRole } = useAuth()

  const filterNavItems = (items: NavItem[]): NavItem[] => {
    return items
      .filter((item) => {
        // If no permissions or roles specified, show the item
        if (!item.permissions && !item.roles) return true

        // Check permissions
        if (item.permissions && item.permissions.length > 0) {
          const hasPerms = item.requireAll
            ? item.permissions.every((p) => hasPermission(p))
            : item.permissions.some((p) => hasPermission(p))

          if (!hasPerms) return false
        }

        // Check roles
        if (item.roles && item.roles.length > 0) {
          const hasRoles = item.roles.some((r) => hasRole(r))
          if (!hasRoles) return false
        }

        return true
      })
      .map((item) => ({
        ...item,
        children: item.children ? filterNavItems(item.children) : undefined,
      }))
  }

  const visibleItems = filterNavItems(navigationItems)

  return (
    <nav className={cn("space-y-1", className)}>
      {visibleItems.map((item) => (
        <NavItemComponent key={item.href} item={item} />
      ))}
    </nav>
  )
}

const NavItemComponent: React.FC<{ item: NavItem }> = ({ item }) => {
  return (
    <div>
      <Link
        href={item.href}
        className="flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
      >
        <span className="flex items-center gap-2">
          {item.icon && <span className="text-lg">{item.icon}</span>}
          {item.label}
        </span>
        {item.badge && (
          <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
            {item.badge}
          </span>
        )}
      </Link>

      {item.children && item.children.length > 0 && (
        <div className="ml-4 space-y-1">
          {item.children.map((child) => (
            <NavItemComponent key={child.href} item={child} />
          ))}
        </div>
      )}
    </div>
  )
}

// Default navigation items with permission requirements
export const DEFAULT_NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    permissions: [PermissionEnum.VIEW_DASHBOARD],
  },
  {
    label: "Tracking",
    href: "/tracking",
    permissions: [PermissionEnum.VIEW_TRACKING],
  },
  {
    label: "Alerts",
    href: "/alerts",
    permissions: [PermissionEnum.VIEW_ALERTS],
  },
  {
    label: "Field Operations",
    href: "/field-operations",
    permissions: [PermissionEnum.ACCESS_FIELD_MODE],
    roles: [UserRole.RANGER, UserRole.ADMIN],
    children: [
      {
        label: "Incident Reports",
        href: "/field-operations/incidents",
        permissions: [PermissionEnum.CREATE_INCIDENT],
      },
      {
        label: "Observations",
        href: "/field-operations/observations",
        permissions: [PermissionEnum.RECORD_OBSERVATIONS],
      },
    ],
  },
  {
    label: "Anti-Poaching",
    href: "/anti-poaching",
    permissions: [PermissionEnum.ACCESS_ANALYTICS],
    roles: [UserRole.RANGER, UserRole.ADMIN],
    children: [
      {
        label: "Threat Analysis",
        href: "/anti-poaching/threats",
      },
      {
        label: "Patrol Routes",
        href: "/anti-poaching/routes",
      },
    ],
  },
  {
    label: "Disaster Management",
    href: "/disaster-management",
    permissions: [PermissionEnum.ACCESS_ANALYTICS],
    roles: [UserRole.ADMIN, UserRole.RANGER],
  },
  {
    label: "Research",
    href: "/research",
    permissions: [PermissionEnum.ACCESS_ANALYTICS],
    roles: [UserRole.RESEARCHER, UserRole.ADMIN],
    children: [
      {
        label: "Migration Patterns",
        href: "/research/migration",
        permissions: [PermissionEnum.VIEW_MIGRATION_DATA],
      },
      {
        label: "Population Analysis",
        href: "/research/population",
        permissions: [PermissionEnum.ACCESS_POPULATION_DATA],
      },
      {
        label: "Seasonal Trends",
        href: "/research/seasonal",
        permissions: [PermissionEnum.VIEW_SEASONAL_TRENDS],
      },
    ],
  },
  {
    label: "Environment",
    href: "/environment",
    permissions: [PermissionEnum.VIEW_TRACKING],
  },
  {
    label: "Drone Fleet",
    href: "/drone-fleet",
    permissions: [PermissionEnum.OPERATE_DRONES],
    roles: [UserRole.DRONE_OPERATOR, UserRole.ADMIN],
    children: [
      {
        label: "Active Missions",
        href: "/drone-fleet/missions",
      },
      {
        label: "Geofences",
        href: "/drone-fleet/geofences",
      },
    ],
  },
  {
    label: "Veterinary",
    href: "/veterinary",
    permissions: [PermissionEnum.VIEW_ANIMAL_HEALTH],
    roles: [UserRole.VETERINARIAN, UserRole.ADMIN],
    children: [
      {
        label: "Health Records",
        href: "/veterinary/health-records",
      },
      {
        label: "Care Plans",
        href: "/veterinary/care-plans",
      },
    ],
  },
  {
    label: "Reports",
    href: "/reports",
    permissions: [PermissionEnum.VIEW_REPORTS],
  },
  {
    label: "Government Reporting",
    href: "/government-reporting",
    permissions: [PermissionEnum.EXPORT_REPORTS],
    roles: [UserRole.ADMIN],
  },
  {
    label: "Settings",
    href: "/settings",
    permissions: [PermissionEnum.SYSTEM_SETTINGS],
    roles: [UserRole.ADMIN],
  },
]
