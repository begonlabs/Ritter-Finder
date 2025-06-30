"use client"

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

export interface ClientTypeData {
  category: string
  total_leads: number
  verified_emails: number
  verified_phones: number
  verified_websites: number
  avg_quality_score: number
  latest_lead_date: string
}

export interface ClientTypeOption {
  value: string
  label: string
  description: string
  stats?: {
    totalLeads: number
    verifiedEmails: number
    avgQuality: number
  }
}

interface UseClientTypesReturn {
  clientTypes: ClientTypeOption[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

// Fallback data for when Supabase is not available or returns no data
const fallbackClientTypes: ClientTypeOption[] = [
  { 
    value: "solar", 
    label: "Instaladores de Paneles Solares", 
    description: "Empresas especializadas en instalación de sistemas solares" 
  },
  { 
    value: "industrial", 
    label: "Empresas Industriales", 
    description: "Sector industrial y manufacturero" 
  },
  { 
    value: "energy", 
    label: "Compañías Energéticas", 
    description: "Empresas del sector energético y utilities" 
  },
  { 
    value: "residential", 
    label: "Sector Residencial", 
    description: "Desarrolladores y constructores residenciales" 
  },
  { 
    value: "commercial", 
    label: "Sector Comercial", 
    description: "Empresas y edificios comerciales" 
  },
  { 
    value: "consulting", 
    label: "Consultorías Energéticas", 
    description: "Consultores especializados en eficiencia energética" 
  }
]

export function useClientTypes(): UseClientTypesReturn {
  const [clientTypes, setClientTypes] = useState<ClientTypeOption[]>(fallbackClientTypes)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClient()

  const fetchClientTypes = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const { data: leadsData, error: supabaseError } = await supabase
        .from('leads_by_category')
        .select('*')
        .order('total_leads', { ascending: false })

      if (supabaseError) {
        console.warn('Supabase error, using fallback data:', supabaseError.message)
        setClientTypes(fallbackClientTypes)
        return
      }

      if (!leadsData || leadsData.length === 0) {
        console.warn('No data from Supabase, using fallback data')
        setClientTypes(fallbackClientTypes)
        return
      }

      // Transform Supabase data to client types format
      const transformedTypes: ClientTypeOption[] = leadsData.map((item: ClientTypeData) => ({
        value: item.category.toLowerCase().replace(/\s+/g, '_'),
        label: getCategoryLabel(item.category),
        description: getCategoryDescription(item.category),
        stats: {
          totalLeads: item.total_leads,
          verifiedEmails: item.verified_emails,
          avgQuality: item.avg_quality_score
        }
      }))

      setClientTypes(transformedTypes)
      
    } catch (err) {
      console.error('Error fetching client types:', err)
      setError('Error al cargar tipos de cliente')
      setClientTypes(fallbackClientTypes)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchClientTypes()
  }, [])

  const refetch = async () => {
    await fetchClientTypes()
  }

  return {
    clientTypes,
    isLoading,
    error,
    refetch
  }
}

// Helper functions to get user-friendly labels and descriptions
function getCategoryLabel(category: string): string {
  const labelMap: Record<string, string> = {
    'solar': 'Instaladores de Paneles Solares',
    'industrial': 'Empresas Industriales', 
    'energy': 'Compañías Energéticas',
    'residential': 'Sector Residencial',
    'commercial': 'Sector Comercial',
    'consulting': 'Consultorías Energéticas',
    'wind': 'Energía Eólica',
    'hydroelectric': 'Energía Hidroeléctrica',
    'biomass': 'Biomasa y Bioenergía',
    'geothermal': 'Energía Geotérmica'
  }
  
  return labelMap[category.toLowerCase()] || category
}

function getCategoryDescription(category: string): string {
  const descriptionMap: Record<string, string> = {
    'solar': 'Empresas especializadas en instalación de sistemas solares',
    'industrial': 'Sector industrial y manufacturero',
    'energy': 'Empresas del sector energético y utilities',
    'residential': 'Desarrolladores y constructores residenciales',
    'commercial': 'Empresas y edificios comerciales',
    'consulting': 'Consultores especializados en eficiencia energética',
    'wind': 'Desarrolladores y operadores de parques eólicos',
    'hydroelectric': 'Empresas de energía hidroeléctrica',
    'biomass': 'Empresas de biomasa y bioenergía',
    'geothermal': 'Empresas de energía geotérmica'
  }
  
  return descriptionMap[category.toLowerCase()] || `Empresas del sector ${category}`
} 