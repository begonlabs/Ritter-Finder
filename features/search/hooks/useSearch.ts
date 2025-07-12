"use client"

import { useState, useCallback, useMemo } from "react"
import { mockLeads } from "@/lib/mock-data"
import { useSearchConfig } from "./useSearchConfig"
import { useSearchHistory } from "./useSearchHistory"

import type { SearchState, SearchResults, SearchConfig, SearchActions, SearchLead, QualityDistribution } from "../types"
import { searchLeadToLegacyLead } from "../types"

// Generate mock search leads based on search criteria
function generateSearchResults(config: SearchConfig): SearchLead[] {
  // Convert mockLeads (Legacy format) to SearchLead format
  const searchLeads: SearchLead[] = mockLeads.map((lead, index) => ({
    id: lead.id,
    // Contact Information
    email: lead.email,
    verified_email: lead.verified_email,
    phone: lead.phone,
    verified_phone: lead.verified_phone,
    
    // Company Information (updated field names)
    company_name: lead.company_name || 'Unknown Company',
    company_website: lead.company_website,
    verified_website: lead.verified_website,
    
    // Location Information (simplified)
    address: lead.location,
    state: extractStateFromLocation(lead.location),
    country: 'España',
    
    // New fields from schema
    activity: mapIndustryToActivity(lead.industry),
    description: lead.notes || `Empresa del sector ${lead.industry}`,
    category: mapIndustryToCategory(lead.industry),
    
    // Data Quality Score (1-5 scale)
    data_quality_score: calculateQualityScore(lead),
    
    // Timestamps
    created_at: new Date().toISOString(),
    updated_at: lead.lastActivity ? new Date(lead.lastActivity).toISOString() : new Date().toISOString(),
    last_contacted_at: undefined,
    
    // Legacy compatibility fields
    name: lead.name,
    company: lead.company_name,
    website: lead.company_website,
    position: lead.position,
    location: lead.location,
    industry: lead.industry,
    employees: lead.employees,
    revenue: lead.revenue,
    source: lead.source,
    confidence: lead.confidence,
    lastActivity: lead.lastActivity,
    notes: lead.notes,
    hasWebsite: lead.hasWebsite,
    websiteExists: lead.websiteExists,
    emailValidated: lead.emailValidated,
  }))

  // Filter based on search config
  return searchLeads.filter(lead => {
    // Filter by client types (map to activities)
    if (config.selectedClientTypes.length > 0) {
      const matchesClientType = config.selectedClientTypes.some(clientType => 
        mapClientTypeToActivity(clientType).includes(lead.activity)
      )
      if (!matchesClientType) return false
    }

    // Filter by locations
    if (config.selectedLocations.length > 0 && !config.selectedLocations.includes("all")) {
      const matchesLocation = config.selectedLocations.some(location => 
        lead.state?.toLowerCase().includes(location.toLowerCase()) ||
        lead.address?.toLowerCase().includes(location.toLowerCase())
      )
      if (!matchesLocation) return false
    }

    // Filter by validation requirements
    if (config.requireWebsite && !lead.company_website) return false
    if (config.validateEmail && !lead.verified_email) return false
    if (config.validateWebsite && !lead.verified_website) return false
    
    // Filter by quality score if specified
    if (config.minQualityScore && lead.data_quality_score < config.minQualityScore) return false

    return true
  })
}

// Helper functions for mapping
function extractStateFromLocation(location: string): string {
  const states = ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Bilbao', 'Málaga', 'Zaragoza', 'Murcia']
  const found = states.find(state => location?.includes(state))
  return found || 'Madrid'
}

function mapIndustryToActivity(industry: string): string {
  const mappings: Record<string, string> = {
    'Solar': 'Instalación de Paneles Solares',
    'Energy': 'Servicios Energéticos',
    'Industrial': 'Manufactura Industrial',
    'Construction': 'Construcción y Desarrollo',
    'Technology': 'Tecnología y Software',
    'Consulting': 'Consultoría Energética',
  }
  return mappings[industry] || 'Servicios Generales'
}

function mapIndustryToCategory(industry: string): string {
  const mappings: Record<string, string> = {
    'Solar': 'Energía Renovable',
    'Energy': 'Energía y Utilities',
    'Industrial': 'Industria',
    'Construction': 'Construcción',
    'Technology': 'Tecnología',
    'Consulting': 'Servicios Profesionales',
  }
  return mappings[industry] || 'Otros'
}

