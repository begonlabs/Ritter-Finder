"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  Key,
  Check,
  X,
  Shield,
  Crown,
  Briefcase,
  Users,
  Search,
  Mail,
  BarChart3,
  Settings,
  FileText,
  Database,
  Download,
  Info
} from "lucide-react"
import type { PermissionManagementProps, SystemRole, PermissionGroup, PermissionMatrix } from "../types"
import styles from "../styles/PermissionManagement.module.css"

// Grupos de permisos del sistema
const permissionGroups: PermissionGroup[] = [
  {
    id: 'leads',
    name: 'Gestión de Leads',
    description: 'Búsqueda, visualización y gestión de leads',
    permissions: [
      { id: 'leads.view', name: 'Ver leads', description: 'Visualizar leads en el dashboard', category: 'leads' },
      { id: 'leads.search', name: 'Buscar leads', description: 'Realizar búsquedas de leads', category: 'leads' },
      { id: 'leads.export', name: 'Exportar leads', description: 'Descargar leads en diferentes formatos', category: 'leads' },
      { id: 'leads.advanced_search', name: 'Búsqueda avanzada', description: 'Acceso a filtros avanzados', category: 'leads' }
    ]
  },
  {
    id: 'campaigns',
    name: 'Campañas de Email',
    description: 'Creación y gestión de campañas de marketing',
    permissions: [
      { id: 'campaigns.view', name: 'Ver campañas', description: 'Visualizar campañas existentes', category: 'campaigns' },
      { id: 'campaigns.create', name: 'Crear campañas', description: 'Crear nuevas campañas de email', category: 'campaigns' },
      { id: 'campaigns.edit', name: 'Editar campañas', description: 'Modificar campañas existentes', category: 'campaigns' },
      { id: 'campaigns.delete', name: 'Eliminar campañas', description: 'Eliminar campañas del sistema', category: 'campaigns' },
      { id: 'campaigns.send', name: 'Enviar campañas', description: 'Ejecutar campañas de email', category: 'campaigns' }
    ]
  },
  {
    id: 'analytics',
    name: 'Analytics e Informes',
    description: 'Análisis de datos y reportes del sistema',
    permissions: [
      { id: 'analytics.view', name: 'Ver analytics', description: 'Acceso al dashboard de analytics', category: 'analytics' },
      { id: 'analytics.advanced', name: 'Analytics avanzado', description: 'Métricas y análisis detallados', category: 'analytics' },
      { id: 'analytics.export', name: 'Exportar reportes', description: 'Descargar informes y reportes', category: 'analytics' },
      { id: 'analytics.history', name: 'Historial completo', description: 'Acceso a todo el historial de actividad', category: 'analytics' }
    ]
  },
  {
    id: 'users',
    name: 'Gestión de Usuarios',
    description: 'Administración de usuarios y equipos',
    permissions: [
      { id: 'users.view', name: 'Ver usuarios', description: 'Visualizar lista de usuarios', category: 'users' },
      { id: 'users.create', name: 'Crear usuarios', description: 'Añadir nuevos usuarios al sistema', category: 'users' },
      { id: 'users.edit', name: 'Editar usuarios', description: 'Modificar información de usuarios', category: 'users' },
      { id: 'users.delete', name: 'Eliminar usuarios', description: 'Eliminar usuarios del sistema', category: 'users' },
      { id: 'users.roles', name: 'Gestionar roles', description: 'Asignar y cambiar roles de usuarios', category: 'users' }
    ]
  },
  {
    id: 'system',
    name: 'Configuración del Sistema',
    description: 'Configuraciones generales y administración',
    permissions: [
      { id: 'system.settings', name: 'Configuración general', description: 'Acceso a configuraciones del sistema', category: 'system' },
      { id: 'system.templates', name: 'Gestionar plantillas', description: 'Crear y editar plantillas de email', category: 'templates' },
      { id: 'system.backup', name: 'Backup y restauración', description: 'Realizar backups del sistema', category: 'system' },
      { id: 'system.logs', name: 'Ver logs del sistema', description: 'Acceso a logs de actividad', category: 'system' }
    ]
  }
]

