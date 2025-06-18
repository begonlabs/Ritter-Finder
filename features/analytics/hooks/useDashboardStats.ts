"use client"

import { useState, useEffect, useCallback } from "react"
import type { DashboardStats, TrendData, AnalyticsState, DashboardMetrics } from "../types"

// Mock data - in real app this would come from dashboard_metrics table
const mockDashboardData = {
  current: {
    totalLeads: 1234,
    totalCampaigns: 45,
    totalSearches: 89,
    averageOpenRate: 68,
    leadsQualityScore: 85.5,
    campaignSuccessRate: 72.3,
    searchEfficiency: 91.2,
    costPerLead: 15.50,
    roiPercentage: 340.75,
    estimatedMoneySaved: 58365
  },
  previous: {
    totalLeads: 1102,
    totalCampaigns: 42,
    totalSearches: 85,
    averageOpenRate: 66,
    leadsQualityScore: 82.1,
    campaignSuccessRate: 69.8,
    searchEfficiency: 88.7,
    costPerLead: 17.20,
    roiPercentage: 315.40,
    estimatedMoneySaved: 54230
  }
}

// API integration functions (to be implemented)
async function fetchDashboardMetrics(period: 'daily' | 'weekly' | 'monthly' = 'monthly'): Promise<DashboardMetrics | null> {
  // This would query the dashboard_metrics table
  // SELECT * FROM dashboard_metrics 
  // WHERE period_type = $1 
  // ORDER BY date DESC 
  // LIMIT 1
  return null // Placeholder
}

async function fetchPreviousPeriodMetrics(period: 'daily' | 'weekly' | 'monthly' = 'monthly'): Promise<DashboardMetrics | null> {
  // This would query for previous period comparison
  return null // Placeholder
}

function calculateTrend(current: number, previous: number, label: string = "from last month"): TrendData {
  const difference = current - previous
  const percentage = previous > 0 ? Math.round((difference / previous) * 100) : 0
  
  return {
    value: current,
    percentage: Math.abs(percentage),
    positive: difference >= 0,
    label
  }
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchStats = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const { current, previous } = mockDashboardData
      
      const dashboardStats: DashboardStats = {
        totalLeads: current.totalLeads,
        totalCampaigns: current.totalCampaigns,
        totalSearches: current.totalSearches,
        averageOpenRate: current.averageOpenRate,
        trendsFromLastMonth: {
          leads: calculateTrend(current.totalLeads, previous.totalLeads),
          campaigns: calculateTrend(current.totalCampaigns, previous.totalCampaigns),
          searches: calculateTrend(current.totalSearches, previous.totalSearches),
          openRate: calculateTrend(current.averageOpenRate, previous.averageOpenRate)
        }
      }

      setStats(dashboardStats)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard stats')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const refreshStats = useCallback(async () => {
    await fetchStats()
  }, [fetchStats])

  // Auto-refresh every 5 minutes
  useEffect(() => {
    fetchStats()
    
    const interval = setInterval(fetchStats, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchStats])

  return {
    stats,
    isLoading,
    error,
    lastUpdated,
    refreshStats,
    
    // Individual stats for easier access
    totalLeads: stats?.totalLeads || 0,
    totalCampaigns: stats?.totalCampaigns || 0,
    totalSearches: stats?.totalSearches || 0,
    averageOpenRate: stats?.averageOpenRate || 0,
    trends: stats?.trendsFromLastMonth || null
  }
}
