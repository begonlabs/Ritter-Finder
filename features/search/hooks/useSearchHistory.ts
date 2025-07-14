"use client"

import { createClient } from '@/utils/supabase/client'
import type { SearchConfig, SearchResults } from '../types'

export interface SearchHistoryRecord {
  id: string
  user_id: string
  query_name?: string
  search_parameters: any
  filters_applied?: any
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'
  total_results: number
  valid_results: number
  duplicate_results: number
  execution_time_ms: number
  pages_scraped: number
  websites_searched: number
  started_at: string
  completed_at?: string
  error_message?: string
  search_config_id?: string
}

export function useSearchHistory() {
  const supabase = createClient()

  const saveSearchToHistory = async (
    searchConfig: SearchConfig,
    searchResults: SearchResults,
    searchTime: number,
    status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled' = 'completed',
    errorMessage?: string
  ): Promise<string | null> => {
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        console.error('Error getting user:', userError)
        return null
      }

      // Prepare search parameters for storage
      const searchParameters = {
        selectedClientTypes: searchConfig.selectedClientTypes,
        selectedLocations: searchConfig.selectedLocations,
        requireWebsite: searchConfig.requireWebsite,
        requireEmail: searchConfig.requireEmail,
        requirePhone: searchConfig.requirePhone,
        minQualityScore: searchConfig.minQualityScore,
        activityFilter: searchConfig.activityFilter,
        categoryFilter: searchConfig.categoryFilter,
      }

      // Prepare filters applied
      const filtersApplied = {
        websiteRequired: searchConfig.requireWebsite,
        emailRequired: searchConfig.requireEmail,
        phoneRequired: searchConfig.requirePhone,
        qualityScoreMin: searchConfig.minQualityScore,
      }

      // Calculate metrics
      const validResults = searchResults.leads.filter(lead => 
        lead.verified_email || lead.verified_phone || lead.verified_website
      ).length

      const duplicateResults = 0 // For now, we'll set this to 0 as we don't have duplicate detection

      // Create search history record
      const { data, error } = await supabase
        .from('search_history')
        .insert({
          user_id: user.id,
          query_name: `Búsqueda ${new Date().toLocaleDateString('es-ES')}`,
          search_parameters: searchParameters,
          filters_applied: filtersApplied,
          status: status,
          total_results: searchResults.totalFound,
          valid_results: validResults,
          duplicate_results: duplicateResults,
          execution_time_ms: searchTime,
          pages_scraped: Math.ceil(searchResults.totalFound / 10), // Estimate
          websites_searched: searchConfig.selectedClientTypes.length * 2, // Estimate
          started_at: new Date(Date.now() - searchTime).toISOString(),
          completed_at: new Date().toISOString(),
          error_message: errorMessage,
        })
        .select('id')
        .single()

      if (error) {
        console.error('Error saving search to history:', error)
        return null
      }

      // Also log activity for the timeline
      await logSearchActivity(user.id, data.id, status, searchResults.totalFound, searchTime, errorMessage)

      return data.id
    } catch (err) {
      console.error('Error saving search history:', err)
      return null
    }
  }

  const logSearchActivity = async (
    userId: string,
    searchId: string,
    status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled',
    totalResults: number,
    searchTime: number,
    errorMessage?: string
  ) => {
    try {
      let action = 'search_started'
      let description = 'Búsqueda de leads iniciada'

      if (status === 'completed') {
        action = 'search_completed'
        description = `Búsqueda completada - ${totalResults} leads encontrados en ${Math.round(searchTime / 1000)}s`
      } else if (status === 'failed') {
        action = 'search_failed'
        description = `Búsqueda fallida: ${errorMessage || 'Error desconocido'}`
      } else if (status === 'cancelled') {
        action = 'search_cancelled'
        description = 'Búsqueda cancelada por el usuario'
      }

      await supabase
        .from('activity_logs')
        .insert({
          user_id: userId,
          activity_type: 'search',
          action: action,
          description: description,
          resource_type: 'search_history',
          resource_id: searchId,
          timestamp: new Date().toISOString(),
          changes: {
            total_results: totalResults,
            execution_time_ms: searchTime,
            status: status,
            error_message: errorMessage
          }
        })

    } catch (err) {
      console.error('Error logging search activity:', err)
      // Don't throw error as this is not critical
    }
  }

  const getSearchHistory = async (limit: number = 50): Promise<SearchHistoryRecord[]> => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        console.error('Error getting user:', userError)
        return []
      }

      const { data, error } = await supabase
        .from('search_history')
        .select('*')
        .eq('user_id', user.id)
        .order('started_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching search history:', error)
        return []
      }

      return data || []
    } catch (err) {
      console.error('Error getting search history:', err)
      return []
    }
  }

  const deleteSearchHistory = async (searchId: string): Promise<boolean> => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        console.error('Error getting user:', userError)
        return false
      }

      const { error } = await supabase
        .from('search_history')
        .delete()
        .eq('id', searchId)
        .eq('user_id', user.id)

      if (error) {
        console.error('Error deleting search history:', error)
        return false
      }

      return true
    } catch (err) {
      console.error('Error deleting search history:', err)
      return false
    }
  }

  const updateSearchStatus = async (
    searchId: string, 
    status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled',
    errorMessage?: string
  ): Promise<boolean> => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        console.error('Error getting user:', userError)
        return false
      }

      const updateData: any = {
        status,
        completed_at: status === 'completed' || status === 'failed' || status === 'cancelled' 
          ? new Date().toISOString() 
          : null
      }

      if (errorMessage) {
        updateData.error_message = errorMessage
      }

      const { error } = await supabase
        .from('search_history')
        .update(updateData)
        .eq('id', searchId)
        .eq('user_id', user.id)

      if (error) {
        console.error('Error updating search status:', error)
        return false
      }

      return true
    } catch (err) {
      console.error('Error updating search status:', err)
      return false
    }
  }

  return {
    saveSearchToHistory,
    getSearchHistory,
    deleteSearchHistory,
    updateSearchStatus,
  }
} 