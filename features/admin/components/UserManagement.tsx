"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
  Trash2,
  User,
  AlertCircle,
  X
} from "lucide-react"
import type { UserManagementProps, User as UserType, SystemRoleType } from "../types"
import styles from "../styles/UserManagement.module.css"

// Roles disponibles
const availableRoles = [
  { id: 'admin', name: 'Administrador', color: '#dc2626' },
  { id: 'supervisor', name: 'Supervisor', color: '#2563eb' },
  { id: 'comercial', name: 'Comercial', color: '#16a34a' }
]



// Mock data for development
const mockUsers: UserType[] = [
  {
    id: "1",
    name: "María González",
    email: "maria.gonzalez@ritterfinder.com",
    status: "active",
    role: {
      id: "admin",
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
      phone: "+34 600 123 456"
    }
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
      phone: "+34 600 789 012"
    }
  },
  {
    id: "3",
    name: "Ana Martínez",
    email: "ana.martinez@ritterfinder.com",
    status: "inactive",
    role: {
      id: "comercial",
      name: "Comercial",
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
      lastIpAddress: "192.168.1.102"
    }
  }
]

interface CreateUserForm {
  name: string
  email: string
  roleId: SystemRoleType | ''
  phone: string
  sendWelcomeEmail: boolean
}

interface CreateUserFormErrors {
  name?: string
  email?: string
  roleId?: string
  phone?: string
  sendWelcomeEmail?: string
}

