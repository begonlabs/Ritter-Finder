"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Users, 
  Shield, 
  Mail,
  Database,
  ChevronDown
} from "lucide-react"
import { useResponsive } from "@/features/layout/hooks/useResponsive"
import { cn } from "@/lib/utils"
import type { AdminDashboardProps, AdminTab } from "../types"
import styles from "../styles/AdminDashboard.module.css"

// Import real components
import { UserManagement } from "./UserManagement"
import { RoleManagement } from "./RoleManagement"
import { TemplateManagement } from "./TemplateManagement"
import { LeadImport } from "./LeadImport"

export function AdminDashboard({ className = "" }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("users")
  const { isSmallScreen, isMediumScreen, isLargeScreen, utils } = useResponsive()

  // Configurable admin tabs - easy to extend
  const adminTabs: AdminTab[] = [
    {
      id: "users",
      label: "Usuarios",
      icon: Users,
      component: UserManagement,
      permissions: ["admin.users.view"],
    },
    {
      id: "roles",
      label: "Roles",
      icon: Shield,
      component: RoleManagement,
      permissions: ["admin.roles.view"],
    },
    // {
    //   id: "templates",
    //   label: "Plantillas",
    //   icon: Mail,
    //   component: TemplateManagement,
    //   permissions: ["admin.templates.view"],
    // },
    {
      id: "leads",
      label: "Importar Leads",
      icon: Database,
      component: LeadImport,
      permissions: ["admin.leads.view"],
    },
  ]

  const activeTabData = adminTabs.find(tab => tab.id === activeTab)
  const ActiveComponent = activeTabData?.component || UserManagement

  return (
    <div className={cn(
      styles.adminDashboard,
      isSmallScreen && styles.adminDashboardMobile,
      isMediumScreen && styles.adminDashboardTablet,
      isLargeScreen && styles.adminDashboardDesktop,
      className
    )}>
      {/* Header */}
      <div className={cn(
        styles.adminHeader,
        isSmallScreen && styles.adminHeaderMobile,
        "flex items-center justify-between"
      )}>
        <div>
          <h1 className={cn(
            styles.adminTitle,
            isSmallScreen && styles.adminTitleMobile,
            isMediumScreen && styles.adminTitleTablet,
            "text-3xl font-bold text-gray-900 flex items-center gap-3"
          )}>
            <Shield className={cn(
              "h-8 w-8 text-ritter-gold",
              isSmallScreen && "h-6 w-6"
            )} />
            Dashboard de Administración
          </h1>
          <p className={cn(
            styles.adminDescription,
            isSmallScreen && styles.adminDescriptionMobile,
            "text-gray-600 mt-2"
          )}>
            Gestiona usuarios, roles y configuración del sistema
          </p>
        </div>
      </div>

      {/* Navigation - Conditional rendering */}
      {isSmallScreen ? (
        // Mobile: Dropdown Navigation
        <div className={cn(styles.mobileNavigation)}>
          <Select value={activeTab} onValueChange={setActiveTab}>
            <SelectTrigger className={cn(styles.mobileSelector)}>
              <div className="flex items-center gap-2">
                {(() => {
                  const currentTab = adminTabs.find(tab => tab.id === activeTab)
                  const Icon = currentTab?.icon || Users
                  return (
                    <>
                      <Icon className="h-4 w-4 text-ritter-gold" />
                      <span className="font-medium">{currentTab?.label || 'Seleccionar sección'}</span>
                    </>
                  )
                })()}
              </div>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </SelectTrigger>
            <SelectContent className={cn(styles.mobileSelectorContent)}>
              {adminTabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <SelectItem 
                    key={tab.id} 
                    value={tab.id}
                    disabled={tab.disabled}
                    className={cn(styles.mobileSelectorItem)}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <Icon className="h-4 w-4 text-ritter-gold" />
                      <span className="font-medium">{tab.label}</span>
                      {tab.badge && tab.badge > 0 && (
                        <Badge 
                          variant="secondary" 
                          className="ml-auto h-5 min-w-5 text-xs"
                        >
                          {tab.badge}
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>
      ) : (
        // Tablet/Desktop: Tab Navigation
        <Tabs value={activeTab} onValueChange={setActiveTab} className={cn(
          styles.adminTabs
        )}>
          <TabsList className={cn(
            styles.tabsList,
            isMediumScreen && styles.tabsListTablet,
            isLargeScreen && styles.tabsListDesktop,
            "grid w-full grid-cols-3"
          )}>
            {adminTabs.map((tab) => {
              const Icon = tab.icon
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  disabled={tab.disabled}
                  className={cn(
                    styles.tabsTrigger,
                    isMediumScreen && styles.tabsTriggerTablet,
                    "flex items-center gap-2 relative"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                  {tab.badge && tab.badge > 0 && (
                    <Badge 
                      variant="secondary" 
                      className={cn(
                        styles.tabBadge,
                        "ml-1 h-5 min-w-5 text-xs"
                      )}
                    >
                      {tab.badge}
                    </Badge>
                  )}
                </TabsTrigger>
              )
            })}
          </TabsList>
        </Tabs>
      )}

      {/* Content - Always rendered outside tabs for mobile compatibility */}
      <div className={cn(
        styles.tabsContent,
        isSmallScreen && styles.tabsContentMobile,
        isMediumScreen && styles.tabsContentTablet
      )}>
        <ActiveComponent />
      </div>
    </div>
  )
}