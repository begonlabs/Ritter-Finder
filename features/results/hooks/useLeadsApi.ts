import { useState, useEffect, useCallback } from "react"
import type { NormalizedLead, LeadsApiResponse, LeadsSearchParams } from "../types"

interface UseLeadsApiResult {
  normalizedLeads: NormalizedLead[]
  isLoading: boolean
  error: string | null
  total: number
  hasMore: boolean
  currentPage: number
  fetchLeads: (params?: LeadsSearchParams) => Promise<void>
  refreshLeads: () => Promise<void>
  clearLeads: () => void
}

export function useLeadsApi(initialParams?: LeadsSearchParams): UseLeadsApiResult {
  const [normalizedLeads, setNormalizedLeads] = useState<NormalizedLead[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [lastParams, setLastParams] = useState<LeadsSearchParams | undefined>(initialParams)

  const fetchLeads = useCallback(async (params?: LeadsSearchParams) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const searchParams = new URLSearchParams()
      
      // Add all search parameters
      if (params?.city) searchParams.append('city', params.city)
      if (params?.province) searchParams.append('province', params.province)
      if (params?.industry) searchParams.append('industry', params.industry)
      if (params?.source_type) searchParams.append('source_type', params.source_type)
      if (params?.confidence_min !== undefined) searchParams.append('confidence_min', params.confidence_min.toString())
      if (params?.has_website !== undefined) searchParams.append('has_website', params.has_website.toString())
      if (params?.has_email !== undefined) searchParams.append('has_email', params.has_email.toString())
      if (params?.has_phone !== undefined) searchParams.append('has_phone', params.has_phone.toString())
      if (params?.search_term) searchParams.append('search_term', params.search_term)
      if (params?.page) searchParams.append('page', params.page.toString())
      if (params?.limit) searchParams.append('limit', params.limit.toString())

      const response = await fetch(`/api/leads?${searchParams.toString()}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data: LeadsApiResponse = await response.json()
      
      if (!data.success) {
        throw new Error('Failed to fetch leads from API')
      }

      // If it's a new search (page 1), replace the leads
      // If it's pagination (page > 1), append to existing leads
      if (params?.page && params.page > 1) {
        setNormalizedLeads(prev => [...prev, ...data.data])
      } else {
        setNormalizedLeads(data.data)
      }

      setTotal(data.total)
      setHasMore(data.hasMore)
      setCurrentPage(data.page)
      setLastParams(params)
      
    } catch (err) {
      console.error('Error fetching leads:', err)
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
      setNormalizedLeads([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const refreshLeads = useCallback(async () => {
    await fetchLeads(lastParams)
  }, [fetchLeads, lastParams])

  const clearLeads = useCallback(() => {
    setNormalizedLeads([])
    setTotal(0)
    setHasMore(false)
    setCurrentPage(1)
    setError(null)
  }, [])

  // Initial fetch on mount
  useEffect(() => {
    if (initialParams) {
      fetchLeads(initialParams)
    }
  }, []) // Empty dependency array for mount only

  return {
    normalizedLeads,
    isLoading,
    error,
    total,
    hasMore,
    currentPage,
    fetchLeads,
    refreshLeads,
    clearLeads,
  }
} 