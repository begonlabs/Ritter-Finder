"use client"

import { useState, useCallback } from "react"
import { createClient } from "@/utils/supabase/client"
import type { Lead } from "../types"

interface LeadsSearchFilters {
  selectedClientTypes: string[]
  selectedLocations: string[]
  requireWebsite: boolean
  requireEmail: boolean
  requirePhone: boolean
}

interface UseLeadsSearchResult {
  leads: Lead[]
  isLoading: boolean
  error: string | null
  totalFound: number
  searchLeads: (filters: LeadsSearchFilters) => Promise<void>
  clearResults: () => void
  // ✅ New state for no results with criteria
  noResultsWithCriteria: boolean
}

// Helper function to map client types to real database categories
const mapClientTypesToCategories = async (supabase: any, clientTypes: string[]): Promise<string[]> => {
  if (clientTypes.length === 0) return []
  
  try {
    // Get all available categories from the database
    const { data: categories, error } = await supabase
      .from('leads_by_category')
      .select('category')
      .gt('total_leads', 0)
    
    if (error || !categories) {
      console.error('Error fetching categories:', error)
      return []
    }
    
    // Smart mapping based on keywords and real categories
    const categoryMappings: Record<string, string[]> = {
      'solar': ['energia', 'fotovolt', 'renovable', 'solar'],
      'industrial': ['talleres', 'mecanic', 'industria', 'manufactur'],
      'residential': ['construccion', 'hogar', 'residencial', 'inmobil'],
      'commercial': ['comercio', 'tiendas', 'oficina', 'servicios'],
      'healthcare': ['clinic', 'medicina', 'salud', 'dental', 'farmac'],
      'education': ['educacion', 'formacion', 'universidad', 'colegio'],
      'hospitality': ['hotel', 'turismo', 'restauran', 'bar'],
      'retail': ['tienda', 'comercio', 'venta'],
      'technology': ['tecnologia', 'software', 'informatica'],
      'financial': ['finanza', 'banca', 'seguros', 'inversion'],
      'automotive': ['automovil', 'talleres', 'coches', 'vehiculos'],
      'agriculture': ['agricultura', 'ganaderia', 'agro'],
      'real-estate': ['inmobiliaria', 'propiedades'],
      'consulting': ['consultoria', 'asesoria'],
      'manufacturing': ['manufactura', 'fabricacion'],
      'logistics': ['logistica', 'transporte'],
      'food-beverage': ['alimentacion', 'bebidas', 'restauracion'],
      'media': ['medios', 'comunicacion', 'marketing'],
      'government': ['gobierno', 'administracion'],
      'non-profit': ['ong', 'fundacion'],
      'energy': ['energia', 'electr', 'gas', 'combustible'],
      'beauty': ['belleza', 'estetica', 'peluquer']
    }
    
    const matchedCategories: string[] = []
    
    clientTypes.forEach(clientType => {
      const keywords = categoryMappings[clientType] || [clientType.toLowerCase()]
      
      categories.forEach((cat: any) => {
        if (cat.category) {
          const categoryLower = cat.category.toLowerCase()
          const matches = keywords.some(keyword => 
            categoryLower.includes(keyword) ||
            keyword.includes(categoryLower.split(' ')[0]) // Match first word
          )
          if (matches && !matchedCategories.includes(cat.category)) {
            matchedCategories.push(cat.category)
          }
        }
      })
    })
    
    console.log(`🏷️ Mapped client types [${clientTypes.join(', ')}] to categories:`, matchedCategories)
    return matchedCategories
    
  } catch (error) {
    console.error('Error in mapClientTypesToCategories:', error)
    return []
  }
}

