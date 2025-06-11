"use client"

import { useState, useEffect, useCallback } from 'react'
import type { AdminStats, ActivityLog } from '../types'

// Mock data for development
const mockAdminStats: AdminStats = {
  totalUsers: 248,
  activeUsers: 196,
  totalRoles: 8,
  totalPermissions: 32,
  recentActivity: [
    {
      id: '1',
      userId: 'user-1',
      userName: 'María González',
      action: 'user_created',
      resource: 'users',
      resourceId: 'user-new-1',
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 min ago
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0...',
      details: { role: 'Marketing Manager' }
    },
    {
      id: '2',
      userId: 'user-2',
      userName: 'Carlos Ruiz',
      action: 'role_updated',
      resource: 'roles',
      resourceId: 'role-3',
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 min ago
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0...',
      details: { roleName: 'Sales Team' }
    },
    {
      id: '3',
      userId: 'user-3',
      userName: 'Ana Martínez',
      action: 'permission_granted',
      resource: 'permissions',
      resourceId: 'perm-12',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
      ipAddress: '192.168.1.102',
      userAgent: 'Mozilla/5.0...',
      details: { permission: 'analytics.view' }
    }
  ],
  userGrowth: {
    current: 248,
    previous: 231,
    percentage: 7.4
  }
}

interface UseAdminReturn {
  // Stats
  stats: AdminStats
  isLoadingStats: boolean
  statsError: string | null
  
  // Activity
  recentActivity: ActivityLog[]
  isLoadingActivity: boolean
  activityError: string | null
  
  // Actions
  refreshStats: () => Promise<void>
  refreshActivity: () => Promise<void>
  logActivity: (activity: Omit<ActivityLog, 'id' | 'timestamp'>) => Promise<void>
  clearActivity: () => Promise<void>
  
  // Utilities
  formatActivityMessage: (activity: ActivityLog) => string
  getActivityIcon: (action: string) => string
  getActivityColor: (action: string) => string
  lastUpdated: Date | null
}

export function useAdmin(): UseAdminReturn {
  const [stats, setStats] = useState<AdminStats>(mockAdminStats)
  const [isLoadingStats, setIsLoadingStats] = useState(false)
  const [statsError, setStatsError] = useState<string | null>(null)
  
  const [recentActivity, setRecentActivity] = useState<ActivityLog[]>(mockAdminStats.recentActivity)
  const [isLoadingActivity, setIsLoadingActivity] = useState(false)
  const [activityError, setActivityError] = useState<string | null>(null)
  
  const [lastUpdated, setLastUpdated] = useState<Date | null>(new Date())

  // Fetch admin stats
  const refreshStats = useCallback(async () => {
    setIsLoadingStats(true)
    setStatsError(null)
    
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Simulate stats update
      const updatedStats = {
        ...mockAdminStats,
        totalUsers: mockAdminStats.totalUsers + Math.floor(Math.random() * 5),
        activeUsers: mockAdminStats.activeUsers + Math.floor(Math.random() * 3)
      }
      
      setStats(updatedStats)
      setLastUpdated(new Date())
    } catch (error) {
      setStatsError('Error loading admin statistics')
      console.error('Error fetching admin stats:', error)
    } finally {
      setIsLoadingStats(false)
    }
  }, [])

  // Fetch recent activity
  const refreshActivity = useCallback(async () => {
    setIsLoadingActivity(true)
    setActivityError(null)
    
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 800))
      
      setRecentActivity(mockAdminStats.recentActivity)
    } catch (error) {
      setActivityError('Error loading recent activity')
      console.error('Error fetching activity:', error)
    } finally {
      setIsLoadingActivity(false)
    }
  }, [])

  // Log new activity
  const logActivity = useCallback(async (activityData: Omit<ActivityLog, 'id' | 'timestamp'>) => {
    try {
      const newActivity: ActivityLog = {
        ...activityData,
        id: `activity-${Date.now()}`,
        timestamp: new Date()
      }
      
      // TODO: Send to API
      await new Promise(resolve => setTimeout(resolve, 200))
      
      // Add to local state
      setRecentActivity(prev => [newActivity, ...prev.slice(0, 9)]) // Keep only last 10
      
    } catch (error) {
      console.error('Error logging activity:', error)
    }
  }, [])

  // Clear activity log
  const clearActivity = useCallback(async () => {
    try {
      // TODO: API call to clear activity
      await new Promise(resolve => setTimeout(resolve, 300))
      
      setRecentActivity([])
    } catch (error) {
      console.error('Error clearing activity:', error)
    }
  }, [])

  // Format activity message for display
  const formatActivityMessage = useCallback((activity: ActivityLog): string => {
    const actionMessages: Record<string, string> = {
      'user_created': `creó el usuario`,
      'user_updated': `actualizó el usuario`,
      'user_deleted': `eliminó el usuario`,
      'user_activated': `activó el usuario`,
      'user_deactivated': `desactivó el usuario`,
      'role_created': `creó el rol`,
      'role_updated': `actualizó el rol`,
      'role_deleted': `eliminó el rol`,
      'permission_granted': `otorgó permisos`,
      'permission_revoked': `revocó permisos`,
      'permission_created': `creó el permiso`,
      'settings_updated': `actualizó la configuración`,
      'system_backup': `realizó respaldo del sistema`,
      'login': `inició sesión`,
      'logout': `cerró sesión`
    }
    
    const message = actionMessages[activity.action] || activity.action
    return `${activity.userName} ${message}`
  }, [])

  // Get icon for activity type
  const getActivityIcon = useCallback((action: string): string => {
    const iconMap: Record<string, string> = {
      'user_created': '👤',
      'user_updated': '✏️',
      'user_deleted': '🗑️',
      'user_activated': '✅',
      'user_deactivated': '⏸️',
      'role_created': '🎭',
      'role_updated': '🔄',
      'role_deleted': '❌',
      'permission_granted': '🔑',
      'permission_revoked': '🚫',
      'permission_created': '🆕',
      'settings_updated': '⚙️',
      'system_backup': '💾',
      'login': '🔐',
      'logout': '🚪'
    }
    
    return iconMap[action] || '📝'
  }, [])

  // Get color for activity type
  const getActivityColor = useCallback((action: string): string => {
    const colorMap: Record<string, string> = {
      'user_created': 'green',
      'user_updated': 'blue',
      'user_deleted': 'red',
      'user_activated': 'green',
      'user_deactivated': 'orange',
      'role_created': 'purple',
      'role_updated': 'blue',
      'role_deleted': 'red',
      'permission_granted': 'green',
      'permission_revoked': 'orange',
      'permission_created': 'purple',
      'settings_updated': 'blue',
      'system_backup': 'indigo',
      'login': 'green',
      'logout': 'gray'
    }
    
    return colorMap[action] || 'gray'
  }, [])

  // Load initial data
  useEffect(() => {
    refreshStats()
    refreshActivity()
  }, [refreshStats, refreshActivity])

  return {
    // Stats
    stats,
    isLoadingStats,
    statsError,
    
    // Activity
    recentActivity,
    isLoadingActivity,
    activityError,
    
    // Actions
    refreshStats,
    refreshActivity,
    logActivity,
    clearActivity,
    
    // Utilities
    formatActivityMessage,
    getActivityIcon,
    getActivityColor,
    lastUpdated
  }
} 