function mapClientTypeToActivity(clientType: string): string[] {
  const mappings: Record<string, string[]> = {
    'solar': ['Instalación de Paneles Solares', 'Energía Solar'],
    'industrial': ['Manufactura Industrial', 'Producción Industrial'],
    'energy': ['Servicios Energéticos', 'Energía y Utilities'],
    'residential': ['Construcción Residencial', 'Desarrollo Inmobiliario'],
    'commercial': ['Servicios Comerciales', 'Edificios Comerciales'],
    'consulting': ['Consultoría Energética', 'Servicios Profesionales'],
  }
  return mappings[clientType] || ['Servicios Generales']
}

function calculateQualityScore(lead: any): number {
  let score = 1 // Base score
  if (lead.verified_email) score += 1
  if (lead.verified_phone) score += 1  
  if (lead.verified_website) score += 1
  if (lead.phone) score += 1 // Has phone number
  return Math.min(score, 5) // Cap at 5
}

function calculateQualityDistribution(leads: SearchLead[]): QualityDistribution {
  const distribution = { score1: 0, score2: 0, score3: 0, score4: 0, score5: 0 }
  
  leads.forEach(lead => {
    const score = lead.data_quality_score
    switch (score) {
      case 1: distribution.score1++; break
      case 2: distribution.score2++; break
      case 3: distribution.score3++; break
      case 4: distribution.score4++; break
      case 5: distribution.score5++; break
    }
  })
  
  return distribution
}

function calculateLocationBreakdown(leads: SearchLead[]): Record<string, number> {
  const breakdown: Record<string, number> = {}
  
  leads.forEach(lead => {
    const location = lead.state || 'Unknown'
    breakdown[location] = (breakdown[location] || 0) + 1
  })
  
  return breakdown
}

function calculateActivityBreakdown(leads: SearchLead[]): Record<string, number> {
  const breakdown: Record<string, number> = {}
  
  leads.forEach(lead => {
    const activity = lead.activity
    breakdown[activity] = (breakdown[activity] || 0) + 1
  })
  
  return breakdown
}

