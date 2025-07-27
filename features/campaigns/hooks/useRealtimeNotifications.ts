"use client"

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'

interface SystemEvent {
  id: number
  event_type: string
  event_data: Record<string, any>
  created_at: string
}

interface RealtimeNotification {
  id: string
  type: 'warning' | 'error' | 'info' | 'success'
  title: string
  message: string
  timestamp: Date
  autoHide?: boolean
  duration?: number
}

interface UseRealtimeNotificationsReturn {
  notifications: RealtimeNotification[]
  recentEvents: SystemEvent[]
  isConnected: boolean
  clearNotification: (id: string) => void
  clearAllNotifications: () => void
  addManualNotification: (notification: Omit<RealtimeNotification, 'id' | 'timestamp'>) => void
}

export const useRealtimeNotifications = (): UseRealtimeNotificationsReturn => {
  const [notifications, setNotifications] = useState<RealtimeNotification[]>([])
  const [recentEvents, setRecentEvents] = useState<SystemEvent[]>([])
  const [isConnected, setIsConnected] = useState(false)

  // Clear individual notification
  const clearNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  // Clear all notifications
  const clearAllNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  // Add manual notification
  const addManualNotification = useCallback((notification: Omit<RealtimeNotification, 'id' | 'timestamp'>) => {
    const newNotification: RealtimeNotification = {
      ...notification,
      id: `manual-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    }

    setNotifications(prev => [newNotification, ...prev])

    // Auto-hide if specified
    if (notification.autoHide !== false) {
      const duration = notification.duration || 5000
      setTimeout(() => {
        clearNotification(newNotification.id)
      }, duration)
    }
  }, [clearNotification])

  // Convert system event to notification
  const eventToNotification = useCallback((event: SystemEvent): RealtimeNotification => {
    const eventData = event.event_data
    
    switch (event.event_type) {
      case 'email_limit_warning':
        return {
          id: `event-${event.id}`,
          type: 'warning',
          title: `Límite ${eventData.limit_type === 'hourly' ? 'Horario' : 'Diario'} Cerca`,
          message: `${eventData.percentage}% usado (${eventData.count}/${eventData.limit}). Quedan ${eventData.remaining} emails.`,
          timestamp: new Date(event.created_at),
          autoHide: true,
          duration: 8000
        }

      case 'email_limit_reached':
        return {
          id: `event-${event.id}`,
          type: 'error',
          title: `Límite ${eventData.limit_type === 'hourly' ? 'Horario' : 'Diario'} Alcanzado`,
          message: `No se pueden enviar más emails hasta el próximo reset (${eventData.count}/${eventData.limit}).`,
          timestamp: new Date(event.created_at),
          autoHide: false
        }

      case 'email_counter_reset':
        return {
          id: `event-${event.id}`,
          type: 'success',
          title: `Contador ${eventData.reset_type === 'hourly' ? 'Horario' : 'Diario'} Reseteado`,
          message: `El límite ha sido renovado. Anterior: ${eventData.previous_count} emails.`,
          timestamp: new Date(event.created_at),
          autoHide: true,
          duration: 4000
        }

      case 'bulk_email_sent':
        return {
          id: `event-${event.id}`,
          type: 'info',
          title: 'Envío Masivo Realizado',
          message: `Se enviaron ${eventData.emails_sent} emails. Total: ${eventData.new_daily_count} hoy, ${eventData.new_hourly_count} esta hora.`,
          timestamp: new Date(event.created_at),
          autoHide: true,
          duration: 6000
        }

      case 'system_maintenance':
        return {
          id: `event-${event.id}`,
          type: 'info',
          title: 'Mantenimiento del Sistema',
          message: eventData.message || 'El sistema está realizando tareas de mantenimiento.',
          timestamp: new Date(event.created_at),
          autoHide: true,
          duration: 3000
        }

      default:
        return {
          id: `event-${event.id}`,
          type: 'info',
          title: 'Evento del Sistema',
          message: `Evento: ${event.event_type}`,
          timestamp: new Date(event.created_at),
          autoHide: true,
          duration: 4000
        }
    }
  }, [])

  // Setup realtime subscriptions
  useEffect(() => {
    const supabase = createClient()
    let mounted = true

    // Subscribe to system events
    const eventsSubscription = supabase
      .channel('system-events-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'system_events'
        },
        (payload) => {
          if (!mounted) return

          console.log('🔔 New system event for notifications:', payload.new)
          
          const event = payload.new as SystemEvent
          
          // Add to recent events
          setRecentEvents(prev => [event, ...prev.slice(0, 19)]) // Keep last 20 events
          
          // Convert to notification if it's user-facing
          if (['email_limit_warning', 'email_limit_reached', 'email_counter_reset', 'bulk_email_sent'].includes(event.event_type)) {
            const notification = eventToNotification(event)
            setNotifications(prev => [notification, ...prev])
          }
        }
      )
      .subscribe((status) => {
        console.log('📡 System events subscription status:', status)
        setIsConnected(status === 'SUBSCRIBED')
      })

    // Load recent events on mount
    const loadRecentEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('system_events')
          .select('*')
          .gte('expires_at', new Date().toISOString())
          .order('created_at', { ascending: false })
          .limit(10)

        if (error) {
          console.error('Error loading recent events:', error)
          return
        }

        if (mounted && data) {
          setRecentEvents(data)
          console.log(`📋 Loaded ${data.length} recent events`)
        }
      } catch (error) {
        console.error('Error in loadRecentEvents:', error)
      }
    }

    loadRecentEvents()

    // Cleanup
    return () => {
      mounted = false
      console.log('🧹 Cleaning up notifications subscription')
      eventsSubscription.unsubscribe()
    }
  }, [eventToNotification])

  // Auto-cleanup old notifications
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now()
      setNotifications(prev => 
        prev.filter(notification => {
          const age = now - notification.timestamp.getTime()
          const maxAge = notification.autoHide === false ? Infinity : (notification.duration || 5000) + 10000
          return age < maxAge
        })
      )
    }, 30000) // Cleanup every 30 seconds

    return () => clearInterval(cleanup)
  }, [])

  return {
    notifications,
    recentEvents,
    isConnected,
    clearNotification,
    clearAllNotifications,
    addManualNotification
  }
}