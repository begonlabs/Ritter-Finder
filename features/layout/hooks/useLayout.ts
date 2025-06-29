import { useState, useCallback, useEffect } from 'react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { createClient } from '@/utils/supabase/client'
import type { 
  LayoutState, 
  LayoutActions, 
  UseLayoutReturn, 
  LayoutTheme,
  NotificationItem,
  UserProfile,
  SecurityAlert,
  Role,
  Permission,
  PermissionCategory
} from '../types'

const defaultTheme: LayoutTheme = {
  mode: 'light',
  primaryColor: '#D4A574', // ritter-gold
  secondaryColor: '#2C3E50', // ritter-dark
  borderRadius: '0.5rem'
}

// Function to convert permission names to Permission objects
const convertPermissionNamesToObjects = (permissionNames: string[]): Permission[] => {
  return permissionNames.map((name, index) => {
    const parts = name.split('.')
    const resource = parts[0] || 'unknown'
    const action = parts[1] || '*'
    const category = getCategoryFromResource(resource)
    
    return {
      id: `perm-${resource}-${action}-${index}`,
      name,
      description: `${action} access to ${resource}`,
      category,
      resource,
      action
    }
  })
}

// Helper function to determine category from resource
const getCategoryFromResource = (resource: string): PermissionCategory => {
  switch (resource) {
    case 'admin':
    case 'users':
    case 'roles':
    case 'settings':
      return 'admin'
    case 'leads':
      return 'leads'
    case 'campaigns':
      return 'campaigns'
    case 'analytics':
      return 'analytics'
    case 'export':
      return 'export'
    default:
      return 'settings' // Default fallback to a valid PermissionCategory
  }
}

// Function to fetch user profile data from Supabase
const fetchUserProfileFromDatabase = async (authUser: any): Promise<UserProfile | null> => {
  if (!authUser) return null

  const supabase = createClient()

  try {
    // First, get user profile data
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .select(`
        *,
        role:roles(
          id,
          name,
          description,
          is_system_role,
          permissions,
          created_at,
          updated_at
        )
      `)
      .eq('id', authUser.id)
      .single()

    if (profileError) {
      console.error('Error fetching user profile:', profileError)
      // If no profile exists, create one with basic role
      return createFallbackUserProfile(authUser)
    }

    // If user has a role, get detailed permissions
    let rolePermissions: Permission[] = []
    if (profileData.role) {
      // Use role permissions from JSONB field (simpler approach)
      const permissionNames = profileData.role.permissions || []
      rolePermissions = convertPermissionNamesToObjects(permissionNames)
    }

    // Construct the role object
    const role: Role = profileData.role ? {
      id: profileData.role.id,
      name: profileData.role.name,
      description: profileData.role.description,
      isSystemRole: profileData.role.is_system_role,
      permissions: rolePermissions,
      createdAt: new Date(profileData.role.created_at),
      updatedAt: new Date(profileData.role.updated_at)
    } : createDefaultRole()

    // Construct the UserProfile
    const userProfile: UserProfile = {
      id: authUser.id,
      email: authUser.email,
      fullName: profileData.full_name || authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Usuario',
      status: authUser.email_confirmed_at ? 'active' : 'invited',
      role,
      lastLoginAt: authUser.last_sign_in_at ? new Date(authUser.last_sign_in_at) : undefined,
      emailVerifiedAt: authUser.email_confirmed_at ? new Date(authUser.email_confirmed_at) : undefined,
      twoFactorEnabled: false, // TODO: Get from user metadata or separate table
      failedLoginAttempts: 0, // TODO: Get from user metadata
      createdAt: new Date(authUser.created_at),
      updatedAt: new Date(profileData.updated_at || authUser.updated_at),
      // Optional fields
      invitedAt: profileData.invited_at ? new Date(profileData.invited_at) : undefined,
      avatar: authUser.user_metadata?.avatar_url
    }

    return userProfile

  } catch (error) {
    console.error('Error fetching user profile from database:', error)
    return createFallbackUserProfile(authUser)
  }
}

// Fallback function when database fetch fails
const createFallbackUserProfile = (authUser: any): UserProfile => {
  const isAdmin = authUser.email?.includes('admin') || 
                  authUser.user_metadata?.role === 'admin'

  const role = isAdmin ? createAdminRole() : createDefaultRole()

  return {
    id: authUser.id,
    email: authUser.email,
    fullName: authUser.user_metadata?.full_name || 
              authUser.user_metadata?.name || 
              authUser.email?.split('@')[0] || 
              'Usuario',
    status: authUser.email_confirmed_at ? 'active' : 'invited',
    role,
    lastLoginAt: authUser.last_sign_in_at ? new Date(authUser.last_sign_in_at) : undefined,
    emailVerifiedAt: authUser.email_confirmed_at ? new Date(authUser.email_confirmed_at) : undefined,
    twoFactorEnabled: false,
    failedLoginAttempts: 0,
    createdAt: new Date(authUser.created_at),
    updatedAt: new Date(),
    avatar: authUser.user_metadata?.avatar_url
  }
}

// Create default role for regular users
const createDefaultRole = (): Role => ({
  id: 'role-user-default',
  name: 'Usuario',
  description: 'Usuario estándar con acceso básico',
  isSystemRole: true,
  permissions: [
    {
      id: 'perm-leads-search',
      name: 'leads.search',
      description: 'Search for leads',
      category: 'leads',
      resource: 'leads',
      action: 'search'
    },
    {
      id: 'perm-leads-read',
      name: 'leads.read',
      description: 'View leads',
      category: 'leads',
      resource: 'leads',
      action: 'read'
    },
    {
      id: 'perm-campaigns-create',
      name: 'campaigns.create',
      description: 'Create campaigns',
      category: 'campaigns',
      resource: 'campaigns',
      action: 'create'
    },
    {
      id: 'perm-analytics-view',
      name: 'analytics.view',
      description: 'View analytics',
      category: 'analytics',
      resource: 'analytics',
      action: 'view'
    }
  ],
  createdAt: new Date(),
  updatedAt: new Date()
})

