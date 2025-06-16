"use client"

import { useMemo, useEffect } from "react"
import { useLeadSelection } from "./useLeadSelection"
import { useResultsFiltering } from "./useResultsFiltering"
import { useLeadsApi } from "./useLeadsApi"
import { useLeadsAdapter } from "./useLeadsAdapter"
import type { Lead, ResultsState, ResultsActions, LeadSummary, ConfidenceLevel, LeadsSearchParams } from "../types"

interface UseResultsOptions {
  initialSearchParams?: LeadsSearchParams
  autoFetch?: boolean
}

export function useResults(options: UseResultsOptions = {}) {
  const { initialSearchParams, autoFetch = true } = options

  // API layer - fetch normalized leads from backend
  const {
    normalizedLeads,
    isLoading,
    error,
    total,
    hasMore,
    currentPage,
    fetchLeads,
    refreshLeads,
    clearLeads,
  } = useLeadsApi(autoFetch ? initialSearchParams : undefined)

  // Adapter layer - convert normalized leads to frontend format
  const { adaptNormalizedLeads, createSearchParams } = useLeadsAdapter()

  // Convert normalized leads to frontend Lead format
  const leads = useMemo(() => {
    return adaptNormalizedLeads(normalizedLeads)
  }, [normalizedLeads, adaptNormalizedLeads])

  // Selection logic
  const {
    selection,
    selectedLeadsData,
    actions: selectionActions
  } = useLeadSelection(leads)

  // Filtering and sorting (client-side for now)
  const {
    filters,
    sorting,
    filteredLeads,
    filterOptions,
    actions: filterActions
  } = useResultsFiltering(leads, selection.selectedLeads)

  // Calculate summary statistics
  const summary: LeadSummary = useMemo(() => {
    const byConfidence: Record<ConfidenceLevel, number> = {
      high: leads.filter(lead => lead.confidence >= 90).length,
      medium: leads.filter(lead => lead.confidence >= 80 && lead.confidence < 90).length,
      low: leads.filter(lead => lead.confidence < 80).length,
    }

    const byIndustry: Record<string, number> = {}
    const byLocation: Record<string, number> = {}

    leads.forEach(lead => {
      byIndustry[lead.industry] = (byIndustry[lead.industry] || 0) + 1
      byLocation[lead.location] = (byLocation[lead.location] || 0) + 1
    })

    return {
      total: leads.length,
      byConfidence,
      byIndustry,
      byLocation,
    }
  }, [leads])

  // Calculate stats for filtered leads
  const filteredStats = useMemo(() => {
    const averageConfidence = filteredLeads.length > 0
      ? filteredLeads.reduce((sum, lead) => sum + lead.confidence, 0) / filteredLeads.length
      : 0

    const topIndustries = Object.entries(summary.byIndustry)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([industry]) => industry)

    return {
      totalLeads: filteredLeads.length,
      selectedLeads: selection.selectedLeads.length,
      averageConfidence: Math.round(averageConfidence),
      topIndustries,
    }
  }, [filteredLeads, selection.selectedLeads.length, summary.byIndustry])

  // Enhanced search function that calls the API
  const searchLeads = async (searchParams: LeadsSearchParams) => {
    await fetchLeads(searchParams)
  }

  // Search with current filters
  const searchWithFilters = async () => {
    const searchParams = createSearchParams({
      searchTerm: filters.searchTerm,
      industryFilter: filters.industryFilter,
      locationFilter: filters.locationFilter,
      confidenceRange: filters.confidenceRange,
    }, {
      page: 1,
      limit: 50
    })

    await fetchLeads(searchParams)
  }

  // Load more results (pagination)
  const loadMore = async () => {
    if (hasMore && !isLoading) {
      const searchParams = createSearchParams({
        searchTerm: filters.searchTerm,
        industryFilter: filters.industryFilter,
        locationFilter: filters.locationFilter,
        confidenceRange: filters.confidenceRange,
      }, {
        page: currentPage + 1,
        limit: 50
      })

      await fetchLeads(searchParams)
    }
  }

  const state: ResultsState = {
    leads,
    filteredLeads,
    selection,
    filters,
    sorting,
    isLoading,
  }

  const actions: ResultsActions = {
    selection: selectionActions,
    ...filterActions,
  }

  // Utility functions - returns CSS module class names
  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 90) return "confidenceHigh"
    if (confidence >= 80) return "confidenceMedium"
    return "confidenceLow"
  }

  const exportSelectedLeads = () => {
    const selectedData = selectedLeadsData.map(lead => ({
      Name: lead.name,
      Company: lead.company,
      Email: lead.email,
      Phone: lead.phone,
      Position: lead.position,
      Website: lead.website,
      Industry: lead.industry,
      Location: lead.location,
      Confidence: `${lead.confidence}%`,
      Employees: lead.employees,
      Revenue: lead.revenue,
    }))

    if (selectedData.length === 0) return

    // Create CSV content
    const headers = Object.keys(selectedData[0])
    const csvContent = [
      headers.join(","),
      ...selectedData.map(row => 
        headers.map(header => `"${row[header as keyof typeof row] || ''}"`).join(",")
      )
    ].join("\n")

    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `selected_leads_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return {
    state,
    actions,
    selectedLeadsData,
    filteredStats,
    summary,
    filterOptions,
    getConfidenceColor,
    exportSelectedLeads,
    // API functions
    searchLeads,
    searchWithFilters,
    loadMore,
    refreshLeads,
    clearLeads,
    // API state
    error,
    total,
    hasMore,
    currentPage,
  }
}