// Admin Feature Exports - RitterFinder Admin Dashboard

// Main Components
export { AdminDashboard } from './components/AdminDashboard'
export { UserManagement } from './components/UserManagement'
export { RoleManagement } from './components/RoleManagement'
export { TemplateManagement } from './components/TemplateManagement'

// Component Exports
export * from './components'

// Hook Exports
export { useAdmin } from './hooks/useAdmin'
export { useUserManagement } from './hooks/useUserManagement'
export { useRoleManagement } from './hooks/useRoleManagement'

// Type Exports
export type {
  User,
  Role,
  Permission,
  PermissionCategory,
  AdminTab,
  UseUsersReturn,
  UseRolesReturn,
  UsePermissionsReturn,
  CreateUserInput,
  UpdateUserInput,
  CreateRoleInput,
  UpdateRoleInput,
  CreatePermissionInput,
  UpdatePermissionInput,
  UserFilters,
  PaginationInfo,
  AdminDashboardProps,
  UserManagementProps,
  RoleManagementProps,
  TemplateManagementProps
} from './types'

// Re-export all types for convenience
export * from "./types" 