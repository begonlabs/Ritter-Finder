"use client"

import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { createClient } from "@/utils/supabase/client"
import type { 
  ActivityItem, 
  ComprehensiveActivityHistoryView, 
  ActivityLogRecord 
} from "../types"

// Fixed UUID for anonymous users (from previous conversation)
const ANONYMOUS_USER_ID = "550e8400-e29b-41d4-a716-446655440000"

// Create a stable supabase client instance
const supabaseClient = createClient()

// Data adapter functions
const adaptActivityView = (view: ComprehensiveActivityHistoryView): ActivityItem => {
  // Parse changes to extract metadata
  const changes = view.changes || {}
  const metadata: any = {
    ...changes,
    ip_address: view.ip_address,
    user_agent: view.user_agent
  }

  // Extract specific metadata based on activity type
  if (view.resource_type === 'search_history') {
    metadata.searchId = view.resource_id
    metadata.duration = changes.execution_time_ms ? Math.round(changes.execution_time_ms / 1000) : undefined
    metadata.leadsCount = changes.total_results || changes.valid_results
  } else if (view.resource_type === 'campaigns') {
    metadata.campaignId = view.resource_id
    metadata.leadsCount = changes.total_recipients || changes.emails_sent
  } else if (view.activity_type === 'export') {
    metadata.exportFormat = changes.format || 'csv'
    metadata.leadsCount = changes.count || changes.records_count
  }

  // Determine status from activity type and action
  let status: 'success' | 'error' | 'pending' = 'success'
  if (view.action.includes('failed') || view.action.includes('error')) {
    status = 'error'
    metadata.errorMessage = changes.error_message || view.description
  } else if (view.action.includes('started') || view.action.includes('pending')) {
    status = 'pending'
  }

  return {
    id: view.id,
    type: view.activity_type as any,
    title: generateActivityTitle(view.activity_type, view.action, view.resource_type),
    description: view.description,
    timestamp: view.timestamp,
    userId: view.user_id,
    metadata,
    status
  }
}

const generateActivityTitle = (activityType: string, action: string, resourceType: string): string => {
  switch (activityType) {
    case 'search':
      if (action.includes('completed')) return 'Búsqueda de Leads Completada'
      if (action.includes('started')) return 'Búsqueda de Leads Iniciada'
      if (action.includes('failed')) return 'Búsqueda Fallida'
      return 'Búsqueda de Leads'
    case 'campaign':
      if (action.includes('sent')) return 'Campaña de Email Enviada'
      if (action.includes('created')) return 'Campaña Creada'
      if (action.includes('completed')) return 'Campaña Completada'
      return 'Campaña de Email'
    case 'export':
      return 'Leads Exportados'
    case 'import':
      return 'Importación de Contactos'
    case 'lead_update':
      return 'Leads Actualizados'
    default:
      return action.charAt(0).toUpperCase() + action.slice(1)
  }
}

export function useActivityTimeline(maxItems: number = 50) {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Use ref to track if component is mounted to prevent state updates on unmounted component
  const isMountedRef = useRef(true)
  
  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  // Get current user ID (memoized to prevent recreation)
  const getCurrentUserId = useCallback(async (): Promise<string> => {
    try {
      const { data: { user } } = await supabaseClient.auth.getUser()
      return user?.id || ANONYMOUS_USER_ID
    } catch (error) {
      console.warn('Could not get user, using anonymous ID:', error)
      return ANONYMOUS_USER_ID
    }
  }, [])

  // Load activity data from Supabase (stable dependencies)
  const loadActivities = useCallback(async () => {
    if (isLoading) return // Prevent multiple simultaneous requests
    
    setIsLoading(true)
    setError(null)

    try {
      const userId = await getCurrentUserId()
      console.log('🔄 Loading activity timeline for user:', userId)

      // First try to use the comprehensive_activity_history view
      let { data, error: viewError } = await supabaseClient
        .from('comprehensive_activity_history')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(maxItems * 2) // Get more to account for filtering

      if (viewError) {
        console.warn('📊 View not available, falling back to activity_logs table:', viewError.message)
        
        // Fallback to direct activity_logs table
        const { data: fallbackData, error: tableError } = await supabaseClient
          .from('activity_logs')
          .select('*')
          .eq('user_id', userId)
          .order('timestamp', { ascending: false })
          .limit(maxItems * 2)

        if (tableError) {
          throw new Error(`Failed to load activity data: ${tableError.message}`)
        }

        // Convert activity_logs records to view format
        data = fallbackData?.map((record: ActivityLogRecord) => ({
          id: record.id,
          user_id: record.user_id,
          user_name: undefined,
          user_email: undefined,
          activity_type: record.activity_type,
          action: record.action,
          description: record.description,
          resource_type: record.resource_type,
          resource_id: record.resource_id,
          timestamp: record.timestamp,
          ip_address: record.ip_address,
          user_agent: record.user_agent,
          before_data: record.before_data,
          after_data: record.after_data,
          changes: record.changes
        } as ComprehensiveActivityHistoryView)) || []
      }

      console.log(`✅ Loaded ${data?.length || 0} activity records from database`)

      // Convert database records to frontend format
      const adaptedActivities = (data || []).map(adaptActivityView)
      
      // Only update state if component is still mounted
      if (isMountedRef.current) {
        setActivities(adaptedActivities)
      }

    } catch (err) {
      console.error('❌ Error loading activity timeline:', err)
      
      if (isMountedRef.current) {
      setError(err instanceof Error ? err.message : 'Failed to load activity timeline')
        // Set empty array on error rather than keeping old data
        setActivities([])
      }
    } finally {
      if (isMountedRef.current) {
      setIsLoading(false)
      }
    }
  }, [maxItems, getCurrentUserId, isLoading])

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

    // Sort by timestamp (newest first) and limit
    return filtered
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, maxItems)
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

  // Auto-load on mount only (remove loadActivities dependency to prevent infinite loop)
  useEffect(() => {
    loadActivities()
  }, []) // Only run on mount

  // Create stable filter setters to prevent unnecessary re-renders
  const stableSetTypeFilter = useCallback((value: string) => {
    setTypeFilter(value)
  }, [])

  const stableSetStatusFilter = useCallback((value: string) => {
    setStatusFilter(value)
  }, [])

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
    setTypeFilter: stableSetTypeFilter,
    setStatusFilter: stableSetStatusFilter,
    loadActivities,
    getActivityDetails,

    // Computed
    hasActivities: activities.length > 0,
    hasFilteredResults: filteredActivities.length > 0
  }
} 