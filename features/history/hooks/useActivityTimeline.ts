"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import type { ActivityItem } from "../types"

// Mock data - in real app this would come from API
const mockActivityData: ActivityItem[] = [
  {
    id: "activity-1",
    type: "search",
    title: "Búsqueda de Leads Completada",
    description: "Búsqueda de instaladores solares residenciales en 2 sitios web",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(), // 1 hour ago
    userId: "user-1",
    status: "success",
    metadata: {
      searchId: "search-1",
      leadsCount: 24,
      duration: 45
    }
  },
  {
    id: "activity-2",
    type: "campaign",
    title: "Campaña de Email Enviada",
    description: "Oferta especial de energía solar enviada a 18 contactos",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    userId: "user-1",
    status: "success",
    metadata: {
      campaignId: "campaign-1",
      leadsCount: 18
    }
  },
  {
    id: "activity-3",
    type: "export",
    title: "Leads Exportados",
    description: "Lista de 31 leads exportada en formato CSV",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
    userId: "user-1",
    status: "success",
    metadata: {
      leadsCount: 31,
      exportFormat: "csv"
    }
  },
  {
    id: "activity-4",
    type: "search",
    title: "Búsqueda de Leads Iniciada",
    description: "Búsqueda de consultores energéticos comerciales en progreso",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
    userId: "user-1",
    status: "success",
    metadata: {
      searchId: "search-2",
      leadsCount: 31,
      duration: 62
    }
  },
  {
    id: "activity-5",
    type: "campaign",
    title: "Campaña de Seguimiento",
    description: "Email de información sobre paneles solares enviado",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
    userId: "user-1",
    status: "success",
    metadata: {
      campaignId: "campaign-2",
      leadsCount: 25
    }
  },
  {
    id: "activity-6",
    type: "search",
    title: "Búsqueda Fallida",
    description: "Error al conectar con solarinstallers.com",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    userId: "user-1",
    status: "error",
    metadata: {
      searchId: "search-4",
      errorMessage: "Connection timeout",
      duration: 12
    }
  },
  {
    id: "activity-7",
    type: "export",
    title: "Exportación PDF",
    description: "Reporte de leads exportado en formato PDF",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(), // 30 hours ago
    userId: "user-1",
    status: "success",
    metadata: {
      leadsCount: 42,
      exportFormat: "pdf"
    }
  },
  {
    id: "activity-8",
    type: "campaign",
    title: "Newsletter Enviada",
    description: "Tendencias en Energía Verde enviada a 156 suscriptores",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    userId: "user-1",
    status: "success",
    metadata: {
      campaignId: "campaign-5",
      leadsCount: 156
    }
  },
  {
    id: "activity-9",
    type: "lead_update",
    title: "Leads Actualizados",
    description: "15 leads marcados como contactados",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 60).toISOString(), // 60 hours ago
    userId: "user-1",
    status: "success",
    metadata: {
      leadsCount: 15
    }
  },
  {
    id: "activity-10",
    type: "import",
    title: "Importación de Contactos",
    description: "Lista de contactos importada desde archivo CSV",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
    userId: "user-1",
    status: "success",
    metadata: {
      leadsCount: 128,
      exportFormat: "csv"
    }
  }
]

export function useActivityTimeline(maxItems: number = 50) {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Load activity data
  const loadActivities = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600))
      setActivities(mockActivityData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load activity timeline')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Filter and sort activities
  const filteredActivities = useMemo(() => {
    let filtered = activities

    // Filter by type
    if (typeFilter !== "all") {
      filtered = filtered.filter(activity => activity.type === typeFilter)
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(activity => activity.status === statusFilter)
    }

    // Sort by timestamp (newest first)
    filtered = filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    // Limit to maxItems
    return filtered.slice(0, maxItems)
  }, [activities, typeFilter, statusFilter, maxItems])

  // Group activities by date
  const groupedActivities = useMemo(() => {
    const groups: { [key: string]: ActivityItem[] } = {}
    
    filteredActivities.forEach(activity => {
      const date = new Date(activity.timestamp).toDateString()
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(activity)
    })

    return groups
  }, [filteredActivities])

  // Get activity details
  const getActivityDetails = useCallback((activityId: string) => {
    return activities.find(activity => activity.id === activityId)
  }, [activities])

  // Calculate activity stats
  const stats = useMemo(() => {
    const last24h = activities.filter(activity => 
      new Date(activity.timestamp).getTime() > Date.now() - 24 * 60 * 60 * 1000
    )
    const last7d = activities.filter(activity => 
      new Date(activity.timestamp).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
    )

    return {
      totalActivities: activities.length,
      activitiesLast24h: last24h.length,
      activitiesLast7d: last7d.length,
      successfulActivities: activities.filter(a => a.status === 'success').length,
      failedActivities: activities.filter(a => a.status === 'error').length,
      searchActivities: activities.filter(a => a.type === 'search').length,
      campaignActivities: activities.filter(a => a.type === 'campaign').length,
      exportActivities: activities.filter(a => a.type === 'export').length,
      successRate: activities.length > 0 
        ? Math.round((activities.filter(a => a.status === 'success').length / activities.length) * 100)
        : 0
    }
  }, [activities])

  // Auto-load on mount
  useEffect(() => {
    loadActivities()
  }, [loadActivities])

  return {
    // State
    activities: filteredActivities,
    allActivities: activities,
    groupedActivities,
    isLoading,
    error,
    typeFilter,
    statusFilter,
    stats,

    // Actions
    setTypeFilter,
    setStatusFilter,
    loadActivities,
    getActivityDetails,

    // Computed
    hasActivities: activities.length > 0,
    hasFilteredResults: filteredActivities.length > 0
  }
} 