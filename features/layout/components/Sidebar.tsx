"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useLayout } from "../hooks/useLayout"
import { useResponsive } from "../hooks/useResponsive"
import type { SidebarProps, SidebarItem } from "../types"
import styles from "../styles/Sidebar.module.css"

interface ModularSidebarProps extends Partial<SidebarProps> {
  className?: string
  variant?: 'default' | 'compact' | 'floating'
  showToggle?: boolean
}

export function Sidebar({
  items = [],
  activeItem,
  onItemClick,
  className = "",
  variant = 'default',
  showToggle = true
}: ModularSidebarProps) {
  const { state, actions } = useLayout()
  const { isMobile } = useResponsive()

  const handleItemClick = (item: SidebarItem) => {
    if (item.disabled) return
    
    if (onItemClick) {
      onItemClick(item)
    } else if (item.onClick) {
      item.onClick()
    }
    
    // Close mobile menu after selection
    if (isMobile && state.mobileMenuOpen) {
      actions.toggleMobileMenu()
    }
  }

  const isFloating = variant === 'floating'
  const isCompact = variant === 'compact' || state.sidebarCollapsed

  const sidebarClasses = cn(
    styles.sidebar,
    state.sidebarCollapsed ? styles.collapsed : styles.expanded,
    isFloating && styles.floating,
    className
  )

  return (
    <aside className={sidebarClasses}>
      {/* Header with toggle */}
      {showToggle && (
        <div className={styles.sidebarHeader}>
          {!state.sidebarCollapsed && (
            <h2 className={styles.sidebarTitle}>
              Navigation
            </h2>
          )}
          <button
            onClick={actions.toggleSidebar}
            className={styles.toggleButton}
          >
            {state.sidebarCollapsed ? (
              <ChevronRight className={styles.toggleIcon} />
            ) : (
              <ChevronLeft className={styles.toggleIcon} />
            )}
          </button>
        </div>
      )}

      {/* Navigation Items */}
      <nav className={styles.navigation}>
        {items.map((item) => {
          const IconComponent = item.icon
          const isActive = activeItem === item.id
          const hasChildren = item.children && item.children.length > 0

          const itemClasses = cn(
            styles.navigationItem,
            isActive && styles.active,
            item.disabled && styles.disabled,
            isCompact && styles.compact
          )

          return (
            <div key={item.id}>
              <button
                onClick={() => handleItemClick(item)}
                disabled={item.disabled}
                className={itemClasses}
              >
                <IconComponent className={cn(
                  styles.navigationIcon,
                  isCompact && styles.compact
                )} />
                
                {!state.sidebarCollapsed && (
                  <>
                    <span className={styles.navigationLabel}>
                      {item.label}
                    </span>
                    
                    {/* Badge */}
                    {item.badge && item.badge > 0 && (
                      <span className={styles.navigationBadge}>
                        {item.badge}
                      </span>
                    )}
                    
                    {/* Chevron for children */}
                    {hasChildren && (
                      <ChevronRight className={styles.navigationChevron} />
                    )}
                  </>
                )}
              </button>

              {/* Children items (only show when not collapsed and has children) */}
              {!state.sidebarCollapsed && hasChildren && (
                <div className={styles.childrenContainer}>
                  {item.children?.map((child) => {
                    const ChildIcon = child.icon
                    const isChildActive = activeItem === child.id

                    const childClasses = cn(
                      styles.childItem,
                      isChildActive && styles.active,
                      child.disabled && styles.disabled
                    )

                    return (
                      <button
                        key={child.id}
                        onClick={() => handleItemClick(child)}
                        disabled={child.disabled}
                        className={childClasses}
                      >
                        <ChildIcon className={styles.childIcon} />
                        <span className={styles.childLabel}>
                          {child.label}
                        </span>
                        
                        {/* Child badge */}
                        {child.badge && child.badge > 0 && (
                          <span className={styles.childBadge}>
                            {child.badge}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      {!state.sidebarCollapsed && (
        <div className={styles.sidebarFooter}>
          <p className={styles.footerText}>
            RitterFinder v1.0
          </p>
        </div>
      )}
    </aside>
  )
}
