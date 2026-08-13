/**
 * Role-Based Access Control Types
 * Defines user roles and permissions for W.A.T.C.H system
 */

export enum UserRole {
  ADMIN = "admin",
  RANGER = "ranger",
  RESEARCHER = "researcher",
  DRONE_OPERATOR = "drone_operator",
  VETERINARIAN = "veterinarian",
  VIEWER = "viewer",
}

export enum Permission {
  // Admin permissions
  MANAGE_USERS = "manage_users",
  MANAGE_ROLES = "manage_roles",
  SYSTEM_SETTINGS = "system_settings",
  EXPORT_REPORTS = "export_reports",
  VIEW_AUDIT_LOG = "view_audit_log",

  // Ranger permissions
  CREATE_INCIDENT = "create_incident",
  UPDATE_INCIDENT = "update_incident",
  TRACK_ANIMALS = "track_animals",
  ACCESS_FIELD_MODE = "access_field_mode",
  RECORD_OBSERVATIONS = "record_observations",

  // Researcher permissions
  ACCESS_ANALYTICS = "access_analytics",
  VIEW_MIGRATION_DATA = "view_migration_data",
  GENERATE_INSIGHTS = "generate_insights",
  ACCESS_POPULATION_DATA = "access_population_data",
  VIEW_SEASONAL_TRENDS = "view_seasonal_trends",

  // Drone operator permissions
  OPERATE_DRONES = "operate_drones",
  SCHEDULE_MISSIONS = "schedule_missions",
  VIEW_DRONE_STATUS = "view_drone_status",
  MANAGE_GEOFENCES = "manage_geofences",

  // Veterinarian permissions
  VIEW_ANIMAL_HEALTH = "view_animal_health",
  RECORD_HEALTH_DATA = "record_health_data",
  ACCESS_MEDICAL_HISTORY = "access_medical_history",
  MANAGE_CARE_PLANS = "manage_care_plans",

  // Common permissions
  VIEW_DASHBOARD = "view_dashboard",
  VIEW_ALERTS = "view_alerts",
  VIEW_TRACKING = "view_tracking",
  VIEW_REPORTS = "view_reports",
  SUBMIT_FEEDBACK = "submit_feedback",
}

export const RolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    // All permissions
    Permission.MANAGE_USERS,
    Permission.MANAGE_ROLES,
    Permission.SYSTEM_SETTINGS,
    Permission.EXPORT_REPORTS,
    Permission.VIEW_AUDIT_LOG,
    Permission.CREATE_INCIDENT,
    Permission.UPDATE_INCIDENT,
    Permission.TRACK_ANIMALS,
    Permission.ACCESS_FIELD_MODE,
    Permission.RECORD_OBSERVATIONS,
    Permission.ACCESS_ANALYTICS,
    Permission.VIEW_MIGRATION_DATA,
    Permission.GENERATE_INSIGHTS,
    Permission.ACCESS_POPULATION_DATA,
    Permission.VIEW_SEASONAL_TRENDS,
    Permission.OPERATE_DRONES,
    Permission.SCHEDULE_MISSIONS,
    Permission.VIEW_DRONE_STATUS,
    Permission.MANAGE_GEOFENCES,
    Permission.VIEW_ANIMAL_HEALTH,
    Permission.RECORD_HEALTH_DATA,
    Permission.ACCESS_MEDICAL_HISTORY,
    Permission.MANAGE_CARE_PLANS,
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_ALERTS,
    Permission.VIEW_TRACKING,
    Permission.VIEW_REPORTS,
    Permission.SUBMIT_FEEDBACK,
  ],
  [UserRole.RANGER]: [
    Permission.CREATE_INCIDENT,
    Permission.UPDATE_INCIDENT,
    Permission.TRACK_ANIMALS,
    Permission.ACCESS_FIELD_MODE,
    Permission.RECORD_OBSERVATIONS,
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_ALERTS,
    Permission.VIEW_TRACKING,
    Permission.VIEW_REPORTS,
    Permission.SUBMIT_FEEDBACK,
  ],
  [UserRole.RESEARCHER]: [
    Permission.ACCESS_ANALYTICS,
    Permission.VIEW_MIGRATION_DATA,
    Permission.GENERATE_INSIGHTS,
    Permission.ACCESS_POPULATION_DATA,
    Permission.VIEW_SEASONAL_TRENDS,
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_ALERTS,
    Permission.VIEW_TRACKING,
    Permission.VIEW_REPORTS,
    Permission.SUBMIT_FEEDBACK,
  ],
  [UserRole.DRONE_OPERATOR]: [
    Permission.OPERATE_DRONES,
    Permission.SCHEDULE_MISSIONS,
    Permission.VIEW_DRONE_STATUS,
    Permission.MANAGE_GEOFENCES,
    Permission.TRACK_ANIMALS,
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_ALERTS,
    Permission.VIEW_TRACKING,
    Permission.VIEW_REPORTS,
    Permission.SUBMIT_FEEDBACK,
  ],
  [UserRole.VETERINARIAN]: [
    Permission.VIEW_ANIMAL_HEALTH,
    Permission.RECORD_HEALTH_DATA,
    Permission.ACCESS_MEDICAL_HISTORY,
    Permission.MANAGE_CARE_PLANS,
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_ALERTS,
    Permission.VIEW_REPORTS,
    Permission.SUBMIT_FEEDBACK,
  ],
  [UserRole.VIEWER]: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_ALERTS,
    Permission.VIEW_TRACKING,
    Permission.VIEW_REPORTS,
    Permission.SUBMIT_FEEDBACK,
  ],
}

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  department?: string
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
}

export interface AuthContext {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  hasPermission: (permission: Permission) => boolean
  hasRole: (role: UserRole) => boolean
}