// Helper function to map locations to real database states
const mapLocationsToStates = async (supabase: any, locations: string[]): Promise<string[]> => {
  if (locations.length === 0) return []
  
  try {
    // Get all available states from the database
    const { data: states, error } = await supabase
      .from('leads_by_state')
      .select('state, country')
      .gt('total_leads', 0)
    
    if (error || !states) {
      console.error('Error fetching states:', error)
      return []
    }
    
    const matchedStates: string[] = []
    
    locations.forEach(location => {
      if (location === 'all') {
        // If "all" is selected, don't filter by state
        return
      }
      
      const locationLower = location.toLowerCase()
      
      states.forEach((stateData: any) => {
        const stateLower = stateData.state?.toLowerCase() || ''
        const countryLower = stateData.country?.toLowerCase() || ''
        
        // Direct match or partial match
        if (stateLower.includes(locationLower) || 
            locationLower.includes(stateLower) ||
            countryLower.includes(locationLower)) {
          if (stateData.state && stateData.state !== 'Sin Estado' && !matchedStates.includes(stateData.state)) {
            matchedStates.push(stateData.state)
          }
        }
      })
    })
    
    console.log(`📍 Mapped locations [${locations.join(', ')}] to states:`, matchedStates)
    return matchedStates
    
  } catch (error) {
    console.error('Error in mapLocationsToStates:', error)
    return []
  }
}

