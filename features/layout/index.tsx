// Layout Feature - RitterFinder Layout System

// Pages
export { LayoutPage, PageContainer, SectionCard } from "./pages/LayoutPage"

// Styles
export { default as LayoutPageStyles } from "./styles/LayoutPage.module.css"

// Components
export { DashboardHeader } from "./components/DashboardHeader"
export { DashboardNavigation } from "./components/DashboardNavigation"
export { Sidebar } from "./components/Sidebar"
export { DashboardLayout } from "./components/DashboardLayout"

// Hooks
export { useLayout } from "./hooks/useLayout"
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
  UseResponsiveReturn
} from "./types"

// Type aliases for external use
export type {
  LayoutNavigationItem,
  LayoutNavigationProps,
  LayoutHeaderProps,
  LayoutSidebarProps,
  LayoutWrapperProps
} from "./types"
