"use client"

import { useState, useCallback, useEffect, useMemo } from 'react'
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

export function useUserManagement(): UseUserManagementReturn {
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

  // Create user
  const createUser = useCallback(async (userData: CreateUserInput): Promise<User> => {
    try {
      setIsCreating(true)
      setError(null)
      
      // TODO: Replace with actual API call
      // const response = await fetch('/api/admin/users', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(userData)
      // })
      // const newUser = await response.json()
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Create mock user for development
      const selectedRole = availableRoles.find(r => r.id === userData.roleId) || availableRoles[0]
      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        status: 'active',
        role: {
          id: selectedRole.id,
          name: selectedRole.name,
          description: `Rol ${selectedRole.name}`,
          color: selectedRole.color,
          permissions: [],
          isSystem: true,
          userCount: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        permissions: [],
        lastLogin: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {
          loginCount: 0,
          phone: userData.phone
        }
      }
      
      setUsers(prev => [...prev, newUser])
      return newUser
      
    } catch (err) {
      setError('Error al crear usuario')
      console.error('Error creating user:', err)
      throw err
    } finally {
      setIsCreating(false)
    }
  }, [])

  // Update user
  const updateUser = useCallback(async (id: string, userData: UpdateUserInput): Promise<User> => {
    try {
      setIsUpdating(true)
      setError(null)
      
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/admin/users/${id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(userData)
      // })
      // const updatedUser = await response.json()
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setUsers(prev => prev.map(user => 
        user.id === id 
          ? { ...user, ...userData, updatedAt: new Date() }
          : user
      ))
      
      const updatedUser = users.find(u => u.id === id)!
      return updatedUser
      
    } catch (err) {
      setError('Error al actualizar usuario')
      console.error('Error updating user:', err)
      throw err
    } finally {
      setIsUpdating(false)
    }
  }, [users])

  // Delete user
  const deleteUser = useCallback(async (id: string) => {
    try {
      setIsDeleting(true)
      setError(null)
      
      // TODO: Replace with actual API call
      // await fetch(`/api/admin/users/${id}`, { method: 'DELETE' })
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setUsers(prev => prev.filter(user => user.id !== id))
      
    } catch (err) {
      setError('Error al eliminar usuario')
      console.error('Error deleting user:', err)
      throw err
    } finally {
      setIsDeleting(false)
    }
  }, [])

  // Toggle user status
  const toggleUserStatus = useCallback(async (id: string) => {
    try {
      setIsUpdating(true)
      setError(null)
      
      const user = users.find(u => u.id === id)
      if (!user) return
      
      const newStatus = user.status === 'active' ? 'inactive' : 'active'
      
      // TODO: Replace with actual API call
      // await fetch(`/api/admin/users/${id}/status`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status: newStatus })
      // })
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300))
      
      setUsers(prev => prev.map(user => 
        user.id === id 
          ? { ...user, status: newStatus, updatedAt: new Date() }
          : user
      ))
      
    } catch (err) {
      setError('Error al cambiar estado del usuario')
      console.error('Error toggling user status:', err)
      throw err
    } finally {
      setIsUpdating(false)
    }
  }, [users])

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

  // Filter and sort users
  const filteredUsers = useMemo(() => {
    let filtered = users.filter(user => {
      const matchesSearch = !filters.search || 
        user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.search.toLowerCase())
      
      const matchesStatus = filters.status === 'all' || user.status === filters.status
      const matchesRole = filters.roleId === 'all' || user.role.id === filters.roleId
      
      return matchesSearch && matchesStatus && matchesRole
    })

    // Sort users
    filtered.sort((a, b) => {
      const order = filters.sortOrder === 'asc' ? 1 : -1
      
      switch (filters.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name) * order
        case 'email':
          return a.email.localeCompare(b.email) * order
        case 'lastLogin':
          if (!a.lastLogin && !b.lastLogin) return 0
          if (!a.lastLogin) return 1
          if (!b.lastLogin) return -1
          return (a.lastLogin.getTime() - b.lastLogin.getTime()) * order
        case 'createdAt':
          return (a.createdAt.getTime() - b.createdAt.getTime()) * order
        default:
          return 0
      }
    })

    return filtered
  }, [users, filters])

  // Get status badge class
  const getStatusBadgeClass = useCallback((status: User['status']) => {
    const styles: Record<User['status'], string> = {
      active: "bg-green-100 text-green-800 border-green-200",
      inactive: "bg-gray-100 text-gray-800 border-gray-200",
      suspended: "bg-red-100 text-red-800 border-red-200"
    }
    return styles[status]
  }, [])

  // Get status label
  const getStatusLabel = useCallback((status: User['status']) => {
    const labels: Record<User['status'], string> = {
      active: "Activo",
      inactive: "Inactivo", 
      suspended: "Suspendido"
    }
    return labels[status]
  }, [])

  // Format last login time
  const formatLastLogin = useCallback((date?: Date) => {
    if (!date) return "Nunca"
    
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffMins < 60) return `Hace ${diffMins} min`
    if (diffHours < 24) return `Hace ${diffHours}h`
    if (diffDays < 7) return `Hace ${diffDays} días`
    
    return date.toLocaleDateString()
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