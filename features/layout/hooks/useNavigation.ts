import { useMemo } from 'react'
import { 
  Home, Search, Users, Mail, History, Zap, BarChart3, Shield, 
  Settings, UserCog, FileText, Database 
} from 'lucide-react'
import type { 
  NavigationItem, 
  UserProfile, 
  PermissionChecker 
} from '../types'

interface UseNavigationProps {
  user: UserProfile | null
  activeTab: string
  searchComplete: boolean
  selectedLeadsCount: number
}

interface UseNavigationReturn {
  navigationItems: NavigationItem[]
  availableItems: NavigationItem[]
  hasAccess: (itemId: string) => boolean
  permissionChecker: PermissionChecker
}

// Permission checker utility
const createPermissionChecker = (user: UserProfile | null): PermissionChecker => {
  const userPermissions = user?.role?.permissions?.map(p => p.name) || []
  
  // Function to check if a specific permission is granted by user's permissions
  const checkPermission = (requiredPermission: string): boolean => {
    if (!user || user.status !== 'active') {
      console.log('❌ Permission check failed: No active user')
      return false
    }
    
    // Always allow admin role (check multiple formats for compatibility)
    const roleName = user.role.name?.toLowerCase()
    if (roleName === 'admin' || roleName === 'administrator' || roleName === 'administrador') {
      console.log(`✅ Admin access granted for: ${requiredPermission} (role: ${user.role.name})`)
      return true
    }
    
    console.log(`🔍 Checking permission: ${requiredPermission}`)
    console.log(`👤 User: ${user.fullName} (${user.role.name})`)
    console.log(`🗝️ Available permissions: ${userPermissions.join(', ')}`)
    
    // Direct permission match
    if (userPermissions.includes(requiredPermission)) {
      console.log(`✅ Direct match found for: ${requiredPermission}`)
      return true
    }
    
    // Check for wildcard permissions
    const [requiredResource, requiredAction] = requiredPermission.split(/[.:]/)
    console.log(`🎯 Checking wildcards for: ${requiredResource}:${requiredAction}`)
    
    for (const permission of userPermissions) {
      const [resource, action] = permission.split(/[.:]/)
      
      // Check for exact wildcard match: "admin:*" covers "admin.users", "admin.settings", etc.
      if (resource === requiredResource && action === '*') {
        console.log(`✅ Wildcard match: ${permission} covers ${requiredPermission}`)
        return true
      }
      
      // Check for global wildcard: "*:*" or "*.*"
      if (resource === '*' && action === '*') {
        console.log(`✅ Global wildcard match: ${permission} covers ${requiredPermission}`)
        return true
      }
      
      // Check for resource wildcard: "admin:*" covers anything starting with "admin"
      if (permission === `${requiredResource}:*` || permission === `${requiredResource}.*`) {
        console.log(`✅ Resource wildcard match: ${permission} covers ${requiredPermission}`)
        return true
      }
    }
    
    console.log(`❌ No permission found for: ${requiredPermission}`)
    return false
  }
  
  return {
    hasPermission: checkPermission,
    
    hasAnyPermission: (permissions: string[]) => {
      if (!user || user.status !== 'active') return false
      const roleName = user.role.name?.toLowerCase()
      if (roleName === 'admin' || roleName === 'administrator' || roleName === 'administrador') return true
      return permissions.some(permission => checkPermission(permission))
    },
    
    hasAllPermissions: (permissions: string[]) => {
      if (!user || user.status !== 'active') return false
      const roleName = user.role.name?.toLowerCase()
      if (roleName === 'admin' || roleName === 'administrator' || roleName === 'administrador') return true
      return permissions.every(permission => checkPermission(permission))
    },
    
    canAccessResource: (resource: string, action: string) => {
      if (!user || user.status !== 'active') return false
      const roleName = user.role.name?.toLowerCase()
      if (roleName === 'admin' || roleName === 'administrator' || roleName === 'administrador') return true
      
      const permissionToCheck = `${resource}.${action}`
      return checkPermission(permissionToCheck)
    }
  }
}

