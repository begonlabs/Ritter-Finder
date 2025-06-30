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
  sortField: "data_quality_score",
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

    // Apply search term filter (search in real database fields)
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      filtered = filtered.filter(lead =>
        // Search in company name (both legacy and real field)
        (lead.company_name || lead.company || '').toLowerCase().includes(searchLower) ||
        // Search in activity
        (lead.activity || '').toLowerCase().includes(searchLower) ||
        // Search in description
        (lead.description || '').toLowerCase().includes(searchLower) ||
        // Search in category
        (lead.category || lead.industry || '').toLowerCase().includes(searchLower) ||
        // Search in email
        (lead.email || '').toLowerCase().includes(searchLower) ||
        // Search in phone
        (lead.phone || '').toLowerCase().includes(searchLower) ||
        // Search in location fields
        (lead.location || '').toLowerCase().includes(searchLower) ||
        (lead.state || '').toLowerCase().includes(searchLower) ||
        (lead.country || '').toLowerCase().includes(searchLower) ||
        (lead.address || '').toLowerCase().includes(searchLower)
      )
    }

    // Apply industry/category filter
    if (filters.industryFilter) {
      filtered = filtered.filter(lead => {
        const category = (lead.category || lead.industry || '').toLowerCase()
        const activity = (lead.activity || '').toLowerCase()
        const filterLower = filters.industryFilter.toLowerCase()
        
        return category.includes(filterLower) || activity.includes(filterLower)
      })
    }

    // Apply location filter
    if (filters.locationFilter) {
      const filterLower = filters.locationFilter.toLowerCase()
      filtered = filtered.filter(lead => {
        const location = (lead.location || '').toLowerCase()
        const state = (lead.state || '').toLowerCase()
        const country = (lead.country || '').toLowerCase()
        const address = (lead.address || '').toLowerCase()
        
        return location.includes(filterLower) || 
               state.includes(filterLower) || 
               country.includes(filterLower) ||
               address.includes(filterLower)
      })
    }

    // Apply confidence range filter (convert quality score to confidence)
    filtered = filtered.filter(lead => {
      // If we have real quality score, convert it to confidence percentage
      if (lead.data_quality_score !== undefined) {
        const confidence = Math.round(((lead.data_quality_score - 1) / 4) * 100)
        return confidence >= filters.confidenceRange[0] && confidence <= filters.confidenceRange[1]
      }
      // Fallback to legacy confidence field
      const confidence = lead.confidence || 0
      return confidence >= filters.confidenceRange[0] && confidence <= filters.confidenceRange[1]
    })

    // Apply selected only filter
    if (filters.showOnlySelected) {
      filtered = filtered.filter(lead => selectedLeads.includes(lead.id))
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sorting.sortField]
      let bValue: any = b[sorting.sortField]

      // Handle special cases for new fields
      if (sorting.sortField === "company_name") {
        aValue = a.company_name || a.company || ''
        bValue = b.company_name || b.company || ''
      }

      if (sorting.sortField === "data_quality_score") {
        aValue = a.data_quality_score || 1
        bValue = b.data_quality_score || 1
      }

      if (sorting.sortField === "activity") {
        aValue = a.activity || ''
        bValue = b.activity || ''
      }

      if (sorting.sortField === "category") {
        aValue = a.category || a.industry || ''
        bValue = b.category || b.industry || ''
      }

      // String comparison
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sorting.sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }

      // Number comparison
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sorting.sortDirection === "asc"
          ? aValue - bValue
          : bValue - aValue
      }

      // Date comparison
      if (aValue instanceof Date && bValue instanceof Date) {
        return sorting.sortDirection === "asc"
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime()
      }

      // String comparison for dates
      if (typeof aValue === "string" && typeof bValue === "string" && 
          (sorting.sortField === "created_at" || sorting.sortField === "updated_at" || sorting.sortField === "lastActivity")) {
        const aTime = new Date(aValue).getTime()
        const bTime = new Date(bValue).getTime()
        return sorting.sortDirection === "asc"
          ? aTime - bTime
          : bTime - aTime
      }

      return 0
    })

    return filtered
  }, [leads, filters, sorting, selectedLeads])

  // Get unique values for filter options (using real database fields)
  const filterOptions = useMemo(() => {
    // Get industries from both category and activity fields
    const industries = [...new Set([
      ...leads.map(lead => lead.category || '').filter(Boolean),
      ...leads.map(lead => lead.activity || '').filter(Boolean),
      ...leads.map(lead => lead.industry || '').filter(Boolean)
    ])].sort()
    
    // Get locations from all location fields
    const locations = [...new Set([
      ...leads.map(lead => lead.location || '').filter(Boolean),
      ...leads.map(lead => lead.state || '').filter(Boolean),
      ...leads.map(lead => lead.country || '').filter(Boolean)
    ])].sort()
    
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