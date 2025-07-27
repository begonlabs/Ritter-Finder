"use client"

import { Search, Users, Mail, History, Home, Zap, BarChart3, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/language-context"
import { useResponsive } from "../hooks/useResponsive"
import { useNavigation } from "../hooks/useNavigation"
import { useLayout } from "../hooks/useLayout"
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
  const { 
    isMobile, 
    isSmallScreen, 
    isMediumScreen, 
    isLargeScreen,
    utils 
  } = useResponsive()
  const { state } = useLayout()
  
  // Use the new navigation hook with permissions
  const { navigationItems, hasAccess, permissionChecker } = useNavigation({
    user: state.user,
    activeTab,
    searchComplete,
    selectedLeadsCount
  })

  const handleTabChange = (itemId: string) => {
    const item = navigationItems.find(nav => nav.id === itemId)
    if (item && !item.disabled && hasAccess(itemId)) {
      onTabChange(itemId)
    }
  }

  // Determine if we should show icons only, text only, or both
  const showIconsOnly = isSmallScreen || (compact && isMediumScreen)
  const showFullLabels = isLargeScreen && !compact
  const shouldCollapse = utils.shouldCollapseNavigation()

  const containerClasses = cn(
    styles.navigationContainer,
    compact ? styles.compact : styles.normal,
    className,
    isSmallScreen && styles.mobile,
    isMediumScreen && styles.tablet,
    isLargeScreen && styles.desktop,
    showIconsOnly && styles.iconsOnly,
    shouldCollapse && styles.collapsed
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
          const isDisabled = item.disabled || !hasAccess(item.id)
          const hasPermissions = hasAccess(item.id)

          const itemClasses = cn(
            styles.navigationItem,
            compact ? styles.compact : styles.normal,
            isActive ? styles.active : styles.inactive,
            isDisabled && styles.disabled,
            !hasPermissions && styles.unauthorized,
            // Responsive classes
            isSmallScreen && styles.itemMobile,
            isMediumScreen && styles.itemTablet,
            isLargeScreen && styles.itemDesktop,
            showIconsOnly && styles.itemIconOnly
          )

          return (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              disabled={isDisabled}
              data-onboarding={item.dataOnboarding}
              className={itemClasses}
              title={!hasPermissions ? 'No tienes permisos para acceder a esta sección' : item.label}
            >
              <IconComponent className={cn(
                styles.navigationIcon,
                compact ? styles.compact : styles.normal,
                isSmallScreen && styles.iconMobile,
                isMediumScreen && styles.iconTablet,
                isLargeScreen && styles.iconDesktop
              )} />
              {!showIconsOnly && (
              <span className={cn(
                styles.navigationLabel,
                  compact ? styles.compact : styles.normal,
                  isSmallScreen && styles.labelMobile,
                  isMediumScreen && styles.labelTablet,
                  isLargeScreen && styles.labelDesktop,
                  utils.getTextSize('sm')
              )}>
                {item.label}
              </span>
              )}

              {/* Badge */}
              {item.badge && hasPermissions && (!showIconsOnly || isLargeScreen) && (
                <div className={cn(
                  styles.navigationBadge,
                  compact ? styles.compact : styles.normal,
                  isSmallScreen && styles.badgeMobile,
                  isMediumScreen && styles.badgeTablet,
                  isLargeScreen && styles.badgeDesktop
                )}>
                  {item.badge}
                </div>
              )}

              {/* Permissions indicator for development/admin */}
              {state.user?.role.name === 'Admin' && item.requiredPermissions && item.requiredPermissions.length > 0 && (
                <div className={styles.permissionsIndicator} title={`Requiere: ${item.requiredPermissions.join(', ')}`}>
                  🔐
                </div>
              )}

              {/* Active indicator */}
              {isActive && hasPermissions && (
                <div className={cn(
                  styles.activeIndicator,
                  compact ? styles.compact : styles.normal
                )} />
              )}

              {/* Hover effect */}
              {!isDisabled && hasPermissions && (
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
                  activeTab === item.id ? styles.active : styles.inactive,
                  !hasAccess(item.id) && styles.unauthorized
                )}
              />
            ))}
          </div>
        </div>
      )}

      {/* User permissions summary for development */}
      {process.env.NODE_ENV === 'development' && state.user && (
        <div className={styles.devPermissionsSummary}>
          <details className={styles.devDetails}>
            <summary>🔑 Permisos de {state.user.fullName}</summary>
            <div className={styles.devPermissionsList}>
              <p><strong>Rol:</strong> {state.user.role.name}</p>
              <p><strong>Estado:</strong> {state.user.status}</p>
              <p><strong>Permisos disponibles:</strong></p>
              <ul>
                {state.user.role.permissions.map(permission => (
                  <li key={permission.id}>
                    {permission.name} - {permission.description}
                  </li>
                ))}
              </ul>
            </div>
          </details>
        </div>
      )}
    </div>
  )
}
