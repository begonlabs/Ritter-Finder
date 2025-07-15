"use client"

/**
 * UserProfile Component - RitterFinder Layout System
 * 
 * Enhanced user profile component with password change functionality and improved organization.
 * 
 * Features:
 * - Profile information editing
 * - Password change with validation
 * - Security settings display
 * - Permissions overview
 * - Responsive design
 * 
 * Props:
 * - user: UserProfile object with user data
 * - canEdit: boolean to enable/disable editing
 * - onEdit: callback when editing starts
 * - onSave: callback when profile is saved
 * - onCancel: callback when editing is cancelled
 * - onPasswordChange: callback when password is changed
 */

import { useState } from "react"
import { 
  User, Mail, Shield, Calendar, Clock, 
  CheckCircle, AlertCircle, Eye, EyeOff,
  Settings, Edit3, Save, X, Lock, Key,
  EyeOff as EyeOffIcon, Eye as EyeIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useLayout } from "../hooks/useLayout"
import { useChangePassword } from "@/features/auth/hooks/useChangePassword"
import { PasswordChangeNotification } from "./PasswordChangeNotification"
import { formatDistanceToNow, format } from "date-fns"
import { es } from "date-fns/locale"
import type { UserProfileProps } from "../types"
import styles from "../styles/UserProfile.module.css"

interface UserProfileExtendedProps extends UserProfileProps {
  canEdit?: boolean
  onEdit?: () => void
  onSave?: (data: any) => void
  onCancel?: () => void
  onPasswordChange?: (data: any) => void
  onLogout?: () => void
}

