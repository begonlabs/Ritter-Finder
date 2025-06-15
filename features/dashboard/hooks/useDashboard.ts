"use client"

import { useState, useCallback } from "react"
import { mockLeads } from "@/lib/mock-data"
import type { DashboardState, DashboardActions, TabType, CampaignData, SearchHistoryItem, SearchResults } from "../types"

export function useDashboard() {
  const [state, setState] = useState<DashboardState>({
    // Search configuration
    selectedWebsites: [],
    selectedClientTypes: [],
    selectedLocations: [],
    requireWebsite: false,
    validateEmail: false,
    validateWebsite: false,
    
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
  })

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

  const setValidateEmail = useCallback((validate: boolean) => {
    setState(prev => ({ ...prev, validateEmail: validate }))
  }, [])

  const setValidateWebsite = useCallback((validate: boolean) => {
    setState(prev => ({ ...prev, validateWebsite: validate }))
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

  // Search action
  const handleSearch = useCallback(() => {
    if (state.selectedWebsites.length === 0 || state.selectedClientTypes.length === 0 || state.selectedLocations.length === 0) {
      return
    }

    setState(prev => ({
      ...prev,
      isSearching: true,
      searchComplete: false,
      searchProgress: 0,
      currentStep: "Iniciando búsqueda...",
      leads: [],
      selectedLeads: [],
      emailSent: false,
    }))

    // Simulate search process
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        isSearching: false,
        searchComplete: true,
        searchProgress: 100,
        currentStep: "Búsqueda completada",
        leads: mockLeads,
        activeTab: "results" as TabType,
      }))
    }, 5000)
  }, [state.selectedWebsites, state.selectedClientTypes, state.selectedLocations])

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
      validateEmail: false,
      validateWebsite: false,
      isSearching: false,
      searchComplete: false,
      searchProgress: 0,
      currentStep: "",
      searchResults: null,
      leads: [],
      selectedLeads: [],
      emailSent: false,
    }))
  }, [])

  const actions: DashboardActions = {
    // Search configuration actions
    setSelectedWebsites,
    setSelectedClientTypes,
    setSelectedLocations,
    setRequireWebsite,
    setValidateEmail,
    setValidateWebsite,
    
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
