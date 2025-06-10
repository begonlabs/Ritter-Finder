"use client"

import { useState } from "react"
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

export function DashboardHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { t } = useLanguage()

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
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
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-ritter-gold text-ritter-dark text-xs">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>{t("notification.leads")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-auto">
                <DropdownMenuItem className="cursor-pointer">
                  <div className="flex flex-col space-y-1">
                    <span className="font-medium">{t("notification.leads")}</span>
                    <span className="text-xs text-muted-foreground">{t("notification.leads.desc")}</span>
                    <span className="text-xs text-muted-foreground">
                      {t("notification.time.hours").replace("{count}", "2")}
                    </span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <div className="flex flex-col space-y-1">
                    <span className="font-medium">{t("notification.campaign")}</span>
                    <span className="text-xs text-muted-foreground">{t("notification.campaign.desc")}</span>
                    <span className="text-xs text-muted-foreground">{t("notification.time.yesterday")}</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <div className="flex flex-col space-y-1">
                    <span className="font-medium">{t("notification.system")}</span>
                    <span className="text-xs text-muted-foreground">{t("notification.system.desc")}</span>
                    <span className="text-xs text-muted-foreground">
                      {t("notification.time.days").replace("{count}", "3")}
                    </span>
                  </div>
                </DropdownMenuItem>
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
              <DropdownMenuLabel>Usuario Demo</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>{t("nav.profile")}</DropdownMenuItem>
              <DropdownMenuItem>{t("nav.settings")}</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/">{t("nav.logout")}</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
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
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-ritter-gold text-ritter-dark text-xs">
                      3
                    </Badge>
                  </Button>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5 text-gray-600" />
                  </Button>
                </div>
                <Link href="/" className="px-4 py-2 rounded-md hover:bg-gray-100 text-red-500">
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
