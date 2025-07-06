"use client"

import { useState, useCallback, useEffect } from "react"
import { mockLeads } from "@/lib/mock-data"
import { useLeadsSearch } from "./useLeadsSearch"
import type { DashboardState, DashboardActions, TabType, CampaignData, SearchHistoryItem, SearchResults } from "../types"

export function useDashboard() {
  // Hook para búsqueda real de leads en Supabase
  const leadsSearch = useLeadsSearch()
  
  const [state, setState] = useState<DashboardState>({
    // Search configuration
    selectedWebsites: [],
    selectedClientTypes: [],
    selectedLocations: [],
    requireWebsite: false,
    requireEmail: false,
    requirePhone: false,
    validateEmail: false,
    validateWebsite: false,
    validatePhone: false,
    
    // UI state
    activeTab: "search" as TabType,
    isSearching: false,
    searchComplete: false,
    searchProgress: 0,
    currentStep: "",
    emailSent: false,
    
    // Results
    leads: [],
    selectedLeads: [],
    searchResults: null,
    
    // History
    searchHistory: [],
    
    // No results with criteria
    noResultsWithCriteria: false,
  })

  // ✅ Effect to sync leads from useLeadsSearch to dashboard state
  useEffect(() => {
    if (leadsSearch.leads.length > 0 && !state.isSearching) {
      console.log('🔄 Sincronizando leads al dashboard:', leadsSearch.leads.length, 'leads')
      setState(prev => ({
        ...prev,
        leads: [...leadsSearch.leads], // Create a new array copy
        searchComplete: true,
        activeTab: "results" as TabType,
      }))
    }
  }, [leadsSearch.leads, state.isSearching])

  // ✅ Effect to handle search errors
  useEffect(() => {
    if (leadsSearch.error && state.isSearching) {
      console.error('❌ Error en búsqueda detectado:', leadsSearch.error)
      setState(prev => ({
        ...prev,
        isSearching: false,
        searchComplete: false,
        searchProgress: 0,
        currentStep: `Error: ${leadsSearch.error}`,
        leads: [],
      }))
    }
  }, [leadsSearch.error, state.isSearching])

  // ✅ Effect to handle no results with criteria
  useEffect(() => {
    if (leadsSearch.noResultsWithCriteria && !state.isSearching) {
      console.log('⚠️ No hay resultados con criterios - mostrando mensaje al usuario')
      setState(prev => ({
        ...prev,
        searchComplete: true,
        currentStep: "No se encontraron resultados con los criterios especificados",
        activeTab: "results" as TabType,
        noResultsWithCriteria: true,
      }))
    }
  }, [leadsSearch.noResultsWithCriteria, state.isSearching])

  // Search configuration actions
  const setSelectedWebsites = useCallback((websites: string[]) => {
    setState(prev => ({ ...prev, selectedWebsites: websites }))
  }, [])

  const setSelectedClientTypes = useCallback((clientTypes: string[]) => {
    setState(prev => ({ ...prev, selectedClientTypes: clientTypes }))
  }, [])

  const setSelectedLocations = useCallback((locations: string[]) => {
    setState(prev => ({ ...prev, selectedLocations: locations }))
  }, [])

  const setRequireWebsite = useCallback((require: boolean) => {
    setState(prev => ({ ...prev, requireWebsite: require }))
  }, [])

  const setRequireEmail = useCallback((require: boolean) => {
    setState(prev => ({ ...prev, requireEmail: require }))
  }, [])

  const setRequirePhone = useCallback((require: boolean) => {
    setState(prev => ({ ...prev, requirePhone: require }))
  }, [])

  const setValidateEmail = useCallback((validate: boolean) => {
    setState(prev => ({ ...prev, validateEmail: validate }))
  }, [])

  const setValidateWebsite = useCallback((validate: boolean) => {
    setState(prev => ({ ...prev, validateWebsite: validate }))
  }, [])

  const setValidatePhone = useCallback((validate: boolean) => {
    setState(prev => ({ ...prev, validatePhone: validate }))
  }, [])

  // UI actions
  const setActiveTab = useCallback((tab: TabType) => {
    setState(prev => ({ ...prev, activeTab: tab }))
  }, [])

  const setIsSearching = useCallback((searching: boolean) => {
    setState(prev => ({ ...prev, isSearching: searching }))
  }, [])

  const setSearchComplete = useCallback((complete: boolean) => {
    setState(prev => ({ ...prev, searchComplete: complete }))
  }, [])

  const setSearchProgress = useCallback((progress: number) => {
    setState(prev => ({ ...prev, searchProgress: progress }))
  }, [])

  const setCurrentStep = useCallback((step: string) => {
    setState(prev => ({ ...prev, currentStep: step }))
  }, [])

  // Results actions
  const setSearchResults = useCallback((results: SearchResults | null) => {
    setState(prev => ({ ...prev, searchResults: results }))
  }, [])

  // History actions
  const addSearchToHistory = useCallback((search: SearchHistoryItem) => {
    setState(prev => ({ 
      ...prev, 
      searchHistory: [search, ...prev.searchHistory] 
    }))
  }, [])

  const clearSearchHistory = useCallback(() => {
    setState(prev => ({ ...prev, searchHistory: [] }))
  }, [])

  // Lead management actions
  const handleSelectLead = useCallback((id: string) => {
    setState(prev => ({ 
      ...prev, 
      selectedLeads: prev.selectedLeads.includes(id)
        ? prev.selectedLeads.filter((leadId) => leadId !== id)
        : [...prev.selectedLeads, id]
    }))
  }, [])

  const handleSelectAll = useCallback((select: boolean) => {
    setState(prev => ({
      ...prev,
      selectedLeads: select ? prev.leads.map((lead) => lead.id) : []
    }))
  }, [])

  // ✅ Improved search action with proper data flow
  const handleSearch = useCallback(async () => {
    if (state.selectedClientTypes.length === 0 || state.selectedLocations.length === 0) {
      console.warn('⚠️ Búsqueda cancelada: faltan criterios de búsqueda')
      return
    }

    console.log('🚀 Iniciando búsqueda mejorada...')

    // Clear previous results and start search
    setState(prev => ({
      ...prev,
      isSearching: true,
      searchComplete: false,
      searchProgress: 0,
      currentStep: "Iniciando búsqueda en Supabase...",
      leads: [],
      selectedLeads: [],
      emailSent: false,
      noResultsWithCriteria: false, // Reset no results state
    }))

    // Clear any previous search results
    leadsSearch.clearResults()

    try {
      // Update progress
      setState(prev => ({
        ...prev,
        searchProgress: 25,
        currentStep: "Conectando con base de datos..."
      }))

      // Execute the actual search
      console.log('📡 Ejecutando búsqueda con criterios:', {
        clientTypes: state.selectedClientTypes,
        locations: state.selectedLocations,
        requireWebsite: state.requireWebsite,
        requireEmail: state.requireEmail,
        requirePhone: state.requirePhone,
      })
      
      // ✅ Enhanced validation logging
      console.log('🔍 Validación de filtros antes de búsqueda:', {
        'Filtro Website activo': state.requireWebsite,
        'Filtro Email activo': state.requireEmail,
        'Filtro Phone activo': state.requirePhone,
        'Criterios válidos': state.selectedClientTypes.length > 0 && state.selectedLocations.length > 0
      })

      await leadsSearch.searchLeads({
        selectedClientTypes: state.selectedClientTypes,
        selectedLocations: state.selectedLocations,
        requireWebsite: state.requireWebsite,
        requireEmail: state.requireEmail,
        requirePhone: state.requirePhone,
      })

      setState(prev => ({
        ...prev,
        searchProgress: 75,
        currentStep: "Procesando resultados..."
      }))

      // ✅ Remove setTimeout - let useEffect handle the data sync
      setState(prev => ({
        ...prev,
        searchProgress: 100,
        currentStep: "Búsqueda completada - procesando datos...",
        isSearching: false, // This will trigger the useEffect to sync leads
      }))

      console.log('✅ Búsqueda completada exitosamente')

    } catch (error) {
      console.error('❌ Error en búsqueda:', error)
      setState(prev => ({
        ...prev,
        isSearching: false,
        searchComplete: false,
        searchProgress: 0,
        currentStep: "Error en la búsqueda",
        leads: [],
      }))
    }
  }, [
    state.selectedClientTypes, 
    state.selectedLocations, 
    state.requireWebsite, 
    state.requireEmail, 
    state.requirePhone, 
    leadsSearch.searchLeads,
    leadsSearch.clearResults
  ])

  // Campaign actions
  const handleSendCampaign = useCallback((campaignData: CampaignData) => {
    setState(prev => ({ ...prev, emailSent: true }))
    console.log("Campaign sent:", campaignData)
    
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        activeTab: "dashboard" as TabType,
        selectedWebsites: [],
        selectedClientTypes: [],
        selectedLocations: [],
        requireWebsite: false,
        validateEmail: false,
        validateWebsite: false,
        searchComplete: false,
        leads: [],
        selectedLeads: [],
        emailSent: false,
      }))
    }, 5000)
  }, [])

  const handleRerunSearch = useCallback((searchData: SearchHistoryItem) => {
    setState(prev => ({
      ...prev,
      selectedWebsites: searchData.websites,
      selectedClientTypes: searchData.clientTypes,
      selectedLocations: searchData.locations,
      requireWebsite: searchData.requireWebsite,
      validateEmail: searchData.validateEmail,
      validateWebsite: searchData.validateWebsite,
      activeTab: "search" as TabType,
    }))
  }, [])

  const handleViewLeads = useCallback(() => {
    setState(prev => ({
      ...prev,
      leads: mockLeads,
      activeTab: "results" as TabType,
    }))
  }, [])

  // Combined actions
  const resetSearch = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedWebsites: [],
      selectedClientTypes: [],
      selectedLocations: [],
      requireWebsite: false,
      requireEmail: false,
      requirePhone: false,
      validateEmail: false,
      validateWebsite: false,
      validatePhone: false,
      isSearching: false,
      searchComplete: false,
      searchProgress: 0,
      currentStep: "",
      searchResults: null,
      leads: [],
      selectedLeads: [],
      emailSent: false,
    }))
    
    // También limpiar resultados de búsqueda
    leadsSearch.clearResults()
  }, [leadsSearch])

  const actions: DashboardActions = {
    // Search configuration actions
    setSelectedWebsites,
    setSelectedClientTypes,
    setSelectedLocations,
    setRequireWebsite,
    setRequireEmail,
    setRequirePhone,
    setValidateEmail,
    setValidateWebsite,
    setValidatePhone,
    
    // UI actions
    setActiveTab,
    setIsSearching,
    setSearchComplete,
    setSearchProgress,
    setCurrentStep,
    
    // Results actions
    setSearchResults,
    
    // History actions
    addSearchToHistory,
    clearSearchHistory,
    
    // Lead management actions
    handleSelectLead,
    handleSelectAll,
    
    // Search action
    handleSearch,
    
    // Campaign actions
    handleSendCampaign,
    handleRerunSearch,
    handleViewLeads,
    
    // Combined actions
    resetSearch,
  }

  return {
    state,
    actions,
  }
}
