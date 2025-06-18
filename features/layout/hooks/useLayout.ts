import { useState, useCallback, useEffect } from 'react'
import type { 
  LayoutState, 
  LayoutActions, 
  UseLayoutReturn, 
  LayoutTheme,
  NotificationItem,
  UserProfile,
  SecurityAlert,
  Role,
  Permission
} from '../types'

const defaultTheme: LayoutTheme = {
  mode: 'light',
  primaryColor: '#D4A574', // ritter-gold
  secondaryColor: '#2C3E50', // ritter-dark
  borderRadius: '0.5rem'
}

// Mock permissions for demo
const mockPermissions: Permission[] = [
  {
    id: 'perm-1',
    name: 'leads.search',
    description: 'Search for leads',
    category: 'leads',
    resource: 'leads',
    action: 'search'
  },
  {
    id: 'perm-2',
    name: 'campaigns.create',
    description: 'Create campaigns',
    category: 'campaigns',
    resource: 'campaigns',
    action: 'create'
  },
  {
    id: 'perm-3',
    name: 'admin.users',
    description: 'Manage users',
    category: 'admin',
    resource: 'users',
    action: 'manage'
  },
  {
    id: 'perm-4',
    name: 'analytics.view',
    description: 'View analytics',
    category: 'analytics',
    resource: 'analytics',
    action: 'view'
  }
]

// Mock role for demo
const mockAdminRole: Role = {
  id: 'role-admin-1',
  name: 'Admin',
  description: 'Full system access',
  isSystemRole: true,
  permissions: mockPermissions,
  createdAt: new Date(2023, 5, 15),
  updatedAt: new Date()
}

// Enhanced default user with new structure
const defaultUser: UserProfile = {
  id: 'demo-user-1',
  email: 'demo@ritterfinder.com',
  fullName: 'Usuario Demo',
  status: 'active',
  role: mockAdminRole,
  lastLoginAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
  emailVerifiedAt: new Date(2023, 5, 16),
  twoFactorEnabled: false,
  invitedAt: new Date(2023, 5, 15),
  passwordSetAt: new Date(2023, 5, 16),
  failedLoginAttempts: 0,
  createdAt: new Date(2023, 5, 15),
  updatedAt: new Date()
}

// Enhanced notifications with new structure
const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'lead',
    title: 'Nuevos leads encontrados',
    message: '5 nuevos leads encontrados en tu búsqueda de "Inmobiliarias Madrid"',
    priority: 1,
    isRead: false,
    isArchived: false,
    actionUrl: '/dashboard?tab=results',
    actionText: 'Ver leads',
    relatedType: 'search',
    relatedId: 'search-123',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: 'notif-2',
    type: 'campaign',
    title: 'Campaña completada',
    message: 'Tu campaña "Inmobiliarias Madrid" ha terminado con un 45% de apertura',
    priority: 2,
    isRead: false,
    isArchived: false,
    actionUrl: '/dashboard?tab=campaign',
    actionText: 'Ver resultados',
    relatedType: 'campaign',
    relatedId: 'campaign-456',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: 'notif-3',
    type: 'system',
    title: 'Actualización del sistema',
    message: 'Sistema actualizado con nuevas funcionalidades de análisis',
    priority: 0,
    isRead: false,
    isArchived: false,
    actionUrl: '/changelog',
    actionText: 'Ver novedades',
    relatedType: 'system',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
  },
  {
    id: 'notif-4',
    type: 'security',
    title: 'Nuevo inicio de sesión',
    message: 'Se detectó un nuevo inicio de sesión desde Madrid, España',
    priority: 1,
    isRead: true,
    readAt: new Date(Date.now() - 60 * 60 * 1000),
    isArchived: false,
    relatedType: 'session',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
  }
]

// Security alerts for demo
const initialSecurityAlerts: SecurityAlert[] = [
  {
    id: 'security-1',
    type: 'new_device',
    severity: 'medium',
    message: 'Nuevo dispositivo detectado: MacBook Pro desde Madrid',
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    requiresAction: false
  }
]

export const useLayout = (): UseLayoutReturn => {
  const [state, setState] = useState<LayoutState>({
    sidebarCollapsed: false,
    mobileMenuOpen: false,
    theme: defaultTheme,
    notifications: initialNotifications,
    user: defaultUser,
    securityAlerts: initialSecurityAlerts,
    sessionExpiryWarning: false,
    lastActivity: new Date()
  })

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem('ritterfinder-layout-state')
      if (savedState) {
        const parsed = JSON.parse(savedState)
        setState(prev => ({
          ...prev,
          sidebarCollapsed: parsed.sidebarCollapsed ?? false,
          theme: { ...defaultTheme, ...parsed.theme }
        }))
      }
    } catch (error) {
      console.warn('Failed to load layout state from localStorage:', error)
    }
  }, [])

  // Save state to localStorage when it changes
  useEffect(() => {
    try {
      const stateToSave = {
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme
      }
      localStorage.setItem('ritterfinder-layout-state', JSON.stringify(stateToSave))
    } catch (error) {
      console.warn('Failed to save layout state to localStorage:', error)
    }
  }, [state.sidebarCollapsed, state.theme])

  // Session activity tracking
  useEffect(() => {
    const handleActivity = () => {
      setState(prev => ({
        ...prev,
        lastActivity: new Date()
      }))
    }

    // Track user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true)
    })

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true)
      })
    }
  }, [])

  const toggleSidebar = useCallback(() => {
    setState(prev => ({
      ...prev,
      sidebarCollapsed: !prev.sidebarCollapsed
    }))
  }, [])

  const toggleMobileMenu = useCallback(() => {
    setState(prev => ({
      ...prev,
      mobileMenuOpen: !prev.mobileMenuOpen
    }))
  }, [])

  const setTheme = useCallback((theme: LayoutTheme) => {
    setState(prev => ({
      ...prev,
      theme
    }))
  }, [])

  const addNotification = useCallback((notification: NotificationItem) => {
    setState(prev => ({
      ...prev,
      notifications: [notification, ...prev.notifications]
    }))
  }, [])

  const markNotificationRead = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(notif =>
        notif.id === id ? { 
          ...notif, 
          isRead: true, 
          readAt: new Date() 
        } : notif
      )
    }))
  }, [])

  const clearNotifications = useCallback(() => {
    setState(prev => ({
      ...prev,
      notifications: []
    }))
  }, [])

  const setUser = useCallback((user: UserProfile | null) => {
    setState(prev => ({
      ...prev,
      user
    }))
  }, [])

  // New security actions
  const addSecurityAlert = useCallback((alert: SecurityAlert) => {
    setState(prev => ({
      ...prev,
      securityAlerts: [alert, ...prev.securityAlerts]
    }))
  }, [])

  const dismissSecurityAlert = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      securityAlerts: prev.securityAlerts.filter(alert => alert.id !== id)
    }))
  }, [])

  const updateLastActivity = useCallback(() => {
    setState(prev => ({
      ...prev,
      lastActivity: new Date()
    }))
  }, [])

  const triggerSessionWarning = useCallback((show: boolean) => {
    setState(prev => ({
      ...prev,
      sessionExpiryWarning: show
    }))
  }, [])

  const actions: LayoutActions = {
    toggleSidebar,
    toggleMobileMenu,
    setTheme,
    addNotification,
    markNotificationRead,
    clearNotifications,
    setUser,
    addSecurityAlert,
    dismissSecurityAlert,
    updateLastActivity,
    triggerSessionWarning
  }

  return {
    state,
    actions
  }
} 