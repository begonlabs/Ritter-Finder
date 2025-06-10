import { useState, useCallback, useEffect } from 'react'
import type { 
  LayoutState, 
  LayoutActions, 
  UseLayoutReturn, 
  LayoutTheme,
  NotificationItem,
  UserProfile 
} from '../types'

const defaultTheme: LayoutTheme = {
  mode: 'light',
  primaryColor: '#D4A574', // ritter-gold
  secondaryColor: '#2C3E50', // ritter-dark
  borderRadius: '0.5rem'
}

const defaultUser: UserProfile = {
  id: 'demo-user-1',
  name: 'Usuario Demo',
  email: 'demo@ritterfinder.com',
  role: 'admin'
}

const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'lead',
    title: 'Nuevos leads encontrados',
    description: '5 nuevos leads encontrados en tu búsqueda',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: false,
    action: {
      label: 'Ver leads',
      onClick: () => console.log('Navigate to leads')
    }
  },
  {
    id: 'notif-2',
    type: 'campaign',
    title: 'Campaña completada',
    description: 'Tu campaña "Inmobiliarias Madrid" ha terminado',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    read: false,
    action: {
      label: 'Ver resultados',
      onClick: () => console.log('Navigate to campaign results')
    }
  },
  {
    id: 'notif-3',
    type: 'system',
    title: 'Actualización del sistema',
    description: 'Sistema actualizado con nuevas funcionalidades',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    read: false,
    action: {
      label: 'Ver novedades',
      onClick: () => console.log('Navigate to changelog')
    }
  }
]

export const useLayout = (): UseLayoutReturn => {
  const [state, setState] = useState<LayoutState>({
    sidebarCollapsed: false,
    mobileMenuOpen: false,
    theme: defaultTheme,
    notifications: initialNotifications,
    user: defaultUser
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
        notif.id === id ? { ...notif, read: true } : notif
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

  const actions: LayoutActions = {
    toggleSidebar,
    toggleMobileMenu,
    setTheme,
    addNotification,
    markNotificationRead,
    clearNotifications,
    setUser
  }

  return {
    state,
    actions
  }
} 