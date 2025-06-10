"use client"

import { DashboardHeader } from "./DashboardHeader"
import { DashboardNavigation } from "./DashboardNavigation"
import { Sidebar } from "./Sidebar"
import { useLayout } from "../hooks/useLayout"
import { useResponsive } from "../hooks/useResponsive"
import { cn } from "@/lib/utils"
import type { DashboardLayoutProps, SidebarItem } from "../types"

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
    <div className={cn("min-h-screen bg-gradient-to-br from-gray-50 to-gray-100", className)}>
      {/* Header */}
      <DashboardHeader 
        user={user}
        onLogout={onLogout}
        {...headerProps}
      />

      <div className="flex">
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
          "flex-1 transition-all duration-300",
          showSidebar && !isMobile && (state.sidebarCollapsed ? "ml-0" : "ml-0"),
          "container mx-auto py-6 px-4"
        )}>
          {/* Navigation */}
          <DashboardNavigation
            activeTab={activeTab}
            onTabChange={onTabChange}
            searchComplete={searchComplete}
            selectedLeadsCount={selectedLeadsCount}
            {...navigationProps}
          />

          {/* Page Content */}
          <div className="space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
} 