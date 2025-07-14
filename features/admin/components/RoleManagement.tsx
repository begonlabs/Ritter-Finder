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
  AlertCircle,
  RefreshCw
} from "lucide-react"
import type { RoleManagementProps, SystemRole, User, SystemRoleType } from "../types"
import { useRoleManagement } from "../hooks/useRoleManagement"
import styles from "../styles/RoleManagement.module.css"

export function RoleManagement({ className = "" }: RoleManagementProps) {
  const {
    users,
    isLoading,
    error,
    isAssigning,
    searchTerm,
    selectedRole,
    selectedUsers,
    filteredUsers,
    systemRoles,
    getRoleIcon,
    setSearchTerm,
    setSelectedRole,
    setSelectedUsers,
    toggleUserSelection,
    clearSelection,
    assignUserToRole,
    bulkAssignRole,
    fetchUsers
  } = useRoleManagement()

  // Handle role assignment
  const handleAssignRole = async (userId: string, newRoleId: SystemRoleType) => {
    try {
      await assignUserToRole(userId, newRoleId)
    } catch (error) {
      console.error('Error assigning role:', error)
    }
  }

  // Handle bulk role assignment
  const handleBulkAssign = async (roleId: SystemRoleType) => {
    if (selectedUsers.length === 0) return
    try {
      await bulkAssignRole(selectedUsers, roleId)
    } catch (error) {
      console.error('Error bulk assigning roles:', error)
    }
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
        <Button 
          variant="outline" 
          size="sm"
          onClick={fetchUsers}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Actualizando...' : 'Actualizar'}
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">Error al cargar usuarios:</span>
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

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
          {isLoading && users.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-2 text-muted-foreground">
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span>Cargando usuarios...</span>
              </div>
            </div>
          ) : (
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
          )}

          {filteredUsers.length === 0 && !isLoading && (
            <div className={styles.emptyState}>
              <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No se encontraron usuarios</p>
              <p className="text-sm">Prueba ajustando los filtros de búsqueda o haz clic en "Actualizar"</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 