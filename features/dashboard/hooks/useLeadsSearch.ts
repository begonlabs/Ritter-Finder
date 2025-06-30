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
}

// Helper function to get categories from client types using the views
const getCategoriesFromClientTypes = async (supabase: any, clientTypes: string[]): Promise<string[]> => {
  if (clientTypes.length === 0) return []
  
  try {
    // Get all available categories from the view
    const { data: categories, error } = await supabase
      .from('leads_by_category')
      .select('category')
      .gt('total_leads', 0) // Only categories with leads
    
    if (error) {
      console.error('Error fetching categories:', error)
      return []
    }
    
    // Simple mapping for common client types
    const clientTypeToKeywords: Record<string, string[]> = {
      'solar': ['solar', 'energía', 'renovable'],
      'industrial': ['industria', 'manufactur', 'fabrica'],
      'residential': ['construcción', 'hogar', 'residencial'],
      'commercial': ['comercio', 'servicios', 'oficina'],
      'healthcare': ['salud', 'medicina', 'healthcare'],
      'education': ['educación', 'formación', 'universidad'],
      'hospitality': ['hostelería', 'turismo', 'hotel'],
      'retail': ['retail', 'tienda', 'comercio'],
      'technology': ['tecnología', 'software', 'it'],
      'financial': ['finanzas', 'banca', 'seguros'],
      'automotive': ['automoción', 'coches', 'vehículos'],
      'agriculture': ['agricultura', 'ganadería', 'agro'],
      'real-estate': ['inmobiliaria', 'propiedades'],
      'consulting': ['consultoría', 'consulting'],
      'manufacturing': ['manufactura', 'fabricación'],
      'logistics': ['logística', 'transporte'],
      'food-beverage': ['alimentación', 'bebidas', 'restauración'],
      'media': ['medios', 'comunicación', 'marketing'],
      'government': ['gobierno', 'administración'],
      'non-profit': ['ong', 'fundación'],
    }
    
    const matchedCategories: string[] = []
    
    clientTypes.forEach(clientType => {
      const keywords = clientTypeToKeywords[clientType] || [clientType]
      
      categories?.forEach((cat: any) => {
        if (cat.category) {
          const categoryLower = cat.category.toLowerCase()
          const matches = keywords.some(keyword => 
            categoryLower.includes(keyword.toLowerCase())
          )
          if (matches && !matchedCategories.includes(cat.category)) {
            matchedCategories.push(cat.category)
          }
        }
      })
    })
    
    return matchedCategories
  } catch (error) {
    console.error('Error in getCategoriesFromClientTypes:', error)
    return []
  }
}

// Helper function to get states from locations using the views
const getStatesFromLocations = async (supabase: any, locations: string[]): Promise<string[]> => {
  if (locations.length === 0) return []
  
  try {
    // Get all available states from the view
    const { data: states, error } = await supabase
      .from('leads_by_state')
      .select('state, country')
      .gt('total_leads', 0) // Only states with leads
    
    if (error) {
      console.error('Error fetching states:', error)
      return []
    }
    
    const matchedStates: string[] = []
    
    locations.forEach(location => {
      const locationLower = location.toLowerCase()
      
      states?.forEach((stateData: any) => {
        const stateLower = stateData.state?.toLowerCase() || ''
        const countryLower = stateData.country?.toLowerCase() || ''
        
        // Match by state name or country name
        if (stateLower.includes(locationLower) || 
            countryLower.includes(locationLower) ||
            locationLower.includes(stateLower)) {
          if (stateData.state && !matchedStates.includes(stateData.state)) {
            matchedStates.push(stateData.state)
          }
        }
      })
    })
    
    return matchedStates
  } catch (error) {
    console.error('Error in getStatesFromLocations:', error)
    return []
  }
}

