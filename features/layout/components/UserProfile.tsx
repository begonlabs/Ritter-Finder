"use client"

import { useState } from "react"
import { 
  User, Mail, Shield, Calendar, Clock, 
  CheckCircle, AlertCircle, Eye, EyeOff,
  Settings, Edit3, Save, X 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useLayout } from "../hooks/useLayout"
import { formatDistanceToNow, format } from "date-fns"
import { es } from "date-fns/locale"
import type { UserProfileProps } from "../types"
import styles from "../styles/UserProfile.module.css"

interface UserProfileExtendedProps extends UserProfileProps {
  canEdit?: boolean
  onEdit?: () => void
  onSave?: (data: any) => void
  onCancel?: () => void
}

export function UserProfile({ 
  className = "",
  canEdit = true,
  onEdit,
  onSave,
  onCancel 
}: UserProfileExtendedProps) {
  const { state, actions } = useLayout()
  const [isEditing, setIsEditing] = useState(false)
  const [showSensitiveInfo, setShowSensitiveInfo] = useState(false)
  const [editData, setEditData] = useState({
    fullName: state.user?.fullName || '',
    email: state.user?.email || ''
  })

  if (!state.user) {
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

  const user = state.user

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

  const handleSave = () => {
    // Update user data
    const updatedUser = { ...user, ...editData }
    actions.setUser(updatedUser)
    setIsEditing(false)
    onSave?.(editData)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditData({
      fullName: user.fullName,
      email: user.email
    })
    onCancel?.()
  }

  return (
    <div className={`${styles.profileContainer} ${className}`}>
      {/* Header Card */}
      <Card className={styles.headerCard}>
        <CardHeader>
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
                    />
                    <div className={styles.editActions}>
                      <Button size="sm" onClick={handleSave} className={styles.saveButton}>
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancel} className={styles.cancelButton}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className={styles.nameDisplay}>
                    <CardTitle className={styles.profileName}>{user.fullName}</CardTitle>
                    {canEdit && (
                      <Button size="sm" variant="ghost" onClick={handleEdit} className={styles.editButton}>
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
              
              <div className={styles.profileEmail}>
                {isEditing ? (
                  <Input
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                    className={styles.editInput}
                    placeholder="email@example.com"
                  />
                ) : (
                  <p className={styles.emailText}>{user.email}</p>
                )}
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
        </CardHeader>
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

            {user.passwordSetAt && (
              <div className={styles.infoItem}>
                <Label className={styles.infoLabel}>Password establecida</Label>
                <div className={styles.infoValue}>
                  <Calendar className="h-4 w-4 mr-2" />
                  {format(user.passwordSetAt, 'dd/MM/yyyy', { locale: es })}
                </div>
              </div>
            )}
          </div>
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
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Verificado</span>
                    {showSensitiveInfo && (
                      <span className={styles.verificationDate}>
                        ({format(user.emailVerifiedAt, 'dd/MM/yyyy', { locale: es })})
                      </span>
                    )}
                  </div>
                ) : (
                  <div className={styles.unverified}>
                    <AlertCircle className="h-4 w-4 text-orange-600" />
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
  )
} 