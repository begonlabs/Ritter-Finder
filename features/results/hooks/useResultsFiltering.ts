"use client"

import { useState, useMemo } from "react"
import type { Lead, ResultsFilters, ResultsSorting } from "../types"

const initialFilters: ResultsFilters = {
  searchTerm: "",
  industryFilter: "",
  locationFilter: "",
  confidenceRange: [0, 100],
  showOnlySelected: false,
}

const initialSorting: ResultsSorting = {
  sortField: "confidence",
  sortDirection: "desc",
}

export function useResultsFiltering(leads: Lead[], selectedLeads: string[] = []) {
  const [filters, setFilters] = useState<ResultsFilters>(initialFilters)
  const [sorting, setSortingState] = useState<ResultsSorting>(initialSorting)

  const setSearchTerm = (term: string) => {
    setFilters(prev => ({ ...prev, searchTerm: term }))
  }

  const setIndustryFilter = (industry: string) => {
    setFilters(prev => ({ ...prev, industryFilter: industry }))
  }

  const setLocationFilter = (location: string) => {
    setFilters(prev => ({ ...prev, locationFilter: location }))
  }

  const setConfidenceRange = (range: [number, number]) => {
    setFilters(prev => ({ ...prev, confidenceRange: range }))
  }

  const setShowOnlySelected = (show: boolean) => {
    setFilters(prev => ({ ...prev, showOnlySelected: show }))
  }

  const setSorting = (field: keyof Lead) => {
    setSortingState(prev => ({
      sortField: field,
      sortDirection: prev.sortField === field && prev.sortDirection === "desc" ? "asc" : "desc",
    }))
  }

  const resetFilters = () => {
    setFilters(initialFilters)
    setSortingState(initialSorting)
  }

  const filteredAndSortedLeads = useMemo(() => {
    let filtered = [...leads]

    // Apply search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      filtered = filtered.filter(lead =>
        lead.name.toLowerCase().includes(searchLower) ||
        lead.company.toLowerCase().includes(searchLower) ||
        lead.email.toLowerCase().includes(searchLower) ||
        lead.industry.toLowerCase().includes(searchLower) ||
        lead.location.toLowerCase().includes(searchLower)
      )
    }

    // Apply industry filter
    if (filters.industryFilter) {
      filtered = filtered.filter(lead =>
        lead.industry.toLowerCase() === filters.industryFilter.toLowerCase()
      )
    }

    // Apply location filter
    if (filters.locationFilter) {
      filtered = filtered.filter(lead =>
        lead.location.toLowerCase().includes(filters.locationFilter.toLowerCase())
      )
    }

    // Apply confidence range filter
    filtered = filtered.filter(lead =>
      lead.confidence >= filters.confidenceRange[0] &&
      lead.confidence <= filters.confidenceRange[1]
    )

    // Apply selected only filter
    if (filters.showOnlySelected) {
      filtered = filtered.filter(lead => selectedLeads.includes(lead.id))
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sorting.sortField]
      const bValue = b[sorting.sortField]

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sorting.sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sorting.sortDirection === "asc"
          ? aValue - bValue
          : bValue - aValue
      }

      return 0
    })

    return filtered
  }, [leads, filters, sorting, selectedLeads])

  // Get unique values for filter options
  const filterOptions = useMemo(() => {
    const industries = [...new Set(leads.map(lead => lead.industry))].sort()
    const locations = [...new Set(leads.map(lead => lead.location))].sort()
    
    return {
      industries,
      locations,
    }
  }, [leads])

  const actions = {
    setSearchTerm,
    setIndustryFilter,
    setLocationFilter,
    setConfidenceRange,
    setShowOnlySelected,
    setSorting,
    resetFilters,
  }

  return {
    filters,
    sorting,
    filteredLeads: filteredAndSortedLeads,
    filterOptions,
    actions,
  }
} 