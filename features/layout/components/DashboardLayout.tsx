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
  headerProps?: Record<string, unknown>
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
  const { isMobile } = useResponsive()

  return (
    <div className={cn(styles.dashboardLayout, className)}>
      {/* Header */}
      <DashboardHeader 
        user={user}
        onLogout={onLogout}
        {...headerProps}
      />

      <div className={styles.layoutContainer}>
        {/* Sidebar (optional) */}
        {showSidebar && !isMobile && (
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
              state.sidebarCollapsed ? "w-16" : "w-64"
            )}
          />
        )}

        {/* Main Content */}
        <main className={cn(
          styles.mainContent,
          showSidebar && !isMobile && (state.sidebarCollapsed ? styles.withSidebarCollapsed : styles.withSidebarExpanded)
        )}>
          <div className={styles.contentContainer}>
            {/* Navigation */}
            <div className={styles.navigationSection}>
              <DashboardNavigation
                activeTab={activeTab}
                onTabChange={onTabChange}
                searchComplete={searchComplete}
                selectedLeadsCount={selectedLeadsCount}
                {...navigationProps}
              />
            </div>

            {/* Page Content */}
            <div className={styles.pageContent}>
              <div className={styles.contentArea}>
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 