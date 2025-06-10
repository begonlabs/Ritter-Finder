"use client"

import { Search, Users, Mail, History, Home, Zap, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/language-context"

interface NavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
  searchComplete: boolean
  selectedLeadsCount: number
}

export function DashboardNavigation({ activeTab, onTabChange, searchComplete, selectedLeadsCount }: NavigationProps) {
  const { t } = useLanguage()

  const navigationItems = [
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

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-2 mb-6">
      <div className="flex items-center justify-center md:justify-start space-x-1 overflow-x-auto">
        {navigationItems.map((item) => {
          const IconComponent = item.icon
          const isActive = activeTab === item.id
          const isDisabled = item.disabled

          return (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => !isDisabled && onTabChange(item.id)}
              disabled={isDisabled}
              data-onboarding={item.dataOnboarding}
              className={cn(
                "flex flex-col items-center justify-center min-w-[80px] h-16 px-3 py-2 rounded-lg transition-all duration-200 relative group",
                isActive
                  ? "bg-ritter-gold text-ritter-dark shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                isDisabled && "opacity-50 cursor-not-allowed hover:bg-transparent hover:text-gray-600",
              )}
            >
              <IconComponent className={cn("h-5 w-5 mb-1", isActive ? "text-ritter-dark" : "text-gray-500")} />
              <span className="text-xs font-medium leading-none">{item.label}</span>

              {/* Badge */}
              {item.badge && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {item.badge}
                </div>
              )}

              {/* Active indicator */}
              {isActive && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-ritter-dark rounded-full" />
              )}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
