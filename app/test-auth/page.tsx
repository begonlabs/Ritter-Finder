"use client"

import { useAuth } from '@/features/auth/hooks/useAuth'
import { useLayout } from '@/features/layout/hooks/useLayout'
import { useNavigation } from '@/features/layout/hooks/useNavigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, AlertCircle, Shield, User, LogOut } from 'lucide-react'

export default function TestAuthPage() {
  const auth = useAuth()
  const layout = useLayout()
  
  // Test navigation with current user
  const { navigationItems, availableItems, hasAccess, permissionChecker } = useNavigation({
    user: layout.state.user,
    activeTab: 'dashboard',
    searchComplete: false,
    selectedLeadsCount: 0
  })

  const handleLogout = async () => {
    try {
      await auth.signOut()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const testPermissions = [
    'admin:users',
    'admin:settings', 
    'admin:roles',
    'leads:search',
    'leads:read',
    'campaigns:create',
    'campaigns:send',
    'analytics:view',
    'export:unlimited',
    'settings:manage'
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-blue-600" />
              Test Auth & Permissions - RitterFinder
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  Prueba de autenticación y sistema de permisos para usuario admin
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Admin email: itsjhonalex@gmail.com | Expected role: admin
                </p>
              </div>
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Auth Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Estado de Autenticación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                {auth.user ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <span className="font-medium">
                  {auth.user ? 'Autenticado' : 'No autenticado'}
                </span>
              </div>

              {auth.user && (
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Email:</strong> {auth.user.email}
                  </div>
                  <div>
                    <strong>ID:</strong> {auth.user.id}
                  </div>
                  <div>
                    <strong>Verificado:</strong> {auth.user.email_confirmed_at ? '✅' : '❌'}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* User Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Perfil de Usuario</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {layout.state.user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">{layout.state.user.fullName}</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Email:</strong> {layout.state.user.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <strong>Estado:</strong>
                      <Badge variant={layout.state.user.status === 'active' ? 'default' : 'secondary'}>
                        {layout.state.user.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <strong>Rol:</strong>
                      <Badge variant="outline">
                        {layout.state.user.role.name}
                      </Badge>
                    </div>
                    <div>
                      <strong>Es Admin:</strong> {layout.state.user.role.name?.toLowerCase() === 'admin' || layout.state.user.role.name?.toLowerCase() === 'administrator' || layout.state.user.role.name?.toLowerCase() === 'administrador' ? '✅' : '❌'}
                    </div>
                    <div>
                      <strong>Permisos en rol:</strong> {layout.state.user.role.permissions.length}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-amber-600">
                  <AlertCircle className="h-5 w-5" />
                  <span>Cargando perfil de usuario...</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Debug Raw Data */}
        {layout.state.user && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Debug - Datos en Crudo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Auth User (Supabase):</h4>
                <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                  {JSON.stringify({
                    id: auth.user?.id,
                    email: auth.user?.email,
                    email_confirmed_at: auth.user?.email_confirmed_at,
                    user_metadata: auth.user?.user_metadata
                  }, null, 2)}
                </pre>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Layout User (DB Profile):</h4>
                <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                  {JSON.stringify({
                    id: layout.state.user?.id,
                    fullName: layout.state.user?.fullName,
                    email: layout.state.user?.email,
                    status: layout.state.user?.status,
                    role: {
                      name: layout.state.user?.role.name,
                      isSystemRole: layout.state.user?.role.isSystemRole,
                      permissionsCount: layout.state.user?.role.permissions.length
                    }
                  }, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Permissions Testing */}
        {layout.state.user && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Test de Permisos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Permisos disponibles del usuario:</h4>
                  <div className="flex flex-wrap gap-2">
                    {layout.state.user.role.permissions.map((permission) => (
                      <Badge key={permission.id} variant="outline" className="text-xs">
                        {permission.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Test de permisos específicos:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {testPermissions.map((permission) => {
                      const hasPermission = permissionChecker.hasPermission(permission)
                      return (
                        <div key={permission} className="flex items-center gap-2 text-sm">
                          {hasPermission ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                          <span className={hasPermission ? 'text-green-700' : 'text-red-700'}>
                            {permission}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Items */}
        {layout.state.user && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Items de Navegación Disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Navegación principal ({navigationItems.length} items):</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {navigationItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-2 text-sm p-2 bg-green-50 rounded">
                        <item.icon className="h-4 w-4 text-green-600" />
                        <span className="text-green-700">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Todos los items disponibles ({availableItems.length} items):</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {availableItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-2 text-sm p-2 bg-blue-50 rounded">
                        <item.icon className="h-4 w-4 text-blue-600" />
                        <span className="text-blue-700">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Test de acceso directo:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {['dashboard', 'search', 'results', 'campaign', 'history', 'scraping', 'analytics', 'admin'].map((itemId) => {
                      const access = hasAccess(itemId)
                      return (
                        <div key={itemId} className="flex items-center gap-2 text-sm">
                          {access ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                          <span className={access ? 'text-green-700' : 'text-red-700'}>
                            {itemId}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Debug Console */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Debug Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div>
                <strong>Auth loading:</strong> {auth.isLoading ? 'Sí' : 'No'}
              </div>
              <div>
                <strong>Layout user loaded:</strong> {layout.state.user ? 'Sí' : 'No'}
              </div>
              <div>
                <strong>Notifications:</strong> {layout.state.notifications.length}
              </div>
              <div className="text-xs text-gray-600 mt-4">
                Revisa la consola del navegador para logs detallados de permisos y carga de datos.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 