export function useLeadsSearch(): UseLeadsSearchResult {
  const [leads, setLeads] = useState<Lead[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalFound, setTotalFound] = useState(0)
  const [noResultsWithCriteria, setNoResultsWithCriteria] = useState(false)
  const supabase = createClient()

  // Convert Supabase lead to Dashboard Lead format
  // ✅ Fixed adapter to properly handle null values from database
  const adaptSupabaseLead = (supabaseLead: any): Lead => {
    return {
      id: supabaseLead.id,
      email: supabaseLead.email || null, // Keep null instead of empty string
      verified_email: supabaseLead.verified_email || false,
      phone: supabaseLead.phone || null, // Keep null instead of empty string
      verified_phone: supabaseLead.verified_phone || false,
      company_name: supabaseLead.company_name,
      company_website: supabaseLead.company_website || null, // Keep null instead of empty string
      verified_website: supabaseLead.verified_website || false,
      address: supabaseLead.address || null,
      state: supabaseLead.state || null,
      country: supabaseLead.country || null,
      activity: supabaseLead.activity,
      description: supabaseLead.description || null,
      category: supabaseLead.category || null,
      data_quality_score: supabaseLead.data_quality_score || 1,
      created_at: supabaseLead.created_at,
      updated_at: supabaseLead.updated_at,
      last_contacted_at: supabaseLead.last_contacted_at,
      
      // Legacy compatibility fields (use empty strings for display compatibility)
      name: `Contacto - ${supabaseLead.company_name}`,
      position: 'Contacto Comercial',
      location: `${supabaseLead.state || ''}, ${supabaseLead.country || ''}`.replace(/^, |, $/, ''),
      industry: supabaseLead.category || supabaseLead.activity,
      employees: 'Desconocido',
      revenue: 'Desconocido',
      source: 'RitterFinder Database',
      confidence: (supabaseLead.data_quality_score || 1) * 20, // Convert 1-5 to 0-100
      lastActivity: supabaseLead.updated_at || supabaseLead.created_at,
      notes: supabaseLead.description || '',
      hasWebsite: Boolean(supabaseLead.company_website),
      websiteExists: supabaseLead.verified_website || false,
      emailValidated: supabaseLead.verified_email || false
    }
  }

  const searchLeads = useCallback(async (filters: LeadsSearchFilters) => {
    setIsLoading(true)
    setError(null)
    setNoResultsWithCriteria(false) // Reset state at start of search
    
    try {
      console.log('🔍 === INICIANDO BÚSQUEDA INTELIGENTE CON DATOS REALES ===')
      console.log('📋 Filtros recibidos:', filters)
      
      // Step 1: Map client types to real categories
      let targetCategories: string[] = []
      if (filters.selectedClientTypes.length > 0) {
        targetCategories = await mapClientTypesToCategories(supabase, filters.selectedClientTypes)
        if (targetCategories.length === 0) {
          console.warn('⚠️ No se encontraron categorías para los tipos de cliente seleccionados')
        }
      }
      
      // Step 2: Map locations to real states  
      let targetStates: string[] = []
      if (filters.selectedLocations.length > 0 && !filters.selectedLocations.includes('all')) {
        targetStates = await mapLocationsToStates(supabase, filters.selectedLocations)
        if (targetStates.length === 0) {
          console.warn('⚠️ No se encontraron estados para las ubicaciones seleccionadas')
        }
      }
      
      console.log('🎯 Búsqueda dirigida a:')
      console.log('   📊 Categorías:', targetCategories)
      console.log('   🗺️ Estados:', targetStates)
      
      // Step 3: Build the intelligent query
      let query = supabase
        .from('leads')
        .select('*')
      
      let hasFilters = false
      
      // Apply category filter
      if (targetCategories.length > 0) {
        query = query.in('category', targetCategories)
        hasFilters = true
        console.log('✅ Filtro de categorías aplicado')
      }
      
      // Apply state filter
      if (targetStates.length > 0) {
        query = query.in('state', targetStates)
        hasFilters = true
        console.log('✅ Filtro de estados aplicado')
      }
      
      // ✅ Apply data requirement filters (improved and fixed)
      if (filters.requireWebsite) {
        query = query.not('company_website', 'is', null)
                     .neq('company_website', '')
        hasFilters = true
        console.log('✅ Filtro de sitio web requerido aplicado')
      }
      
      if (filters.requireEmail) {
        // ✅ Fixed: Only require email exists, not necessarily verified
        query = query.not('email', 'is', null)
                     .neq('email', '')
        hasFilters = true
        console.log('✅ Filtro de email requerido aplicado (solo existencia)')
      }
      
      if (filters.requirePhone) {
        // ✅ Fixed: Only require phone exists, not necessarily verified
        query = query.not('phone', 'is', null)
                     .neq('phone', '')
        hasFilters = true
        console.log('✅ Filtro de teléfono requerido aplicado (solo existencia)')
      }
      
      // ✅ Removed strict quality filter - let users see all results
      // Quality filter for better results (lowered threshold)
      query = query.gte('data_quality_score', 1) // Show all leads with any quality score
      
      // ✅ Increased limit for better pagination testing
      // Order by quality and recency
      query = query
        .order('data_quality_score', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(500) // Increased limit to test pagination properly
      
      console.log('📡 Ejecutando query optimizada...')
      
      // ✅ Debug: Log the actual query being executed
      console.log('🔧 Query SQL construido:', {
        table: 'leads',
        filters: {
          categories: targetCategories.length > 0 ? targetCategories : 'ninguno',
          states: targetStates.length > 0 ? targetStates : 'ninguno',
          requireWebsite: filters.requireWebsite,
          requireEmail: filters.requireEmail,
          requirePhone: filters.requirePhone,
        },
        ordering: 'data_quality_score DESC, created_at DESC',
        limit: '500 resultados (para pruebas de paginación)'
      })
      
      const { data, error: supabaseError } = await query
      
      if (supabaseError) {
        console.error('❌ Error de Supabase:', supabaseError)
        throw new Error(`Error de Supabase: ${supabaseError.message}`)
      }
      
      console.log(`🎉 Query exitosa: ${data?.length || 0} leads encontrados`)
      
      // ✅ Improved fallback logic that respects user filters
      let finalData = data
      if ((!data || data.length === 0) && hasFilters) {
        console.log('🔄 Sin resultados con filtros, intentando búsqueda más amplia...')
        
        // Try removing location filter first (keep other filters)
        if (targetStates.length > 0 && targetCategories.length > 0) {
          console.log('📍 Intentando sin filtro de ubicación...')
          
          let fallbackQuery = supabase
            .from('leads')
            .select('*')
            .in('category', targetCategories)
            .gte('data_quality_score', 1) // Show all quality levels
          
          // ✅ Keep user's data requirements even in fallback
          if (filters.requireWebsite) {
            fallbackQuery = fallbackQuery.not('company_website', 'is', null)
                                        .neq('company_website', '')
          }
          
          if (filters.requireEmail) {
            fallbackQuery = fallbackQuery.not('email', 'is', null)
                                        .neq('email', '')
          }
          
          if (filters.requirePhone) {
            fallbackQuery = fallbackQuery.not('phone', 'is', null)
                                        .neq('phone', '')
          }
          
          fallbackQuery = fallbackQuery.order('data_quality_score', { ascending: false })
                                        .limit(500) // Same limit for pagination testing
          
          const { data: fallbackData } = await fallbackQuery
          
          if (fallbackData && fallbackData.length > 0) {
            console.log(`🆘 Fallback exitoso: ${fallbackData.length} leads encontrados`)
            finalData = fallbackData
          }
        }
      }
      
      // ✅ Final fallback: only if no category restrictions and no data requirements
      if (!finalData || finalData.length === 0) {
        if (targetCategories.length === 0 && !filters.requireWebsite && !filters.requireEmail && !filters.requirePhone) {
          console.log('🚨 Último recurso: mostrando leads de alta calidad sin filtros')
          const { data: qualityData } = await supabase
            .from('leads')
            .select('*')
            .gte('data_quality_score', 3)
            .order('data_quality_score', { ascending: false })
            .limit(500) // Pagination testing limit
          
          finalData = qualityData || []
        } else {
          console.log('❌ No hay resultados que cumplan con los criterios especificados')
          setNoResultsWithCriteria(true) // ✅ Set state for UI message
        }
      }
      
      // Convert to dashboard format
      const adaptedLeads = (finalData || []).map(adaptSupabaseLead)
      
      setLeads(adaptedLeads)
      setTotalFound(adaptedLeads.length)
      
      // ✅ Enhanced statistics and validation
      const stats = {
        total: adaptedLeads.length,
        withEmail: adaptedLeads.filter(l => l.email && l.email !== '' && l.email !== null).length,
        withPhone: adaptedLeads.filter(l => l.phone && l.phone !== '' && l.phone !== null).length,
        withWebsite: adaptedLeads.filter(l => l.company_website && l.company_website !== '' && l.company_website !== null).length,
        verifiedEmails: adaptedLeads.filter(l => l.verified_email).length,
        verifiedPhones: adaptedLeads.filter(l => l.verified_phone).length,
        verifiedWebsites: adaptedLeads.filter(l => l.verified_website).length,
        avgQuality: adaptedLeads.length > 0 
          ? Math.round(adaptedLeads.reduce((sum, l) => sum + l.data_quality_score, 0) / adaptedLeads.length * 100) / 100
          : 0
      }
      
      console.log('📊 === BÚSQUEDA COMPLETADA ===')
      console.log('📈 Estadísticas finales:', stats)
      console.log('🎯 Filtros aplicados:', {
        categorías: targetCategories.length > 0 ? 'SÍ' : 'NO',
        ubicaciones: targetStates.length > 0 ? 'SÍ' : 'NO',
        requiereWebsite: filters.requireWebsite ? 'SÍ' : 'NO',
        requiereEmail: filters.requireEmail ? 'SÍ' : 'NO',
        requierePhone: filters.requirePhone ? 'SÍ' : 'NO'
      })
      
      // ✅ Validate filter compliance
      if (filters.requireEmail && stats.withEmail < stats.total) {
        console.warn('⚠️ POSIBLE PROBLEMA: Se requería email pero algunos leads no lo tienen')
        console.log('📋 Primeros 3 leads sin email:', adaptedLeads.filter(l => !l.email || l.email === '').slice(0, 3).map(l => ({
          id: l.id,
          company_name: l.company_name,
          email: l.email,
          verified_email: l.verified_email
        })))
      }
      
      if (filters.requirePhone && stats.withPhone < stats.total) {
        console.warn('⚠️ POSIBLE PROBLEMA: Se requería teléfono pero algunos leads no lo tienen')
      }
      
      if (filters.requireWebsite && stats.withWebsite < stats.total) {
        console.warn('⚠️ POSIBLE PROBLEMA: Se requería sitio web pero algunos leads no lo tienen')
      }
      
    } catch (err) {
      console.error('❌ Error en búsqueda:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido al buscar leads')
      setLeads([])
      setTotalFound(0)
    } finally {
      setIsLoading(false)
    }
  }, [supabase])

  const clearResults = useCallback(() => {
    setLeads([])
    setTotalFound(0)
    setError(null)
    setNoResultsWithCriteria(false) // Reset no results state
  }, [])

  return {
    leads,
    isLoading,
    error,
    totalFound,
    searchLeads,
    clearResults,
    noResultsWithCriteria,
  }
} 