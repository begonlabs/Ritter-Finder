"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { createClient } from "@/utils/supabase/client"
import type { 
  SearchHistoryItem, 
  SearchHistoryDetailedView, 
  SearchHistoryRecord, 
  HistoryFilters 
} from "../types"

// Fixed UUID for anonymous users (from previous conversation)
const ANONYMOUS_USER_ID = "550e8400-e29b-41d4-a716-446655440000"

// Data adapter functions
const adaptSearchView = (view: SearchHistoryDetailedView): SearchHistoryItem => {
  // Parse search parameters to extract useful information
  const searchParams = view.search_parameters || {}
  const filtersApplied = view.filters_applied || {}
  
  // Extract websites from search parameters
  const websites = searchParams.websites || searchParams.sources || ['general']
  
  // Extract client type from filters or parameters
  const clientType = searchParams.client_type || 
                    filtersApplied.client_type || 
                    searchParams.category ||
                    'general'

  // Calculate search time in seconds
  const searchTime = view.duration_seconds || 
                    (view.execution_time_ms ? Math.round(view.execution_time_ms / 1000) : 0)

  return {
    id: view.id,
    date: view.started_at,
    websites: Array.isArray(websites) ? websites : [websites],
    clientType: clientType,
    leadsFound: view.total_results,
    leadsContacted: 0, // Not available in current schema
    searchTime: searchTime,
    status: mapSearchStatus(view.status),
    query: view.query_name,
    filters: {
      industry: filtersApplied.industry || [],
      location: filtersApplied.location || [],
      companySize: filtersApplied.company_size || [],
      confidence: filtersApplied.confidence || searchParams.confidence || 80
    }
  }
}

const adaptSearchRecord = (record: SearchHistoryRecord): SearchHistoryItem => {
  // Parse search parameters to extract useful information
  const searchParams = record.search_parameters || {}
  const filtersApplied = record.filters_applied || {}
  
  // Extract websites from search parameters
  const websites = searchParams.websites || searchParams.sources || ['general']
  
  // Extract client type from filters or parameters
  const clientType = searchParams.client_type || 
                    filtersApplied.client_type || 
                    searchParams.category ||
                    'general'

  // Calculate search time in seconds
  const searchTime = Math.round(record.execution_time_ms / 1000)

  return {
    id: record.id,
    date: record.started_at,
    websites: Array.isArray(websites) ? websites : [websites],
    clientType: clientType,
    leadsFound: record.total_results,
    leadsContacted: 0, // Not available in current schema
    searchTime: searchTime,
    status: mapSearchStatus(record.status),
    query: record.query_name,
    filters: {
      industry: filtersApplied.industry || [],
      location: filtersApplied.location || [],
      companySize: filtersApplied.company_size || [],
      confidence: filtersApplied.confidence || searchParams.confidence || 80
    }
  }
}

const mapSearchStatus = (dbStatus: string): 'completed' | 'failed' | 'cancelled' => {
  switch (dbStatus) {
    case 'completed':
      return 'completed'
    case 'failed':
      return 'failed'
    case 'cancelled':
      return 'cancelled'
    default:
      return 'failed'
  }
}

export function useSearchHistory() {
  const [history, setHistory] = useState<SearchHistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  
  const supabase = createClient()

  // Get current user ID
  const getCurrentUserId = async (): Promise<string> => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      return user?.id || ANONYMOUS_USER_ID
    } catch (error) {
      console.warn('Could not get user, using anonymous ID:', error)
      return ANONYMOUS_USER_ID
    }
  }

  // Load history data from Supabase
  const loadHistory = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const userId = await getCurrentUserId()
      console.log('🔄 Loading search history for user:', userId)

      // First try to use the search_history_detailed view
      let { data, error: viewError } = await supabase
        .from('search_history_detailed')
        .select('*')
        .eq('user_id', userId)
        .order('started_at', { ascending: false })
        .limit(100) // Get a reasonable number of searches

      if (viewError) {
        console.warn('📊 Search history detailed view not available, falling back to search_history table:', viewError.message)
        
        // Fallback to direct search_history table
        const { data: fallbackData, error: tableError } = await supabase
          .from('search_history')
          .select('*')
          .eq('user_id', userId)
          .order('started_at', { ascending: false })
          .limit(100)

        if (tableError) {
          throw new Error(`Failed to load search history: ${tableError.message}`)
        }

        console.log(`✅ Loaded ${fallbackData?.length || 0} search records from search_history table`)

        // Convert search_history records to frontend format
        const adaptedHistory = (fallbackData || []).map(adaptSearchRecord)
        setHistory(adaptedHistory)
        return
      }

      console.log(`✅ Loaded ${data?.length || 0} search records from search_history_detailed view`)

      // Convert database view records to frontend format
      const adaptedHistory = (data || []).map(adaptSearchView)
      setHistory(adaptedHistory)

    } catch (err) {
      console.error('❌ Error loading search history:', err)
      setError(err instanceof Error ? err.message : 'Failed to load search history')
      
      // Set empty array on error rather than keeping old data
      setHistory([])
    } finally {
      setIsLoading(false)
    }
  }, [supabase])

  // Filter history based on search term and status
  const filteredHistory = useMemo(() => {
    let filtered = history

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(item =>
        item.clientType.toLowerCase().includes(term) ||
        item.query?.toLowerCase().includes(term) ||
        item.websites.some(website => website.toLowerCase().includes(term))
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(item => item.status === statusFilter)
    }

    // Sort by date (newest first)
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [history, searchTerm, statusFilter])

  // Delete search record
  const deleteSearch = useCallback(async (searchId: string) => {
    try {
      setIsLoading(true)

      const { error } = await supabase
        .from('search_history')
        .delete()
        .eq('id', searchId)

      if (error) {
        throw new Error(`Failed to delete search: ${error.message}`)
      }

      // Remove from local state
      setHistory(prev => prev.filter(item => item.id !== searchId))
      
      console.log('Search deleted successfully:', searchId)
    } catch (err) {
      console.error('Error deleting search:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete search')
    } finally {
      setIsLoading(false)
    }
  }, [supabase])

  // Rerun search
  const rerunSearch = useCallback(async (searchData: SearchHistoryItem) => {
    console.log('Rerunning search:', searchData)
    // In real app, this would trigger a new search with the same parameters
    // For now, we'll just log the action
    return Promise.resolve()
  }, [])

  // Calculate stats
  const stats = useMemo(() => {
    const completedSearches = history.filter(item => item.status === 'completed')
    
    return {
      totalSearches: history.length,
      successfulSearches: completedSearches.length,
      totalLeadsFound: completedSearches.reduce((sum, item) => sum + item.leadsFound, 0),
      totalLeadsContacted: completedSearches.reduce((sum, item) => sum + item.leadsContacted, 0),
      averageSearchTime: completedSearches.length > 0 
        ? Math.round(completedSearches.reduce((sum, item) => sum + item.searchTime, 0) / completedSearches.length)
        : 0,
      successRate: history.length > 0 
        ? Math.round((completedSearches.length / history.length) * 100)
        : 0
    }
  }, [history])

  // Auto-load on mount
  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  return {
    // State
    history: filteredHistory,
    allHistory: history,
    isLoading,
    error,
    searchTerm,
    statusFilter,
    stats,

    // Actions
    setSearchTerm,
    setStatusFilter,
    deleteSearch,
    rerunSearch,
    loadHistory,
    
    // Computed
    hasHistory: history.length > 0,
    hasFilteredResults: filteredHistory.length > 0
  }
}
