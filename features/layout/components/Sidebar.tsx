"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useLayout } from "../hooks/useLayout"
import { useResponsive } from "../hooks/useResponsive"
import type { SidebarProps, SidebarItem } from "../types"

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

  const sidebarWidth = state.sidebarCollapsed ? 'w-16' : 'w-64'
  const isFloating = variant === 'floating'
  const isCompact = variant === 'compact' || state.sidebarCollapsed

  return (
    <aside className={cn(
      "flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ease-in-out",
      sidebarWidth,
      isFloating && "m-2 rounded-lg shadow-lg border",
      className
    )}>
      {/* Header with toggle */}
      {showToggle && (
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!state.sidebarCollapsed && (
            <h2 className="text-lg font-semibold text-gray-900">
              Navigation
            </h2>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={actions.toggleSidebar}
            className="h-8 w-8 hover:bg-gray-100"
          >
            {state.sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      )}

      {/* Navigation Items */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const IconComponent = item.icon
          const isActive = activeItem === item.id
          const hasChildren = item.children && item.children.length > 0

          return (
            <div key={item.id}>
              <Button
                variant="ghost"
                onClick={() => handleItemClick(item)}
                disabled={item.disabled}
                className={cn(
                  "w-full justify-start transition-all duration-200",
                  isCompact ? "h-10 px-2" : "h-10 px-3",
                  isActive
                    ? "bg-ritter-gold text-ritter-dark hover:bg-ritter-gold/80"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                  item.disabled && "opacity-50 cursor-not-allowed",
                  state.sidebarCollapsed && "justify-center"
                )}
              >
                <IconComponent className={cn(
                  "flex-shrink-0",
                  isCompact ? "h-4 w-4" : "h-5 w-5",
                  !state.sidebarCollapsed && "mr-3"
                )} />
                
                {!state.sidebarCollapsed && (
                  <>
                    <span className="flex-1 text-left truncate">
                      {item.label}
                    </span>
                    
                    {/* Badge */}
                    {item.badge && item.badge > 0 && (
                      <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-red-500 text-white rounded-full">
                        {item.badge}
                      </span>
                    )}
                    
                    {/* Chevron for children */}
                    {hasChildren && (
                      <ChevronRight className="h-4 w-4 ml-2" />
                    )}
                  </>
                )}
              </Button>

              {/* Children items (only show when not collapsed and has children) */}
              {!state.sidebarCollapsed && hasChildren && (
                <div className="ml-4 mt-1 space-y-1">
                  {item.children?.map((child) => {
                    const ChildIcon = child.icon
                    const isChildActive = activeItem === child.id

                    return (
                      <Button
                        key={child.id}
                        variant="ghost"
                        onClick={() => handleItemClick(child)}
                        disabled={child.disabled}
                        className={cn(
                          "w-full justify-start h-8 px-3 text-sm",
                          isChildActive
                            ? "bg-ritter-gold/20 text-ritter-dark"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-800",
                          child.disabled && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <ChildIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="flex-1 text-left truncate">
                          {child.label}
                        </span>
                        
                        {/* Child badge */}
                        {child.badge && child.badge > 0 && (
                          <span className="ml-2 px-1.5 py-0.5 text-xs font-medium bg-gray-500 text-white rounded-full">
                            {child.badge}
                          </span>
                        )}
                      </Button>
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
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            RitterFinder v1.0
          </div>
        </div>
      )}
    </aside>
  )
}
