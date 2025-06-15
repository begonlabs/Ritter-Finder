"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Users, 
  Shield, 
  Key, 
  Settings, 
  Activity, 
  RefreshCw,
  TrendingUp,
  UserCheck,
  Clock,
  Mail
} from "lucide-react"
import { useAdmin } from "../hooks/useAdmin"
import type { AdminDashboardProps, AdminTab } from "../types"
import styles from "../styles/AdminDashboard.module.css"

// Import real components
import { UserManagement } from "./UserManagement"
import { RoleManagement } from "./RoleManagement"
import { PermissionManagement } from "./PermissionManagement"
import { TemplateManagement } from "./TemplateManagement"
import { SystemSettings } from "./SystemSettings"

export function AdminDashboard({ className = "" }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const {
    stats,
    isLoadingStats,
    recentActivity,
    refreshStats,
    formatActivityMessage,
    getActivityIcon,
    getActivityColor,
    lastUpdated
  } = useAdmin()

  // Configurable admin tabs - easy to extend
  const adminTabs: AdminTab[] = [
    {
      id: "overview",
      label: "Vista General",
      icon: Activity,
      component: () => <AdminOverview />,
      permissions: ["admin.overview"],
    },
    {
      id: "users",
      label: "Usuarios",
      icon: Users,
      component: UserManagement,
      permissions: ["admin.users.view"],
      badge: stats.totalUsers,
    },
    {
      id: "roles",
      label: "Roles",
      icon: Shield,
      component: RoleManagement,
      permissions: ["admin.roles.view"],
      badge: stats.totalRoles,
    },
    {
      id: "permissions",
      label: "Permisos",
      icon: Key,
      component: PermissionManagement,
      permissions: ["admin.permissions.view"],
      badge: stats.totalPermissions,
    },
    {
      id: "templates",
      label: "Plantillas",
      icon: Mail,
      component: TemplateManagement,
      permissions: ["admin.templates.view"],
    },
    {
      id: "settings",
      label: "Configuración",
      icon: Settings,
      component: SystemSettings,
      permissions: ["admin.settings"],
      disabled: false, // Now enabled!
    },
  ]

  // Overview component
  function AdminOverview() {
    return (
      <div className={`${styles.overviewGrid} space-y-6`}>
        {/* Stats Cards */}
        <div className={`${styles.statsGrid} grid gap-4 md:grid-cols-2 lg:grid-cols-4`}>
          <Card className={`${styles.statCard} border-0 shadow-sm hover:shadow-md transition-shadow`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
              <Users className="h-4 w-4 text-ritter-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{stats.userGrowth.percentage}% vs mes anterior
              </div>
            </CardContent>
          </Card>

          <Card className={`${styles.statCard} border-0 shadow-sm hover:shadow-md transition-shadow`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeUsers}</div>
              <div className="text-xs text-muted-foreground">
                {Math.round((stats.activeUsers / stats.totalUsers) * 100)}% del total
              </div>
            </CardContent>
          </Card>

          <Card className={`${styles.statCard} border-0 shadow-sm hover:shadow-md transition-shadow`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Roles Definidos</CardTitle>
              <Shield className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRoles}</div>
              <div className="text-xs text-muted-foreground">
                Roles del sistema configurados
              </div>
            </CardContent>
          </Card>

          <Card className={`${styles.statCard} border-0 shadow-sm hover:shadow-md transition-shadow`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Permisos</CardTitle>
              <Key className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPermissions}</div>
              <div className="text-xs text-muted-foreground">
                Permisos disponibles
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className={`${styles.activityCard} border-0 shadow-sm`}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-ritter-gold" />
              Actividad Reciente
            </CardTitle>
            <div className="flex items-center gap-2">
              {lastUpdated && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <Clock className="h-3 w-3 mr-1" />
                  Actualizado hace {Math.floor((Date.now() - lastUpdated.getTime()) / (1000 * 60))} min
                </Badge>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={refreshStats}
                disabled={isLoadingStats}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isLoadingStats ? 'animate-spin' : ''}`} />
                Actualizar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className={`${styles.activityList} space-y-3`}>
              {recentActivity.length > 0 ? (
                recentActivity.slice(0, 8).map((activity) => (
                  <div key={activity.id} className={`${styles.activityItem} flex items-start gap-3 p-3 bg-gray-50 rounded-lg`}>
                    <div className={`${styles.activityIcon} text-lg`}>
                      {getActivityIcon(activity.action)}
                    </div>
                    <div className={`${styles.activityContent} flex-1 min-w-0`}>
                      <p className={`${styles.activityMessage} text-sm font-medium`}>
                        {formatActivityMessage(activity)}
                      </p>
                      <div className={`${styles.activityMeta} flex items-center gap-2 text-xs text-muted-foreground mt-1`}>
                        <span>{activity.timestamp.toLocaleString()}</span>
                        <Badge 
                          variant="outline" 
                          className={`${styles.activityBadge} text-xs ${getActivityColor(activity.action)}`}
                        >
                          {activity.resource}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className={`${styles.emptyActivity} text-center py-8 text-muted-foreground`}>
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No hay actividad reciente</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }



  const activeTabData = adminTabs.find(tab => tab.id === activeTab)
  const ActiveComponent = activeTabData?.component || AdminOverview

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
            Gestiona usuarios, roles, permisos y configuración del sistema
          </p>
        </div>
      </div>

      {/* Admin Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className={styles.adminTabs}>
        <TabsList className={`${styles.tabsList} grid w-full grid-cols-5 lg:w-fit lg:grid-cols-none lg:flex`}>
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