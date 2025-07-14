"use client"

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
  Download,
  Info
} from "lucide-react"
import type { PermissionManagementProps } from "../types"
import { usePermissionManagement } from "../hooks/usePermissionManagement"
import styles from "../styles/PermissionManagement.module.css"

export function PermissionManagement({ className = "" }: PermissionManagementProps) {
  const {
    systemRoles,
    permissionGroups,
    filteredGroups,
    selectedGroup,
    isLoading,
    error,
    setSelectedGroup,
    exportMatrix,
    getRoleIcon,
    getGroupIcon
  } = usePermissionManagement()

  // Show loading state
  if (isLoading) {
    return (
      <div className={`${styles.permissionManagement} ${className} space-y-6`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ritter-gold mx-auto mb-4"></div>
            <p>Cargando matriz de permisos...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className={`${styles.permissionManagement} ${className} space-y-6`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <Key className="h-12 w-12 mx-auto" />
            </div>
            <p className="text-red-600 mb-2">Error al cargar permisos</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    )
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