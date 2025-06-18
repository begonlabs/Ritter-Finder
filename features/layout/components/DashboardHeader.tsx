"use client"

import { Bell, Menu, User, UserCircle, LogOut, Shield, AlertTriangle } from "lucide-react"
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
  onSecurityAlert,
  showSecurityStatus = true,
  className = ""
}: DashboardHeaderProps) {
  const { t } = useLanguage()
  const { state, actions } = useLayout()

  const unreadCount = state.notifications.filter(n => !n.isRead).length
  const criticalAlertsCount = state.securityAlerts.filter(a => a.severity === 'critical').length
  const userStatus = state.user?.status || 'active'

  const handleNotificationClick = (notification: any) => {
    actions.markNotificationRead(notification.id)
    if (onNotificationClick) {
      onNotificationClick(notification)
    } else if (notification.actionUrl) {
      window.location.href = notification.actionUrl
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'invited': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'suspended': return 'bg-red-100 text-red-800 border-red-200'
      case 'banned': return 'bg-red-100 text-red-800 border-red-200'
      case 'locked': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activo'
      case 'invited': return 'Invitado'
      case 'inactive': return 'Inactivo'
      case 'suspended': return 'Suspendido'
      case 'banned': return 'Baneado'
      case 'locked': return 'Bloqueado'
      default: return 'Desconocido'
    }
  }

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 3: return 'text-red-600' // urgent
      case 2: return 'text-orange-600' // high
      case 1: return 'text-blue-600' // medium
      default: return 'text-gray-600' // low
    }
  }

  const getPriorityText = (priority: number) => {
    switch (priority) {
      case 3: return 'Urgente'
      case 2: return 'Alta'
      case 1: return 'Media'
      default: return 'Baja'
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

          {/* Security Status */}
          {showSecurityStatus && criticalAlertsCount > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={`${styles.actionButton} ${styles.securityAlert}`}>
                  <Shield className={styles.actionIcon} />
                  <div className={`${styles.notificationBadge} ${styles.criticalBadge}`}>
                    {criticalAlertsCount}
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className={styles.dropdownContent}>
                <div className={styles.dropdownHeader}>
                  <h3 className={styles.dropdownTitle}>Alertas de Seguridad</h3>
                </div>
                <DropdownMenuSeparator />
                <div className={styles.notificationList}>
                  {state.securityAlerts.map((alert) => (
                    <div 
                      key={alert.id}
                      className={`${styles.notificationItem} ${styles.securityAlertItem}`}
                      onClick={() => onSecurityAlert?.(alert)}
                    >
                      <div className={styles.notificationHeader}>
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span className={styles.notificationTitle}>
                          {alert.type === 'new_device' ? 'Nuevo Dispositivo' :
                           alert.type === 'suspicious_activity' ? 'Actividad Sospechosa' :
                           alert.type === 'location_change' ? 'Cambio de Ubicación' :
                           'Intentos Fallidos'}
                        </span>
                        <Badge className={`${styles.severityBadge} severity-${alert.severity}`}>
                          {alert.severity === 'critical' ? 'Crítico' :
                           alert.severity === 'high' ? 'Alto' :
                           alert.severity === 'medium' ? 'Medio' : 'Bajo'}
                        </Badge>
                      </div>
                      <p className={styles.notificationDescription}>
                        {alert.message}
                      </p>
                      <p className={styles.notificationTime}>
                        {formatDistanceToNow(alert.timestamp, { 
                          addSuffix: true, 
                          locale: es 
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

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
                    onClick={() => state.notifications.forEach(n => !n.isRead && actions.markNotificationRead(n.id))}
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
                        <span className={`${styles.notificationTitle} ${!notification.isRead ? styles.unread : ''}`}>
                          {notification.title}
                        </span>
                        <div className={styles.notificationMeta}>
                          <span className={`${styles.priorityBadge} ${getPriorityColor(notification.priority)}`}>
                            {getPriorityText(notification.priority)}
                          </span>
                          {!notification.isRead && (
                            <div className={styles.unreadIndicator} />
                          )}
                        </div>
                      </div>
                      <p className={styles.notificationDescription}>
                        {notification.message}
                      </p>
                      <div className={styles.notificationFooter}>
                        <p className={styles.notificationTime}>
                          {formatDistanceToNow(notification.createdAt, { 
                            addSuffix: true, 
                            locale: es 
                          })}
                        </p>
                        {notification.relatedType && (
                          <Badge variant="outline" className={styles.typeBadge}>
                            {notification.type === 'lead' ? 'Lead' :
                             notification.type === 'campaign' ? 'Campaña' :
                             notification.type === 'system' ? 'Sistema' :
                             notification.type === 'security' ? 'Seguridad' : 'Otro'}
                          </Badge>
                        )}
                      </div>
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
            <DropdownMenuContent align="end" className={styles.userDropdownContent}>
              {/* User Info Header */}
              <div className={styles.userInfoHeader}>
                <div className={styles.userAvatar}>
                  <User className={styles.avatarIcon} />
                </div>
                <div className={styles.userDetails}>
                  <p className={styles.userName}>{state.user?.fullName || 'Usuario Demo'}</p>
                  <p className={styles.userEmail}>{state.user?.email || 'demo@ritterfinder.com'}</p>
                  <div className={styles.userStatusSection}>
                    <Badge className={getStatusColor(userStatus)}>
                      {getStatusText(userStatus)}
                    </Badge>
                    <span className={styles.userRole}>
                      {state.user?.role.name || 'Usuario'}
                    </span>
                  </div>
                </div>
              </div>
              <DropdownMenuSeparator />
              
              {/* Profile Menu Item */}
              <DropdownMenuItem onClick={onProfileClick} className={styles.userMenuItem}>
                <UserCircle className={styles.menuItemIcon} />
                <span>{t("nav.profile")}</span>
              </DropdownMenuItem>

              {/* Security Menu Item */}
              {state.user?.twoFactorEnabled !== undefined && (
                <DropdownMenuItem className={styles.userMenuItem}>
                  <Shield className={styles.menuItemIcon} />
                  <span>Seguridad</span>
                  {state.user.twoFactorEnabled && (
                    <Badge variant="outline" className="ml-auto">2FA</Badge>
                  )}
                </DropdownMenuItem>
              )}
              
              <DropdownMenuSeparator />
              
              {/* Logout Menu Item */}
              <DropdownMenuItem asChild>
                <Link href="/" onClick={onLogout} className={styles.userMenuItemLogout}>
                  <LogOut className={styles.menuItemIcon} />
                  <span>{t("nav.logout")}</span>
                </Link>
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
                  {criticalAlertsCount > 0 && (
                    <button className={`${styles.actionButton} ${styles.securityAlert}`}>
                      <Shield className={styles.actionIcon} />
                      <div className={`${styles.notificationBadge} ${styles.criticalBadge}`}>
                        {criticalAlertsCount}
                      </div>
                    </button>
                  )}
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
