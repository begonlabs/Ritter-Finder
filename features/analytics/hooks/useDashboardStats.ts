"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { createClient } from "../../../utils/supabase/client"
import type { 
  DashboardStats, 
  DashboardOverviewRecord, 
  DashboardSummaryRecord,
  DailyDashboardStatsRecord,
  DashboardOverviewAdapter,
  DashboardSummaryAdapter
} from "../types"

// Fixed UUID for anonymous users (from previous conversation)
const ANONYMOUS_USER_ID = "550e8400-e29b-41d4-a716-446655440000"

// Create a stable supabase client instance
const supabaseClient = createClient()

// Data adapter function to convert dashboard_overview to frontend format
const adaptDashboardOverview: DashboardOverviewAdapter = (record: DashboardOverviewRecord): DashboardStats => {
  return {
    totalLeads: record.total_leads,
    totalCampaigns: record.total_campaigns,
    totalSearches: record.total_searches,
    totalUsers: record.total_users,
    averageLeadQuality: record.avg_lead_quality
  }
}

// Enhanced adapter with growth data from dashboard summary
const adaptDashboardSummary: DashboardSummaryAdapter = (record: DashboardSummaryRecord): DashboardStats => {
  return {
    totalLeads: record.total_leads,
    totalCampaigns: record.total_campaigns,
    totalSearches: record.total_searches,
    totalUsers: record.active_users,
    averageLeadQuality: record.avg_lead_quality
  }
}

// Mock data fallback
const createMockDashboardStats = (): DashboardStats => ({
  totalLeads: 1234,
  totalCampaigns: 45,
  totalSearches: 89,
  totalUsers: 12,
  averageLeadQuality: 87.2
})

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchStats = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      console.log('📊 Fetching dashboard stats from dashboard_overview...')

      // First, try to get enhanced data with growth rates from dashboard summary function
      try {
        const { data: summaryData, error: summaryError } = await supabaseClient
          .rpc('get_dashboard_summary', {
            p_start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            p_end_date: new Date().toISOString().split('T')[0]
          })

        if (summaryData && summaryData.length > 0 && !summaryError) {
          console.log('✅ Dashboard stats loaded from summary function:', summaryData[0])
          const dashboardStats = adaptDashboardSummary(summaryData[0])
          setStats(dashboardStats)
          setLastUpdated(new Date())
          return
        }

        console.log('⚠️ Summary function not available, trying dashboard_overview view...', summaryError?.message)
      } catch (summaryErr) {
        console.log('⚠️ Summary function failed, trying dashboard_overview view...', summaryErr)
      }

      // Fallback to dashboard_overview view
      const { data: overviewData, error: overviewError } = await supabaseClient
        .from('dashboard_overview')
        .select('*')
        .single()

      if (overviewData && !overviewError) {
        console.log('✅ Dashboard stats loaded from overview view:', overviewData)
        const dashboardStats = adaptDashboardOverview(overviewData)
        setStats(dashboardStats)
        setLastUpdated(new Date())
        return
      }

      console.log('⚠️ Dashboard overview view not available, trying daily stats...', overviewError?.message)

      // Try daily_dashboard_stats materialized view
      const { data: dailyData, error: dailyError } = await supabaseClient
        .from('daily_dashboard_stats')
        .select('*')
        .order('stats_date', { ascending: false })
        .limit(1)
        .single()

      if (dailyData && !dailyError) {
        console.log('✅ Dashboard stats loaded from daily stats:', dailyData)
        const adaptedData: DashboardOverviewRecord = {
          section: 'daily',
          total_leads: dailyData.total_leads,
          total_campaigns: dailyData.total_campaigns,
          total_searches: dailyData.total_searches,
          total_users: dailyData.active_users,
          avg_lead_quality: dailyData.avg_lead_quality
        }
        const dashboardStats = adaptDashboardOverview(adaptedData)
        setStats(dashboardStats)
        setLastUpdated(new Date())
        return
      }

      console.log('⚠️ No dashboard data available, using mock data...', dailyError?.message)
      
      // Final fallback to mock data
      const mockStats = createMockDashboardStats()
      setStats(mockStats)
      setLastUpdated(new Date())

    } catch (err) {
      console.error('❌ Error fetching dashboard stats:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard stats')
      
      // Fallback to mock data on error
      const mockStats = createMockDashboardStats()
      setStats(mockStats)
      setLastUpdated(new Date())
    } finally {
      setIsLoading(false)
    }
  }, [])

  const refreshStats = useCallback(async () => {
    await fetchStats()
  }, [fetchStats])

  // Memoized individual stats for easier access
  const memoizedStats = useMemo(() => {
    if (!stats) {
      return {
        totalLeads: 0,
        totalCampaigns: 0,
        totalSearches: 0,
        totalUsers: 0,
        averageLeadQuality: 0
      }
    }

    return {
      totalLeads: stats.totalLeads,
      totalCampaigns: stats.totalCampaigns,
      totalSearches: stats.totalSearches,
      totalUsers: stats.totalUsers,
      averageLeadQuality: stats.averageLeadQuality
    }
  }, [stats])

  // Initial load - only on mount
  useEffect(() => {
    fetchStats()
  }, []) // Empty dependency array - only run on mount

  return {
    stats,
    isLoading,
    error,
    lastUpdated,
    refreshStats,
    
    // Individual stats for easier access
    ...memoizedStats
  }
}
