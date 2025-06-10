"use client"

import { Search, Users, Mail, History, Home, Zap, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/language-context"
import { useResponsive } from "../hooks/useResponsive"
import type { NavigationProps, NavigationItem } from "../types"

interface DashboardNavigationProps extends NavigationProps {
  className?: string
  compact?: boolean
}

export function DashboardNavigation({ 
  activeTab, 
  onTabChange, 
  searchComplete, 
  selectedLeadsCount,
  className = "",
  compact = false 
}: DashboardNavigationProps) {
  const { t } = useLanguage()
  const { isMobile } = useResponsive()

  const navigationItems: NavigationItem[] = [
    {
      id: "dashboard",
      label: t("nav.dashboard"),
      icon: Home,
      disabled: false,
      badge: null,
    },
    {
      id: "search",
      label: t("nav.search"),
      icon: Search,
      disabled: false,
      badge: null,
      dataOnboarding: "search",
    },
    {
      id: "results",
      label: t("results.title"),
      icon: Users,
      disabled: !searchComplete,
      badge: null,
      dataOnboarding: "results",
    },
    {
      id: "campaign",
      label: t("nav.campaigns"),
      icon: Mail,
      disabled: selectedLeadsCount === 0,
      badge: selectedLeadsCount > 0 ? selectedLeadsCount : null,
      dataOnboarding: "campaigns",
    },
    {
      id: "history",
      label: t("nav.history"),
      icon: History,
      disabled: false,
      badge: null,
      dataOnboarding: "history",
    },
    {
      id: "scraping",
      label: "Scraping",
      icon: Zap,
      disabled: false,
      badge: null,
      dataOnboarding: "scraping",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      disabled: false,
      badge: null,
      dataOnboarding: "analytics",
    },
  ]

  const handleTabChange = (itemId: string) => {
    const item = navigationItems.find(nav => nav.id === itemId)
    if (item && !item.disabled) {
      onTabChange(itemId)
    }
  }

  return (
    <div className={cn(
      "bg-white border border-gray-200 rounded-xl shadow-sm mb-6",
      compact ? "p-1" : "p-2",
      className
    )}>
      <div className={cn(
        "flex items-center space-x-1 overflow-x-auto",
        isMobile ? "justify-start" : "justify-center md:justify-start"
      )}>
        {navigationItems.map((item) => {
          const IconComponent = item.icon
          const isActive = activeTab === item.id
          const isDisabled = item.disabled

          return (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => handleTabChange(item.id)}
              disabled={isDisabled}
              data-onboarding={item.dataOnboarding}
              className={cn(
                "flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-all duration-200 relative group",
                compact ? "min-w-[60px] h-12" : "min-w-[80px] h-16",
                isActive
                  ? "bg-ritter-gold text-ritter-dark shadow-sm scale-105"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:scale-102",
                isDisabled && "opacity-50 cursor-not-allowed hover:bg-transparent hover:text-gray-600 hover:scale-100",
              )}
            >
              <IconComponent className={cn(
                "mb-1 transition-colors",
                compact ? "h-4 w-4" : "h-5 w-5",
                isActive ? "text-ritter-dark" : "text-gray-500"
              )} />
              <span className={cn(
                "font-medium leading-none",
                compact ? "text-[10px]" : "text-xs"
              )}>
                {item.label}
              </span>

              {/* Badge */}
              {item.badge && (
                <div className={cn(
                  "absolute bg-red-500 text-white text-xs rounded-full flex items-center justify-center",
                  compact 
                    ? "-top-0.5 -right-0.5 h-4 w-4" 
                    : "-top-1 -right-1 h-5 w-5"
                )}>
                  {item.badge}
                </div>
              )}

              {/* Active indicator */}
              {isActive && (
                <div className={cn(
                  "absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-ritter-dark rounded-full transition-all",
                  compact ? "w-6 h-0.5" : "w-8 h-0.5"
                )} />
              )}

              {/* Hover effect */}
              {!isDisabled && (
                <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-5 bg-ritter-gold transition-opacity" />
              )}
            </Button>
          )
        })}
      </div>

      {/* Progress indicator for small screens */}
      {isMobile && (
        <div className="flex justify-center mt-2">
          <div className="flex space-x-1">
            {navigationItems.map((item) => (
              <div
                key={`indicator-${item.id}`}
                className={cn(
                  "w-1 h-1 rounded-full transition-colors",
                  activeTab === item.id ? "bg-ritter-gold" : "bg-gray-300"
                )}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
