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
    <header className={`bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40 ${className}`}>
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Image
            src="/images/ritterlogo.png"
            alt="RitterMor Energy"
            width={150}
            height={60}
            priority
            className="h-auto"
          />
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-3">
          <LanguageSelector />

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative hover:bg-gray-100">
                <Bell className="h-5 w-5 text-gray-600" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-ritter-gold text-ritter-dark text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                Notificaciones
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => state.notifications.forEach(n => !n.read && actions.markNotificationRead(n.id))}
                    className="h-6 text-xs"
                  >
                    Marcar todas
                  </Button>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-auto">
                {state.notifications.length > 0 ? (
                  state.notifications.map((notification) => (
                    <DropdownMenuItem 
                      key={notification.id}
                      className="cursor-pointer"
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex flex-col space-y-1 w-full">
                        <div className="flex items-start justify-between">
                          <span className={`font-medium ${!notification.read ? 'text-ritter-dark' : 'text-gray-600'}`}>
                            {notification.title}
                          </span>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-ritter-gold rounded-full flex-shrink-0 ml-2 mt-1" />
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {notification.description}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(notification.timestamp, { 
                            addSuffix: true, 
                            locale: es 
                          })}
                        </span>
                      </div>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No hay notificaciones
                  </div>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                <User className="h-5 w-5 text-gray-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{state.user?.name || 'Usuario Demo'}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onProfileClick}>
                {t("nav.profile")}
              </DropdownMenuItem>
              <DropdownMenuItem>{t("nav.settings")}</DropdownMenuItem>
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
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-white">
              <div className="flex flex-col space-y-4 mt-8">
                <div className="flex items-center justify-center space-x-4 pb-4 border-b">
                  <LanguageSelector />
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5 text-gray-600" />
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-ritter-gold text-ritter-dark text-xs">
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={onProfileClick}>
                    <User className="h-5 w-5 text-gray-600" />
                  </Button>
                </div>
                <Link 
                  href="/" 
                  className="px-4 py-2 rounded-md hover:bg-gray-100 text-red-500"
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
