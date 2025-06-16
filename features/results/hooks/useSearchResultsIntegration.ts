import { useCallback } from "react"
import { useRouter } from "next/navigation"
import type { LeadsSearchParams } from "../types"

interface SearchCriteria {
  selectedClientTypes: string[]
  selectedLocations: string[]
  requireWebsite?: boolean
  validateEmail?: boolean
  validateWebsite?: boolean
}

export function useSearchResultsIntegration() {
  const router = useRouter()

  // Convert search criteria from dashboard to API search params
  const convertSearchCriteria = useCallback((criteria: SearchCriteria): LeadsSearchParams => {
    const searchParams: LeadsSearchParams = {}

    // Map client types to industries
    if (criteria.selectedClientTypes.length > 0) {
      // For now, use the first client type as industry filter
      // This could be enhanced with a mapping function
      searchParams.industry = mapClientTypeToIndustry(criteria.selectedClientTypes[0])
    }

    // Map locations to city/province
    if (criteria.selectedLocations.length > 0) {
      const location = criteria.selectedLocations[0]
      // Extract city from location (assuming format like "Madrid, España")
      const city = location.split(',')[0].trim()
      searchParams.city = city
    }

    // Apply validation filters
    if (criteria.requireWebsite) {
      searchParams.has_website = true
    }

    if (criteria.validateEmail) {
      searchParams.has_email = true
    }

    // Set reasonable defaults
    searchParams.confidence_min = 70  // Only show decent confidence leads
    searchParams.limit = 50
    searchParams.page = 1

    return searchParams
  }, [])

  // Navigate to results with search parameters
  const navigateToResults = useCallback((criteria: SearchCriteria) => {
    const searchParams = convertSearchCriteria(criteria)
    
    // Convert to URL search params
    const urlParams = new URLSearchParams()
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined) {
        urlParams.append(key, value.toString())
      }
    })

    // Navigate to results page with parameters
    router.push(`/results?${urlParams.toString()}`)
  }, [convertSearchCriteria, router])

  // Handle search completion from dashboard
  const handleSearchComplete = useCallback((criteria: SearchCriteria) => {
    console.log('🚀 Search completed, navigating to results with:', criteria)
    navigateToResults(criteria)
  }, [navigateToResults])

  return {
    convertSearchCriteria,
    navigateToResults,
    handleSearchComplete,
  }
}

// Helper function to map client types to industries
function mapClientTypeToIndustry(clientType: string): string {
  const mapping: Record<string, string> = {
    'solar': 'Energy & Environment',
    'industrial': 'Manufacturing',
    'residential': 'Construction',
    'commercial': 'Professional Services',
    'healthcare': 'Healthcare',
    'education': 'Education',
    'hospitality': 'Hospitality',
    'retail': 'Retail',
    'technology': 'Technology',
    'financial': 'Financial Services',
    'automotive': 'Automotive',
    'agriculture': 'Agriculture',
    'real-estate': 'Real Estate',
    'consulting': 'Professional Services',
    'manufacturing': 'Manufacturing',
    'logistics': 'Transportation & Logistics',
    'food-beverage': 'Food & Beverage',
    'media': 'Media & Entertainment',
    'government': 'Government',
    'non-profit': 'Non-Profit',
  }

  return mapping[clientType.toLowerCase()] || 'Other'
} 