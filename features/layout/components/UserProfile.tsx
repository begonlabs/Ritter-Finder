"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Shield,
  Key,
  Edit2,
  Save,
  X,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Clock,
  Activity,
  Crown,
  Users,
  Settings,
  Lock
} from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { useLayout } from "../hooks/useLayout"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import type { UserProfileProps, RoleInfo } from "../types"
import styles from "../styles/UserProfile.module.css"

interface PasswordChangeForm {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

interface PasswordErrors {
  currentPassword?: string
  newPassword?: string
  confirmPassword?: string
  general?: string
}

interface ProfileEditForm {
  name: string
  email: string
  phone: string
  location: string
}

export function UserProfile({ className = "" }: UserProfileProps) {
  const { t } = useLanguage()
  const { state } = useLayout()
  
  // Enhanced role information
  const roleDefinitions: Record<string, RoleInfo> = {
    Admin: {
      id: "admin",
      name: "Admin",
      displayName: "Administrador del Sistema",
      description: "Acceso completo a todas las funcionalidades del sistema, gestión de usuarios y configuración avanzada.",
      level: "admin",
      permissions: [
        "Gestión completa de usuarios",
        "Configuración del sistema",
        "Acceso a todas las campañas",
        "Reportes y analytics avanzados",
        "Gestión de roles y permisos",
        "Configuración de seguridad"
      ],
      color: {
        background: "bg-gradient-to-r from-red-50 to-pink-50",
        text: "text-red-800",
        border: "border-red-200"
      }
    },
    Supervisor: {
      id: "supervisor",
      name: "Supervisor",
      displayName: "Supervisor de Equipo",
      description: "Supervisión de equipos comerciales, acceso a reportes y gestión de campañas asignadas.",
      level: "advanced",
      permissions: [
        "Supervisión de equipos",
        "Gestión de campañas asignadas",
        "Reportes de equipo",
        "Asignación de leads",
        "Configuración básica"
      ],
      color: {
        background: "bg-gradient-to-r from-blue-50 to-indigo-50",
        text: "text-blue-800",
        border: "border-blue-200"
      }
    },
    Comercial: {
      id: "comercial",
      name: "Comercial",
      displayName: "Agente Comercial",
      description: "Acceso a herramientas de búsqueda, gestión de leads asignados y seguimiento de campañas.",
      level: "intermediate",
      permissions: [
        "Búsqueda de leads",
        "Gestión de leads asignados",
        "Seguimiento de campañas",
        "Reportes básicos",
        "Actualización de perfil"
      ],
      color: {
        background: "bg-gradient-to-r from-green-50 to-emerald-50",
        text: "text-green-800",
        border: "border-green-200"
      }
    }
  }
  
  // Mock user data with enhanced role info
  const mockUser = {
    id: "user_001",
    name: "Juan Carlos Pérez",
    email: "juan.perez@ritterfinder.com",
    phone: "+34 600 123 456",
    location: "Madrid, España",
    role: "Admin",
    roleInfo: roleDefinitions["Admin"],
    avatar: null,
    joinDate: new Date(2023, 5, 15),
    lastLogin: new Date(Date.now() - 1000 * 60 * 30),
    loginCount: 245,
    status: "active" as const,
    permissions: ["admin.users", "admin.roles", "admin.settings"],
    preferences: {
      language: "es",
      timezone: "Europe/Madrid",
      notifications: true
    }
  }

  // States
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [profileForm, setProfileForm] = useState<ProfileEditForm>({
    name: mockUser.name,
    email: mockUser.email,
    phone: mockUser.phone,
    location: mockUser.location
  })
  
  const [passwordForm, setPasswordForm] = useState<PasswordChangeForm>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  
  const [passwordErrors, setPasswordErrors] = useState<PasswordErrors>({})
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false)
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false)

  // Password validation
  const validatePassword = (password: string): string[] => {
    const errors: string[] = []
    if (password.length < 8) errors.push("Mínimo 8 caracteres")
    if (!/[A-Z]/.test(password)) errors.push("Al menos una mayúscula")
    if (!/[a-z]/.test(password)) errors.push("Al menos una minúscula")
    if (!/\d/.test(password)) errors.push("Al menos un número")
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push("Al menos un carácter especial")
    return errors
  }

  // Handle password change
  const handlePasswordChange = async () => {
    setPasswordErrors({})
    
    const errors: PasswordErrors = {}
    
    if (!passwordForm.currentPassword) {
      errors.currentPassword = "La contraseña actual es requerida"
    }
    
    if (!passwordForm.newPassword) {
      errors.newPassword = "La nueva contraseña es requerida"
    } else {
      const passwordValidation = validatePassword(passwordForm.newPassword)
      if (passwordValidation.length > 0) {
        errors.newPassword = passwordValidation.join(", ")
      }
    }
    
    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = "Confirma la nueva contraseña"
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = "Las contraseñas no coinciden"
    }
    
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors)
      return
    }
    
    setIsSubmittingPassword(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      })
      setIsChangingPassword(false)
      
      console.log("Contraseña cambiada exitosamente")
    } catch (error) {
      setPasswordErrors({ general: "Error al cambiar la contraseña" })
    } finally {
      setIsSubmittingPassword(false)
    }
  }

  // Handle profile update
  const handleProfileUpdate = async () => {
    setIsSubmittingProfile(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setIsEditingProfile(false)
      console.log("Perfil actualizado exitosamente")
    } catch (error) {
      console.error("Error actualizando perfil:", error)
    } finally {
      setIsSubmittingProfile(false)
    }
  }

  // Cancel profile edit
  const handleCancelProfileEdit = () => {
    setProfileForm({
      name: mockUser.name,
      email: mockUser.email,
      phone: mockUser.phone,
      location: mockUser.location
    })
    setIsEditingProfile(false)
  }

  // Get role level icon
  const getRoleLevelIcon = (level: string) => {
    switch (level) {
      case 'admin':
        return <Crown className="h-4 w-4" />
      case 'advanced':
        return <Users className="h-4 w-4" />
      case 'intermediate':
        return <Settings className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  return (
    <div className={`${styles.userProfile} ${className}`}>
      {/* Header */}
      <div className={styles.profileHeader}>
        <div className={styles.headerContent}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              <User className="h-8 w-8" />
            </div>
            <div className={styles.userDetails}>
              <h1 className={styles.userName}>{mockUser.name}</h1>
              <p className={styles.userEmail}>{mockUser.email}</p>
              
              {/* Enhanced Role Display */}
              <div className={styles.roleContainer}>
                <div className={`${styles.roleBadge} ${mockUser.roleInfo?.color.background} ${mockUser.roleInfo?.color.text} ${mockUser.roleInfo?.color.border}`}>
                  {getRoleLevelIcon(mockUser.roleInfo?.level || 'basic')}
                  <span className={styles.roleTitle}>{mockUser.roleInfo?.displayName || mockUser.role}</span>
                  <Badge variant="outline" className={styles.roleLevelBadge}>
                    {mockUser.roleInfo?.level === 'admin' ? 'Nivel Máximo' : 
                     mockUser.roleInfo?.level === 'advanced' ? 'Nivel Avanzado' : 
                     mockUser.roleInfo?.level === 'intermediate' ? 'Nivel Intermedio' : 'Nivel Básico'}
                  </Badge>
                </div>
                <p className={styles.roleDescription}>
                  {mockUser.roleInfo?.description}
                </p>
              </div>
            </div>
          </div>
          
          <div className={styles.headerActions}>
            <Button
              variant="outline"
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className={styles.editButton}
            >
              {isEditingProfile ? (
                <>
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </>
              ) : (
                <>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Editar Perfil
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="info" className={styles.profileTabs}>
        <TabsList className={styles.tabsList}>
          <TabsTrigger value="info" className={styles.tabsTrigger}>
            <User className="h-4 w-4 mr-2" />
            Información Personal
          </TabsTrigger>
          <TabsTrigger value="security" className={styles.tabsTrigger}>
            <Shield className="h-4 w-4 mr-2" />
            Seguridad
          </TabsTrigger>
          <TabsTrigger value="activity" className={styles.tabsTrigger}>
            <Activity className="h-4 w-4 mr-2" />
            Actividad
          </TabsTrigger>
        </TabsList>

        {/* Personal Information Tab */}
        <TabsContent value="info" className={styles.tabsContent}>
          <div className={styles.infoTabContainer}>
            {/* Personal Info Card */}
            <Card className={styles.infoCard}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Información Personal</span>
                  {isEditingProfile && (
                    <Button
                      onClick={handleProfileUpdate}
                      disabled={isSubmittingProfile}
                      className={styles.saveButton}
                    >
                      {isSubmittingProfile ? (
                        <>
                          <div className={styles.spinner} />
                          Guardando...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Guardar
                        </>
                      )}
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className={styles.infoContent}>
                <div className={styles.infoGrid}>
                  <div className={styles.infoField}>
                    <Label className={styles.fieldLabel}>
                      <User className="h-4 w-4 mr-2" />
                      Nombre Completo
                    </Label>
                    {isEditingProfile ? (
                      <Input
                        value={profileForm.name}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                        className={styles.fieldInput}
                      />
                    ) : (
                      <p className={styles.fieldValue}>{mockUser.name}</p>
                    )}
                  </div>

                  <div className={styles.infoField}>
                    <Label className={styles.fieldLabel}>
                      <Mail className="h-4 w-4 mr-2" />
                      Correo Electrónico
                    </Label>
                    {isEditingProfile ? (
                      <Input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                        className={styles.fieldInput}
                      />
                    ) : (
                      <p className={styles.fieldValue}>{mockUser.email}</p>
                    )}
                  </div>

                  <div className={styles.infoField}>
                    <Label className={styles.fieldLabel}>
                      <Phone className="h-4 w-4 mr-2" />
                      Teléfono
                    </Label>
                    {isEditingProfile ? (
                      <Input
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                        className={styles.fieldInput}
                      />
                    ) : (
                      <p className={styles.fieldValue}>{mockUser.phone}</p>
                    )}
                  </div>

                  <div className={styles.infoField}>
                    <Label className={styles.fieldLabel}>
                      <MapPin className="h-4 w-4 mr-2" />
                      Ubicación
                    </Label>
                    {isEditingProfile ? (
                      <Input
                        value={profileForm.location}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, location: e.target.value }))}
                        className={styles.fieldInput}
                      />
                    ) : (
                      <p className={styles.fieldValue}>{mockUser.location}</p>
                    )}
                  </div>

                  <div className={styles.infoField}>
                    <Label className={styles.fieldLabel}>
                      <Calendar className="h-4 w-4 mr-2" />
                      Fecha de Registro
                    </Label>
                    <p className={styles.fieldValue}>
                      {mockUser.joinDate.toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>

                  <div className={styles.infoField}>
                    <Label className={styles.fieldLabel}>
                      <Shield className="h-4 w-4 mr-2" />
                      Estado de la Cuenta
                    </Label>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Activa
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Role & Permissions Card */}
            <Card className={styles.roleCard}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-ritter-gold" />
                  Rol y Permisos
                </CardTitle>
              </CardHeader>
              <CardContent className={styles.roleContent}>
                <div className={styles.roleInfo}>
                  <div className={styles.roleHeader}>
                    <div className={`${styles.roleMainBadge} ${mockUser.roleInfo?.color.background} ${mockUser.roleInfo?.color.text} ${mockUser.roleInfo?.color.border}`}>
                      {getRoleLevelIcon(mockUser.roleInfo?.level || 'basic')}
                      <div className={styles.roleMainInfo}>
                        <h3 className={styles.roleMainTitle}>{mockUser.roleInfo?.displayName}</h3>
                        <p className={styles.roleMainLevel}>
                          {mockUser.roleInfo?.level === 'admin' ? 'Administrador del Sistema' : 
                           mockUser.roleInfo?.level === 'advanced' ? 'Usuario Avanzado' : 
                           mockUser.roleInfo?.level === 'intermediate' ? 'Usuario Intermedio' : 'Usuario Básico'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <p className={styles.roleMainDescription}>
                    {mockUser.roleInfo?.description}
                  </p>

                  <Separator className="my-4" />

                  <div className={styles.permissionsSection}>
                    <h4 className={styles.permissionsTitle}>
                      <Lock className="h-4 w-4 mr-2" />
                      Permisos Asignados
                    </h4>
                    <div className={styles.permissionsList}>
                      {mockUser.roleInfo?.permissions.map((permission, index) => (
                        <div key={index} className={styles.permissionItem}>
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>{permission}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className={styles.tabsContent}>
          <Card className={styles.securityCard}>
            <CardHeader>
              <CardTitle>Configuración de Seguridad</CardTitle>
            </CardHeader>
            <CardContent className={styles.securityContent}>
              <div className={styles.securitySection}>
                <div className={styles.sectionHeader}>
                  <div className={styles.sectionInfo}>
                    <h3 className={styles.sectionTitle}>Contraseña</h3>
                    <p className={styles.sectionDescription}>
                      Mantén tu cuenta segura con una contraseña fuerte
                    </p>
                  </div>
                  
                  <Dialog open={isChangingPassword} onOpenChange={setIsChangingPassword}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className={styles.changePasswordButton}>
                        <Key className="h-4 w-4 mr-2" />
                        Cambiar Contraseña
                      </Button>
                    </DialogTrigger>
                    <DialogContent className={styles.passwordDialog}>
                      <DialogHeader>
                        <DialogTitle>Cambiar Contraseña</DialogTitle>
                        <DialogDescription>
                          Ingresa tu contraseña actual y elige una nueva contraseña segura.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className={styles.passwordForm}>
                        {/* Current Password */}
                        <div className={styles.passwordField}>
                          <Label htmlFor="currentPassword">Contraseña Actual</Label>
                          <div className={styles.passwordInputWrapper}>
                            <Input
                              id="currentPassword"
                              type={showCurrentPassword ? "text" : "password"}
                              value={passwordForm.currentPassword}
                              onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                              className={passwordErrors.currentPassword ? styles.inputError : ''}
                            />
                            <button
                              type="button"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              className={styles.passwordToggle}
                            >
                              {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                          {passwordErrors.currentPassword && (
                            <p className={styles.errorMessage}>
                              <AlertCircle className="h-3 w-3 mr-1" />
                              {passwordErrors.currentPassword}
                            </p>
                          )}
                        </div>

                        {/* New Password */}
                        <div className={styles.passwordField}>
                          <Label htmlFor="newPassword">Nueva Contraseña</Label>
                          <div className={styles.passwordInputWrapper}>
                            <Input
                              id="newPassword"
                              type={showNewPassword ? "text" : "password"}
                              value={passwordForm.newPassword}
                              onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                              className={passwordErrors.newPassword ? styles.inputError : ''}
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className={styles.passwordToggle}
                            >
                              {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                          {passwordErrors.newPassword && (
                            <p className={styles.errorMessage}>
                              <AlertCircle className="h-3 w-3 mr-1" />
                              {passwordErrors.newPassword}
                            </p>
                          )}
                          
                          {/* Password Requirements */}
                          {passwordForm.newPassword && (
                            <div className={styles.passwordRequirements}>
                              <p className={styles.requirementsTitle}>Requisitos de contraseña:</p>
                              <ul className={styles.requirementsList}>
                                {[
                                  { test: passwordForm.newPassword.length >= 8, text: "Mínimo 8 caracteres" },
                                  { test: /[A-Z]/.test(passwordForm.newPassword), text: "Una mayúscula" },
                                  { test: /[a-z]/.test(passwordForm.newPassword), text: "Una minúscula" },
                                  { test: /\d/.test(passwordForm.newPassword), text: "Un número" },
                                  { test: /[!@#$%^&*(),.?":{}|<>]/.test(passwordForm.newPassword), text: "Un carácter especial" }
                                ].map((req, index) => (
                                  <li key={index} className={req.test ? styles.requirementMet : styles.requirementUnmet}>
                                    {req.test ? <CheckCircle className="h-3 w-3" /> : <X className="h-3 w-3" />}
                                    {req.text}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        {/* Confirm Password */}
                        <div className={styles.passwordField}>
                          <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
                          <div className={styles.passwordInputWrapper}>
                            <Input
                              id="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              value={passwordForm.confirmPassword}
                              onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                              className={passwordErrors.confirmPassword ? styles.inputError : ''}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className={styles.passwordToggle}
                            >
                              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                          {passwordErrors.confirmPassword && (
                            <p className={styles.errorMessage}>
                              <AlertCircle className="h-3 w-3 mr-1" />
                              {passwordErrors.confirmPassword}
                            </p>
                          )}
                        </div>

                        {/* General Error */}
                        {passwordErrors.general && (
                          <div className={styles.generalError}>
                            <AlertCircle className="h-4 w-4 mr-2" />
                            {passwordErrors.general}
                          </div>
                        )}
                      </div>
                      
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsChangingPassword(false)
                            setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
                            setPasswordErrors({})
                          }}
                        >
                          Cancelar
                        </Button>
                        <Button
                          onClick={handlePasswordChange}
                          disabled={isSubmittingPassword}
                          className={styles.submitButton}
                        >
                          {isSubmittingPassword ? (
                            <>
                              <div className={styles.spinner} />
                              Cambiando...
                            </>
                          ) : (
                            <>
                              <Key className="h-4 w-4 mr-2" />
                              Cambiar Contraseña
                            </>
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <Separator className="my-6" />
                
                <div className={styles.securityInfo}>
                  <div className={styles.securityItem}>
                    <div className={styles.securityIcon}>
                      <Shield className="h-5 w-5 text-green-600" />
                    </div>
                    <div className={styles.securityDetails}>
                      <h4 className={styles.securityItemTitle}>Autenticación de Dos Factores</h4>
                      <p className={styles.securityItemDescription}>
                        Próximamente disponible para mayor seguridad
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                      Próximamente
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className={styles.tabsContent}>
          <Card className={styles.activityCard}>
            <CardHeader>
              <CardTitle>Actividad de la Cuenta</CardTitle>
            </CardHeader>
            <CardContent className={styles.activityContent}>
              <div className={styles.activityStats}>
                <div className={styles.statItem}>
                  <div className={styles.statIcon}>
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className={styles.statDetails}>
                    <p className={styles.statLabel}>Último Acceso</p>
                    <p className={styles.statValue}>
                      {formatDistanceToNow(mockUser.lastLogin, { addSuffix: true, locale: es })}
                    </p>
                  </div>
                </div>
                
                <div className={styles.statItem}>
                  <div className={styles.statIcon}>
                    <Activity className="h-5 w-5 text-green-600" />
                  </div>
                  <div className={styles.statDetails}>
                    <p className={styles.statLabel}>Total de Accesos</p>
                    <p className={styles.statValue}>{mockUser.loginCount}</p>
                  </div>
                </div>
                
                <div className={styles.statItem}>
                  <div className={styles.statIcon}>
                    <Calendar className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className={styles.statDetails}>
                    <p className={styles.statLabel}>Miembro desde</p>
                    <p className={styles.statValue}>
                      {formatDistanceToNow(mockUser.joinDate, { addSuffix: true, locale: es })}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 