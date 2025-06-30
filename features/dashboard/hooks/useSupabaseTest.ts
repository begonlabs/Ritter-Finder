"use client"

import { useState, useCallback } from "react"
import { createClient } from "@/utils/supabase/client"

export function useSupabaseTest() {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const supabase = createClient()

  const testConnection = useCallback(async () => {
    setIsLoading(true)
    const testResults: any = {}
    
    try {
      console.log('🧪 === INICIANDO TESTS DE SUPABASE ===')
      
      // Test 1: Conexión básica a tabla leads
      console.log('Test 1: Conexión básica a tabla leads')
      const { data: leads, error: leadsError } = await supabase
        .from('leads')
        .select('*')
        .limit(3)
      
      testResults.leadsConnection = {
        success: !leadsError,
        error: leadsError?.message,
        count: leads?.length || 0,
        sample: leads?.[0] || null
      }
      
      console.log('📊 Resultado Test 1:', testResults.leadsConnection)
      
      // Test 2: Vista leads_by_category
      console.log('Test 2: Vista leads_by_category')
      const { data: categories, error: categoriesError } = await supabase
        .from('leads_by_category')
        .select('*')
        .limit(5)
      
      testResults.categoriesView = {
        success: !categoriesError,
        error: categoriesError?.message,
        count: categories?.length || 0,
        sample: categories || []
      }
      
      console.log('🏷️ Resultado Test 2:', testResults.categoriesView)
      
      // Test 3: Vista leads_by_state
      console.log('Test 3: Vista leads_by_state')
      const { data: states, error: statesError } = await supabase
        .from('leads_by_state')
        .select('*')
        .limit(5)
      
      testResults.statesView = {
        success: !statesError,
        error: statesError?.message,
        count: states?.length || 0,
        sample: states || []
      }
      
      console.log('📍 Resultado Test 3:', testResults.statesView)
      
      // Test 4: Vista leads_by_country
      console.log('Test 4: Vista leads_by_country')
      const { data: countries, error: countriesError } = await supabase
        .from('leads_by_country')
        .select('*')
        .limit(5)
      
      testResults.countriesView = {
        success: !countriesError,
        error: countriesError?.message,
        count: countries?.length || 0,
        sample: countries || []
      }
      
      console.log('🌍 Resultado Test 4:', testResults.countriesView)
      
      // Test 5: Estructura de un lead
      if (leads && leads.length > 0) {
        const leadFields = Object.keys(leads[0])
        testResults.leadStructure = {
          fields: leadFields,
          hasActivity: leadFields.includes('activity'),
          hasCategory: leadFields.includes('category'),
          hasState: leadFields.includes('state'),
          hasCountry: leadFields.includes('country'),
          hasVerificationFlags: [
            'verified_email',
            'verified_phone', 
            'verified_website'
          ].every(field => leadFields.includes(field))
        }
        
        console.log('🔧 Estructura del lead:', testResults.leadStructure)
      }
      
      // Test 6: Buscar términos específicos
      console.log('Test 6: Búsqueda de términos específicos')
      const { data: searchTest, error: searchError } = await supabase
        .from('leads')
        .select('*')
        .or('activity.ilike.%solar%,category.ilike.%solar%,activity.ilike.%energia%,category.ilike.%energia%')
        .limit(3)
      
      testResults.searchTest = {
        success: !searchError,
        error: searchError?.message,
        count: searchTest?.length || 0,
        sample: searchTest || []
      }
      
      console.log('🔍 Resultado Test 6:', testResults.searchTest)
      
      console.log('🧪 === TESTS COMPLETADOS ===')
      
    } catch (error) {
      console.error('❌ Error general en tests:', error)
      testResults.generalError = error
    } finally {
      setIsLoading(false)
      setResults(testResults)
    }
  }, [supabase])

  const testSimpleQuery = useCallback(async () => {
    setIsLoading(true)
    
    try {
      console.log('🔍 Test simple: obteniendo cualquier lead...')
      
      const { data, error } = await supabase
        .from('leads')
        .select('id, company_name, activity, category, state, country')
        .limit(1)
      
      if (error) {
        console.error('❌ Error en query simple:', error)
        setResults({ error: error.message })
      } else {
        console.log('✅ Query simple exitosa:', data)
        setResults({ simpleQuery: data })
      }
      
    } catch (error) {
      console.error('❌ Error general en query simple:', error)
      setResults({ error: error })
    } finally {
      setIsLoading(false)
    }
  }, [supabase])

  return {
    isLoading,
    results,
    testConnection,
    testSimpleQuery,
  }
} 