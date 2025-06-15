"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  Shield,
  Search,
  Users,
  Crown,
  UserCheck,
  Briefcase,
  ArrowUpDown,
  History,
  AlertCircle
} from "lucide-react"
import type { RoleManagementProps, SystemRole, User, SystemRoleType } from "../types"
import styles from "../styles/RoleManagement.module.css"

// Roles del sistema predefinidos
const systemRoles: SystemRole[] = [
  {
    id: 'admin',
    name: 'Administrador',
    description: 'Acceso completo al sistema, gestión de usuarios y configuración',
    color: '#dc2626',
    icon: 'Crown',
    userCount: 2,
    permissions: {}
  },
  {
    id: 'supervisor',
    name: 'Supervisor',
    description: 'Gestión de equipos, análisis avanzado y supervisión de campañas',
    color: '#2563eb',
    icon: 'Shield', 
    userCount: 5,
    permissions: {}
  },
  {
    id: 'comercial',
    name: 'Comercial',
    description: 'Gestión de leads, campañas de email y análisis básico',
    color: '#16a34a',
    icon: 'Briefcase',
    userCount: 12,
    permissions: {}
  }
]

// Mock users data
const mockUsers: User[] = [
  {
    id: "1",
    name: "María González",
    email: "maria.gonzalez@ritterfinder.com",
    status: "active",
    role: {
      id: "admin",
      name: "Administrador",
      description: "Acceso completo",
      color: "#dc2626",
      permissions: [],
      isSystem: true,
      userCount: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    permissions: [],
    lastLogin: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    metadata: { loginCount: 245, department: "IT" }
  },
  {
    id: "2",
    name: "Carlos Ruiz",
    email: "carlos.ruiz@ritterfinder.com",
    status: "active",
    role: {
      id: "supervisor",
      name: "Supervisor",
      description: "Gestión de equipos",
      color: "#2563eb",
      permissions: [],
      isSystem: true,
      userCount: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    permissions: [],
    lastLogin: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    metadata: { loginCount: 89, department: "Ventas" }
  },
  {
    id: "3",
    name: "Ana Martínez",
    email: "ana.martinez@ritterfinder.com",
    status: "active",
    role: {
      id: "comercial",
      name: "Comercial",
      description: "Gestión de leads",
      color: "#16a34a",
      permissions: [],
      isSystem: true,
      userCount: 12,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    permissions: [],
    lastLogin: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    metadata: { loginCount: 34, department: "Marketing" }
  }
]

export function RoleManagement({ className = "" }: RoleManagementProps) {
  const [users] = useState<User[]>(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState<SystemRoleType | 'all'>('all')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === 'all' || user.role.id === selectedRole
    
    return matchesSearch && matchesRole
  })

  // Get role icon
  const getRoleIcon = (roleId: string) => {
    switch (roleId) {
      case 'admin': return Crown
      case 'supervisor': return Shield
      case 'comercial': return Briefcase
      default: return Users
    }
  }

  // Handle role assignment
  const handleAssignRole = (userId: string, newRoleId: SystemRoleType) => {
    console.log(`Assigning user ${userId} to role ${newRoleId}`)
    // Aquí iría la lógica para asignar el rol
  }

  // Handle bulk role assignment
  const handleBulkAssign = (roleId: SystemRoleType) => {
    if (selectedUsers.length === 0) return
    console.log(`Bulk assigning ${selectedUsers.length} users to role ${roleId}`)
    setSelectedUsers([])
  }

  return (
    <div className={`${styles.roleManagement} ${className} space-y-6`}>
      {/* Header */}
      <div className={styles.roleHeader}>
        <div>
          <h2 className={styles.roleTitle}>
            <Shield className="h-6 w-6 text-ritter-gold" />
            Gestión de Roles
          </h2>
          <p className={styles.roleDescription}>
            Asigna usuarios a los roles del sistema. Los roles son fijos y no pueden ser modificados.
          </p>
        </div>
      </div>

      {/* System Roles Overview */}
      <div className={styles.rolesGrid}>
        {systemRoles.map((role) => {
          const IconComponent = getRoleIcon(role.id)
          return (
            <Card key={role.id} className={styles.roleCard}>
              <CardContent className="pt-6">
                <div className={styles.roleCardContent}>
                  <div className={styles.roleIconContainer} style={{ backgroundColor: `${role.color}15` }}>
                    <IconComponent 
                      className={styles.roleIcon} 
                      style={{ color: role.color }}
                    />
                  </div>
                  <div className={styles.roleInfo}>
                    <h3 className={styles.roleName}>{role.name}</h3>
                    <p className={styles.roleDescText}>{role.description}</p>
                    <div className={styles.roleStats}>
                      <Badge 
                        variant="outline" 
                        className={styles.userCountBadge}
                        style={{ borderColor: role.color, color: role.color }}
                      >
                        <Users className="h-3 w-3 mr-1" />
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

      {/* User Assignment Section */}
      <Card className={styles.assignmentCard}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Asignación de Usuarios</span>
            {selectedUsers.length > 0 && (
              <div className={styles.bulkActions}>
                <span className="text-sm text-muted-foreground mr-3">
                  {selectedUsers.length} usuarios seleccionados
                </span>
                <Select onValueChange={(value) => handleBulkAssign(value as SystemRoleType)}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Asignar rol masivo" />
                  </SelectTrigger>
                  <SelectContent>
                    {systemRoles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: role.color }}
                          />
                          {role.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className={styles.filtersSection}>
            <div className={styles.searchInputWrapper}>
              <Search className={styles.searchIcon} />
              <Input
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            
            <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as SystemRoleType | 'all')}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los roles</SelectItem>
                {systemRoles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: role.color }}
                      />
                      {role.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Users Table */}
          <div className={styles.tableContainer}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers(filteredUsers.map(u => u.id))
                        } else {
                          setSelectedUsers([])
                        }
                      }}
                      className={styles.checkbox}
                    />
                  </TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Rol Actual</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => {
                  const IconComponent = getRoleIcon(user.role.id)
                  return (
                    <TableRow key={user.id} className={styles.userRow}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedUsers([...selectedUsers, user.id])
                            } else {
                              setSelectedUsers(selectedUsers.filter(id => id !== user.id))
                            }
                          }}
                          className={styles.checkbox}
                        />
                      </TableCell>
                      <TableCell>
                        <div className={styles.userCell}>
                          <div className={styles.userAvatar}>
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className={styles.userName}>{user.name}</div>
                            <div className={styles.userEmail}>{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={styles.roleBadge}
                          style={{ borderColor: user.role.color, color: user.role.color }}
                        >
                          <IconComponent className="h-3 w-3 mr-1" />
                          {user.role.name}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={styles.department}>
                          {user.metadata?.department || "-"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={user.status === 'active' ? 'default' : 'secondary'}
                          className={user.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                        >
                          {user.status === 'active' ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className={styles.userActions}>
                          <Select onValueChange={(value) => handleAssignRole(user.id, value as SystemRoleType)}>
                            <SelectTrigger className="w-36">
                              <SelectValue placeholder="Cambiar rol" />
                            </SelectTrigger>
                            <SelectContent>
                              {systemRoles
                                .filter(role => role.id !== user.role.id)
                                .map((role) => {
                                  const RoleIcon = getRoleIcon(role.id)
                                  return (
                                    <SelectItem key={role.id} value={role.id}>
                                      <div className="flex items-center gap-2">
                                        <RoleIcon className="h-3 w-3" style={{ color: role.color }} />
                                        {role.name}
                                      </div>
                                    </SelectItem>
                                  )
                                })}
                            </SelectContent>
                          </Select>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <History className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {filteredUsers.length === 0 && (
            <div className={styles.emptyState}>
              <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No se encontraron usuarios</p>
              <p className="text-sm">Prueba ajustando los filtros de búsqueda</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 