export function useLeadsSearch(): UseLeadsSearchResult {
  const [leads, setLeads] = useState<Lead[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalFound, setTotalFound] = useState(0)
  const supabase = createClient()

  // Convertir lead de Supabase a formato del dashboard
  const adaptSupabaseLead = (supabaseLead: any): Lead => {
    return {
      id: supabaseLead.id,
      email: supabaseLead.email || '',
      verified_email: supabaseLead.verified_email || false,
      phone: supabaseLead.phone || '',
      verified_phone: supabaseLead.verified_phone || false,
      company_name: supabaseLead.company_name,
      company_website: supabaseLead.company_website || '',
      verified_website: supabaseLead.verified_website || false,
      address: supabaseLead.address,
      state: supabaseLead.state,
      country: supabaseLead.country,
      activity: supabaseLead.activity,
      description: supabaseLead.description,
      category: supabaseLead.category,
      data_quality_score: supabaseLead.data_quality_score || 1,
      created_at: supabaseLead.created_at,
      updated_at: supabaseLead.updated_at,
      last_contacted_at: supabaseLead.last_contacted_at,
      
      // Campos de compatibilidad legacy
      name: `Contacto - ${supabaseLead.company_name}`,
      position: 'Contacto Comercial',
      location: `${supabaseLead.state || ''}, ${supabaseLead.country || ''}`.replace(/^, |, $/, ''),
      industry: supabaseLead.category || supabaseLead.activity,
      employees: 'Desconocido',
      revenue: 'Desconocido',
      source: 'RitterFinder Search',
      confidence: (supabaseLead.data_quality_score || 1) * 20, // Convertir 1-5 a 0-100
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
    
    try {
      console.log('🔍 Buscando leads con filtros:', filters)
      
      // Primero, verificar si hay datos en la tabla (sin filtros)
      console.log('📊 Verificando datos en la tabla leads...')
      const { data: sampleData, error: sampleError } = await supabase
        .from('leads')
        .select('*')
        .limit(5)
      
      if (sampleError) {
        console.error('❌ Error obteniendo muestra de leads:', sampleError)
      } else {
        console.log(`📈 Muestra de leads encontrados: ${sampleData?.length || 0}`)
        if (sampleData && sampleData.length > 0) {
          console.log('📋 Primer lead como ejemplo:', sampleData[0])
        }
      }
      
      // Construir query base
      let query = supabase
        .from('leads')
        .select('*')
      
      // Para debugging, empezar con una query más simple
      let hasFilters = false
      
      // Filtro por categorías/actividades (simplificado para debugging)
      if (filters.selectedClientTypes.length > 0) {
        console.log('🏷️ Aplicando filtro de tipos de cliente:', filters.selectedClientTypes)
        
        try {
          // Primero intentar búsqueda simple por activity o category
          const searchTerms = filters.selectedClientTypes.flatMap(type => [
            type.toLowerCase(),
            type // Mantener original también
          ])
          
          console.log('🔍 Términos de búsqueda para categorías:', searchTerms)
          
          // Búsqueda simple en activity y category
          const categoryConditions = searchTerms.map(term => 
            `category.ilike.%${term}%`
          )
          const activityConditions = searchTerms.map(term => 
            `activity.ilike.%${term}%`
          )
          
          const allConditions = [...categoryConditions, ...activityConditions]
          query = query.or(allConditions.join(','))
          hasFilters = true
          
        } catch (error) {
          console.error('❌ Error en filtro de categorías:', error)
        }
      }
      
      // Filtro por ubicaciones (simplificado para debugging)
      if (filters.selectedLocations.length > 0) {
        console.log('📍 Aplicando filtro de ubicaciones:', filters.selectedLocations)
        
        try {
          const locationConditions = filters.selectedLocations.flatMap(location => [
            `state.ilike.%${location}%`,
            `country.ilike.%${location}%`
          ])
          
          console.log('🔍 Condiciones de ubicación:', locationConditions)
          
          if (hasFilters) {
            // Si ya hay filtros, agregar como AND
            query = query.or(locationConditions.join(','))
          } else {
            query = query.or(locationConditions.join(','))
          }
          hasFilters = true
          
        } catch (error) {
          console.error('❌ Error en filtro de ubicaciones:', error)
        }
      }
      
      // Filtros de datos requeridos
      if (filters.requireWebsite) {
        query = query.not('company_website', 'is', null)
                     .neq('company_website', '')
      }
      
      if (filters.requireEmail) {
        query = query.not('email', 'is', null)
                     .neq('email', '')
      }
      
      if (filters.requirePhone) {
        query = query.not('phone', 'is', null)
                     .neq('phone', '')
      }
      
             // Si no hay filtros aplicados, traer algunos resultados para testing
       if (!hasFilters) {
         console.log('⚠️ No hay filtros aplicados, trayendo leads de muestra...')
         query = query.limit(50) // Traer 50 leads de muestra
       } else {
         query = query.limit(500) // Límite cuando hay filtros
       }
       
       // Ordenar por calidad y fecha
       query = query.order('data_quality_score', { ascending: false })
                    .order('created_at', { ascending: false })
       
       console.log('📡 Ejecutando query a Supabase...')
       console.log('🔧 Filtros aplicados:', hasFilters ? 'SÍ' : 'NO')
       
              const { data, error: supabaseError } = await query
       
       if (supabaseError) {
         console.error('❌ Error detallado de Supabase:', supabaseError)
         throw new Error(`Error de Supabase: ${supabaseError.message}`)
       }
       
       console.log(`✅ Encontrados ${data?.length || 0} leads en Supabase`)
       
       let finalData = data
       
       if (data && data.length > 0) {
         console.log('📝 Primer lead crudo de Supabase:', data[0])
       } else {
         console.log('⚠️ No se encontraron leads con los filtros aplicados')
         
         // Si no hay resultados con filtros, intentar una query más simple
         if (hasFilters) {
           console.log('🔄 Intentando query sin filtros como fallback...')
           const { data: fallbackData, error: fallbackError } = await supabase
             .from('leads')
             .select('*')
             .limit(10)
           
           if (!fallbackError && fallbackData && fallbackData.length > 0) {
             console.log(`🆘 Fallback: encontrados ${fallbackData.length} leads sin filtros`)
             console.log('📝 Primer lead del fallback:', fallbackData[0])
             finalData = fallbackData
           }
         }
       }
       
       // Adaptar leads a formato del dashboard
       const adaptedLeads = (finalData || []).map(adaptSupabaseLead)
       
       setLeads(adaptedLeads)
       setTotalFound(adaptedLeads.length)
      
      // Log de estadísticas
      const stats = {
        total: adaptedLeads.length,
        withEmail: adaptedLeads.filter(l => l.email && l.email !== '').length,
        withPhone: adaptedLeads.filter(l => l.phone && l.phone !== '').length,
        withWebsite: adaptedLeads.filter(l => l.company_website && l.company_website !== '').length,
        verifiedEmails: adaptedLeads.filter(l => l.verified_email).length,
      }
      console.log('📊 Estadísticas de leads encontrados:', stats)
      
    } catch (err) {
      console.error('❌ Error buscando leads:', err)
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
  }, [])

  return {
    leads,
    isLoading,
    error,
    totalFound,
    searchLeads,
    clearResults,
  }
} 