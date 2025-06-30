"use client"

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

export interface CountryData {
  country: string
  total_leads: number
  avg_quality_score: number
  high_quality_leads: number
  high_quality_percentage: number
  verified_emails: number
  verified_phones: number
  verified_websites: number
  leads_with_website: number
  leads_with_phone: number
  leads_with_email: number
  email_verification_rate: number
  phone_verification_rate: number
  top_categories: string
  first_lead_date: string
  latest_lead_date: string
  quality_1: number
  quality_2: number
  quality_3: number
  quality_4: number
  quality_5: number
}

export interface StateData {
  country: string
  state: string
  total_leads: number
  avg_quality_score: number
  high_quality_leads: number
  high_quality_percentage: number
  verified_emails: number
  verified_phones: number
  verified_websites: number
  leads_with_phone: number
  leads_with_email: number
  leads_with_website: number
  contactable_percentage: number
  top_activities: string
  first_lead_date: string
  latest_lead_date: string
  leads_last_30_days: number
  quality_1: number
  quality_2: number
  quality_3: number
  quality_4: number
  quality_5: number
}

export interface LocationOption {
  value: string
  label: string
  region?: string
  type: 'country' | 'state'
  stats?: {
    totalLeads: number
    avgQuality: number
    verifiedEmails: number
    contactablePercentage: number
    recentActivity: number
  }
}

interface UseLocationsReturn {
  locations: LocationOption[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

// Fallback data for when Supabase is not available or returns no data
const fallbackLocations: LocationOption[] = [
  { value: "all", label: "Toda España", type: "country" },
  { value: "madrid", label: "Madrid", region: "Comunidad de Madrid", type: "state" },
  { value: "barcelona", label: "Barcelona", region: "Cataluña", type: "state" },
  { value: "valencia", label: "Valencia", region: "Comunidad Valenciana", type: "state" },
  { value: "sevilla", label: "Sevilla", region: "Andalucía", type: "state" },
  { value: "bilbao", label: "Bilbao", region: "País Vasco", type: "state" },
  { value: "malaga", label: "Málaga", region: "Andalucía", type: "state" },
  { value: "zaragoza", label: "Zaragoza", region: "Aragón", type: "state" },
  { value: "murcia", label: "Murcia", region: "Región de Murcia", type: "state" },
  { value: "palma", label: "Palma", region: "Islas Baleares", type: "state" },
  { value: "las-palmas", label: "Las Palmas", region: "Canarias", type: "state" },
  { value: "vigo", label: "Vigo", region: "Galicia", type: "state" },
  { value: "gijon", label: "Gijón", region: "Asturias", type: "state" },
  { value: "hospitalet", label: "L'Hospitalet", region: "Cataluña", type: "state" },
  { value: "cordoba", label: "Córdoba", region: "Andalucía", type: "state" },
  { value: "valladolid", label: "Valladolid", region: "Castilla y León", type: "state" }
]

export function useLocations(): UseLocationsReturn {
  const [locations, setLocations] = useState<LocationOption[]>(fallbackLocations)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClient()

  const fetchLocations = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Fetch both countries and states data in parallel
      const [countriesResponse, statesResponse] = await Promise.all([
        supabase
          .from('leads_by_country')
          .select('*')
          .order('total_leads', { ascending: false }),
        supabase
          .from('leads_by_state')
          .select('*')
          .order('total_leads', { ascending: false })
      ])

      if (countriesResponse.error || statesResponse.error) {
        console.warn('Supabase error, using fallback data:', 
          countriesResponse.error?.message || statesResponse.error?.message)
        setLocations(fallbackLocations)
        return
      }

      const countriesData = countriesResponse.data || []
      const statesData = statesResponse.data || []

      if (countriesData.length === 0 && statesData.length === 0) {
        console.warn('No data from Supabase, using fallback data')
        setLocations(fallbackLocations)
        return
      }

      // Transform Supabase data to location options
      const transformedLocations: LocationOption[] = []

      // Add "All" option first
      transformedLocations.push({
        value: "all",
        label: "Todas las ubicaciones",
        type: "country",
        stats: {
          totalLeads: countriesData.reduce((sum, item) => sum + item.total_leads, 0),
          avgQuality: countriesData.length > 0 
            ? Number((countriesData.reduce((sum, item) => sum + item.avg_quality_score, 0) / countriesData.length).toFixed(2))
            : 0,
          verifiedEmails: countriesData.reduce((sum, item) => sum + item.verified_emails, 0),
          contactablePercentage: 0,
          recentActivity: 0
        }
      })

      // Transform countries data
      countriesData.forEach((country: CountryData) => {
        if (country.country && country.country !== 'Sin País') {
          transformedLocations.push({
            value: country.country.toLowerCase().replace(/\s+/g, '_'),
            label: country.country,
            type: "country",
            stats: {
              totalLeads: country.total_leads,
              avgQuality: country.avg_quality_score,
              verifiedEmails: country.verified_emails,
              contactablePercentage: country.email_verification_rate,
              recentActivity: 0
            }
          })
        }
      })

      // Transform states data (only for Spain for now)
      statesData
        .filter((state: StateData) => state.country && state.country.toLowerCase().includes('españa'))
        .forEach((state: StateData) => {
          if (state.state && state.state !== 'Sin Estado') {
            transformedLocations.push({
              value: state.state.toLowerCase().replace(/\s+/g, '_'),
              label: state.state,
              region: getRegionForState(state.state),
              type: "state",
              stats: {
                totalLeads: state.total_leads,
                avgQuality: state.avg_quality_score,
                verifiedEmails: state.verified_emails,
                contactablePercentage: state.contactable_percentage,
                recentActivity: state.leads_last_30_days
              }
            })
          }
        })

      setLocations(transformedLocations)
      
    } catch (err) {
      console.error('Error fetching locations:', err)
      setError('Error al cargar ubicaciones')
      setLocations(fallbackLocations)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLocations()
  }, [])

  const refetch = async () => {
    await fetchLocations()
  }

  return {
    locations,
    isLoading,
    error,
    refetch
  }
}

// Helper function to get region/community for Spanish states
function getRegionForState(state: string): string {
  const regionMap: Record<string, string> = {
    'madrid': 'Comunidad de Madrid',
    'barcelona': 'Cataluña',
    'valencia': 'Comunidad Valenciana',
    'sevilla': 'Andalucía',
    'bilbao': 'País Vasco',
    'málaga': 'Andalucía',
    'malaga': 'Andalucía',
    'zaragoza': 'Aragón',
    'murcia': 'Región de Murcia',
    'palma': 'Islas Baleares',
    'las palmas': 'Canarias',
    'vigo': 'Galicia',
    'gijón': 'Asturias',
    'gijon': 'Asturias',
    'hospitalet': 'Cataluña',
    'córdoba': 'Andalucía',
    'cordoba': 'Andalucía',
    'valladolid': 'Castilla y León',
    'alicante': 'Comunidad Valenciana',
    'santander': 'Cantabria',
    'toledo': 'Castilla-La Mancha'
  }
  
  return regionMap[state.toLowerCase()] || 'España'
} 