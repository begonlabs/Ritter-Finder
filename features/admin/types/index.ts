// Admin Feature Types - RitterFinder Admin Dashboard

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  status: 'active' | 'inactive' | 'suspended'
  role: Role
  permissions: Permission[]
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
  metadata?: {
    loginCount: number
    lastIpAddress?: string
    department?: string
    phone?: string
  }
}

export interface Role {
  id: string
  name: string
  description: string
  color: string
  permissions: Permission[]
  isSystem: boolean
  userCount: number
  createdAt: Date
  updatedAt: Date
}

export interface Permission {
  id: string
  name: string
  description: string
  resource: string
  action: string
  scope: 'global' | 'department' | 'personal'
  category: PermissionCategory
  isSystem: boolean
}

export type PermissionCategory = 
  | 'users'
  | 'roles'
  | 'leads'
  | 'campaigns'
  | 'analytics'
  | 'settings'
  | 'system'
  | 'templates'

// Sistema de roles fijos
export type SystemRoleType = 'admin' | 'supervisor' | 'comercial'

export interface SystemRole {
  id: SystemRoleType
  name: string
  description: string
  color: string
  icon: string
  userCount: number
  permissions: PermissionMatrix
}

// Matriz de permisos
export interface PermissionMatrix {
  [key: string]: boolean
}

export interface PermissionGroup {
  id: string
  name: string
  description: string
  permissions: PermissionItem[]
}

export interface PermissionItem {
  id: string
  name: string
  description: string
  category: PermissionCategory
}

// Asignación de usuarios a roles
export interface UserRoleAssignment {
  userId: string
  roleId: SystemRoleType
  assignedAt: Date
  assignedBy: string
}

export interface RoleAssignmentHistory {
  id: string
  userId: string
  userName: string
  previousRole?: SystemRoleType
  newRole: SystemRoleType
  assignedBy: string
  assignedAt: Date
  reason?: string
}

export interface AdminStats {
  totalUsers: number
  activeUsers: number
  totalRoles: number
  totalPermissions: number
  recentActivity: ActivityLog[]
  userGrowth: {
    current: number
    previous: number
    percentage: number
  }
}

export interface ActivityLog {
  id: string
  userId: string
  userName: string
  action: string
  resource: string
  resourceId?: string
  timestamp: Date
  ipAddress: string
  userAgent: string
  details?: Record<string, any>
}

export interface AdminTab {
  id: string
  label: string
  icon: any
  component: React.ComponentType<any>
  permissions: string[]
  badge?: number
  disabled?: boolean
}

// Hook return types
export interface UseUsersReturn {
  users: User[]
  totalUsers: number
  isLoading: boolean
  error: string | null
  filters: UserFilters
  pagination: PaginationInfo
  // Actions
  fetchUsers: () => Promise<void>
  createUser: (userData: CreateUserInput) => Promise<User>
  updateUser: (id: string, userData: UpdateUserInput) => Promise<User>
  deleteUser: (id: string) => Promise<void>
  toggleUserStatus: (id: string) => Promise<void>
  setFilters: (filters: Partial<UserFilters>) => void
  setPage: (page: number) => void
}

export interface UseRolesReturn {
  roles: Role[]
  totalRoles: number
  isLoading: boolean
  error: string | null
  // Actions
  fetchRoles: () => Promise<void>
  createRole: (roleData: CreateRoleInput) => Promise<Role>
  updateRole: (id: string, roleData: UpdateRoleInput) => Promise<Role>
  deleteRole: (id: string) => Promise<void>
  duplicateRole: (id: string) => Promise<Role>
}

export interface UsePermissionsReturn {
  permissions: Permission[]
  permissionsByCategory: Record<PermissionCategory, Permission[]>
  isLoading: boolean
  error: string | null
  // Actions
  fetchPermissions: () => Promise<void>
  createPermission: (permissionData: CreatePermissionInput) => Promise<Permission>
  updatePermission: (id: string, permissionData: UpdatePermissionInput) => Promise<Permission>
  deletePermission: (id: string) => Promise<void>
}

// Hook para gestión de roles del sistema
export interface UseSystemRolesReturn {
  systemRoles: SystemRole[]
  users: User[]
  isLoading: boolean
  error: string | null
  // Actions
  assignUserToRole: (userId: string, roleId: SystemRoleType) => Promise<void>
  bulkAssignRole: (userIds: string[], roleId: SystemRoleType) => Promise<void>
  getAssignmentHistory: (userId: string) => Promise<RoleAssignmentHistory[]>
}

// Hook para gestión de permisos del sistema
export interface UsePermissionMatrixReturn {
  permissionGroups: PermissionGroup[]
  systemRoles: SystemRole[]
  permissionMatrix: Record<SystemRoleType, PermissionMatrix>
  isLoading: boolean
  error: string | null
  // Actions (solo lectura - los permisos son fijos)
  refreshPermissions: () => Promise<void>
  exportPermissionMatrix: () => void
}

// Input types
export interface CreateUserInput {
  name: string
  email: string
  roleId: string
  department?: string
  phone?: string
  sendWelcomeEmail?: boolean
}

export interface UpdateUserInput {
  name?: string
  email?: string
  roleId?: string
  status?: User['status']
  department?: string
  phone?: string
}

export interface CreateRoleInput {
  name: string
  description: string
  color: string
  permissionIds: string[]
}

export interface UpdateRoleInput {
  name?: string
  description?: string
  color?: string
  permissionIds?: string[]
}

export interface CreatePermissionInput {
  name: string
  description: string
  resource: string
  action: string
  scope: Permission['scope']
  category: PermissionCategory
}

export interface UpdatePermissionInput {
  name?: string
  description?: string
  scope?: Permission['scope']
}

// Filter and pagination types
export interface UserFilters {
  search: string
  status: User['status'] | 'all'
  roleId: string | 'all'
  department: string | 'all'
  sortBy: 'name' | 'email' | 'lastLogin' | 'createdAt'
  sortOrder: 'asc' | 'desc'
}

export interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

// Component props
export interface AdminDashboardProps {
  className?: string
}

export interface UserManagementProps {
  className?: string
}

export interface RoleManagementProps {  
  className?: string
}

export interface PermissionManagementProps {
  className?: string
}

export interface TemplateManagementProps {
  className?: string
} 