export function UserManagement({ className = "" }: UserManagementProps) {
  const [users] = useState<UserType[]>(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  
  // Debug: Log modal state changes
  console.log('Modal state:', isCreateModalOpen)
  const [isCreating, setIsCreating] = useState(false)
  const [createForm, setCreateForm] = useState<CreateUserForm>({
    name: '',
    email: '',
    roleId: '',
    phone: '',
    sendWelcomeEmail: true
  })
  const [formErrors, setFormErrors] = useState<CreateUserFormErrors>({})

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    const matchesRole = roleFilter === "all" || user.role.id === roleFilter
    
    return matchesSearch && matchesStatus && matchesRole
  })

  // Validate form
  const validateForm = (): boolean => {
    const errors: CreateUserFormErrors = {}
    
    if (!createForm.name.trim()) {
      errors.name = 'El nombre es requerido'
    }
    
    if (!createForm.email.trim()) {
      errors.email = 'El email es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(createForm.email)) {
      errors.email = 'Email inválido'
    } else if (users.some(u => u.email.toLowerCase() === createForm.email.toLowerCase())) {
      errors.email = 'Este email ya está registrado'
    }
    
    if (!createForm.roleId) {
      errors.roleId = 'Selecciona un rol'
    }
    
    if (createForm.phone && !/^[\+]?[0-9\s\-\(\)]+$/.test(createForm.phone)) {
      errors.phone = 'Formato de teléfono inválido'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle form submission
  const handleCreateUser = async () => {
    if (!validateForm()) return
    
    setIsCreating(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      console.log('Creating user:', createForm)
      
      // Reset form and close modal
      setCreateForm({
        name: '',
        email: '',
        roleId: '',
        phone: '',
        sendWelcomeEmail: true
      })
            setFormErrors({})
      setIsCreateModalOpen(false)
      
      // Here you would typically refresh the users list
      
    } catch (error) {
      console.error('Error creating user:', error)
    } finally {
      setIsCreating(false)
    }
  }

  // Reset form when modal closes
  const handleModalClose = () => {
    if (!isCreating) {
      setCreateForm({
        name: '',
        email: '',
        roleId: '',
        phone: '',
        sendWelcomeEmail: true
      })
      setFormErrors({})
    }
    setIsCreateModalOpen(false)
  }

  // Get status badge styling
  const getStatusBadge = (status: UserType['status']) => {
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
      <div className={styles.userHeader}>
        <div>
          <h2 className={styles.userTitle}>
            <Users className="h-6 w-6 text-ritter-gold" />
            Gestión de Usuarios
          </h2>
          <p className={styles.userDescription}>
            Administra usuarios, roles y permisos del sistema
          </p>
        </div>
        
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button 
              className={styles.addUserButton}
              onClick={() => {
                console.log('Button clicked, current modal state:', isCreateModalOpen)
                setIsCreateModalOpen(true)
              }}
            >
              <Plus className="h-4 w-4" />
              Nuevo Usuario
            </Button>
          </DialogTrigger>
          <DialogContent className={styles.createUserModal}>
            <DialogHeader>
              <DialogTitle className={styles.modalTitle}>
                <User className="h-5 w-5 text-ritter-gold" />
                Crear Nuevo Usuario
              </DialogTitle>
              <DialogDescription className={styles.modalDescription}>
                Completa la información para crear un nuevo usuario en el sistema.
              </DialogDescription>
            </DialogHeader>
            
            <div className={styles.modalForm}>
              {/* Name Field */}
              <div className={styles.formGroup}>
                <Label htmlFor="name" className={styles.formLabel}>
                  Nombre completo *
                </Label>
                <Input
                  id="name"
                  value={createForm.name}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ej: María González"
                  className={formErrors.name ? styles.inputError : ''}
                  disabled={isCreating}
                />
                {formErrors.name && (
                  <div className={styles.errorMessage}>
                    <AlertCircle className="h-4 w-4" />
                    {formErrors.name}
                  </div>
                )}
              </div>

              {/* Email Field */}
              <div className={styles.formGroup}>
                <Label htmlFor="email" className={styles.formLabel}>
                  Email corporativo *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={createForm.email}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="usuario@ritterfinder.com"
                  className={formErrors.email ? styles.inputError : ''}
                  disabled={isCreating}
                />
                {formErrors.email && (
                  <div className={styles.errorMessage}>
                    <AlertCircle className="h-4 w-4" />
                    {formErrors.email}
                  </div>
                )}
              </div>

              {/* Role Field */}
              <div className={styles.formGroup}>
                <Label htmlFor="role" className={styles.formLabel}>
                  Rol del sistema *
                </Label>
                <Select 
                  value={createForm.roleId} 
                  onValueChange={(value) => setCreateForm(prev => ({ ...prev, roleId: value as SystemRoleType }))}
                  disabled={isCreating}
                >
                  <SelectTrigger className={formErrors.roleId ? styles.inputError : ''}>
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRoles.map((role) => (
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
                {formErrors.roleId && (
                  <div className={styles.errorMessage}>
                    <AlertCircle className="h-4 w-4" />
                    {formErrors.roleId}
                  </div>
                )}
              </div>

              {/* Phone Field */}
              <div className={styles.formGroup}>
                <Label htmlFor="phone" className={styles.formLabel}>
                  Teléfono
                </Label>
                <Input
                  id="phone"
                  value={createForm.phone}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+34 600 123 456"
                  className={formErrors.phone ? styles.inputError : ''}
                  disabled={isCreating}
                />
                {formErrors.phone && (
                  <div className={styles.errorMessage}>
                    <AlertCircle className="h-4 w-4" />
                    {formErrors.phone}
                  </div>
                )}
              </div>

              {/* Welcome Email Checkbox */}
              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={createForm.sendWelcomeEmail}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, sendWelcomeEmail: e.target.checked }))}
                    className={styles.checkbox}
                    disabled={isCreating}
                  />
                  <span className={styles.checkboxText}>
                    Enviar email de bienvenida con credenciales de acceso
                  </span>
                </label>
              </div>
            </div>

            <DialogFooter className={styles.modalFooter}>
              <Button 
                variant="outline" 
                onClick={handleModalClose}
                disabled={isCreating}
                className={styles.cancelButton}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleCreateUser}
                disabled={isCreating}
                className={styles.createButton}
              >
                {isCreating ? (
                  <>
                    <div className={styles.spinner} />
                    Creando...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Crear Usuario
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className={styles.filtersCard}>
        <CardContent className="pt-6">
          <div className={styles.filtersGrid}>
            <div className={styles.searchContainer}>
              <div className={styles.searchInputWrapper}>
                <Search className={styles.searchIcon} />
                <Input
                  placeholder="Buscar usuarios por nombre o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
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
                {availableRoles.map((role) => (
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
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className={styles.usersTableCard}>
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
          <div className={styles.tableContainer}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Último Acceso</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className={styles.userRow}>
                    <TableCell>
                      <div className={styles.userCell}>
                        <div className={styles.userAvatar}>
                          <span className="text-sm font-medium text-ritter-gold">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className={styles.userName}>
                            {user.name}
                          </div>
                          <div className={styles.userEmail}>
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </div>
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
                      <div className={styles.lastLoginCell}>
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {formatLastLogin(user.lastLogin)}
                      </div>
                      {user.metadata?.loginCount && (
                        <div className="text-xs text-muted-foreground">
                          {user.metadata.loginCount} accesos
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className={styles.userActions}>
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
            <div className={styles.emptyState}>
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