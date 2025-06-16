import { useMemo } from "react"
import type { Lead, NormalizedLead } from "../types"

export function useLeadsAdapter() {
  
  // Convert normalized lead to frontend Lead interface
  const adaptNormalizedLead = (normalized: NormalizedLead): Lead => {
    return {
      id: normalized.id,
      name: normalized.name,
      // Use company name as the lead name for businesses
      company: normalized.name,
      email: normalized.email_found || '',
      website: normalized.website || '',
      phone: normalized.phone || '',
      // Infer position based on legal form and business type
      position: inferPosition(normalized),
      location: normalized.location_normalized,
      industry: normalized.industry,
      employees: normalized.estimated_employees,
      revenue: normalized.estimated_revenue,
      source: getSourceDisplayName(normalized.source_type),
      confidence: normalized.confidence_score,
      lastActivity: normalized.scraped_at,
      notes: createNotesFromNormalized(normalized),
      hasWebsite: !!normalized.website,
      websiteExists: normalized.website_validated,
      emailValidated: normalized.email_validated,
    }
  }

  // Convert array of normalized leads
  const adaptNormalizedLeads = useMemo(() => {
    return (normalizedLeads: NormalizedLead[]): Lead[] => {
      return normalizedLeads.map(adaptNormalizedLead)
    }
  }, [])

  // Helper functions
  const inferPosition = (normalized: NormalizedLead): string => {
    // Infer position based on legal form and business context
    if (normalized.legal_form?.includes('SOCIEDAD LIMITADA')) {
      return 'CEO/Managing Director'
    }
    if (normalized.legal_form?.includes('AUTONOMO')) {
      return 'Owner'
    }
    if (normalized.source_type === 'paginas_amarillas') {
      return 'Business Owner'
    }
    if (normalized.cnae_code?.startsWith('62')) {
      return 'CTO/Technical Director'
    }
    if (normalized.cnae_code?.startsWith('70')) {
      return 'Managing Director'
    }
    return 'Business Contact'
  }

  const getSourceDisplayName = (sourceType: string): string => {
    const sourceMap: Record<string, string> = {
      'paginas_amarillas': 'Páginas Amarillas',
      'axesor': 'Axesor',
    }
    return sourceMap[sourceType] || sourceType
  }

  const createNotesFromNormalized = (normalized: NormalizedLead): string => {
    const notes: string[] = []
    
    if (normalized.description) {
      notes.push(`Descripción: ${normalized.description}`)
    }
    
    if (normalized.business_object) {
      notes.push(`Objeto social: ${normalized.business_object}`)
    }
    
    if (normalized.cif_nif) {
      notes.push(`CIF/NIF: ${normalized.cif_nif}`)
    }
    
    if (normalized.constitution_date) {
      notes.push(`Constituida: ${new Date(normalized.constitution_date).toLocaleDateString()}`)
    }
    
    if (normalized.cnae_code) {
      notes.push(`CNAE: ${normalized.cnae_code}`)
    }
    
    if (normalized.activities) {
      notes.push(`Actividades: ${normalized.activities}`)
    }
    
    return notes.join(' | ')
  }

  // Create search params for API
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
      params.industry = filters.industryFilter
    }
    
    if (filters.locationFilter) {
      // Extract city from location filter
      const city = filters.locationFilter.split(',')[0].trim()
      params.city = city
    }
    
    if (filters.confidenceRange) {
      params.confidence_min = filters.confidenceRange[0].toString()
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

  return {
    adaptNormalizedLead,
    adaptNormalizedLeads,
    createSearchParams,
  }
} 