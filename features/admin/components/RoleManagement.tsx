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
  RefreshCw,
  Phone,
  Trash2
} from "lucide-react"
import { useResponsive } from "@/features/layout/hooks/useResponsive"
import { cn } from "@/lib/utils"
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

  const { isSmallScreen, isMediumScreen, isLargeScreen, utils } = useResponsive()

  // Handle role assignment
  const handleAssignRole = async (userId: string, newRoleId: SystemRoleType) => {
    try {
      console.log('🔄 Iniciando asignación de rol...')
      await assignUserToRole(userId, newRoleId)
      console.log('✅ Rol asignado exitosamente')
      // Aquí podrías agregar una notificación de éxito
    } catch (error) {
      console.error('❌ Error assigning role:', error)
      // Aquí podrías agregar una notificación de error
      throw error // Re-lanzar para que el componente padre pueda manejarlo
    }
  }

  // Handle bulk role assignment
  const handleBulkAssign = async (roleId: SystemRoleType) => {
    if (selectedUsers.length === 0) {
      console.log('⚠️ No hay usuarios seleccionados para asignación masiva')
      return
    }
    try {
      console.log('🔄 Iniciando asignación masiva de roles...')
      await bulkAssignRole(selectedUsers, roleId)
      console.log('✅ Roles asignados masivamente exitosamente')
      // Aquí podrías agregar una notificación de éxito
    } catch (error) {
      console.error('❌ Error bulk assigning roles:', error)
      // Aquí podrías agregar una notificación de error
      throw error // Re-lanzar para que el componente padre pueda manejarlo
    }
  }

  return (
    <div className={cn(
      styles.roleManagement,
      isSmallScreen && styles.roleManagementMobile,
      isMediumScreen && styles.roleManagementTablet,
      className
    )}>
      {/* Header */}
      <div className={cn(
        styles.roleHeader,
        isSmallScreen && styles.roleHeaderMobile
      )}>
        <div>
          <h2 className={cn(
            styles.roleTitle,
            isSmallScreen && styles.roleTitleMobile
          )}>
            <Shield className={cn(
              "h-6 w-6 text-ritter-gold",
              isSmallScreen && "h-5 w-5"
            )} />
            Gestión de Roles
          </h2>
          <p className={cn(
            styles.roleDescription,
            isSmallScreen && styles.roleDescriptionMobile
          )}>
            Asigna usuarios a los roles del sistema. Los roles son fijos y no pueden ser modificados.
          </p>
        </div>
        <Button 
          variant="outline" 
          size={isSmallScreen ? "sm" : "sm"}
          onClick={fetchUsers}
          disabled={isLoading}
          className={cn(
            "flex items-center gap-2",
            isSmallScreen && styles.refreshButtonMobile
          )}
        >
          <RefreshCw className={cn(
            `h-4 w-4 ${isLoading ? 'animate-spin' : ''}`,
            isSmallScreen && "h-3 w-3"
          )} />
          {isSmallScreen ? 'Actualizar' : (isLoading ? 'Actualizando...' : 'Actualizar')}
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
      <div className={cn(
        styles.rolesGrid,
        isSmallScreen && styles.rolesGridMobile,
        isMediumScreen && styles.rolesGridTablet
      )}>
        {systemRoles.map((role) => {
          const IconComponent = getRoleIcon(role.id)
          return (
            <Card key={role.id} className={cn(
              styles.roleCard,
              isSmallScreen && styles.roleCardMobile
            )}>
              <CardContent className={cn(
                "pt-6",
                isSmallScreen && "pt-4"
              )}>
                <div className={cn(
                  styles.roleCardContent,
                  isSmallScreen && styles.roleCardContentMobile
                )}>
                  <div className={cn(
                    styles.roleIconContainer,
                    isSmallScreen && styles.roleIconContainerMobile
                  )} style={{ backgroundColor: `${role.color}15` }}>
                    <IconComponent 
                      className={cn(
                        styles.roleIcon,
                        isSmallScreen && styles.roleIconMobile
                      )} 
                      style={{ color: role.color }}
                    />
                  </div>
                  <div className={cn(
                    styles.roleInfo,
                    isSmallScreen && styles.roleInfoMobile
                  )}>
                    <h3 className={cn(
                      styles.roleName,
                      isSmallScreen && styles.roleNameMobile
                    )}>{role.name}</h3>
                    <p className={cn(
                      styles.roleDescText,
                      isSmallScreen && styles.roleDescTextMobile
                    )}>{role.description}</p>
                    <div className={cn(
                      styles.roleStats,
                      isSmallScreen && styles.roleStatsMobile
                    )}>
                      <Badge 
                        variant="outline" 
                        className={cn(
                          styles.userCountBadge,
                          isSmallScreen && styles.userCountBadgeMobile
                        )}
                        style={{ borderColor: role.color, color: role.color }}
                      >
                        <Users className={cn(
                          "h-3 w-3 mr-1",
                          isSmallScreen && "h-2 w-2 mr-0.5"
                        )} />
                        {isSmallScreen ? role.userCount : `${role.userCount} usuarios`}
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
      <Card className={cn(
        styles.assignmentCard,
        isSmallScreen && styles.assignmentCardMobile
      )}>
        <CardHeader className={cn(
          isSmallScreen && styles.assignmentHeaderMobile
        )}>
          <CardTitle className={cn(
            "flex items-center justify-between",
            isSmallScreen && "flex-col items-start gap-3"
          )}>
            <span className={cn(
              isSmallScreen && styles.assignmentTitleMobile
            )}>Asignación de Usuarios</span>
            {selectedUsers.length > 0 && (
              <div className={cn(
                styles.bulkActions,
                isSmallScreen && styles.bulkActionsMobile
              )}>
                <span className={cn(
                  "text-sm text-muted-foreground mr-3",
                  isSmallScreen && "text-xs mr-2"
                )}>
                  {selectedUsers.length} usuarios seleccionados
                </span>
                <Select 
                  onValueChange={async (value) => {
                    try {
                      await handleBulkAssign(value as SystemRoleType)
                      // Reset the select value after successful assignment
                      const selectElement = document.querySelector('[data-bulk-assign]') as HTMLSelectElement
                      if (selectElement) {
                        selectElement.value = ''
                      }
                    } catch (error) {
                      console.error('Error en asignación masiva de roles:', error)
                      // Aquí podrías mostrar una notificación de error
                    }
                  }}
                  disabled={isAssigning}
                >
                  <SelectTrigger className="w-48" data-bulk-assign>
                    <SelectValue placeholder={isAssigning ? "Asignando..." : "Asignar rol masivo"} />
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
        <CardContent className={cn(
          isSmallScreen && styles.assignmentContentMobile
        )}>
          {/* Filters */}
          <div className={cn(
            styles.filtersSection,
            isSmallScreen && styles.filtersSectionMobile
          )}>
            <div className={cn(
              styles.searchInputWrapper,
              isSmallScreen && styles.searchInputWrapperMobile
            )}>
              <Search className={cn(
                styles.searchIcon,
                isSmallScreen && styles.searchIconMobile
              )} />
              <Input
                placeholder={isSmallScreen ? "Buscar..." : "Buscar usuarios..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={cn(
                  styles.searchInput,
                  isSmallScreen && styles.searchInputMobile
                )}
              />
            </div>
            
            <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as SystemRoleType | 'all')}>
              <SelectTrigger className={cn(
                "w-48",
                isSmallScreen && "w-full"
              )}>
                <SelectValue placeholder={isSmallScreen ? "Rol" : "Filtrar por rol"} />
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
            <div className={cn(
              "flex items-center justify-center py-12",
              isSmallScreen && "py-8"
            )}>
              <div className={cn(
                "flex items-center gap-2 text-muted-foreground",
                isSmallScreen && "text-sm"
              )}>
                <RefreshCw className={cn(
                  "h-5 w-5 animate-spin",
                  isSmallScreen && "h-4 w-4"
                )} />
                <span>Cargando usuarios...</span>
              </div>
            </div>
          ) : (
          <div className={cn(
            styles.tableContainer,
            isSmallScreen && styles.tableContainerMobile
          )}>
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
                            {user.metadata?.phone && (
                              <div className={styles.userPhone}>
                                <Phone className="h-3 w-3" />
                                {user.metadata.phone}
                              </div>
                            )}
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
                      <TableCell className="text-right">
                        <div className={styles.userActions}>
                          <Select 
                            onValueChange={async (value) => {
                              try {
                                await handleAssignRole(user.id, value as SystemRoleType)
                                // Reset the select value after successful assignment
                                const selectElement = document.querySelector(`[data-user-id="${user.id}"]`) as HTMLSelectElement
                                if (selectElement) {
                                  selectElement.value = ''
                                }
                              } catch (error) {
                                console.error('Error en asignación de rol:', error)
                                // Aquí podrías mostrar una notificación de error
                              }
                            }}
                            disabled={isAssigning}
                          >
                            <SelectTrigger className="w-36" data-user-id={user.id}>
                              <SelectValue placeholder={isAssigning ? "Asignando..." : "Cambiar rol"} />
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