export const useNavigation = ({
  user,
  activeTab,
  searchComplete,
  selectedLeadsCount
}: UseNavigationProps): UseNavigationReturn => {
  
  // Create permission checker
  const permissionChecker = useMemo(() => createPermissionChecker(user), [user])
  
  // Define all possible navigation items with their required permissions
  const allNavigationItems: NavigationItem[] = useMemo(() => [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      disabled: false,
      badge: null,
      dataOnboarding: "dashboard",
      requiredPermissions: [] // Everyone can access dashboard
    },
    {
      id: "search",
      label: "Búsqueda",
      icon: Search,
      disabled: false,
      badge: null,
      dataOnboarding: "search",
      requiredPermissions: ["leads:search"] // Only need search permission
    },
    {
      id: "results",
      label: "Resultados",
      icon: Users,
      disabled: !searchComplete,
      badge: null,
      dataOnboarding: "results",
      requiredPermissions: ["leads:read"] // Only need read permission
    },
    {
      id: "campaign",
      label: "Campañas",
      icon: Mail,
      disabled: selectedLeadsCount === 0,
      badge: selectedLeadsCount > 0 ? selectedLeadsCount : null,
      dataOnboarding: "campaigns",
      requiredPermissions: ["campaigns:create", "campaigns:send"] // Need create and send permissions
    },
    {
      id: "history",
      label: "Historial",
      icon: History,
      disabled: false,
      badge: null,
      dataOnboarding: "history",
      requiredPermissions: ["leads:read", "campaigns:read"] // Need both read permissions
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      disabled: false,
      badge: null,
      dataOnboarding: "analytics",
      requiredPermissions: ["analytics:view"] // Only need view permission
    },
    {
      id: "admin",
      label: "Admin",
      icon: Shield,
      disabled: false,
      badge: null,
      dataOnboarding: "admin",
      requiredPermissions: ["admin:*"] // Need admin wildcard permission
    }
  ], [searchComplete, selectedLeadsCount])
  
  // Filter items based on user permissions
  const availableItems = useMemo(() => {
    if (!user) return []
    
    return allNavigationItems.filter(item => {
      // If no permissions required, everyone can access
      if (!item.requiredPermissions || item.requiredPermissions.length === 0) {
        return true
      }
      
      // Check if user has any of the required permissions
      return permissionChecker.hasAnyPermission(item.requiredPermissions)
    })
  }, [allNavigationItems, user, permissionChecker])
  
  // Main navigation items (commonly used)
  const navigationItems = useMemo(() => {
    // Filter based on role permissions
    if (!user) return []
    
    const roleName = user.role.name?.toLowerCase()
    
    // Define which items each role can see
    let allowedItemIds: string[] = []
    
    if (roleName === 'admin' || roleName === 'administrator') {
      // Admin sees everything
      allowedItemIds = ["dashboard", "search", "results", "campaign", "history", "analytics", "admin"]
    } else if (roleName === 'supervisor') {
      // Supervisor sees everything except admin
      allowedItemIds = ["dashboard", "search", "results", "campaign", "history", "analytics"]
    } else if (roleName === 'comercial' || roleName === 'commercial') {
      // Commercial sees only dashboard, search, results, and campaigns
      allowedItemIds = ["dashboard", "search", "results", "campaign"]
    } else {
      // Default fallback - only dashboard
      allowedItemIds = ["dashboard"]
    }
    
    return availableItems.filter(item => allowedItemIds.includes(item.id))
  }, [availableItems, user])
  
  // Function to check if user has access to specific item
  const hasAccess = (itemId: string): boolean => {
    const item = allNavigationItems.find(item => item.id === itemId)
    if (!item || !user) return false
    
    if (!item.requiredPermissions || item.requiredPermissions.length === 0) {
      return true
    }
    
    return permissionChecker.hasAnyPermission(item.requiredPermissions)
  }
  
  return {
    navigationItems,
    availableItems,
    hasAccess,
    permissionChecker
  }
}
