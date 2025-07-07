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

// Function to fetch user profile data from Supabase
const fetchUserProfileFromDatabase = async (authUser: any): Promise<UserProfile | null> => {
  if (!authUser) return null

  const supabase = createClient()

  try {
    console.log('🔍 Fetching user profile for:', authUser.email, '(ID:', authUser.id, ')')

    // Get user profile with role information using role_id
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .select(`
        id,
        full_name,
        role_id,
        last_activity_at,
        metadata,
        created_at,
        updated_at
      `)
      .eq('id', authUser.id)
      .single()

    if (profileError) {
      console.error('❌ Error fetching user profile:', profileError)
      return null
    }

    if (!profileData) {
      console.log('⚠️ No profile found for user:', authUser.email)
      return null
    }

    console.log('✅ Profile data retrieved:', {
      fullName: profileData.full_name,
      roleId: profileData.role_id
    })

    // Now get the role information using the role_id
    let roleData = null
    if (profileData.role_id) {
      console.log('🔑 Fetching role data for role_id:', profileData.role_id)
      
      const { data: roleInfo, error: roleError } = await supabase
        .from('roles')
        .select(`
          id,
          name,
          description,
          is_system_role,
          created_at,
          updated_at
        `)
        .eq('id', profileData.role_id)
        .single()

      if (roleError) {
        console.error('❌ Error fetching role:', roleError)
      } else if (roleInfo) {
        roleData = roleInfo
        console.log('✅ Role data retrieved:', {
          name: roleInfo.name,
          description: roleInfo.description,
          isSystemRole: roleInfo.is_system_role
        })
      }
    }

    // Get user permissions via role_permissions relationship
    let rolePermissions: Permission[] = []
    if (roleData) {
      console.log('🔑 Fetching permissions for role:', roleData.name, '(ID:', roleData.id, ')')
      
      const { data: permissionsData, error: permissionsError } = await supabase
        .from('role_permissions')
        .select(`
          permissions(
            id,
            name,
            description,
            category,
            resource,
            action
          )
        `)
        .eq('role_id', roleData.id)

      if (permissionsError) {
        console.error('❌ Error fetching role permissions:', permissionsError)
      } else if (permissionsData) {
        console.log('📋 Raw permissions data:', permissionsData)
        
        rolePermissions = permissionsData
          .filter(rp => rp.permissions)
          .map(rp => {
            // Handle permissions as either object or array
            const p = Array.isArray(rp.permissions) ? rp.permissions[0] : rp.permissions
            return {
              id: p.id,
              name: p.name,
              description: p.description,
              category: p.category as PermissionCategory,
              resource: p.resource,
              action: p.action
            }
          })
          
        console.log('🔑 Processed role permissions:', rolePermissions.map(p => p.name))
      } else {
        console.log('⚠️ No permissions data returned for role:', roleData.name)
      }
    } else {
      console.log('⚠️ No role found for role_id:', profileData.role_id)
    }

    // Also get any specific user permissions (overrides/additions)
    const { data: userPermissionsData, error: userPermissionsError } = await supabase
      .from('user_permissions')
      .select(`
        granted,
        expires_at,
        permissions(
          id,
          name,
          description,
          category,
          resource,
          action
        )
      `)
      .eq('user_id', authUser.id)
      .eq('granted', true)

    let userSpecificPermissions: Permission[] = []
    if (!userPermissionsError && userPermissionsData) {
      userSpecificPermissions = userPermissionsData
        .filter(up => up.permissions && (up.expires_at === null || new Date(up.expires_at) > new Date()))
        .map(up => {
          // Handle permissions as either object or array
          const p = Array.isArray(up.permissions) ? up.permissions[0] : up.permissions
          return {
            id: p.id,
            name: p.name,
            description: p.description,
            category: p.category as PermissionCategory,
            resource: p.resource,
            action: p.action
          }
        })
      
      console.log('👤 User-specific permissions:', userSpecificPermissions.map(p => p.name))
    }

    // Combine role permissions with user-specific permissions
    const allPermissions = [...rolePermissions, ...userSpecificPermissions]
    console.log('🔧 Combined permissions:', allPermissions.map(p => p.name))

    // Create role object with permissions from relations
    const roleWithPermissions: Role = roleData ? {
      id: roleData.id,
      name: roleData.name,
      description: roleData.description,
      isSystemRole: roleData.is_system_role,
      permissions: allPermissions,
      createdAt: new Date(roleData.created_at),
      updatedAt: new Date(roleData.updated_at)
    } : createDefaultRole() // Fallback to default role if no role found

    console.log('🎭 Final role object:', {
      name: roleWithPermissions.name,
      isSystemRole: roleWithPermissions.isSystemRole,
      permissionsCount: roleWithPermissions.permissions.length
    })



    const finalUserProfile: UserProfile = {
      id: profileData.id,
      fullName: profileData.full_name,
      email: authUser.email,
      avatar: profileData.metadata?.avatar_url || null,
      role: roleWithPermissions,
      status: 'active', // Supabase users are active by default
      lastLoginAt: profileData.last_activity_at ? new Date(profileData.last_activity_at) : undefined,
      emailVerifiedAt: authUser.email_confirmed_at ? new Date(authUser.email_confirmed_at) : undefined,
      twoFactorEnabled: false, // TODO: implement 2FA
      failedLoginAttempts: 0, // TODO: get from user metadata
      createdAt: new Date(profileData.created_at),
      updatedAt: new Date(profileData.updated_at)
    }

    console.log('✅ Final user profile created:', {
      fullName: finalUserProfile.fullName,
      email: finalUserProfile.email,
      role: finalUserProfile.role.name,
      permissionsCount: finalUserProfile.role.permissions.length
    })

    return finalUserProfile

  } catch (error) {
    console.error('💥 Error in fetchUserProfileFromDatabase:', error)
    return null
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
      name: 'leads:search',
    description: 'Search for leads',
    category: 'leads',
    resource: 'leads',
    action: 'search'
  },
  {
      id: 'perm-leads-read',
      name: 'leads:read',
      description: 'View leads',
      category: 'leads',
      resource: 'leads',
      action: 'read'
    },
    {
      id: 'perm-campaigns-create',
      name: 'campaigns:create',
    description: 'Create campaigns',
    category: 'campaigns',
    resource: 'campaigns',
    action: 'create'
  },
  {
      id: 'perm-analytics-view',
      name: 'analytics:view',
    description: 'View analytics',
    category: 'analytics',
    resource: 'analytics',
    action: 'view'
  }
  ],
  createdAt: new Date(),
  updatedAt: new Date()
})

export const useLayout = (): UseLayoutReturn => {
  const auth = useAuth()
  
  const [state, setState] = useState<LayoutState>({
    sidebarCollapsed: false,
    mobileMenuOpen: false,
    theme: defaultTheme,
    user: null,
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
        
        setState(prev => ({
          ...prev,
          user: userProfile
        }))

      } catch (error) {
        console.error('Error loading user data:', error)
        // Set user to null if there's an error - the UI will handle this gracefully
        setState(prev => ({
          ...prev,
          user: null
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
    setUser,
    updateUserProfile,
    updateLastActivity,
    triggerSessionWarning
  }

  return {
    state,
    actions
  }
} 