"use client"

import { useState, useCallback, useEffect, useMemo } from 'react'
import { Crown, Shield, Briefcase, Users } from 'lucide-react'
import type { User, SystemRoleType, SystemRole } from '../types'

// Roles del sistema predefinidos
const systemRoles: SystemRole[] = [
  {
    id: 'admin',
    name: 'Administrador',
    description: 'Acceso completo al sistema, gestión de usuarios y configuración',
    color: '#dc2626',
    icon: Crown,
    userCount: 0,
    permissions: {}
  },
  {
    id: 'supervisor',
    name: 'Supervisor',
    description: 'Gestión de equipos, análisis avanzado y supervisión de campañas',
    color: '#2563eb',
    icon: Shield, 
    userCount: 0,
    permissions: {}
  },
  {
    id: 'comercial',
    name: 'Comercial',
    description: 'Gestión de leads, campañas de email y análisis básico',
    color: '#16a34a',
    icon: Briefcase,
    userCount: 0,
    permissions: {}
  }
]

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
  // State
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isAssigning, setIsAssigning] = useState(false)
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState<SystemRoleType | 'all'>('all')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  // Fetch users from API
  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // TODO: Replace with actual API call
      // const response = await fetch('/api/admin/users')
      // const data = await response.json()
      // setUsers(data.users)
      
      // For now, return empty array
      setUsers([])
      
    } catch (err) {
      setError('Error al cargar usuarios')
      console.error('Error fetching users:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Assign user to role
  const assignUserToRole = useCallback(async (userId: string, roleId: SystemRoleType) => {
    try {
      setIsAssigning(true)
      setError(null)
      
      // TODO: Replace with actual API call
      // await fetch(`/api/admin/users/${userId}/role`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ roleId })
      // })
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
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
  }, [])

  // Bulk assign role
  const bulkAssignRole = useCallback(async (userIds: string[], roleId: SystemRoleType) => {
    try {
      setIsAssigning(true)
      setError(null)
      
      // TODO: Replace with actual API call
      // await fetch('/api/admin/users/bulk-assign-role', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ userIds, roleId })
      // })
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
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
  }, [])

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
      case 'admin': return Crown
      case 'supervisor': return Shield
      case 'comercial': return Briefcase
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