// Create admin role for admin users
const createAdminRole = (): Role => ({
  id: 'role-admin-default',
  name: 'Admin',
  description: 'Administrator with full system access',
  isSystemRole: true,
  permissions: [
    {
      id: 'perm-admin-users',
      name: 'admin.users.manage',
      description: 'Manage users',
      category: 'admin',
      resource: 'users',
      action: 'manage'
    },
    {
      id: 'perm-admin-roles',
      name: 'admin.roles.manage',
      description: 'Manage roles and permissions',
      category: 'admin',
      resource: 'roles',
      action: 'manage'
    },
    {
      id: 'perm-admin-settings',
      name: 'admin.settings.manage',
      description: 'Manage system settings',
      category: 'admin',
      resource: 'settings',
      action: 'manage'
    },
    {
      id: 'perm-leads-all',
      name: 'leads.*',
      description: 'Full leads access',
      category: 'leads',
      resource: 'leads',
      action: '*'
    },
    {
      id: 'perm-campaigns-all',
      name: 'campaigns.*',
      description: 'Full campaigns access',
      category: 'campaigns',
      resource: 'campaigns',
      action: '*'
    },
    {
      id: 'perm-analytics-all',
      name: 'analytics.*',
      description: 'Full analytics access',
      category: 'analytics',
      resource: 'analytics',
      action: '*'
    }
  ],
  createdAt: new Date(),
  updatedAt: new Date()
})

// Fetch user notifications from database
const fetchUserNotifications = async (userId: string): Promise<NotificationItem[]> => {
  const supabase = createClient()
  
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .eq('is_archived', false)
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      console.error('Error fetching notifications:', error)
      return getWelcomeNotification()
    }

    if (!data || data.length === 0) {
      return getWelcomeNotification()
    }

    return data.map(notification => ({
      id: notification.id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      priority: notification.priority,
      isRead: notification.is_read,
      readAt: notification.read_at ? new Date(notification.read_at) : undefined,
      isArchived: notification.is_archived,
      actionUrl: notification.action_url,
      actionText: notification.action_text,
      relatedType: notification.related_type,
      relatedId: notification.related_id,
      createdAt: new Date(notification.created_at)
    }))

  } catch (error) {
    console.error('Error fetching notifications:', error)
    return getWelcomeNotification()
  }
}

// Fallback welcome notification for new users
const getWelcomeNotification = (): NotificationItem[] => [
  {
    id: 'notif-welcome',
    type: 'system',
    title: '¡Bienvenido a RitterFinder!',
    message: 'Tu cuenta ha sido configurada correctamente. Comienza buscando leads para tu negocio.',
    priority: 1,
    isRead: false,
    isArchived: false,
    actionUrl: '/dashboard?tab=search',
    actionText: 'Iniciar búsqueda',
    relatedType: 'onboarding',
    createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
  }
]

export const useLayout = (): UseLayoutReturn => {
  const auth = useAuth()
  
  const [state, setState] = useState<LayoutState>({
    sidebarCollapsed: false,
    mobileMenuOpen: false,
    theme: defaultTheme,
    notifications: [],
    user: null,
    securityAlerts: [],
    sessionExpiryWarning: false,
    lastActivity: new Date()
  })

  // Update user profile when auth user changes
  useEffect(() => {
    const loadUserData = async () => {
      if (!auth.user) {
        setState(prev => ({
          ...prev,
          user: null,
          notifications: []
        }))
        return
      }

      try {
        // Fetch user profile from database
        const userProfile = await fetchUserProfileFromDatabase(auth.user)
        
        // Fetch user notifications
        const notifications = userProfile ? await fetchUserNotifications(auth.user.id) : []
        
        setState(prev => ({
          ...prev,
          user: userProfile,
          notifications
        }))

      } catch (error) {
        console.error('Error loading user data:', error)
        // Fallback to basic user profile
        const fallbackProfile = createFallbackUserProfile(auth.user)
        setState(prev => ({
          ...prev,
          user: fallbackProfile,
          notifications: getWelcomeNotification()
        }))
      }
    }

    loadUserData()
  }, [auth.user])

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

  const markNotificationRead = useCallback(async (id: string) => {
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

    // Update in database
    const supabase = createClient()
    try {
      await supabase
        .from('notifications')
        .update({ 
          is_read: true, 
          read_at: new Date().toISOString() 
        })
        .eq('id', id)
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
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

  // Function to update user profile in database
  const updateUserProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!state.user) return { success: false, error: 'No user logged in' }

    const supabase = createClient()
    
    try {
      // Update user_profiles table
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          full_name: updates.fullName,
          metadata: updates.avatar ? { avatar_url: updates.avatar } : {}
        })
        .eq('id', state.user.id)

      if (profileError) {
        console.error('Error updating user profile:', profileError)
        return { success: false, error: 'Failed to update profile' }
      }

      // Update local state
      setUser({
        ...state.user,
        ...updates
      })

      return { success: true }
      
    } catch (error) {
      console.error('Error updating user profile:', error)
      return { success: false, error: 'Unexpected error' }
    }
  }, [state.user, setUser])

  // Security actions
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
    updateUserProfile,
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