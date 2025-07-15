"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Users, 
  Shield, 
  Mail
} from "lucide-react"
import type { AdminDashboardProps, AdminTab } from "../types"
import styles from "../styles/AdminDashboard.module.css"

// Import real components
import { UserManagement } from "./UserManagement"
import { RoleManagement } from "./RoleManagement"
import { TemplateManagement } from "./TemplateManagement"

export function AdminDashboard({ className = "" }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("users")

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
    {
      id: "templates",
      label: "Plantillas",
      icon: Mail,
      component: TemplateManagement,
      permissions: ["admin.templates.view"],
    },
  ]

  const activeTabData = adminTabs.find(tab => tab.id === activeTab)
  const ActiveComponent = activeTabData?.component || UserManagement

  return (
    <div className={`${styles.adminDashboard} ${className} space-y-6`}>
      {/* Header */}
      <div className={`${styles.adminHeader} flex items-center justify-between`}>
        <div>
          <h1 className={`${styles.adminTitle} text-3xl font-bold text-gray-900 flex items-center gap-3`}>
            <Shield className="h-8 w-8 text-ritter-gold" />
            Dashboard de Administración
          </h1>
          <p className={`${styles.adminDescription} text-gray-600 mt-2`}>
            Gestiona usuarios, roles y configuración del sistema
          </p>
        </div>
      </div>

      {/* Admin Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className={styles.adminTabs}>
        <TabsList className={`${styles.tabsList} grid w-full grid-cols-3 lg:w-fit lg:grid-cols-none lg:flex`}>
          {adminTabs.map((tab) => {
            const Icon = tab.icon
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                disabled={tab.disabled}
                className={`${styles.tabsTrigger} flex items-center gap-2 relative`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                {tab.badge && tab.badge > 0 && (
                  <Badge 
                    variant="secondary" 
                    className={`${styles.tabBadge} ml-1 h-5 min-w-5 text-xs`}
                  >
                    {tab.badge}
                  </Badge>
                )}
              </TabsTrigger>
            )
          })}
        </TabsList>

        {/* Tab Content */}
        {adminTabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className={styles.tabsContent}>
            <ActiveComponent />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}