import { useState, useEffect } from 'react'
import { Crown, Shield, Briefcase, Users, Search, Mail, BarChart3, Settings, Key } from 'lucide-react'
import type { SystemRole, PermissionGroup, PermissionMatrix } from '../types'

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

export function usePermissionManagement() {
  const [systemRoles, setSystemRoles] = useState<SystemRole[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedGroup, setSelectedGroup] = useState<string>('all')

  // Load system roles
  useEffect(() => {
    const loadSystemRoles = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Simulate API call - replace with actual API
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const roles: SystemRole[] = [
          {
            id: 'admin',
            name: 'Administrador',
            description: 'Acceso completo al sistema',
            color: '#dc2626',
            icon: Crown,
            userCount: 0,
            permissions: rolePermissions.admin
          },
          {
            id: 'supervisor',
            name: 'Supervisor',
            description: 'Gestión de equipos y supervisión',
            color: '#2563eb',
            icon: Shield,
            userCount: 0,
            permissions: rolePermissions.supervisor
          },
          {
            id: 'comercial',
            name: 'Comercial',
            description: 'Gestión de leads y campañas',
            color: '#16a34a',
            icon: Briefcase,
            userCount: 0,
            permissions: rolePermissions.comercial
          }
        ]
        
        setSystemRoles(roles)
      } catch (err) {
        setError('Error al cargar los roles del sistema')
        console.error('Error loading system roles:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadSystemRoles()
  }, [])

  // Filter permissions by group
  const filteredGroups = selectedGroup === 'all' 
    ? permissionGroups 
    : permissionGroups.filter(group => group.id === selectedGroup)

  // Get role icon component
  const getRoleIcon = (roleId: string) => {
    switch (roleId) {
      case 'admin': return Crown
      case 'supervisor': return Shield
      case 'comercial': return Briefcase
      default: return Users
    }
  }

  // Get group icon component
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
  const exportMatrix = async () => {
    try {
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
    } catch (err) {
      console.error('Error exporting matrix:', err)
      throw new Error('Error al exportar la matriz de permisos')
    }
  }

  // Update role user count
  const updateRoleUserCount = async (roleId: string, count: number) => {
    setSystemRoles(prev => 
      prev.map(role => 
        role.id === roleId 
          ? { ...role, userCount: count }
          : role
      )
    )
  }

  // Get permission statistics
  const getPermissionStats = () => {
    const totalPermissions = permissionGroups.reduce((total, group) => total + group.permissions.length, 0)
    const roleStats = systemRoles.map(role => {
      const totalRolePermissions = Object.keys(role.permissions).length
      const activeRolePermissions = Object.values(role.permissions).filter(Boolean).length
      return {
        roleId: role.id,
        roleName: role.name,
        total: totalRolePermissions,
        active: activeRolePermissions,
        percentage: Math.round((activeRolePermissions / totalRolePermissions) * 100)
      }
    })

    return {
      totalPermissions,
      roleStats
    }
  }

  return {
    // State
    systemRoles,
    permissionGroups,
    filteredGroups,
    selectedGroup,
    isLoading,
    error,
    
    // Actions
    setSelectedGroup,
    exportMatrix,
    updateRoleUserCount,
    
    // Utilities
    getRoleIcon,
    getGroupIcon,
    getPermissionStats
  }
} 