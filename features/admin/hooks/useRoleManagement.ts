"use client"

import { useState, useCallback, useEffect, useMemo } from 'react'
import { createClient } from '@/utils/supabase/client'
import { createAdminClient } from '@/utils/supabase/admin'
import { Crown, Shield, Briefcase, Users } from 'lucide-react'
import type { User, SystemRoleType, SystemRole } from '../types'

// Roles del sistema predefinidos
const systemRoles: SystemRole[] = [
  {
    id: 'f6798529-943b-483c-98be-bca8fdde370d' as SystemRoleType,
    name: 'Administrador',
    description: 'Acceso completo al sistema, gestión de usuarios y configuración',
    color: '#dc2626',
    icon: Crown,
    userCount: 0,
    permissions: {}
  },
  {
    id: '39af56ac-919b-45ae-94b7-569a2d85681a' as SystemRoleType,
    name: 'Supervisor',
    description: 'Gestión de equipos, análisis avanzado y supervisión de campañas',
    color: '#2563eb',
    icon: Shield, 
    userCount: 0,
    permissions: {}
  },
  {
    id: '8f698c5f-2373-45f8-90c2-9f4427d2638c' as SystemRoleType,
    name: 'Comercial',
    description: 'Gestión de leads, campañas de email y análisis básico',
    color: '#16a34a',
    icon: Briefcase,
    userCount: 0,
    permissions: {}
  }
]

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

interface UseRoleManagementReturn {
  // State
  users: User[]
  isLoading: boolean
  error: string | null
  isAssigning: boolean
  
  // Filters
  searchTerm: string
  selectedRole: SystemRoleType | 'all'
  selectedUsers: string[]
  filteredUsers: User[]
  
  // Actions
  fetchUsers: () => Promise<void>
  assignUserToRole: (userId: string, roleId: SystemRoleType) => Promise<void>
  bulkAssignRole: (userIds: string[], roleId: SystemRoleType) => Promise<void>
  
  // Filter actions
  setSearchTerm: (term: string) => void
  setSelectedRole: (role: SystemRoleType | 'all') => void
  setSelectedUsers: (userIds: string[]) => void
  toggleUserSelection: (userId: string) => void
  clearSelection: () => void
  
  // Utilities
  systemRoles: SystemRole[]
  getRoleIcon: (roleId: string) => any
  getRoleUserCount: (roleId: SystemRoleType) => number
}

