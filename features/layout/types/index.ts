// Layout Types - RitterFinder Layout System

import { LucideIcon } from "lucide-react"

// User Status from database schema
export type UserStatus = 'invited' | 'active' | 'inactive' | 'suspended' | 'banned' | 'locked'

// Permission categories from database schema
export type PermissionCategory = 'leads' | 'campaigns' | 'analytics' | 'admin' | 'export' | 'settings'

// Enhanced User System Types based on new database schema
export interface Permission {
  id: string
  name: string
  description?: string
  category: PermissionCategory
  resource: string
  action: string
  conditions?: Record<string, any>
}

export interface Role {
  id: string
  name: string
  description?: string
  isSystemRole: boolean
  permissions: Permission[]
  createdAt: Date
  updatedAt: Date
}

export interface UserSession {
  id: string
  sessionToken: string
  createdAt: Date
  lastAccessedAt: Date
  expiresAt: Date
  ipAddress?: string
  userAgent?: string
  deviceType?: string
  browser?: string
  os?: string
  country?: string
  city?: string
  isActive: boolean
}

export interface UserProfile {
  id: string
  email: string
  fullName: string
  avatar?: string
  
  // Status and Role Information
  status: UserStatus
  role: Role
  
  // Authentication Information
  lastLoginAt?: Date
  emailVerifiedAt?: Date
  twoFactorEnabled: boolean
  
  // Invitation System
  invitedBy?: string
  invitedAt?: Date
  passwordSetAt?: Date
  
  // Account Security
  failedLoginAttempts: number
  lockedUntil?: Date
  
  // Current Session
  currentSession?: UserSession
  
  // Timestamps
  createdAt: Date
  updatedAt: Date
}

// Legacy interface for backward compatibility
export interface RoleInfo {
  id: string
  name: string
  displayName: string
  description: string
  level: 'basic' | 'intermediate' | 'advanced' | 'admin'
  permissions: string[]
  color: {
    background: string
    text: string
    border: string
  }
}

// Enhanced Notification System
export interface NotificationItem {
  id: string
  type: 'lead' | 'campaign' | 'system' | 'search' | 'security' | 'user'
  title: string
  message: string
  priority: 0 | 1 | 2 | 3 // 0=low, 1=medium, 2=high, 3=urgent
  
  // Status
  isRead: boolean
  readAt?: Date
  isArchived: boolean
  archivedAt?: Date
  
  // Actions
  actionUrl?: string
  actionText?: string
  actionData?: Record<string, any>
  
  // Related Resources
  relatedType?: string
  relatedId?: string
  
  // Timestamps
  createdAt: Date
  expiresAt?: Date
}

// Navigation interfaces
export interface NavigationItem {
  id: string
  label: string
  icon: LucideIcon
  disabled: boolean
  badge: number | null
  dataOnboarding?: string
  requiredPermissions?: string[] // New: permissions required to access
}

export interface NavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
  searchComplete: boolean
  selectedLeadsCount: number
}

// Enhanced Header Props
export interface HeaderProps {
  user?: UserProfile
  notifications?: NotificationItem[]
  onProfileClick?: () => void
  onNotificationClick?: (notification: NotificationItem) => void
  onLogout?: () => void
  showMobileMenu?: boolean
  onMobileMenuToggle?: () => void
  
  // New security features
  onSecurityAlert?: (alert: SecurityAlert) => void
  showSecurityStatus?: boolean
}

// Security Alert System
export interface SecurityAlert {
  id: string
  type: 'suspicious_activity' | 'new_device' | 'location_change' | 'failed_attempts'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  timestamp: Date
  requiresAction: boolean
  actionUrl?: string
}

// Sidebar interfaces
export interface SidebarItem {
  id: string
  label: string
  icon: LucideIcon
  href?: string
  onClick?: () => void
  disabled?: boolean
  badge?: number
  children?: SidebarItem[]
  requiredPermissions?: string[] // New: permissions required
}

export interface SidebarProps {
  items: SidebarItem[]
  activeItem?: string
  onItemClick?: (item: SidebarItem) => void
  collapsed?: boolean
  onToggle?: () => void
}

// Layout wrapper interfaces
export interface LayoutProps {
  children: React.ReactNode
  header?: React.ReactNode
  sidebar?: React.ReactNode
  navigation?: React.ReactNode
  className?: string
}

export interface DashboardLayoutProps {
  children: React.ReactNode
  activeTab: string
  onTabChange: (tab: string) => void
  searchComplete: boolean
  selectedLeadsCount: number
  user?: UserProfile
  onLogout?: () => void
}

// Theme and responsive interfaces
export interface LayoutTheme {
  mode: 'light' | 'dark'
  primaryColor: string
  secondaryColor: string
  borderRadius: string
}

export interface ResponsiveBreakpoints {
  mobile: number
  tablet: number
  desktop: number
  wide: number
}

// Enhanced Layout State
export interface LayoutState {
  sidebarCollapsed: boolean
  mobileMenuOpen: boolean
  theme: LayoutTheme
  notifications: NotificationItem[]
  user: UserProfile | null
  
  // New security and session management
  securityAlerts: SecurityAlert[]
  sessionExpiryWarning: boolean
  lastActivity: Date
}

export interface LayoutActions {
  toggleSidebar: () => void
  toggleMobileMenu: () => void
  setTheme: (theme: LayoutTheme) => void
  addNotification: (notification: NotificationItem) => void
  markNotificationRead: (id: string) => void
  clearNotifications: () => void
  setUser: (user: UserProfile | null) => void
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>
  
  // New security actions
  addSecurityAlert: (alert: SecurityAlert) => void
  dismissSecurityAlert: (id: string) => void
  updateLastActivity: () => void
  triggerSessionWarning: (show: boolean) => void
}

// Hook return types
export interface UseLayoutReturn {
  state: LayoutState
  actions: LayoutActions
}

export interface UseResponsiveReturn {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  breakpoint: keyof ResponsiveBreakpoints
  width: number
  height: number
}

// Enhanced User Profile Props
export interface UserProfileProps {
  className?: string
  user?: UserProfile
  onProfileUpdate?: (data: any) => void
  onPasswordChange?: (data: any) => void
  onSecuritySettingsChange?: (settings: any) => void
  onSessionManagement?: (action: 'revoke' | 'revoke_all', sessionId?: string) => void
}

// Utility functions types
export interface PermissionChecker {
  hasPermission: (permission: string) => boolean
  hasAnyPermission: (permissions: string[]) => boolean
  hasAllPermissions: (permissions: string[]) => boolean
  canAccessResource: (resource: string, action: string) => boolean
}

// Export utility types for external use
export type {
  NavigationItem as LayoutNavigationItem,
  NavigationProps as LayoutNavigationProps,
  HeaderProps as LayoutHeaderProps,
  SidebarProps as LayoutSidebarProps,
  LayoutProps as LayoutWrapperProps,
  UserProfile as LayoutUserProfile,
  Permission as LayoutPermission,
  Role as LayoutRole
}
