import { useMemo } from "react"
import type { Lead, NormalizedLead } from "../types"
import { normalizedToLead, leadToNormalized } from "../types"

export function useLeadsAdapter() {
  
  // Convert normalized lead to frontend Lead interface using the transformation function
  const adaptNormalizedLead = (normalized: NormalizedLead): Lead => {
    return normalizedToLead(normalized)
  }

  // Convert array of normalized leads
  const adaptNormalizedLeads = useMemo(() => {
    return (normalizedLeads: NormalizedLead[]): Lead[] => {
      return normalizedLeads.map(adaptNormalizedLead)
    }
  }, [])

  // Create search params for API using simplified schema fields
  const createSearchParams = (
    filters: {
      searchTerm?: string
      industryFilter?: string
      locationFilter?: string
      confidenceRange?: [number, number]
      sourceType?: 'paginas_amarillas' | 'axesor'
    },
    pagination: {
      page?: number
      limit?: number
    } = {}
  ) => {
    const params: Record<string, string> = {}
    
    if (filters.searchTerm) {
      params.search_term = filters.searchTerm
    }
    
    if (filters.industryFilter) {
      // Search in both industry and activity fields
      params.industry = filters.industryFilter
    }
    
    if (filters.locationFilter) {
      // Extract city from location filter
      const city = filters.locationFilter.split(',')[0].trim()
      params.city = city
    }
    
    if (filters.confidenceRange) {
      // Convert confidence percentage to quality score (1-5)
      const minQualityScore = Math.round((filters.confidenceRange[0] / 100) * 4) + 1
      params.quality_score_min = minQualityScore.toString()
    }
    
    if (filters.sourceType) {
      params.source_type = filters.sourceType
    }
    
    if (pagination.page) {
      params.page = pagination.page.toString()
    }
    
    if (pagination.limit) {
      params.limit = pagination.limit.toString()
    }
    
    return params
  }

  // Validation helper functions for new boolean flags
  const isEmailVerified = (lead: NormalizedLead): boolean => {
    return lead.verified_email && !!lead.email
  }

  const isPhoneVerified = (lead: NormalizedLead): boolean => {
    return lead.verified_phone && !!lead.phone
  }

  const isWebsiteVerified = (lead: NormalizedLead): boolean => {
    return lead.verified_website && !!lead.company_website
  }

  const calculateQualityScore = (lead: NormalizedLead): number => {
    // Quality score calculation based on new schema:
    // 1 (base) + verified_email (1) + verified_phone (1) + verified_website (1) + has_phone (1) = max 5
    let score = 1 // Base score
    
    if (lead.verified_email && lead.email) score += 1
    if (lead.verified_phone && lead.phone) score += 1  
    if (lead.verified_website && lead.company_website) score += 1
    if (lead.phone) score += 1 // Has phone regardless of verification
    
    return Math.min(score, 5) // Cap at 5
  }

  // Get display-friendly source name
  const getSourceDisplayName = (sourceType?: string): string => {
    const sourceMap: Record<string, string> = {
      'paginas_amarillas': 'Páginas Amarillas',
      'axesor': 'Axesor',
    }
    return sourceMap[sourceType || ''] || 'Web Scraping'
  }

  return {
    adaptNormalizedLead,
    adaptNormalizedLeads,
    createSearchParams,
    isEmailVerified,
    isPhoneVerified,
    isWebsiteVerified,
    calculateQualityScore,
    getSourceDisplayName,
  }
} 