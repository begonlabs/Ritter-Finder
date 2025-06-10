// Layout Types - RitterFinder Layout System

import { LucideIcon } from "lucide-react"

// Navigation interfaces
export interface NavigationItem {
  id: string
  label: string
  icon: LucideIcon
  disabled: boolean
  badge: number | null
  dataOnboarding?: string
}

export interface NavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
  searchComplete: boolean
  selectedLeadsCount: number
}

// Header interfaces
export interface NotificationItem {
  id: string
  type: 'lead' | 'campaign' | 'system'
  title: string
  description: string
  timestamp: Date
  read: boolean
  action?: {
    label: string
    onClick: () => void
  }
}

export interface UserProfile {
  id: string
  name: string
  email: string
  avatar?: string
  role: string
}

export interface HeaderProps {
  user?: UserProfile
  notifications?: NotificationItem[]
  onProfileClick?: () => void
  onNotificationClick?: (notification: NotificationItem) => void
  onLogout?: () => void
  showMobileMenu?: boolean
  onMobileMenuToggle?: () => void
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

// Component state interfaces
export interface LayoutState {
  sidebarCollapsed: boolean
  mobileMenuOpen: boolean
  theme: LayoutTheme
  notifications: NotificationItem[]
  user: UserProfile | null
}

export interface LayoutActions {
  toggleSidebar: () => void
  toggleMobileMenu: () => void
  setTheme: (theme: LayoutTheme) => void
  addNotification: (notification: NotificationItem) => void
  markNotificationRead: (id: string) => void
  clearNotifications: () => void
  setUser: (user: UserProfile | null) => void
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

// Export utility types for external use
export type {
  NavigationItem as LayoutNavigationItem,
  NavigationProps as LayoutNavigationProps,
  HeaderProps as LayoutHeaderProps,
  SidebarProps as LayoutSidebarProps,
  LayoutProps as LayoutWrapperProps
}