// Matriz de permisos por rol
const rolePermissions: Record<string, PermissionMatrix> = {
  admin: {
    // Leads
    'leads.view': true,
    'leads.search': true,
    'leads.export': true,
    'leads.advanced_search': true,
    // Campaigns
    'campaigns.view': true,
    'campaigns.create': true,
    'campaigns.edit': true,
    'campaigns.delete': true,
    'campaigns.send': true,
    // Analytics
    'analytics.view': true,
    'analytics.advanced': true,
    'analytics.export': true,
    'analytics.history': true,
    // Users
    'users.view': true,
    'users.create': true,
    'users.edit': true,
    'users.delete': true,
    'users.roles': true,
    // System
    'system.settings': true,
    'system.templates': true,
    'system.backup': true,
    'system.logs': true
  },
  supervisor: {
    // Leads
    'leads.view': true,
    'leads.search': true,
    'leads.export': true,
    'leads.advanced_search': true,
    // Campaigns
    'campaigns.view': true,
    'campaigns.create': true,
    'campaigns.edit': true,
    'campaigns.delete': false,
    'campaigns.send': true,
    // Analytics
    'analytics.view': true,
    'analytics.advanced': true,
    'analytics.export': true,
    'analytics.history': true,
    // Users
    'users.view': true,
    'users.create': false,
    'users.edit': true,
    'users.delete': false,
    'users.roles': false,
    // System
    'system.settings': false,
    'system.templates': true,
    'system.backup': false,
    'system.logs': true
  },
  comercial: {
    // Leads
    'leads.view': true,
    'leads.search': true,
    'leads.export': true,
    'leads.advanced_search': false,
    // Campaigns
    'campaigns.view': true,
    'campaigns.create': true,
    'campaigns.edit': true,
    'campaigns.delete': false,
    'campaigns.send': true,
    // Analytics
    'analytics.view': true,
    'analytics.advanced': false,
    'analytics.export': false,
    'analytics.history': false,
    // Users
    'users.view': false,
    'users.create': false,
    'users.edit': false,
    'users.delete': false,
    'users.roles': false,
    // System
    'system.settings': false,
    'system.templates': false,
    'system.backup': false,
    'system.logs': false
  }
}

// Roles del sistema
const systemRoles: SystemRole[] = [
  {
    id: 'admin',
    name: 'Administrador',
    description: 'Acceso completo al sistema',
    color: '#dc2626',
    icon: 'Crown',
    userCount: 2,
    permissions: rolePermissions.admin
  },
  {
    id: 'supervisor',
    name: 'Supervisor',
    description: 'Gestión de equipos y supervisión',
    color: '#2563eb',
    icon: 'Shield',
    userCount: 5,
    permissions: rolePermissions.supervisor
  },
  {
    id: 'comercial',
    name: 'Comercial',
    description: 'Gestión de leads y campañas',
    color: '#16a34a',
    icon: 'Briefcase',
    userCount: 12,
    permissions: rolePermissions.comercial
  }
]