export function UserProfile({ 
  user,
  className = "",
  canEdit = true,
  onEdit,
  onSave,
  onCancel,
  onPasswordChange,
  onLogout
}: UserProfileExtendedProps) {
  const layout = useLayout()
  const changePassword = useChangePassword()
  const [isEditing, setIsEditing] = useState(false)
  const [showSensitiveInfo, setShowSensitiveInfo] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [notification, setNotification] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)
  const [editData, setEditData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || ''
  })

  // Update edit data when user changes
  useState(() => {
    if (user) {
      setEditData({
        fullName: user.fullName,
        email: user.email
      })
    }
  })

  if (!user) {
    return (
      <div className={`${styles.profileContainer} ${className}`}>
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No hay usuario autenticado</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'active':
        return { color: 'bg-green-100 text-green-800 border-green-200', text: 'Activo', icon: CheckCircle }
      case 'invited':
        return { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', text: 'Invitado', icon: Clock }
      case 'inactive':
        return { color: 'bg-gray-100 text-gray-800 border-gray-200', text: 'Inactivo', icon: AlertCircle }
      case 'suspended':
        return { color: 'bg-red-100 text-red-800 border-red-200', text: 'Suspendido', icon: AlertCircle }
      case 'banned':
        return { color: 'bg-red-100 text-red-800 border-red-200', text: 'Baneado', icon: AlertCircle }
      case 'locked':
        return { color: 'bg-orange-100 text-orange-800 border-orange-200', text: 'Bloqueado', icon: AlertCircle }
      default:
        return { color: 'bg-gray-100 text-gray-800 border-gray-200', text: 'Desconocido', icon: AlertCircle }
    }
  }

  const statusInfo = getStatusInfo(user.status)
  const StatusIcon = statusInfo.icon

  const handleEdit = () => {
    setIsEditing(true)
    setEditData({
      fullName: user.fullName,
      email: user.email
    })
    onEdit?.()
  }

  const handleSave = async () => {
    if (!editData.fullName.trim()) {
      return
    }

    setIsLoading(true)
    
    try {
      const result = await layout.actions.updateUserProfile({
        fullName: editData.fullName.trim()
      })

      if (result.success) {
        setIsEditing(false)
        onSave?.(editData)
        setNotification({
          type: 'success',
          message: 'Perfil actualizado exitosamente'
        })
      } else {
        console.error('Error updating profile:', result.error)
        setNotification({
          type: 'error',
          message: result.error || 'Error al actualizar el perfil'
        })
      }
      
    } catch (error) {
      console.error('Error updating user profile:', error)
      setNotification({
        type: 'error',
        message: 'Error inesperado al actualizar el perfil'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditData({
      fullName: user.fullName,
      email: user.email
    })
    onCancel?.()
  }

  const handlePasswordChange = async () => {
    const validationError = changePassword.validateForm()
    if (validationError) {
      // Show validation error to user instead of console.error
      setNotification({
        type: 'error',
        message: validationError
      })
      return
    }

    setIsChangingPassword(true)
    
    try {
      const result = await changePassword.handleChangePassword({
        currentPassword: changePassword.state.currentPassword,
        newPassword: changePassword.state.newPassword,
        confirmPassword: changePassword.state.confirmPassword
      })

      if (result.success) {
        onPasswordChange?.({
          currentPassword: changePassword.state.currentPassword,
          newPassword: changePassword.state.newPassword
        })
        
        // Reset form and hide password change section
        changePassword.resetForm()
        setIsChangingPassword(false)
        setShowPasswords({
          current: false,
          new: false,
          confirm: false
        })
        
        setNotification({
          type: 'success',
          message: 'Contraseña actualizada exitosamente. Por seguridad, se recomienda cerrar sesión.'
        })
      } else {
        // Show error to user instead of console.error
        setNotification({
          type: 'error',
          message: result.error || 'Error al cambiar la contraseña'
        })
      }
      
    } catch (error) {
      // Handle unexpected errors gracefully
      const errorMessage = error instanceof Error ? error.message : 'Error inesperado al cambiar la contraseña'
      setNotification({
        type: 'error',
        message: errorMessage
      })
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handlePasswordCancel = () => {
    setIsChangingPassword(false)
    changePassword.resetForm()
    setShowPasswords({
      current: false,
      new: false,
      confirm: false
    })
  }

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const updatePasswordField = (field: 'currentPassword' | 'newPassword' | 'confirmPassword', value: string) => {
    changePassword.updateField(field, value)
    
    // Clear notification when user starts typing
    if (notification) {
      setNotification(null)
    }
  }

  const passwordStrength = changePassword.getPasswordStrength(changePassword.state.newPassword)

  const handleNotificationClose = () => {
    setNotification(null)
  }

  return (
    <>
      <div className={`${styles.profileContainer} ${className}`}>
        {/* Profile Header */}
        <Card className={styles.headerCard}>
          <div className={styles.profileHeader}>
            <Avatar className={styles.profileAvatar}>
              <AvatarFallback className={styles.avatarFallback}>
                {user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className={styles.profileHeaderInfo}>
              <div className={styles.profileNameSection}>
                {isEditing ? (
                  <div className={styles.editNameSection}>
                    <Input
                      value={editData.fullName}
                      onChange={(e) => setEditData(prev => ({ ...prev, fullName: e.target.value }))}
                      className={styles.editInput}
                      placeholder="Nombre completo"
                      disabled={isLoading}
                    />
                    <div className={styles.editActions}>
                      <Button 
                        size="sm" 
                        onClick={handleSave} 
                        className={styles.saveButton}
                        disabled={isLoading || !editData.fullName.trim()}
                      >
                        {isLoading ? (
                          <div className={styles.spinner} />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={handleCancel} 
                        className={styles.cancelButton}
                        disabled={isLoading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className={styles.nameDisplay}>
                    <h1 className={styles.profileName}>{user.fullName}</h1>
                    {canEdit && (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={handleEdit} 
                        className={styles.editButton}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
              
              <div className={styles.profileEmail}>
                <p className={styles.emailText}>{user.email}</p>
                <small className={styles.emailNote}>
                  {user.emailVerifiedAt ? '✓ Email verificado' : '⚠ Email no verificado'}
                </small>
              </div>

              <div className={styles.profileBadges}>
                <Badge className={statusInfo.color}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {statusInfo.text}
                </Badge>
                <Badge variant="outline" className={styles.roleBadge}>
                  <Shield className="h-3 w-3 mr-1" />
                  {user.role.name}
                </Badge>
                {user.twoFactorEnabled && (
                  <Badge variant="outline" className={styles.twofaBadge}>
                    <Shield className="h-3 w-3 mr-1" />
                    2FA
                  </Badge>
                )}
                {user.emailVerifiedAt && (
                  <Badge variant="outline" className={styles.verifiedBadge}>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verificado
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Account Information */}
        <Card className={styles.infoCard}>
          <CardHeader>
            <CardTitle className={styles.cardTitle}>
              <User className="h-5 w-5" />
              Información de la Cuenta
            </CardTitle>
          </CardHeader>
          <CardContent className={styles.infoContent}>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <Label className={styles.infoLabel}>ID de Usuario</Label>
                <div className={styles.infoValue}>
                  <span className="font-mono text-sm">{user.id}</span>
                </div>
              </div>

              <div className={styles.infoItem}>
                <Label className={styles.infoLabel}>Estado</Label>
                <div className={styles.infoValue}>
                  <StatusIcon className="h-4 w-4 mr-2" />
                  {statusInfo.text}
                </div>
              </div>

              <div className={styles.infoItem}>
                <Label className={styles.infoLabel}>Rol</Label>
                <div className={styles.infoValue}>
                  <Shield className="h-4 w-4 mr-2" />
                  {user.role.name}
                  {user.role.isSystemRole && (
                    <Badge variant="outline" className="ml-2">Sistema</Badge>
                  )}
                </div>
              </div>

              <div className={styles.infoItem}>
                <Label className={styles.infoLabel}>Último acceso</Label>
                <div className={styles.infoValue}>
                  <Clock className="h-4 w-4 mr-2" />
                  {user.lastLoginAt ? (
                    <>
                      {formatDistanceToNow(user.lastLoginAt, { addSuffix: true, locale: es })}
                      <span className={styles.infoSubtext}>
                        ({format(user.lastLoginAt, 'dd/MM/yyyy HH:mm', { locale: es })})
                      </span>
                    </>
                  ) : (
                    'Nunca'
                  )}
                </div>
              </div>

              <div className={styles.infoItem}>
                <Label className={styles.infoLabel}>Miembro desde</Label>
                <div className={styles.infoValue}>
                  <Calendar className="h-4 w-4 mr-2" />
                  {format(user.createdAt, 'dd/MM/yyyy', { locale: es })}
                </div>
              </div>

              {user.invitedAt && (
                <div className={styles.infoItem}>
                  <Label className={styles.infoLabel}>Invitado</Label>
                  <div className={styles.infoValue}>
                    <Mail className="h-4 w-4 mr-2" />
                    {format(user.invitedAt, 'dd/MM/yyyy', { locale: es })}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Password Change Section */}
        <Card className={styles.passwordCard}>
          <CardHeader>
            <CardTitle className={styles.cardTitle}>
              <Lock className="h-5 w-5" />
              Cambiar Contraseña
            </CardTitle>
          </CardHeader>
          <CardContent className={styles.passwordContent}>
            {isChangingPassword ? (
              <div className={styles.passwordForm}>
                {/* Error Message */}
                {changePassword.state.error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-700 text-sm">{changePassword.state.error}</p>
                  </div>
                )}

                <div className={styles.passwordField}>
                  <Label className={styles.passwordLabel}>Contraseña Actual</Label>
                  <div className={styles.passwordInputWrapper}>
                    <Input
                      type={showPasswords.current ? "text" : "password"}
                      value={changePassword.state.currentPassword}
                      onChange={(e) => updatePasswordField('currentPassword', e.target.value)}
                      placeholder="Ingresa tu contraseña actual"
                      className={styles.passwordInput}
                      disabled={changePassword.state.isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePasswordVisibility('current')}
                      className={styles.passwordToggle}
                    >
                      {showPasswords.current ? <EyeIcon className="h-4 w-4" /> : <EyeOffIcon className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className={styles.passwordField}>
                  <Label className={styles.passwordLabel}>Nueva Contraseña</Label>
                  <div className={styles.passwordInputWrapper}>
                    <Input
                      type={showPasswords.new ? "text" : "password"}
                      value={changePassword.state.newPassword}
                      onChange={(e) => updatePasswordField('newPassword', e.target.value)}
                      placeholder="Ingresa tu nueva contraseña"
                      className={`${styles.passwordInput} ${changePassword.state.newPassword && changePassword.validatePassword(changePassword.state.newPassword) ? styles.passwordError : ''}`}
                      disabled={changePassword.state.isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePasswordVisibility('new')}
                      className={styles.passwordToggle}
                    >
                      {showPasswords.new ? <EyeIcon className="h-4 w-4" /> : <EyeOffIcon className="h-4 w-4" />}
                    </Button>
                  </div>
                  
                  {/* Password Validation Error */}
                  {changePassword.state.newPassword && changePassword.validatePassword(changePassword.state.newPassword) && (
                    <div className={styles.passwordError}>
                      <small className={styles.errorText}>
                        {changePassword.validatePassword(changePassword.state.newPassword)}
                      </small>
                    </div>
                  )}
                  
                  {/* Password Strength Indicator */}
                  {changePassword.state.newPassword && !changePassword.validatePassword(changePassword.state.newPassword) && (
                    <div className="mt-2">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${(passwordStrength.score / 5) * 100}%`,
                              backgroundColor: passwordStrength.color
                            }}
                          />
                        </div>
                        <span className="text-xs font-medium" style={{ color: passwordStrength.color }}>
                          {passwordStrength.label}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <small className={styles.passwordHint}>
                    Mínimo 8 caracteres, incluir mayúsculas, minúsculas y números
                  </small>
                </div>

                <div className={styles.passwordField}>
                  <Label className={styles.passwordLabel}>Confirmar Nueva Contraseña</Label>
                  <div className={styles.passwordInputWrapper}>
                    <Input
                      type={showPasswords.confirm ? "text" : "password"}
                      value={changePassword.state.confirmPassword}
                      onChange={(e) => updatePasswordField('confirmPassword', e.target.value)}
                      placeholder="Confirma tu nueva contraseña"
                      className={styles.passwordInput}
                      disabled={changePassword.state.isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className={styles.passwordToggle}
                    >
                      {showPasswords.confirm ? <EyeIcon className="h-4 w-4" /> : <EyeOffIcon className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className={styles.passwordActions}>
                  <Button 
                    onClick={handlePasswordChange}
                    disabled={changePassword.state.isLoading || !changePassword.state.currentPassword || !changePassword.state.newPassword || !changePassword.state.confirmPassword}
                    className={styles.passwordSaveButton}
                  >
                    {changePassword.state.isLoading ? (
                      <div className={styles.spinner} />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    {changePassword.state.isLoading ? 'Cambiando...' : 'Cambiar Contraseña'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handlePasswordCancel}
                    disabled={changePassword.state.isLoading}
                    className={styles.passwordCancelButton}
                  >
                    <X className="h-4 w-4" />
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <div className={styles.passwordPrompt}>
                <div className={styles.passwordPromptContent}>
                  <Key className={styles.passwordPromptIcon} />
                  <div className={styles.passwordPromptText}>
                    <h4 className={styles.passwordPromptTitle}>Actualiza tu contraseña</h4>
                    <p className={styles.passwordPromptDescription}>
                      Mantén tu cuenta segura con una contraseña fuerte y única
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={() => setIsChangingPassword(true)}
                  className={styles.passwordPromptButton}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Cambiar Contraseña
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Information */}
        <Card className={styles.securityCard}>
          <CardHeader>
            <CardTitle className={styles.cardTitle}>
              <Shield className="h-5 w-5" />
              Seguridad
              <div className={styles.securityToggle}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSensitiveInfo(!showSensitiveInfo)}
                >
                  {showSensitiveInfo ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className={styles.securityContent}>
            <div className={styles.securityGrid}>
              <div className={styles.securityItem}>
                <Label className={styles.securityLabel}>Autenticación 2FA</Label>
                <div className={styles.securityValue}>
                  <Switch 
                    checked={user.twoFactorEnabled} 
                    disabled 
                    className={styles.securitySwitch}
                  />
                  <span className={user.twoFactorEnabled ? styles.enabled : styles.disabled}>
                    {user.twoFactorEnabled ? 'Habilitada' : 'Deshabilitada'}
                  </span>
                </div>
              </div>

              <div className={styles.securityItem}>
                <Label className={styles.securityLabel}>Email verificado</Label>
                <div className={styles.securityValue}>
                  {user.emailVerifiedAt ? (
                    <div className={styles.verified}>
                      <CheckCircle className="h-4 w-4" />
                      <span>Verificado</span>
                      {showSensitiveInfo && (
                        <span className={styles.verificationDate}>
                          ({format(user.emailVerifiedAt, 'dd/MM/yyyy', { locale: es })})
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className={styles.unverified}>
                      <AlertCircle className="h-4 w-4" />
                      <span>No verificado</span>
                    </div>
                  )}
                </div>
              </div>

              {showSensitiveInfo && (
                <div className={styles.securityItem}>
                  <Label className={styles.securityLabel}>Intentos fallidos</Label>
                  <div className={styles.securityValue}>
                    <span className={user.failedLoginAttempts > 0 ? styles.warning : styles.safe}>
                      {user.failedLoginAttempts}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Permissions */}
        <Card className={styles.permissionsCard}>
          <CardHeader>
            <CardTitle className={styles.cardTitle}>
              <Settings className="h-5 w-5" />
              Permisos ({user.role.permissions.length})
            </CardTitle>
          </CardHeader>
          <CardContent className={styles.permissionsContent}>
            <div className={styles.permissionsList}>
              {user.role.permissions.map((permission) => (
                <div key={permission.id} className={styles.permissionItem}>
                  <div className={styles.permissionMain}>
                    <span className={styles.permissionName}>{permission.name}</span>
                    <Badge variant="outline" className={styles.permissionCategory}>
                      {permission.category}
                    </Badge>
                  </div>
                  {permission.description && (
                    <p className={styles.permissionDescription}>{permission.description}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notification */}
      {notification && (
        <PasswordChangeNotification
          type={notification.type}
          message={notification.message}
          onClose={handleNotificationClose}
          onLogout={onLogout}
        />
      )}
    </>
  )
} 