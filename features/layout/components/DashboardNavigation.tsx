"use client"

import { Search, Users, Mail, History, Home, Zap, BarChart3, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/language-context"
import { useResponsive } from "../hooks/useResponsive"
import type { NavigationProps, NavigationItem } from "../types"
import styles from "../styles/DashboardNavigation.module.css"

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
    {
      id: "admin",
      label: "Admin",
      icon: Shield,
      disabled: false,
      badge: null,
      dataOnboarding: "admin",
    },
  ]

  const handleTabChange = (itemId: string) => {
    const item = navigationItems.find(nav => nav.id === itemId)
    if (item && !item.disabled) {
      onTabChange(itemId)
    }
  }

  const containerClasses = cn(
    styles.navigationContainer,
    compact ? styles.compact : styles.normal,
    className
  )

  const wrapperClasses = cn(
    styles.navigationWrapper,
    isMobile ? styles.mobile : styles.desktop
  )

  return (
    <div className={containerClasses}>
      <div className={wrapperClasses}>
        {navigationItems.map((item) => {
          const IconComponent = item.icon
          const isActive = activeTab === item.id
          const isDisabled = item.disabled

          const itemClasses = cn(
            styles.navigationItem,
            compact ? styles.compact : styles.normal,
            isActive ? styles.active : styles.inactive,
            isDisabled && styles.disabled
          )

          return (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              disabled={isDisabled}
              data-onboarding={item.dataOnboarding}
              className={itemClasses}
            >
              <IconComponent className={cn(
                styles.navigationIcon,
                compact ? styles.compact : styles.normal
              )} />
              <span className={cn(
                styles.navigationLabel,
                compact ? styles.compact : styles.normal
              )}>
                {item.label}
              </span>

              {/* Badge */}
              {item.badge && (
                <div className={cn(
                  styles.navigationBadge,
                  compact ? styles.compact : styles.normal
                )}>
                  {item.badge}
                </div>
              )}

              {/* Active indicator */}
              {isActive && (
                <div className={cn(
                  styles.activeIndicator,
                  compact ? styles.compact : styles.normal
                )} />
              )}

              {/* Hover effect */}
              {!isDisabled && (
                <div className={styles.hoverEffect} />
              )}
            </button>
          )
        })}
      </div>

      {/* Progress indicator for small screens */}
      {isMobile && (
        <div className={styles.progressIndicator}>
          <div className={styles.progressDots}>
            {navigationItems.map((item) => (
              <div
                key={`indicator-${item.id}`}
                className={cn(
                  styles.progressDot,
                  activeTab === item.id ? styles.active : styles.inactive
                )}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
