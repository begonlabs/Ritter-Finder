"use client"

import { Bell, Menu, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { LanguageSelector } from "@/components/language-selector"
import { useLanguage } from "@/lib/language-context"
import { useLayout } from "../hooks/useLayout"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import type { HeaderProps } from "../types"
import styles from "../styles/DashboardHeader.module.css"

interface DashboardHeaderProps extends Partial<HeaderProps> {
  className?: string
}

export function DashboardHeader({ 
  onLogout,
  onProfileClick,
  onNotificationClick,
  className = ""
}: DashboardHeaderProps) {
  const { t } = useLanguage()
  const { state, actions } = useLayout()

  const unreadCount = state.notifications.filter(n => !n.read).length

  const handleNotificationClick = (notification: any) => {
    actions.markNotificationRead(notification.id)
    if (onNotificationClick) {
      onNotificationClick(notification)
    } else if (notification.action) {
      notification.action.onClick()
    }
  }

  return (
    <header className={`${styles.header} ${className}`}>
      <div className={styles.headerContainer}>
        {/* Logo */}
        <div className={styles.logoSection}>
          <Image
            src="/images/ritterlogo.png"
            alt="RitterMor Energy"
            width={150}
            height={60}
            priority
            className={styles.logo}
          />
        </div>

        {/* Desktop Actions */}
        <div className={styles.desktopActions}>
          <LanguageSelector />

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={styles.actionButton}>
                <Bell className={styles.actionIcon} />
                {unreadCount > 0 && (
                  <div className={styles.notificationBadge}>
                    {unreadCount}
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className={styles.dropdownContent}>
              <div className={styles.dropdownHeader}>
                <h3 className={styles.dropdownTitle}>Notificaciones</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={() => state.notifications.forEach(n => !n.read && actions.markNotificationRead(n.id))}
                    className={styles.markAllButton}
                  >
                    Marcar todas
                  </button>
                )}
              </div>
              <DropdownMenuSeparator />
              <div className={styles.notificationList}>
                {state.notifications.length > 0 ? (
                  state.notifications.map((notification) => (
                    <div 
                      key={notification.id}
                      className={styles.notificationItem}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className={styles.notificationHeader}>
                        <span className={`${styles.notificationTitle} ${!notification.read ? styles.unread : ''}`}>
                          {notification.title}
                        </span>
                        {!notification.read && (
                          <div className={styles.unreadIndicator} />
                        )}
                      </div>
                      <p className={styles.notificationDescription}>
                        {notification.description}
                      </p>
                      <p className={styles.notificationTime}>
                        {formatDistanceToNow(notification.timestamp, { 
                          addSuffix: true, 
                          locale: es 
                        })}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className={styles.emptyNotifications}>
                    <p className={styles.emptyNotificationsText}>
                      No hay notificaciones
                    </p>
                  </div>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={styles.actionButton}>
                <User className={styles.actionIcon} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{state.user?.name || 'Usuario Demo'}</DropdownMenuLabel>
              <DropdownMenuItem onClick={onProfileClick}>
                {t("nav.profile")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/" onClick={onLogout}>{t("nav.logout")}</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Sheet open={state.mobileMenuOpen} onOpenChange={actions.toggleMobileMenu}>
            <SheetTrigger asChild>
              <button className={styles.mobileMenuButton}>
                <Menu className={styles.mobileMenuIcon} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className={styles.mobileSidebar}>
              <div className={styles.mobileActions}>
                <div className={styles.mobileActionGroup}>
                  <LanguageSelector />
                  <button className={styles.actionButton}>
                    <Bell className={styles.actionIcon} />
                    {unreadCount > 0 && (
                      <div className={styles.notificationBadge}>
                        {unreadCount}
                      </div>
                    )}
                  </button>
                  <button className={styles.actionButton} onClick={onProfileClick}>
                    <User className={styles.actionIcon} />
                  </button>
                </div>
                <Link 
                  href="/" 
                  className={styles.mobileLogoutLink}
                  onClick={onLogout}
                >
                  {t("nav.logout")}
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
