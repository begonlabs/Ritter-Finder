"use client"

import { useState, useCallback, useEffect, useMemo } from 'react'
import { createClient } from '@/utils/supabase/client'
import { createAdminClient } from '@/utils/supabase/admin'
import type { User, SystemRoleType, CreateUserInput, UpdateUserInput, UserFilters } from '../types'

// Mapeo de roles para facilitar el uso
const roleMapping = {
  admin: 'f6798529-943b-483c-98be-bca8fdde370d',
  supervisor: '39af56ac-919b-45ae-94b7-569a2d85681a',
  comercial: '8f698c5f-2373-45f8-90c2-9f4427d2638c'
} as const

// Roles disponibles del sistema con UUIDs reales
const availableRoles = [
  { id: roleMapping.admin, name: 'Administrador', color: '#dc2626' },
  { id: roleMapping.supervisor, name: 'Supervisor', color: '#2563eb' },
  { id: roleMapping.comercial, name: 'Comercial', color: '#16a34a' }
] as const

interface UseUserManagementReturn {
  // State
  users: User[]
  isLoading: boolean
  error: string | null
  isCreating: boolean
  isUpdating: boolean
  isDeleting: boolean
  
  // Filters
  filters: UserFilters
  filteredUsers: User[]
  
  // Actions
  fetchUsers: () => Promise<void>
  createUser: (userData: CreateUserInput) => Promise<User>
  updateUser: (id: string, userData: UpdateUserInput) => Promise<User>
  deleteUser: (id: string) => Promise<void>
  toggleUserStatus: (id: string) => Promise<void>
  verifyUserData: (userId: string) => Promise<void>
  
  // Filter actions
  setFilters: (filters: Partial<UserFilters>) => void
  clearFilters: () => void
  
  // Utilities
  availableRoles: typeof availableRoles
  getStatusBadgeClass: (status: User['status']) => string
  getStatusLabel: (status: User['status']) => string
  formatLastLogin: (date?: Date) => string
}

// Interface para los datos de Supabase
interface UserProfile {
  id: string
  full_name: string
  role_id: string | null
  invited_by: string | null
  invited_at: string
  last_activity_at: string | null
  metadata: any
  created_at: string
  updated_at: string
}

interface AuthUser {
  id: string
  email: string
  email_confirmed_at: string | null
  created_at: string
  updated_at: string
  last_sign_in_at: string | null
}

// Interface para los datos de Supabase que puede tener email undefined
interface UserProfileWithAuth extends UserProfile {
  email?: string
}

