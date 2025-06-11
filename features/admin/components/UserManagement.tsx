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
  Users, 
  Search, 
  Plus, 
  MoreHorizontal,
  Mail,
  Phone,
  Calendar,
  Shield,
  UserCheck,
  UserX,
  Edit2,
  Trash2
} from "lucide-react"
import type { UserManagementProps, User } from "../types"
import styles from "../styles/UserManagement.module.css"

// Mock data for development
const mockUsers: User[] = [
  {
    id: "1",
    name: "María González",
    email: "maria.gonzalez@ritterfinder.com",
    status: "active",
    role: {
      id: "1",
      name: "Administrador",
      description: "Acceso completo al sistema",
      color: "#dc2626",
      permissions: [],
      isSystem: true,
      userCount: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    permissions: [],
    lastLogin: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 days ago
    updatedAt: new Date(),
    metadata: {
      loginCount: 245,
      lastIpAddress: "192.168.1.100",
      department: "IT",
      phone: "+34 600 123 456"
    }
  },
  {
    id: "2",
    name: "Carlos Ruiz",
    email: "carlos.ruiz@ritterfinder.com",
    status: "active",
    role: {
      id: "2",
      name: "Manager",
      description: "Gestión de equipos",
      color: "#2563eb",
      permissions: [],
      isSystem: false,
      userCount: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    permissions: [],
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15), // 15 days ago
    updatedAt: new Date(),
    metadata: {
      loginCount: 89,
      lastIpAddress: "192.168.1.101",
      department: "Ventas",
      phone: "+34 600 789 012"
    }
  },
  {
    id: "3",
    name: "Ana Martínez",
    email: "ana.martinez@ritterfinder.com",
    status: "inactive",
    role: {
      id: "3",
      name: "Usuario",
      description: "Acceso básico",
      color: "#16a34a",
      permissions: [],
      isSystem: false,
      userCount: 12,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    permissions: [],
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45), // 45 days ago
    updatedAt: new Date(),
    metadata: {
      loginCount: 34,
      lastIpAddress: "192.168.1.102",
      department: "Marketing"
    }
  }
]

export function UserManagement({ className = "" }: UserManagementProps) {
  const [users] = useState<User[]>(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [roleFilter, setRoleFilter] = useState<string>("all")

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    const matchesRole = roleFilter === "all" || user.role.id === roleFilter
    
    return matchesSearch && matchesStatus && matchesRole
  })

  // Get status badge styling
  const getStatusBadge = (status: User['status']) => {
    const styles = {
      active: "bg-green-100 text-green-800 border-green-200",
      inactive: "bg-gray-100 text-gray-800 border-gray-200",
      suspended: "bg-red-100 text-red-800 border-red-200"
    }
    
    const labels = {
      active: "Activo",
      inactive: "Inactivo", 
      suspended: "Suspendido"
    }
    
    return (
      <Badge variant="outline" className={styles[status]}>
        {labels[status]}
      </Badge>
    )
  }

  // Format last login time
  const formatLastLogin = (date?: Date) => {
    if (!date) return "Nunca"
    
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffMins < 60) return `Hace ${diffMins} min`
    if (diffHours < 24) return `Hace ${diffHours}h`
    if (diffDays < 7) return `Hace ${diffDays} días`
    
    return date.toLocaleDateString()
  }

  return (
    <div className={`${styles.userManagement} ${className} space-y-6`}>
      {/* Header */}
      <div className={`${styles.userHeader} flex items-center justify-between`}>
        <div>
          <h2 className={`${styles.userTitle} text-2xl font-bold text-gray-900 flex items-center gap-2`}>
            <Users className="h-6 w-6 text-ritter-gold" />
            Gestión de Usuarios
          </h2>
          <p className={`${styles.userDescription} text-gray-600`}>
            Administra usuarios, roles y permisos del sistema
          </p>
        </div>
        <Button className={`${styles.addUserButton} flex items-center gap-2`}>
          <Plus className="h-4 w-4" />
          Nuevo Usuario
        </Button>
      </div>

      {/* Filters */}
      <Card className={`${styles.filtersCard} border-0 shadow-sm`}>
        <CardContent className="pt-6">
          <div className={`${styles.filtersGrid} grid gap-4 md:grid-cols-4`}>
            <div className={`${styles.searchContainer} md:col-span-2`}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar usuarios por nombre o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="inactive">Inactivo</SelectItem>
                <SelectItem value="suspended">Suspendido</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los roles</SelectItem>
                <SelectItem value="1">Administrador</SelectItem>
                <SelectItem value="2">Manager</SelectItem>
                <SelectItem value="3">Usuario</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className={`${styles.usersTableCard} border-0 shadow-sm`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Usuarios ({filteredUsers.length})</span>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <UserCheck className="h-4 w-4" />
              {users.filter(u => u.status === 'active').length} activos
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`${styles.tableContainer} border rounded-lg`}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Último Acceso</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className={styles.userRow}>
                    <TableCell>
                      <div className={`${styles.userCell} flex items-center gap-3`}>
                        <div className={`${styles.userAvatar} w-8 h-8 rounded-full bg-ritter-gold/10 flex items-center justify-center`}>
                          <span className="text-sm font-medium text-ritter-gold">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className={`${styles.userName} font-medium`}>
                            {user.name}
                          </div>
                          <div className={`${styles.userEmail} text-sm text-muted-foreground flex items-center gap-1`}>
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </div>
                          {user.metadata?.phone && (
                            <div className={`${styles.userPhone} text-xs text-muted-foreground flex items-center gap-1`}>
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
                        style={{ borderColor: user.role.color, color: user.role.color }}
                        className={styles.roleBadge}
                      >
                        <Shield className="h-3 w-3 mr-1" />
                        {user.role.name}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(user.status)}
                    </TableCell>
                    <TableCell>
                      <div className={`${styles.lastLoginCell} flex items-center gap-1 text-sm`}>
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {formatLastLogin(user.lastLogin)}
                      </div>
                      {user.metadata?.loginCount && (
                        <div className="text-xs text-muted-foreground">
                          {user.metadata.loginCount} accesos
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={`${styles.department} text-sm`}>
                        {user.metadata?.department || "-"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className={`${styles.userActions} flex items-center justify-end gap-2`}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => {
                            // Toggle user status logic here
                          }}
                        >
                          {user.status === 'active' ? (
                            <UserX className="h-4 w-4 text-orange-600" />
                          ) : (
                            <UserCheck className="h-4 w-4 text-green-600" />
                          )}
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredUsers.length === 0 && (
            <div className={`${styles.emptyState} text-center py-12 text-muted-foreground`}>
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No se encontraron usuarios</p>
              <p className="text-sm">Prueba ajustando los filtros de búsqueda</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}