export function PermissionManagement({ className = "" }: PermissionManagementProps) {
  const [selectedGroup, setSelectedGroup] = useState<string>('all')

  // Filter permissions by group
  const filteredGroups = selectedGroup === 'all' 
    ? permissionGroups 
    : permissionGroups.filter(group => group.id === selectedGroup)

  // Get role icon
  const getRoleIcon = (roleId: string) => {
    switch (roleId) {
      case 'admin': return Crown
      case 'supervisor': return Shield
      case 'comercial': return Briefcase
      default: return Users
    }
  }

  // Get group icon
  const getGroupIcon = (groupId: string) => {
    switch (groupId) {
      case 'leads': return Search
      case 'campaigns': return Mail
      case 'analytics': return BarChart3
      case 'users': return Users
      case 'system': return Settings
      default: return Key
    }
  }

  // Export permission matrix
  const exportMatrix = () => {
    const data = {
      roles: systemRoles.map(role => ({
        id: role.id,
        name: role.name,
        permissions: role.permissions
      })),
      groups: permissionGroups,
      exportedAt: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'permission-matrix.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className={`${styles.permissionManagement} ${className} space-y-6`}>
      {/* Header */}
      <div className={styles.permissionHeader}>
        <div>
          <h2 className={styles.permissionTitle}>
            <Key className="h-6 w-6 text-ritter-gold" />
            Matriz de Permisos
          </h2>
          <p className={styles.permissionDescription}>
            Visualiza los permisos asignados a cada rol del sistema. Los permisos son fijos y no pueden ser modificados.
          </p>
        </div>
        <Button onClick={exportMatrix} className={styles.exportButton}>
          <Download className="h-4 w-4 mr-2" />
          Exportar Matriz
        </Button>
      </div>

      {/* Roles Overview */}
      <div className={styles.rolesOverview}>
        <h3 className={styles.sectionTitle}>Roles del Sistema</h3>
        <div className={styles.rolesGrid}>
          {systemRoles.map((role) => {
            const IconComponent = getRoleIcon(role.id)
            const totalPermissions = Object.keys(role.permissions).length
            const activePermissions = Object.values(role.permissions).filter(Boolean).length
            
            return (
              <Card key={role.id} className={styles.roleOverviewCard}>
                <CardContent className="pt-6">
                  <div className={styles.roleOverviewContent}>
                    <div className={styles.roleIconContainer} style={{ backgroundColor: `${role.color}15` }}>
                      <IconComponent 
                        className={styles.roleIcon} 
                        style={{ color: role.color }}
                      />
                    </div>
                    <div className={styles.roleOverviewInfo}>
                      <h4 className={styles.roleOverviewName}>{role.name}</h4>
                      <p className={styles.roleOverviewDesc}>{role.description}</p>
                      <div className={styles.roleOverviewStats}>
                        <Badge variant="outline" className={styles.permissionBadge}>
                          {activePermissions}/{totalPermissions} permisos
                        </Badge>
                        <Badge 
                          variant="outline" 
                          style={{ borderColor: role.color, color: role.color }}
                        >
                          {role.userCount} usuarios
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Permission Groups Filter */}
      <div className={styles.filtersSection}>
        <div className={styles.groupFilters}>
          <Button
            variant={selectedGroup === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedGroup('all')}
            className={styles.filterButton}
          >
            Todos los permisos
          </Button>
          {permissionGroups.map((group) => {
            const IconComponent = getGroupIcon(group.id)
            return (
              <Button
                key={group.id}
                variant={selectedGroup === group.id ? 'default' : 'outline'}
                onClick={() => setSelectedGroup(group.id)}
                className={styles.filterButton}
              >
                <IconComponent className="h-4 w-4 mr-2" />
                {group.name}
              </Button>
            )
          })}
        </div>
      </div>

      {/* Permission Matrix */}
      <Card className={styles.matrixCard}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Matriz de Permisos
            <Badge variant="secondary" className="ml-2">
              Solo lectura
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={styles.matrixContainer}>
            {filteredGroups.map((group) => {
              const GroupIcon = getGroupIcon(group.id)
              return (
                <div key={group.id} className={styles.permissionGroup}>
                  <div className={styles.groupHeader}>
                    <div className={styles.groupTitleContainer}>
                      <GroupIcon className={styles.groupIcon} />
                      <div>
                        <h4 className={styles.groupTitle}>{group.name}</h4>
                        <p className={styles.groupDescription}>{group.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className={styles.permissionsTable}>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className={styles.permissionNameHeader}>Permiso</TableHead>
                          {systemRoles.map((role) => {
                            const IconComponent = getRoleIcon(role.id)
                            return (
                              <TableHead key={role.id} className={styles.roleHeader}>
                                <div className={styles.roleHeaderContent}>
                                  <IconComponent 
                                    className="h-4 w-4" 
                                    style={{ color: role.color }}
                                  />
                                  <span>{role.name}</span>
                                </div>
                              </TableHead>
                            )
                          })}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {group.permissions.map((permission) => (
                          <TableRow key={permission.id} className={styles.permissionRow}>
                            <TableCell className={styles.permissionNameCell}>
                              <div className={styles.permissionInfo}>
                                <div className={styles.permissionName}>{permission.name}</div>
                                <div className={styles.permissionDesc}>{permission.description}</div>
                              </div>
                            </TableCell>
                            {systemRoles.map((role) => {
                              const hasPermission = role.permissions[permission.id]
                              return (
                                <TableCell key={`${role.id}-${permission.id}`} className={styles.permissionCell}>
                                  <div className={styles.permissionStatus}>
                                    {hasPermission ? (
                                      <div className={styles.permissionGranted}>
                                        <Check className="h-4 w-4" />
                                        <span className="sr-only">Permitido</span>
                                      </div>
                                    ) : (
                                      <div className={styles.permissionDenied}>
                                        <X className="h-4 w-4" />
                                        <span className="sr-only">Denegado</span>
                                      </div>
                                    )}
                                  </div>
                                </TableCell>
                              )
                            })}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div className={styles.matrixLegend}>
            <div className={styles.legendTitle}>
              <Info className="h-4 w-4" />
              Leyenda
            </div>
            <div className={styles.legendItems}>
              <div className={styles.legendItem}>
                <div className={styles.permissionGranted}>
                  <Check className="h-4 w-4" />
                </div>
                <span>Permiso concedido</span>
              </div>
              <div className={styles.legendItem}>
                <div className={styles.permissionDenied}>
                  <X className="h-4 w-4" />
                </div>
                <span>Permiso denegado</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 