export function useUserManagement(): UseUserManagementReturn {
  const supabase = createClient()
  
  // State
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  
  // Filters
  const [filters, setFiltersState] = useState<UserFilters>({
    search: '',
    status: 'all',
    roleId: 'all',
    sortBy: 'name',
    sortOrder: 'asc'
  })

  // Transform Supabase data to User format
  const transformUserData = useCallback((profile: UserProfile, authUser: AuthUser): User => {
    const selectedRole = availableRoles.find(r => r.id === profile.role_id) || availableRoles[0]
    
    return {
      id: profile.id,
      name: profile.full_name,
      email: authUser.email,
      status: 'active', // Todos los usuarios registrados son activos
      role: {
        id: selectedRole.id,
        name: selectedRole.name,
        description: `Rol ${selectedRole.name}`,
        color: selectedRole.color,
        permissions: [],
        isSystem: true,
        userCount: 1,
        createdAt: new Date(profile.created_at),
        updatedAt: new Date(profile.updated_at)
      },
      permissions: [],
      lastLogin: undefined, // No mostrar último acceso
      createdAt: new Date(profile.created_at),
      updatedAt: new Date(profile.updated_at),
      metadata: {
        loginCount: 0,
        phone: profile.metadata?.phone || '',
        lastIpAddress: undefined
      }
    }
  }, [])

  // Fetch users from Supabase
  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Get current user to check permissions
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser()
      if (userError || !currentUser) {
        throw new Error('No autorizado')
      }

      // Fetch user profiles with auth users
      console.log('Intentando cargar perfiles de usuario...')
      
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false })

      console.log('Resultado de la consulta:', { profiles, profilesError })

      if (profilesError) {
        console.error('Error al cargar perfiles:', profilesError)
        throw new Error(`Error al cargar perfiles de usuario: ${profilesError.message}`)
      }

      console.log('Perfiles encontrados:', profiles?.length || 0)
      console.log('Perfiles:', profiles)

      // Transform profiles to users (simplified version without admin API)
      const usersWithAuth = (profiles || []).map((profile: UserProfile) => {
        console.log('Procesando perfil:', profile)
        
        // Create user with data from profile only
        return transformUserData(profile, {
          id: profile.id,
          email: profile.metadata?.email || 'unknown@example.com',
          email_confirmed_at: null,
          created_at: profile.created_at,
          updated_at: profile.updated_at,
          last_sign_in_at: profile.last_activity_at
        })
      })

      // Set users (no need to filter nulls anymore)
      setUsers(usersWithAuth)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar usuarios')
      console.error('Error fetching users:', err)
    } finally {
      setIsLoading(false)
    }
  }, [supabase, transformUserData])

  // Create user
  const createUser = useCallback(async (userData: CreateUserInput): Promise<User> => {
    try {
      setIsCreating(true)
      setError(null)
      
      // Get current user
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser()
      if (userError || !currentUser) {
        throw new Error('No autorizado')
      }

      console.log('👤 Usuario actual:', currentUser.email)
      
      // Check if current user has admin permissions
      const { data: currentUserProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('role_id')
        .eq('id', currentUser.id)
        .single()

      if (profileError) {
        console.error('Error obteniendo perfil del usuario actual:', profileError)
        throw new Error('Error al verificar permisos de administrador')
      }

      // Check if user has admin role (using UUID from roles table)
      const adminRoleId = roleMapping.admin // admin role UUID
      
      if (currentUserProfile?.role_id !== adminRoleId) {
        console.log('❌ Usuario no es admin. Role ID:', currentUserProfile?.role_id)
        console.log('✅ Admin Role ID esperado:', adminRoleId)
        throw new Error('Solo los administradores pueden crear usuarios')
      }

      console.log('✅ Usuario actual tiene permisos de administrador')

      // Use admin client for administrative operations
      const adminClient = createAdminClient()

      // Check if user already exists
      const { data: existingUser } = await adminClient.auth.admin.listUsers()
      const userExists = existingUser.users.some(u => u.email === userData.email)
      
      if (userExists) {
        throw new Error('Ya existe un usuario con este email')
      }

      // Create auth user first
      const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
        user_metadata: {
          full_name: userData.name,
          phone: userData.phone
        }
      })

      if (authError || !authData.user) {
        throw new Error(`Error al crear usuario de autenticación: ${authError?.message}`)
      }

      // Check if profile already exists
      const { data: existingProfile } = await adminClient
        .from('user_profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single()

      let profile: any

      if (existingProfile) {
        // Update existing profile with new data
        const { data: updatedProfile, error: profileError } = await adminClient
          .from('user_profiles')
          .update({
            full_name: userData.name,
            role_id: userData.roleId,
            invited_by: currentUser.id,
            metadata: {
              phone: userData.phone,
              email: userData.email
            },
            updated_at: new Date().toISOString()
          })
          .eq('id', authData.user.id)
          .select()
          .single()

        if (profileError) {
          // Clean up auth user if profile update fails
          await adminClient.auth.admin.deleteUser(authData.user.id)
          throw new Error(`Error al actualizar perfil de usuario: ${profileError.message}`)
        }

        profile = updatedProfile
        console.log('✅ Perfil actualizado:', profile)
      } else {
        // Create new user profile
        const { data: newProfile, error: profileError } = await adminClient
          .from('user_profiles')
          .insert({
            id: authData.user.id,
            full_name: userData.name,
            role_id: userData.roleId,
            invited_by: currentUser.id,
            metadata: {
              phone: userData.phone,
              email: userData.email
            }
          })
          .select()
          .single()

        if (profileError) {
          // Clean up auth user if profile creation fails
          await adminClient.auth.admin.deleteUser(authData.user.id)
          throw new Error(`Error al crear perfil de usuario: ${profileError.message}`)
        }

        profile = newProfile
        console.log('✅ Perfil creado:', profile)
      }

      // Transform and add to state
      if (!authData.user.email) {
        throw new Error('El usuario creado no tiene email válido')
      }
      
      const newUser = transformUserData(profile, {
        id: authData.user.id,
        email: authData.user.email,
        email_confirmed_at: authData.user.email_confirmed_at || null,
        created_at: authData.user.created_at || new Date().toISOString(),
        updated_at: authData.user.updated_at || new Date().toISOString(),
        last_sign_in_at: authData.user.last_sign_in_at || null
      })
      setUsers(prev => [newUser, ...prev])
      
      console.log('✅ Usuario creado exitosamente:', newUser)
      return newUser
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear usuario')
      console.error('Error creating user:', err)
      throw err
    } finally {
      setIsCreating(false)
    }
  }, [supabase, transformUserData])

  // Update user
  const updateUser = useCallback(async (id: string, userData: UpdateUserInput): Promise<User> => {
    try {
      setIsUpdating(true)
      setError(null)
      
      // Use admin client for database operations
      const adminClient = createAdminClient()
      
      // Update user profile
      const { data: profile, error: profileError } = await adminClient
        .from('user_profiles')
        .update({
          full_name: userData.name,
          role_id: userData.roleId,
          metadata: {
            phone: userData.phone
          },
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (profileError) {
        throw new Error('Error al actualizar perfil de usuario')
      }

      // Update auth user if email changed
      if (userData.email) {
        const adminClient = createAdminClient()
        const { error: authError } = await adminClient.auth.admin.updateUserById(id, {
          email: userData.email
        })
        if (authError) {
          console.warn('Error updating auth user email:', authError)
        }
      }

      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === id 
          ? { 
              ...user, 
              name: userData.name || user.name,
              email: userData.email || user.email,
              role: {
                ...user.role,
                id: userData.roleId || user.role.id,
                name: availableRoles.find(r => r.id === userData.roleId)?.name || user.role.name
              },
              metadata: {
                loginCount: user.metadata?.loginCount || 0,
                phone: userData.phone,
                lastIpAddress: user.metadata?.lastIpAddress
              },
              updatedAt: new Date()
            }
          : user
      ))
      
      const updatedUser = users.find(u => u.id === id)!
      return updatedUser
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar usuario')
      console.error('Error updating user:', err)
      throw err
    } finally {
      setIsUpdating(false)
    }
  }, [users, supabase])

  // Delete user
  const deleteUser = useCallback(async (id: string) => {
    try {
      setIsDeleting(true)
      setError(null)
      
      // Get current user
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser()
      if (userError || !currentUser) {
        throw new Error('No autorizado')
      }

      // Check if current user has admin permissions
      const { data: currentUserProfile, error: currentProfileError } = await supabase
        .from('user_profiles')
        .select('role_id')
        .eq('id', currentUser.id)
        .single()

      if (currentProfileError) {
        console.error('Error obteniendo perfil del usuario actual:', currentProfileError)
        throw new Error('Error al verificar permisos de administrador')
      }

      const adminRoleId = roleMapping.admin // admin role UUID
      
      if (currentUserProfile?.role_id !== adminRoleId) {
        console.log('❌ Usuario no es admin. Role ID:', currentUserProfile?.role_id)
        console.log('✅ Admin Role ID esperado:', adminRoleId)
        throw new Error('Solo los administradores pueden eliminar usuarios')
      }

      console.log('✅ Usuario actual tiene permisos de administrador')
      console.log('🗑️ Iniciando eliminación de usuario:', id)

      // Use admin client for administrative operations
      const adminClient = createAdminClient()

      // Check if user exists in auth
      const { data: authUsers, error: listError } = await adminClient.auth.admin.listUsers()
      if (listError) {
        throw new Error(`Error al verificar usuario: ${listError.message}`)
      }

      const authUser = authUsers.users.find(u => u.id === id)
      if (!authUser) {
        console.log('⚠️ Usuario no encontrado en auth, eliminando solo perfil')
      }

      // Delete user profile first
      const { error: profileError } = await adminClient
        .from('user_profiles')
        .delete()
        .eq('id', id)

      if (profileError) {
        console.error('Error eliminando perfil:', profileError)
        throw new Error(`Error al eliminar perfil de usuario: ${profileError.message}`)
      }

      console.log('✅ Perfil eliminado correctamente')

      // Delete auth user if exists
      if (authUser) {
        const { error: authError } = await adminClient.auth.admin.deleteUser(id)
        
        if (authError) {
          console.error('Error eliminando usuario de auth:', authError)
          throw new Error(`Error al eliminar usuario de autenticación: ${authError.message}`)
        }

        console.log('✅ Usuario de auth eliminado correctamente')
      }

      // Remove from local state
      setUsers(prev => prev.filter(user => user.id !== id))
      
      console.log('✅ Usuario eliminado completamente')
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar usuario')
      console.error('Error deleting user:', err)
      throw err
    } finally {
      setIsDeleting(false)
    }
  }, [supabase])

  // Toggle user status (soft delete/restore)
  const toggleUserStatus = useCallback(async (id: string) => {
    try {
      setIsUpdating(true)
      setError(null)
      
      const user = users.find(u => u.id === id)
      if (!user) return
      
      const newStatus = user.status === 'active' ? 'inactive' : 'active'
      
      // Use admin client for database operations
      const adminClient = createAdminClient()
      
      // Update user profile with status
      const { error: profileError } = await adminClient
        .from('user_profiles')
        .update({
          metadata: {
            ...user.metadata,
            status: newStatus
          },
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (profileError) {
        throw new Error('Error al cambiar estado del usuario')
      }

      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === id 
          ? { ...user, status: newStatus, updatedAt: new Date() }
          : user
      ))
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cambiar estado del usuario')
      console.error('Error toggling user status:', err)
      throw err
    } finally {
      setIsUpdating(false)
    }
  }, [users, supabase])

  // Set filters
  const setFilters = useCallback((newFilters: Partial<UserFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }))
  }, [])

  // Clear filters
  const clearFilters = useCallback(() => {
    setFiltersState({
      search: '',
      status: 'all',
      roleId: 'all',
      sortBy: 'name',
      sortOrder: 'asc'
    })
  }, [])

  // Filtered users
  const filteredUsers = useMemo(() => {
    let filtered = [...users]

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      )
    }

    // Status filter - siempre mostrar todos ya que todos son activos
    // if (filters.status !== 'all') {
    //   filtered = filtered.filter(user => user.status === filters.status)
    // }

    // Role filter
    if (filters.roleId !== 'all') {
      filtered = filtered.filter(user => user.role.id === filters.roleId)
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (filters.sortBy) {
        case 'name':
          aValue = a.name
          bValue = b.name
          break
        case 'email':
          aValue = a.email
          bValue = b.email
          break
        case 'createdAt':
          aValue = a.createdAt
          bValue = b.createdAt
          break
        default:
          aValue = a.name
          bValue = b.name
      }

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [users, filters])

  // Utility functions
  const getStatusBadgeClass = useCallback((status: User['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'suspended':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }, [])

  const getStatusLabel = useCallback((status: User['status']) => {
    switch (status) {
      case 'active':
        return 'Activo'
      case 'inactive':
        return 'Inactivo'
      case 'suspended':
        return 'Suspendido'
      default:
        return 'Desconocido'
    }
  }, [])

  const formatLastLogin = useCallback((date?: Date) => {
    if (!date) return 'Nunca'
    
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Hace menos de 1 hora'
    if (diffInHours < 24) return `Hace ${diffInHours} horas`
    if (diffInHours < 168) return `Hace ${Math.floor(diffInHours / 24)} días`
    
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }, [])

  // Verify user data (like in the test script)
  const verifyUserData = useCallback(async (userId: string) => {
    try {
      console.log('🔍 Verificando datos del usuario:', userId)
      
      // Check auth user
      const { data: authUsers, error: listError } = await supabase.auth.admin.listUsers()
      if (listError) {
        console.error('Error listando usuarios de auth:', listError)
        return
      }

      const authUser = authUsers.users.find(u => u.id === userId)
      if (authUser) {
        console.log('✅ Usuario encontrado en auth:', {
          id: authUser.id,
          email: authUser.email,
          created_at: authUser.created_at
        })
      } else {
        console.log('❌ Usuario no encontrado en auth')
      }

      // Check user profile
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (profileError) {
        console.error('Error verificando perfil:', profileError)
        return
      }

      if (profile) {
        console.log('✅ Perfil encontrado:', {
          id: profile.id,
          full_name: profile.full_name,
          role_id: profile.role_id,
          created_at: profile.created_at
        })
      } else {
        console.log('❌ Perfil no encontrado')
      }

    } catch (err) {
      console.error('Error verificando usuario:', err)
    }
  }, [supabase])

  // Load users on mount
  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return {
    // State
    users,
    isLoading,
    error,
    isCreating,
    isUpdating,
    isDeleting,
    
    // Filters
    filters,
    filteredUsers,
    
    // Actions
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    verifyUserData, // New verification function
    
    // Filter actions
    setFilters,
    clearFilters,
    
    // Utilities
    availableRoles,
    getStatusBadgeClass,
    getStatusLabel,
    formatLastLogin
  }
} 