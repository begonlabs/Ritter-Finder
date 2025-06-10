"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import type { SearchHistoryItem, HistoryFilters } from "../types"

// Mock data - in real app this would come from API
const mockSearchHistory: SearchHistoryItem[] = [
  {
    id: "search-1",
    date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    websites: ["solarinstallers.com", "greenenergyfirms.net"],
    clientType: "residential",
    leadsFound: 24,
    leadsContacted: 18,
    searchTime: 45,
    status: "completed",
    query: "solar panel installers",
    filters: {
      industry: ["renewable_energy"],
      confidence: 85
    }
  },
  {
    id: "search-2", 
    date: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
    websites: ["renewableenergy.com", "eco-consultants.org"],
    clientType: "commercial",
    leadsFound: 31,
    leadsContacted: 25,
    searchTime: 62,
    status: "completed",
    query: "commercial energy consultants",
    filters: {
      industry: ["consulting", "renewable_energy"],
      confidence: 90
    }
  },
  {
    id: "search-3",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    websites: ["sustainablesolutions.co"],
    clientType: "industrial", 
    leadsFound: 15,
    leadsContacted: 12,
    searchTime: 38,
    status: "completed",
    query: "sustainable energy solutions",
    filters: {
      industry: ["manufacturing", "renewable_energy"],
      confidence: 80
    }
  },
  {
    id: "search-4",
    date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    websites: ["solarinstallers.com"],
    clientType: "residential",
    leadsFound: 0,
    leadsContacted: 0,
    searchTime: 12,
    status: "failed",
    query: "residential solar contractors",
    filters: {
      industry: ["renewable_energy"],
      confidence: 75
    }
  },
  {
    id: "search-5",
    date: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
    websites: ["greenenergyfirms.net", "renewableenergy.com"],
    clientType: "energy",
    leadsFound: 42,
    leadsContacted: 35,
    searchTime: 78,
    status: "completed",
    query: "green energy consultants",
    filters: {
      industry: ["consulting", "renewable_energy"],
      confidence: 88
    }
  }
]

export function useSearchHistory() {
  const [history, setHistory] = useState<SearchHistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Load history data
  const loadHistory = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))
      setHistory(mockSearchHistory)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load search history')
    } finally {
      setIsLoading(false)
    }
  }, [])

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
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      setHistory(prev => prev.filter(item => item.id !== searchId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete search')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Rerun search
  const rerunSearch = useCallback(async (searchData: SearchHistoryItem) => {
    console.log('Rerunning search:', searchData)
    // In real app, this would trigger a new search with the same parameters
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
