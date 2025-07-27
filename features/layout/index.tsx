// Layout Feature - RitterFinder Layout System

// Pages
export { LayoutPage, PageContainer, SectionCard } from "./pages/LayoutPage"
export { ProfilePage, UserProfilePage } from "./pages/ProfilePage"

// Styles
export { default as LayoutPageStyles } from "./styles/LayoutPage.module.css"
export { default as SidebarStyles } from "./styles/Sidebar.module.css"
export { default as DashboardNavigationStyles } from "./styles/DashboardNavigation.module.css"
export { default as DashboardLayoutStyles } from "./styles/DashboardLayout.module.css"
export { default as DashboardHeaderStyles } from "./styles/DashboardHeader.module.css"
export { default as UserProfileStyles } from "./styles/UserProfile.module.css"
export { default as EmailLimitsIndicatorStyles } from "./styles/EmailLimitsIndicator.module.css"

// Components
export { DashboardHeader } from "./components/DashboardHeader"
export { DashboardNavigation } from "./components/DashboardNavigation"
export { Sidebar } from "./components/Sidebar"
export { DashboardLayout } from "./components/DashboardLayout"
export { UserProfile as UserProfileComponent } from "./components/UserProfile"
export { EmailLimitsIndicator } from "./components/EmailLimitsIndicator"

// Hooks
export { useLayout } from "./hooks/useLayout"
export { useNavigation } from "./hooks/useNavigation"
export { useResponsive } from "./hooks/useResponsive"

// Types
export type {
  NavigationItem,
  NavigationProps,
  NotificationItem,
  UserProfile,
  HeaderProps,
  SidebarItem,
  SidebarProps,
  LayoutProps,
  DashboardLayoutProps,
  LayoutTheme,
  ResponsiveBreakpoints,
  LayoutState,
  LayoutActions,
  UseLayoutReturn,
  UseResponsiveReturn,
  UserProfileProps,
  PermissionChecker
} from "./types"

// Type aliases for external use
export type {
  LayoutNavigationItem,
  LayoutNavigationProps,
  LayoutHeaderProps,
  LayoutSidebarProps,
  LayoutWrapperProps
} from "./types"