export function useSearch() {
  const { config, actions: configActions, isValidConfig } = useSearchConfig()
  const { saveSearchToHistory, updateSearchStatus } = useSearchHistory()
  
  const [searchState, setSearchState] = useState({
    isSearching: false,
    searchComplete: false,
    searchProgress: 0,
    currentStep: "",
  })

  const [results, setResults] = useState<SearchResults | null>(null)
  const [currentSearchId, setCurrentSearchId] = useState<string | null>(null)

  const handleSearch = useCallback(async () => {
    if (!isValidConfig() || searchState.isSearching) {
      return
    }

    setSearchState({
      isSearching: true,
      searchComplete: false,
      searchProgress: 0,
      currentStep: "Iniciando búsqueda...",
    })

    setResults(null)

    // Create initial search history record
    const searchStartTime = Date.now()
    let searchId: string | null = null

    try {
      // Create a temporary search record with 'running' status
      const tempResults: SearchResults = {
        leads: [],
        totalFound: 0,
        searchTime: 0,
        searchId: Date.now().toString(),
        qualityDistribution: { score1: 0, score2: 0, score3: 0, score4: 0, score5: 0 },
        locationBreakdown: {},
        activityBreakdown: {},
      }

      searchId = await saveSearchToHistory(
        config,
        tempResults,
        0,
        'running'
      )
      setCurrentSearchId(searchId)

    // Enhanced search process with more realistic steps
    const steps = [
      "Conectando a fuentes de datos...",
      "Aplicando filtros de búsqueda...",
      "Extrayendo información de contacto...",
      "Verificando emails y sitios web...",
      "Calculando puntuaciones de calidad...",
      "Generando métricas de resultados...",
      "Completando búsqueda...",
    ]

    let currentStepIndex = 0
      const interval = setInterval(async () => {
      currentStepIndex++
      const progress = (currentStepIndex / steps.length) * 100

      setSearchState(prev => ({
        ...prev,
        searchProgress: progress,
        currentStep: steps[currentStepIndex - 1] || "Procesando...",
      }))

      if (currentStepIndex >= steps.length) {
        clearInterval(interval)
        
        // Complete the search with enhanced results
          setTimeout(async () => {
            try {
          const searchLeads = generateSearchResults(config)
              const searchTime = Date.now() - searchStartTime
          
          const searchResults: SearchResults = {
            leads: searchLeads,
            totalFound: searchLeads.length,
                searchTime: searchTime,
            searchId: Date.now().toString(),
            // Enhanced search metadata
            qualityDistribution: calculateQualityDistribution(searchLeads),
            locationBreakdown: calculateLocationBreakdown(searchLeads),
            activityBreakdown: calculateActivityBreakdown(searchLeads),
          }

          setResults(searchResults)
          setSearchState({
            isSearching: false,
            searchComplete: true,
            searchProgress: 100,
            currentStep: `Búsqueda completada - ${searchLeads.length} leads encontrados`,
          })

              // Update search history with completed results
              if (searchId) {
                await saveSearchToHistory(
                  config,
                  searchResults,
                  searchTime,
                  'completed'
                )
              }
            } catch (error) {
              console.error('Error completing search:', error)
              
              setSearchState({
                isSearching: false,
                searchComplete: false,
                searchProgress: 0,
                currentStep: "Error en la búsqueda",
              })

              // Update search history with failed status
              if (searchId) {
                await updateSearchStatus(
                  searchId,
                  'failed',
                  error instanceof Error ? error.message : 'Error desconocido'
                )
              }
            }
        }, 500)
      }
    }, 800) // Slower progression for more realistic feel
    } catch (error) {
      console.error('Error starting search:', error)
      
      setSearchState({
        isSearching: false,
        searchComplete: false,
        searchProgress: 0,
        currentStep: "Error al iniciar búsqueda",
      })

      // Update search history with failed status
      if (searchId) {
        await updateSearchStatus(
          searchId,
          'failed',
          error instanceof Error ? error.message : 'Error al iniciar búsqueda'
        )
      }
    }
  }, [config, isValidConfig, searchState.isSearching, saveSearchToHistory, updateSearchStatus])

  const resetSearch = useCallback(() => {
    configActions.resetSearch()
    setSearchState({
      isSearching: false,
      searchComplete: false,
      searchProgress: 0,
      currentStep: "",
    })
    setResults(null)
    setCurrentSearchId(null)
  }, [configActions])

  const rerunSearch = useCallback((searchConfig: SearchConfig) => {
    configActions.setSelectedClientTypes(searchConfig.selectedClientTypes)
    configActions.setSelectedLocations(searchConfig.selectedLocations)
    configActions.setRequireWebsite(searchConfig.requireWebsite)
    configActions.setValidateEmail(searchConfig.validateEmail)
    configActions.setValidateWebsite(searchConfig.validateWebsite)
    
    // Set new search criteria if provided
    if (searchConfig.minQualityScore !== undefined) {
      // Note: would need to extend configActions to support new fields
    }
    
    setTimeout(() => {
      handleSearch()
    }, 100)
  }, [configActions, handleSearch])

  const actions: SearchActions = {
    ...configActions,
    handleSearch,
    resetSearch,
    rerunSearch,
  }

  const fullState: SearchState = {
    ...config,
    ...searchState,
  }

  const canStartSearch = useMemo(() => {
    // Use fullState instead of internal config to ensure consistency
    const hasClientTypes = fullState.selectedClientTypes.length > 0
    const hasLocations = fullState.selectedLocations.length > 0
    const result = hasClientTypes && hasLocations && !searchState.isSearching
    
    return result
  }, [fullState.selectedClientTypes, fullState.selectedLocations, searchState.isSearching])

  // Transform search leads to legacy format for compatibility
  const legacyResults = useMemo(() => {
    if (!results) return null
    
    return {
      ...results,
      leads: results.leads.map(searchLeadToLegacyLead)
    }
  }, [results])

  return {
    state: fullState,
    actions,
    results: legacyResults, // Return legacy format for compatibility
    searchResults: results, // Return new format for enhanced components
    canStartSearch,
    isSearching: searchState.isSearching,
    searchComplete: searchState.searchComplete,
    currentSearchId, // Expose current search ID for external use
  }
} 