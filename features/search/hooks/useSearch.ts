"use client"

import { useState, useCallback } from "react"
import { mockLeads } from "@/lib/mock-data"
import { useSearchConfig } from "./useSearchConfig"
import type { SearchState, SearchResults, SearchConfig, SearchActions } from "../types"

export function useSearch() {
  const { config, actions: configActions, isValidConfig } = useSearchConfig()
  
  const [searchState, setSearchState] = useState({
    isSearching: false,
    searchComplete: false,
    searchProgress: 0,
    currentStep: "",
  })

  const [results, setResults] = useState<SearchResults | null>(null)

  const handleSearch = useCallback(() => {
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

    // Simulate search process with progress updates
    const steps = [
      "Conectando a fuentes de datos...",
      "Analizando contenido...",
      "Extrayendo información de contacto...",
      "Validando datos...",
      "Completando búsqueda...",
    ]

    let currentStepIndex = 0
    const interval = setInterval(() => {
      currentStepIndex++
      const progress = (currentStepIndex / steps.length) * 100

      setSearchState(prev => ({
        ...prev,
        searchProgress: progress,
        currentStep: steps[currentStepIndex - 1] || "Procesando...",
      }))

      if (currentStepIndex >= steps.length) {
        clearInterval(interval)
        
        // Complete the search
        setTimeout(() => {
          const searchResults: SearchResults = {
            leads: mockLeads,
            totalFound: mockLeads.length,
            searchTime: 5000,
            searchId: Date.now().toString(),
          }

          setResults(searchResults)
          setSearchState({
            isSearching: false,
            searchComplete: true,
            searchProgress: 100,
            currentStep: "Búsqueda completada",
          })
        }, 500)
      }
    }, 1000)
  }, [config, isValidConfig, searchState.isSearching])

  const resetSearch = useCallback(() => {
    configActions.resetSearch()
    setSearchState({
      isSearching: false,
      searchComplete: false,
      searchProgress: 0,
      currentStep: "",
    })
    setResults(null)
  }, [configActions])

  const rerunSearch = useCallback((searchConfig: SearchConfig) => {
    configActions.setSelectedClientTypes(searchConfig.selectedClientTypes)
    configActions.setSelectedLocations(searchConfig.selectedLocations)
    configActions.setRequireWebsite(searchConfig.requireWebsite)
    configActions.setValidateEmail(searchConfig.validateEmail)
    configActions.setValidateWebsite(searchConfig.validateWebsite)
    
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

  const canStartSearch = isValidConfig() && !searchState.isSearching

  return {
    state: fullState,
    actions,
    results,
    canStartSearch,
    isSearching: searchState.isSearching,
    searchComplete: searchState.searchComplete,
  }
} 