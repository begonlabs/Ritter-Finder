"use client"

import { DashboardHeader } from "./DashboardHeader"
import { DashboardNavigation } from "./DashboardNavigation"
import { Sidebar } from "./Sidebar"
import { useLayout } from "../hooks/useLayout"
import { useResponsive } from "../hooks/useResponsive"
import { cn } from "@/lib/utils"
import type { DashboardLayoutProps, SidebarItem } from "../types"
import styles from "../styles/DashboardLayout.module.css"

interface ExtendedDashboardLayoutProps extends DashboardLayoutProps {
  showSidebar?: boolean
  sidebarItems?: SidebarItem[]
  className?: string
  headerProps?: {
    onProfileClick?: () => void
    onNotificationClick?: (notification: any) => void
    [key: string]: unknown
  }
  navigationProps?: Record<string, unknown>
}

export function DashboardLayout({
  children,
  activeTab,
  onTabChange,
  searchComplete,
  selectedLeadsCount,
  user,
  onLogout,
  showSidebar = false,
  sidebarItems = [],
  className = "",
  headerProps = {},
  navigationProps = {}
}: ExtendedDashboardLayoutProps) {
  const { state } = useLayout()
  const { 
    isMobile, 
    isTablet, 
    isDesktop,
    isSmallScreen,
    isMediumScreen,
    isLargeScreen,
    utils,
    windowSize
  } = useResponsive()

  return (
    <div className={cn(
      styles.dashboardLayout, 
      className,
      // Responsive layout classes
      isSmallScreen && styles.mobileLayout,
      isMediumScreen && styles.tabletLayout,
      isLargeScreen && styles.desktopLayout
    )}>
      {/* Header */}
      <DashboardHeader 
        user={user}
        onLogout={onLogout}
        onProfileClick={headerProps.onProfileClick}
        onNotificationClick={headerProps.onNotificationClick}
        {...headerProps}
      />

      <div className={cn(
        styles.layoutContainer,
        utils.getLayoutDirection() === 'column' && styles.stackedLayout
      )}>
        {/* Sidebar (conditional based on screen size) */}
        {showSidebar && utils.shouldShowSidebar() && (
          <Sidebar
            items={sidebarItems}
            activeItem={activeTab}
            onItemClick={(item) => {
              if (item.id && typeof onTabChange === 'function') {
                onTabChange(item.id)
              }
            }}
            className={cn(
              "sticky top-16 h-[calc(100vh-4rem)]",
              state.sidebarCollapsed ? "w-16" : "w-64",
              // Responsive sidebar
              isMediumScreen && state.sidebarCollapsed ? "w-12" : isMediumScreen ? "w-48" : "",
              isLargeScreen && "shadow-lg"
            )}
          />
        )}

        {/* Mobile Navigation Drawer (if needed) */}
        {showSidebar && utils.shouldShowMobileNav() && (
          <div className={cn(
            styles.mobileDrawer,
            state.mobileMenuOpen ? styles.mobileDrawerOpen : styles.mobileDrawerClosed
          )}>
            <Sidebar
              items={sidebarItems}
              activeItem={activeTab}
              onItemClick={(item) => {
                if (item.id && typeof onTabChange === 'function') {
                  onTabChange(item.id)
                }
              }}
              className="w-full h-full"
            />
          </div>
        )}

        {/* Main Content */}
        <main className={cn(
          styles.mainContent,
          showSidebar && utils.shouldShowSidebar() && (state.sidebarCollapsed ? styles.withSidebarCollapsed : styles.withSidebarExpanded),
          // Responsive main content
          isSmallScreen && styles.mobileMain,
          isMediumScreen && styles.tabletMain,
          isLargeScreen && styles.desktopMain
        )}>
          <div className={cn(
            styles.contentContainer,
            utils.getContainerClass(),
            // Responsive container
            isSmallScreen && styles.mobileContainer,
            isMediumScreen && styles.tabletContainer,
            isLargeScreen && styles.desktopContainer
          )}>
            {/* Navigation */}
            <div className={cn(
              styles.navigationSection,
              utils.shouldCollapseNavigation() && styles.collapsedNavigation
            )}>
              <DashboardNavigation
                activeTab={activeTab}
                onTabChange={onTabChange}
                searchComplete={searchComplete}
                selectedLeadsCount={selectedLeadsCount}
                {...navigationProps}
              />
            </div>

            {/* Page Content */}
            <div className={cn(
              styles.pageContent,
              // Responsive spacing
              `gap-[${utils.getSpacing('md')}]`
            )}>
              <div className={cn(
                styles.contentArea,
                // Responsive content area
                utils.shouldStackElements() && styles.stackedContent
              )}>
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 