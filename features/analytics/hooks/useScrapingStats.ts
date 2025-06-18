"use client"

import { useState, useEffect, useCallback } from "react"
import type { ScrapingStats, DailyScrapingStats, SourceStats, WebsiteSource } from "../types"

// API integration functions (to be implemented)
async function fetchScrapingStatsFromDB(): Promise<ScrapingStats | null> {
  // This would aggregate data from scraping_stats table
  // SELECT 
  //   COUNT(*) as sitesReviewed,
  //   SUM(leads_found) as leadsObtained,
  //   AVG(success_rate) as successRate,
  //   SUM(estimated_savings) as moneySaved
  // FROM scraping_stats
  // WHERE session_start >= date_trunc('month', now())
  return null // Placeholder
}

async function fetchWebsiteSourcesFromDB(): Promise<WebsiteSource[]> {
  // This would query website_sources table
  // SELECT * FROM website_sources 
  // WHERE is_active = true 
  // ORDER BY total_leads_found DESC 
  // LIMIT 5
  return [] // Placeholder
}

async function fetchDailyScrapingStats(): Promise<DailyScrapingStats[]> {
  // This would query aggregated daily stats
  // SELECT 
  //   DATE(session_start) as date,
  //   COUNT(*) as sites,
  //   SUM(leads_found) as leads,
  //   SUM(estimated_savings) as savings
  // FROM scraping_stats
  // WHERE session_start >= now() - interval '7 days'
  // GROUP BY DATE(session_start)
  // ORDER BY date DESC
  return [] // Placeholder
}

// Mock data - in real app this would come from aggregated database queries
const mockScrapingData: ScrapingStats = {
  sitesReviewed: 1247,
  leadsObtained: 3891,
  moneySaved: 58365, // in euros
  avgLeadsPerSite: 3.12,
  successRate: 87.3,
  lastUpdate: new Date().toISOString(),
  dailyStats: [
    { date: "2024-01-20", sites: 45, leads: 142, savings: 2130 },
    { date: "2024-01-21", sites: 52, leads: 168, savings: 2520 },
    { date: "2024-01-22", sites: 38, leads: 119, savings: 1785 },
    { date: "2024-01-23", sites: 61, leads: 195, savings: 2925 },
    { date: "2024-01-24", sites: 47, leads: 151, savings: 2265 },
    { date: "2024-01-25", sites: 55, leads: 178, savings: 2670 },
    { date: "2024-01-26", sites: 49, leads: 156, savings: 2340 },
  ],
  topSources: [
    { website: "solarinstallers.com", leads: 892, percentage: 22.9 },
    { website: "greenenergyfirms.net", leads: 734, percentage: 18.9 },
    { website: "renewableenergy.com", leads: 623, percentage: 16.0 },
    { website: "eco-consultants.org", leads: 445, percentage: 11.4 },
    { website: "sustainablesolutions.co", leads: 387, percentage: 9.9 },
  ],
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function useScrapingStats() {
  const [stats, setStats] = useState<ScrapingStats | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchStats = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Update with current timestamp
      const updatedStats: ScrapingStats = {
        ...mockScrapingData,
        lastUpdate: new Date().toISOString()
      }

      setStats(updatedStats)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch scraping stats')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const refreshStats = useCallback(async () => {
    await fetchStats()
  }, [fetchStats])

  // Calculated metrics
  const calculateMetrics = useCallback(() => {
    if (!stats) return null

    const totalSavingsThisWeek = stats.dailyStats
      .slice(-7)
      .reduce((sum, day) => sum + day.savings, 0)

    const averageLeadsPerDay = stats.dailyStats.length > 0
      ? stats.dailyStats.reduce((sum, day) => sum + day.leads, 0) / stats.dailyStats.length
      : 0

    const bestPerformingDay = stats.dailyStats.reduce((best, current) => 
      current.leads > best.leads ? current : best, stats.dailyStats[0]
    )

    return {
      totalSavingsThisWeek,
      averageLeadsPerDay: Math.round(averageLeadsPerDay),
      bestPerformingDay,
      costPerLead: stats.moneySaved / stats.leadsObtained,
      roi: (stats.moneySaved / (stats.sitesReviewed * 10)) * 100 // Assuming €10 cost per site
    }
  }, [stats])

  // Auto-refresh every 2 minutes (scraping is more dynamic)
  useEffect(() => {
    fetchStats()
    
    const interval = setInterval(fetchStats, 2 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchStats])

  return {
    stats,
    isLoading,
    error,
    lastUpdated,
    refreshStats,
    formatCurrency,
    metrics: calculateMetrics(),
    
    // Individual stats for easier access
    sitesReviewed: stats?.sitesReviewed || 0,
    leadsObtained: stats?.leadsObtained || 0,
    moneySaved: stats?.moneySaved || 0,
    successRate: stats?.successRate || 0,
    dailyStats: stats?.dailyStats || [],
    topSources: stats?.topSources || []
  }
}
