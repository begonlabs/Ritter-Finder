"use client"

import { useState, useEffect } from "react"
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
  Trash2,
  User,
  AlertCircle,
  X,
  RefreshCw,
  Eye,
  EyeOff,
  Copy,
  Check,
  Info
} from "lucide-react"
import { useResponsive } from "@/features/layout/hooks/useResponsive"
import { cn } from "@/lib/utils"
import type { UserManagementProps, User as UserType, SystemRoleType } from "../types"
import { useUserManagement } from "../hooks/useUserManagement"
import { useConfirmDialog } from "../hooks/useConfirmDialog"
import { ConfirmDialog } from "./ConfirmDialog"
import styles from "../styles/UserManagement.module.css"

interface CreateUserForm {
  name: string
  email: string
  roleId: string | ''
  password: string
  confirmPassword: string
  generatePassword: boolean
  showPassword: boolean
  showConfirmPassword: boolean
  generatedPassword: string
}

interface CreateUserFormErrors {
  name?: string
  email?: string
  roleId?: string
  password?: string
  confirmPassword?: string
}

export function UserManagement({ className = "" }: UserManagementProps) {
  const {
    users,
    isLoading,
    error,
    isCreating,
    isDeleting,
    filteredUsers,
    availableRoles,
    createUser,
    deleteUser,
    toggleUserStatus,
    setFilters,
    fetchUsers,
    verifyUserData
  } = useUserManagement()

  const { isSmallScreen, isMediumScreen, isLargeScreen, utils } = useResponsive()
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info'
    message: string
    show: boolean
  } | null>(null)
  
  const { confirmDialog, showConfirmDialog, closeConfirmDialog } = useConfirmDialog()
  
  const [createForm, setCreateForm] = useState<CreateUserForm>({
    name: '',
    email: '',
    roleId: '',
    password: '',
    confirmPassword: '',
    generatePassword: false,
    showPassword: false,
    showConfirmPassword: false,
    generatedPassword: ''
  })
  const [formErrors, setFormErrors] = useState<CreateUserFormErrors>({})

  // Update filters when search or filters change
  useEffect(() => {
    setFilters({
      search: searchTerm,
      status: 'all', // Siempre mostrar todos
      roleId: roleFilter === 'all' ? 'all' : roleFilter
    })
  }, [searchTerm, roleFilter, setFilters])

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
    
    if (!createForm.generatePassword) {
      if (!createForm.password) {
        errors.password = 'La contraseña es requerida'
      } else if (createForm.password.length < 8) {
        errors.password = 'La contraseña debe tener al menos 8 caracteres'
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(createForm.password)) {
        errors.password = 'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
      }
      
      if (!createForm.confirmPassword) {
        errors.confirmPassword = 'Confirma la contraseña'
      } else if (createForm.password !== createForm.confirmPassword) {
        errors.confirmPassword = 'Las contraseñas no coinciden'
      }
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Generate random password
  const generateRandomPassword = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
    let password = ''
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return password
  }

  // Handle generate password toggle
  const handleGeneratePasswordToggle = (checked: boolean) => {
    if (checked) {
      const generated = generateRandomPassword()
      setCreateForm(prev => ({ 
        ...prev, 
        generatePassword: true,
        password: '',
        confirmPassword: '',
        generatedPassword: generated
      }))
    } else {
      setCreateForm(prev => ({ 
        ...prev, 
        generatePassword: false,
        password: '',
        confirmPassword: '',
        generatedPassword: ''
      }))
    }
  }

  // Copy generated password to clipboard
  const copyGeneratedPassword = async () => {
    try {
      await navigator.clipboard.writeText(createForm.generatedPassword)
      console.log('✅ Contraseña copiada al portapapeles')
    } catch (error) {
      console.error('Error copiando contraseña:', error)
    }
  }

  // Handle form submission
  const handleCreateUser = async () => {
    if (!validateForm()) return
    
    try {
      const finalPassword = createForm.generatePassword ? createForm.generatedPassword : createForm.password
      
      const newUser = await createUser({
        name: createForm.name,
        email: createForm.email,
        roleId: createForm.roleId,
        password: finalPassword
      })
      
      // Reset form and close modal
      setCreateForm({
        name: '',
        email: '',
        roleId: '',
        password: '',
        confirmPassword: '',
        generatePassword: false,
        showPassword: false,
        showConfirmPassword: false,
        generatedPassword: ''
      })
      setFormErrors({})
      setIsCreateModalOpen(false)
      
      // Show success message
      console.log('✅ Usuario creado exitosamente:', newUser.name)
      
    } catch (error) {
      console.error('Error creating user:', error)
    }
  }

  // Reset form when modal closes
  const handleModalClose = () => {
    if (!isCreating) {
      setCreateForm({
        name: '',
        email: '',
        roleId: '',
        password: '',
        confirmPassword: '',
        generatePassword: false,
        showPassword: false,
        showConfirmPassword: false,
        generatedPassword: ''
      })
      setFormErrors({})
    }
    setIsCreateModalOpen(false)
  }

  // Handle notifications
  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message, show: true })
    setTimeout(() => {
      setNotification(null)
    }, 3000) // Auto-hide after 3 seconds
  }

  // Handle user verification
  const handleVerifyUser = async (userId: string, userName: string) => {
    try {
      await verifyUserData(userId)
      showNotification('success', `✅ Datos de ${userName} verificados con éxito`)
    } catch (error) {
      console.error('Error verificando usuario:', error)
      showNotification('error', `❌ Error al verificar datos de ${userName}`)
    }
  }

  return (
    <div className={cn(
      styles.userManagement,
      isSmallScreen && styles.userManagementMobile,
      isMediumScreen && styles.userManagementTablet,
      className,
      "space-y-6"
    )}>
      {/* Header */}
      <div className={cn(
        styles.userHeader,
        isSmallScreen && styles.userHeaderMobile
      )}>
        <div>
          <h2 className={cn(
            styles.userTitle,
            isSmallScreen && styles.userTitleMobile
          )}>
            <Users className={cn(
              "h-6 w-6 text-ritter-gold",
              isSmallScreen && "h-5 w-5"
            )} />
            Gestión de Usuarios
          </h2>
          <p className={cn(
            styles.userDescription,
            isSmallScreen && styles.userDescriptionMobile
          )}>
            Administra usuarios y roles del sistema
          </p>
        </div>
        
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button 
              className={cn(
                styles.addUserButton,
                isSmallScreen && styles.addUserButtonMobile
              )}
              onClick={() => {
                console.log('Button clicked, current modal state:', isCreateModalOpen)
                setIsCreateModalOpen(true)
              }}
            >
          <Plus className={cn(
            "h-4 w-4",
            isSmallScreen && "h-3 w-3"
          )} />
          {isSmallScreen ? "Nuevo" : "Nuevo Usuario"}
        </Button>
          </DialogTrigger>
          <DialogContent className={cn(
            styles.createUserModal,
            isSmallScreen && styles.createUserModalMobile
          )}>
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
                  onValueChange={(value: string) => setCreateForm(prev => ({ ...prev, roleId: value }))}
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

              {/* Password Section */}
              <div className={styles.formGroup}>
                <div className={styles.checkboxGroup}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={createForm.generatePassword}
                      onChange={(e) => handleGeneratePasswordToggle(e.target.checked)}
                      className={styles.checkbox}
                      disabled={isCreating}
                    />
                    <span className={styles.checkboxText}>
                      Generar contraseña automáticamente
                    </span>
                  </label>
                </div>
              </div>

              {/* Generated Password Display */}
              {createForm.generatePassword && createForm.generatedPassword && (
                <div className={styles.generatedPasswordSection}>
                  <Label className={styles.formLabel}>
                    Contraseña generada
                  </Label>
                  <div className={styles.generatedPasswordContainer}>
                    <Input
                      value={createForm.generatedPassword}
                      readOnly
                      className={styles.generatedPasswordInput}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={copyGeneratedPassword}
                      className={styles.copyButton}
                      title="Copiar contraseña"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className={styles.helperText}>
                    Esta es la contraseña generada. El usuario deberá cambiarla al iniciar sesión por primera vez. Guárdala en un lugar seguro.
                  </p>
                </div>
              )}

              {!createForm.generatePassword && (
                <div className={styles.passwordFields}>
                  {/* Password Field */}
                  <div className={styles.formGroup}>
                    <Label htmlFor="password" className={styles.formLabel}>
                      Contraseña *
                    </Label>
                    <div className={styles.passwordInputContainer}>
                      <Input
                        id="password"
                        type={createForm.showPassword ? "text" : "password"}
                        value={createForm.password}
                        onChange={(e) => setCreateForm(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Ingresa la contraseña"
                        className={`${formErrors.password ? styles.inputError : ''} ${styles.passwordInput}`}
                        disabled={isCreating}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setCreateForm(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                        className={styles.passwordToggle}
                        title={createForm.showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      >
                        {createForm.showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {formErrors.password && (
                      <div className={styles.errorMessage}>
                        <AlertCircle className="h-4 w-4" />
                        {formErrors.password}
                      </div>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div className={styles.formGroup}>
                    <Label htmlFor="confirmPassword" className={styles.formLabel}>
                      Confirmar Contraseña *
                    </Label>
                    <div className={styles.passwordInputContainer}>
                      <Input
                        id="confirmPassword"
                        type={createForm.showConfirmPassword ? "text" : "password"}
                        value={createForm.confirmPassword}
                        onChange={(e) => setCreateForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        placeholder="Confirma la contraseña"
                        className={`${formErrors.confirmPassword ? styles.inputError : ''} ${styles.passwordInput}`}
                        disabled={isCreating}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setCreateForm(prev => ({ ...prev, showConfirmPassword: !prev.showConfirmPassword }))}
                        className={styles.passwordToggle}
                        title={createForm.showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      >
                        {createForm.showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {formErrors.confirmPassword && (
                      <div className={styles.errorMessage}>
                        <AlertCircle className="h-4 w-4" />
                        {formErrors.confirmPassword}
                      </div>
                    )}
                  </div>
                </div>
              )}
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

      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
          notification.type === 'success' 
            ? 'bg-green-100 border border-green-300 text-green-800' 
            : notification.type === 'error'
            ? 'bg-red-100 border border-red-300 text-red-800'
            : 'bg-blue-100 border border-blue-300 text-blue-800'
        }`}>
          <div className="flex items-center gap-2">
            {notification.type === 'success' && <Check className="h-5 w-5" />}
            {notification.type === 'error' && <AlertCircle className="h-5 w-5" />}
            {notification.type === 'info' && <Info className="h-5 w-5" />}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Filters */}
      <Card className={cn(
        styles.filtersCard,
        isSmallScreen && styles.filtersCardMobile
      )}>
        <CardContent className={cn(
          "pt-6",
          isSmallScreen && "pt-4"
        )}>
          <div className={cn(
            styles.filtersGrid,
            isSmallScreen && styles.filtersGridMobile
          )}>
            <div className={cn(
              styles.searchContainer,
              isSmallScreen && styles.searchContainerMobile
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
                  placeholder={isSmallScreen ? "Buscar..." : "Buscar usuarios por nombre..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={cn(
                    styles.searchInput,
                    isSmallScreen && styles.searchInputMobile
                  )}
                />
              </div>
            </div>
            
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className={cn(
                isSmallScreen && styles.selectTriggerMobile
              )}>
                <SelectValue placeholder={isSmallScreen ? "Rol" : "Filtrar por rol"} />
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

      {/* Users Table */}
      <Card className={cn(
        styles.usersTableCard,
        isSmallScreen && styles.usersTableCardMobile
      )}>
        <CardHeader className={cn(
          isSmallScreen && styles.tableHeaderMobile
        )}>
          <CardTitle className={cn(
            "flex items-center justify-between",
            isSmallScreen && "flex-col items-start gap-3"
          )}>
            <span className={cn(
              isSmallScreen && styles.tableTitleMobile
            )}>Usuarios ({filteredUsers.length})</span>
            <div className={cn(
              "flex items-center gap-4",
              isSmallScreen && "w-full justify-between gap-2"
            )}>
              <div className={cn(
                "flex items-center gap-2 text-sm text-muted-foreground",
                isSmallScreen && "text-xs"
              )}>
                <UserCheck className={cn(
                  "h-4 w-4",
                  isSmallScreen && "h-3 w-3"
                )} />
                {isSmallScreen ? `${users.length}` : `${users.length} usuarios registrados`}
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
          </CardTitle>
        </CardHeader>
        <CardContent className={cn(
          isSmallScreen && styles.tableContentMobile
        )}>
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
            <>
              <div className={cn(
                styles.tableContainer,
                isSmallScreen && styles.tableContainerMobile
              )}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Rol</TableHead>
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
                        <TableCell className="text-right">
                          <div className={styles.userActions}>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => handleVerifyUser(user.id, user.name)}
                              title="Verificar datos del usuario"
                            >
                              <Search className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-red-600"
                              onClick={() => {
                                showConfirmDialog(
                                  "Eliminar Usuario",
                                  `¿Estás seguro de que quieres eliminar a ${user.name}? Esta acción no se puede deshacer.`,
                                  async () => {
                                    try {
                                      await deleteUser(user.id)
                                      showNotification('success', `✅ Usuario ${user.name} eliminado exitosamente`)
                                    } catch (error) {
                                      console.error('Error eliminando usuario:', error)
                                      showNotification('error', `❌ Error al eliminar usuario ${user.name}`)
                                    }
                                  },
                                  {
                                    type: 'delete',
                                    confirmText: 'Eliminar',
                                    cancelText: 'Cancelar'
                                  }
                                )
                              }}
                              disabled={isDeleting}
                              title="Eliminar usuario"
                            >
                              {isDeleting ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {filteredUsers.length === 0 && !isLoading && (
                <div className={styles.emptyState}>
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No se encontraron usuarios</p>
                  <p className="text-sm">Prueba ajustando los filtros de búsqueda o haz clic en "Actualizar"</p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Confirm Dialog */}
      {confirmDialog && (
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          onClose={closeConfirmDialog}
          onConfirm={confirmDialog.onConfirm}
          title={confirmDialog.title}
          description={confirmDialog.description}
          confirmText={confirmDialog.confirmText}
          cancelText={confirmDialog.cancelText}
          type={confirmDialog.type}
          isLoading={isDeleting}
        />
      )}
    </div>
  )
}