export function useRoleManagement(): UseRoleManagementReturn {
  const supabase = createClient()
  
  // State
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isAssigning, setIsAssigning] = useState(false)
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState<SystemRoleType | 'all'>('all')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  // Transform Supabase data to User format
  const transformUserData = useCallback((profile: UserProfile, authUser: AuthUser): User => {
    const selectedRole = systemRoles.find(r => r.id === profile.role_id) || systemRoles[0]
    
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

      console.log('👤 Usuario actual para roles:', currentUser.email)
      
      // Check if current user has admin permissions
      const { data: currentUserProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('role_id')
        .eq('id', currentUser.id)
        .single()

      if (profileError) {
        console.error('Error obteniendo perfil del usuario actual para roles:', profileError)
        throw new Error('Error al verificar permisos de administrador')
      }

      // Check if user has admin role (using UUID from roles table)
      const adminRoleId = 'f6798529-943b-483c-98be-bca8fdde370d' // admin role UUID
      
      if (currentUserProfile?.role_id !== adminRoleId) {
        console.log('❌ Usuario no es admin para roles. Role ID:', currentUserProfile?.role_id)
        console.log('✅ Admin Role ID esperado:', adminRoleId)
        throw new Error('Solo los administradores pueden gestionar roles')
      }

      console.log('✅ Usuario actual tiene permisos de administrador para roles')

      // Use admin client for administrative operations
      const adminClient = createAdminClient()

      console.log('Intentando cargar perfiles de usuario para roles con cliente admin...')
      
      // Fetch user profiles with admin client
      const { data: profiles, error: profilesError } = await adminClient
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false })

      console.log('Resultado de la consulta de roles con admin:', { profiles, profilesError })

      if (profilesError) {
        console.error('Error al cargar perfiles para roles con admin:', profilesError)
        throw new Error(`Error al cargar perfiles de usuario: ${profilesError.message}`)
      }

      console.log('Perfiles encontrados para roles:', profiles?.length || 0)
      console.log('Perfiles para roles:', profiles)

      // Transform profiles to users
      const usersWithAuth = (profiles || []).map((profile: any) => {
        console.log('Procesando perfil para roles:', profile)
        
        // Create user with data from profile only
        return transformUserData(profile as UserProfile, {
          id: profile.id,
          email: profile.metadata?.email || 'unknown@example.com',
          email_confirmed_at: null,
          created_at: profile.created_at,
          updated_at: profile.updated_at,
          last_sign_in_at: profile.last_activity_at
        })
      })

      setUsers(usersWithAuth)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar usuarios')
      console.error('Error fetching users for roles:', err)
    } finally {
      setIsLoading(false)
    }
  }, [supabase, transformUserData])

  // Assign user to role
  const assignUserToRole = useCallback(async (userId: string, roleId: SystemRoleType) => {
    try {
      setIsAssigning(true)
      setError(null)
      
      // Get current user
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser()
      if (userError || !currentUser) {
        throw new Error('No autorizado')
      }

      // Update user profile with new role
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          role_id: roleId,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (profileError) {
        throw new Error('Error al actualizar rol del usuario')
      }

      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { 
              ...user, 
              role: {
                ...user.role,
                id: roleId,
                name: systemRoles.find(r => r.id === roleId)?.name || user.role.name,
                color: systemRoles.find(r => r.id === roleId)?.color || user.role.color
              },
              updatedAt: new Date()
            }
          : user
      ))
      
    } catch (err) {
      setError('Error al asignar rol')
      console.error('Error assigning role:', err)
      throw err
    } finally {
      setIsAssigning(false)
    }
  }, [supabase])

  // Bulk assign role
  const bulkAssignRole = useCallback(async (userIds: string[], roleId: SystemRoleType) => {
    try {
      setIsAssigning(true)
      setError(null)
      
      // Get current user
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser()
      if (userError || !currentUser) {
        throw new Error('No autorizado')
      }

      // Update multiple user profiles with new role
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          role_id: roleId,
          updated_at: new Date().toISOString()
        })
        .in('id', userIds)

      if (profileError) {
        throw new Error('Error al actualizar roles de usuarios')
      }

      // Update local state
      setUsers(prev => prev.map(user => 
        userIds.includes(user.id)
          ? { 
              ...user, 
              role: {
                ...user.role,
                id: roleId,
                name: systemRoles.find(r => r.id === roleId)?.name || user.role.name,
                color: systemRoles.find(r => r.id === roleId)?.color || user.role.color
              },
              updatedAt: new Date()
            }
          : user
      ))
      
      // Clear selection
      setSelectedUsers([])
      
    } catch (err) {
      setError('Error al asignar roles masivamente')
      console.error('Error bulk assigning roles:', err)
      throw err
    } finally {
      setIsAssigning(false)
    }
  }, [supabase])

  // Toggle user selection
  const toggleUserSelection = useCallback((userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }, [])

  // Clear selection
  const clearSelection = useCallback(() => {
    setSelectedUsers([])
  }, [])

  // Filter users
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = !searchTerm || 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesRole = selectedRole === 'all' || user.role.id === selectedRole
      
      return matchesSearch && matchesRole
    })
  }, [users, searchTerm, selectedRole])

  // Get role icon
  const getRoleIcon = useCallback((roleId: string) => {
    switch (roleId) {
      case 'f6798529-943b-483c-98be-bca8fdde370d': return Crown
      case '39af56ac-919b-45ae-94b7-569a2d85681a': return Shield
      case '8f698c5f-2373-45f8-90c2-9f4427d2638c': return Briefcase
      default: return Users
    }
  }, [])

  // Get role user count
  const getRoleUserCount = useCallback((roleId: SystemRoleType) => {
    return users.filter(user => user.role.id === roleId).length
  }, [users])

  // Update system roles with actual user counts
  const systemRolesWithCounts = useMemo(() => {
    return systemRoles.map(role => ({
      ...role,
      userCount: getRoleUserCount(role.id)
    }))
  }, [getRoleUserCount])

  // Load users on mount
  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return {
    // State
    users,
    isLoading,
    error,
    isAssigning,
    
    // Filters
    searchTerm,
    selectedRole,
    selectedUsers,
    filteredUsers,
    
    // Actions
    fetchUsers,
    assignUserToRole,
    bulkAssignRole,
    
    // Filter actions
    setSearchTerm,
    setSelectedRole,
    setSelectedUsers,
    toggleUserSelection,
    clearSelection,
    
    // Utilities
    systemRoles: systemRolesWithCounts,
    getRoleIcon,
    getRoleUserCount
  }
} 