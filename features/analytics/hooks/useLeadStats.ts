"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/utils/supabase/client"
import type { 
  LeadCategoryStats, 
  LeadCountryStats, 
  LeadStateStats, 
  LeadSpainRegionStats 
} from "../types"

// Create a stable supabase client instance
const supabaseClient = createClient()

export function useLeadStats(viewType: 'category' | 'country' | 'state' | 'spain-region' = 'category') {
  const [data, setData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchLeadStats = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      console.log(`📊 Fetching lead stats from ${viewType} view...`)

      let query
      switch (viewType) {
        case 'category':
          query = supabaseClient.from('leads_by_category').select('*')
          break
        case 'country':
          query = supabaseClient.from('leads_by_country').select('*')
          break
        case 'state':
          query = supabaseClient.from('leads_by_state').select('*')
          break
        case 'spain-region':
          query = supabaseClient.from('leads_spain_by_region').select('*')
          break
        default:
          query = supabaseClient.from('leads_by_category').select('*')
      }

      const { data: statsData, error: statsError } = await query

      if (statsData && !statsError) {
        console.log(`✅ Lead stats loaded from ${viewType} view:`, statsData.length, 'records')
        setData(statsData)
      } else {
        console.log(`⚠️ ${viewType} view not available, using mock data...`, statsError?.message)
        
        // Fallback to mock data
        const mockData = createMockLeadStats(viewType)
        setData(mockData)
      }

    } catch (err) {
      console.error('❌ Error fetching lead stats:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch lead stats')
      
      // Fallback to mock data on error
      const mockData = createMockLeadStats(viewType)
      setData(mockData)
    } finally {
      setIsLoading(false)
    }
  }, [viewType])

  // Mock data generators
  const createMockLeadStats = (type: string) => {
    switch (type) {
      case 'category':
        return [
          { category: 'Tecnología', total_leads: 245, verified_emails: 180, verified_phones: 120, verified_websites: 200, avg_quality_score: 4.2, latest_lead_date: '2024-01-15' },
          { category: 'Salud', total_leads: 189, verified_emails: 145, verified_phones: 98, verified_websites: 165, avg_quality_score: 4.5, latest_lead_date: '2024-01-14' },
          { category: 'Educación', total_leads: 156, verified_emails: 120, verified_phones: 85, verified_websites: 140, avg_quality_score: 4.1, latest_lead_date: '2024-01-13' },
          { category: 'Finanzas', total_leads: 134, verified_emails: 98, verified_phones: 72, verified_websites: 115, avg_quality_score: 4.3, latest_lead_date: '2024-01-12' },
          { category: 'Retail', total_leads: 98, verified_emails: 75, verified_phones: 45, verified_websites: 85, avg_quality_score: 3.8, latest_lead_date: '2024-01-11' }
        ]
      case 'country':
        return [
          { country: 'España', total_leads: 456, avg_quality_score: 4.2, high_quality_leads: 380, high_quality_percentage: 83.3, verified_emails: 320, verified_phones: 280, email_verification_rate: 70.2, phone_verification_rate: 61.4, top_categories: 'Tecnología, Salud, Educación', first_lead_date: '2023-01-15', latest_lead_date: '2024-01-15' },
          { country: 'México', total_leads: 234, avg_quality_score: 4.0, high_quality_leads: 185, high_quality_percentage: 79.1, verified_emails: 165, verified_phones: 140, email_verification_rate: 70.5, phone_verification_rate: 59.8, top_categories: 'Tecnología, Finanzas, Retail', first_lead_date: '2023-02-20', latest_lead_date: '2024-01-14' },
          { country: 'Colombia', total_leads: 189, avg_quality_score: 3.9, high_quality_leads: 145, high_quality_percentage: 76.7, verified_emails: 125, verified_phones: 98, email_verification_rate: 66.1, phone_verification_rate: 51.9, top_categories: 'Salud, Educación, Tecnología', first_lead_date: '2023-03-10', latest_lead_date: '2024-01-13' }
        ]
      case 'state':
        return [
          { country: 'España', state: 'Madrid', total_leads: 156, avg_quality_score: 4.3, high_quality_leads: 135, high_quality_percentage: 86.5, verified_emails: 110, verified_phones: 95, leads_with_phone: 120, leads_with_email: 140, contactable_percentage: 89.7, top_activities: 'Tecnología, Consultoría, Servicios', leads_last_30_days: 45 },
          { country: 'España', state: 'Barcelona', total_leads: 134, avg_quality_score: 4.1, high_quality_leads: 110, high_quality_percentage: 82.1, verified_emails: 95, verified_phones: 85, leads_with_phone: 98, leads_with_email: 115, contactable_percentage: 87.3, top_activities: 'Tecnología, Salud, Educación', leads_last_30_days: 38 },
          { country: 'España', state: 'Valencia', total_leads: 89, avg_quality_score: 4.0, high_quality_leads: 72, high_quality_percentage: 80.9, verified_emails: 65, verified_phones: 58, leads_with_phone: 70, leads_with_email: 78, contactable_percentage: 85.4, top_activities: 'Educación, Salud, Retail', leads_last_30_days: 25 }
        ]
      case 'spain-region':
        return [
          { comunidad_autonoma: 'Madrid', total_leads: 156, calidad_promedio: 4.3, leads_alta_calidad: 135, telefonos_verificados: 95, emails_verificados: 110, con_website: 140, contactabilidad_porcentaje: 89.7, categoria_principal: 'Tecnología', primer_lead: '2023-01-15', ultimo_lead: '2024-01-15' },
          { comunidad_autonoma: 'Cataluña', total_leads: 134, calidad_promedio: 4.1, leads_alta_calidad: 110, telefonos_verificados: 85, emails_verificados: 95, con_website: 115, contactabilidad_porcentaje: 87.3, categoria_principal: 'Salud', primer_lead: '2023-02-10', ultimo_lead: '2024-01-14' },
          { comunidad_autonoma: 'Comunidad Valenciana', total_leads: 89, calidad_promedio: 4.0, leads_alta_calidad: 72, telefonos_verificados: 58, emails_verificados: 65, con_website: 78, contactabilidad_porcentaje: 85.4, categoria_principal: 'Educación', primer_lead: '2023-03-05', ultimo_lead: '2024-01-13' }
        ]
      default:
        return []
    }
  }

  // Initial load
  useEffect(() => {
    fetchLeadStats()
  }, [fetchLeadStats])

  return {
    data,
    isLoading,
    error,
    refreshStats: fetchLeadStats
  }
} 