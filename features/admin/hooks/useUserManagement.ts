"use client"

import { useState, useCallback, useEffect, useMemo } from 'react'
import { createClient } from '@/utils/supabase/client'
import type { User, SystemRoleType, CreateUserInput, UpdateUserInput, UserFilters } from '../types'

// Roles disponibles del sistema
const availableRoles = [
  { id: 'admin', name: 'Administrador', color: '#dc2626' },
  { id: 'supervisor', name: 'Supervisor', color: '#2563eb' },
  { id: 'comercial', name: 'Comercial', color: '#16a34a' }
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
      status: authUser.last_sign_in_at ? 'active' : 'inactive',
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
      lastLogin: authUser.last_sign_in_at ? new Date(authUser.last_sign_in_at) : undefined,
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
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (profilesError) {
        throw new Error('Error al cargar perfiles de usuario')
      }

      // Fetch auth users for each profile
      const usersWithAuth = await Promise.all(
        (profiles || []).map(async (profile: UserProfile) => {
          const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(profile.id)
          
          if (authError || !authUser.user) {
            console.warn(`No se pudo obtener usuario de autenticación para ${profile.id}:`, authError)
            // Skip this user if we can't get auth data
            return null
          }
          
          // Use auth user data (email, last_sign_in_at, etc.) from Supabase auth table
          return transformUserData(profile, {
            id: authUser.user.id,
            email: authUser.user.email || 'unknown@example.com',
            email_confirmed_at: authUser.user.email_confirmed_at || null,
            created_at: authUser.user.created_at || new Date().toISOString(),
            updated_at: authUser.user.updated_at || new Date().toISOString(),
            last_sign_in_at: authUser.user.last_sign_in_at || null
          })
        })
      )

      // Filter out null values and set users
      setUsers(usersWithAuth.filter((user): user is User => user !== null))
      
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

      // Create auth user first
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: 'tempPassword123!', // Will be changed on first login
        email_confirm: true,
        user_metadata: {
          full_name: userData.name,
          phone: userData.phone
        }
      })

      if (authError || !authData.user) {
        throw new Error('Error al crear usuario de autenticación')
      }

      // Create user profile
      const { data: profile, error: profileError } = await supabase
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
        await supabase.auth.admin.deleteUser(authData.user.id)
        throw new Error('Error al crear perfil de usuario')
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
      
      // Update user profile
      const { data: profile, error: profileError } = await supabase
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
        const { error: authError } = await supabase.auth.admin.updateUserById(id, {
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
      
      // Delete auth user (this will cascade to user_profiles)
      const { error: authError } = await supabase.auth.admin.deleteUser(id)
      
      if (authError) {
        throw new Error('Error al eliminar usuario de autenticación')
      }

      // Remove from local state
      setUsers(prev => prev.filter(user => user.id !== id))
      
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
      
      // Update user profile with status
      const { error: profileError } = await supabase
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

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(user => user.status === filters.status)
    }

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
        case 'status':
          aValue = a.status
          bValue = b.status
          break
        case 'lastLogin':
          aValue = a.lastLogin
          bValue = b.lastLogin
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