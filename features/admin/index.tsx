// Admin Feature - RitterFinder Admin Dashboard
// Comprehensive admin system for user, role, and permission management

// Main Components
export { AdminDashboard } from "./components/AdminDashboard"
export { UserManagement } from "./components/UserManagement"
export { RoleManagement } from "./components/RoleManagement"
export { PermissionManagement } from "./components/PermissionManagement"

// Hooks
export { useAdmin } from "./hooks/useAdmin"

// Types - Individual exports for better tree-shaking
export type {
  // Core entities
  User,
  Role,
  Permission,
  AdminStats,
  ActivityLog,
  AdminTab,
  
  // Categories and enums
  PermissionCategory,
  
  // Hook return types
  UseUsersReturn,
  UseRolesReturn,
  UsePermissionsReturn,
  
  // Input types
  CreateUserInput,
  UpdateUserInput,
  CreateRoleInput,
  UpdateRoleInput,
  CreatePermissionInput,
  UpdatePermissionInput,
  
  // Filter and pagination
  UserFilters,
  PaginationInfo,
  
  // Component props
  AdminDashboardProps,
  UserManagementProps,
  RoleManagementProps,
  PermissionManagementProps,
} from "./types"

// Re-export all types for convenience (can be removed if not needed)
export * from "./types" 