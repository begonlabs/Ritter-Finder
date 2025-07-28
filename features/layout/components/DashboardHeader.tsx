"use client"

import { Menu, User, UserCircle, LogOut } from "lucide-react"
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
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { LanguageSelector } from "@/components/language-selector"
import { useLanguage } from "@/lib/language-context"
import { useLayout } from "../hooks/useLayout"
import { EmailLimitsIndicator } from "./EmailLimitsIndicator"
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
  className = ""
}: DashboardHeaderProps) {
  const { t } = useLanguage()
  const { state, actions } = useLayout()

  const userStatus = state.user?.status || 'active'

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
          <EmailLimitsIndicator compact />
          <LanguageSelector />

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
              <SheetTitle className="sr-only">
                Menú de navegación móvil
              </SheetTitle>
              <div className={styles.mobileActions}>
                {/* Email Limits for Mobile */}
                <div className={styles.mobileEmailLimits}>
                  <EmailLimitsIndicator compact />
                </div>
                
                <div className={styles.mobileActionGroup}>
                  <LanguageSelector />
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
