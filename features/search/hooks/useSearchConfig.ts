"use client"

import { useState } from "react"
import type { SearchConfig, SearchActions } from "../types"

export function useSearchConfig() {
  const [config, setConfig] = useState<SearchConfig>({
    selectedWebsites: [],
    selectedClientTypes: [],
    selectedLocations: [],
    requireWebsite: false,
    validateEmail: false,
    validateWebsite: false,
  })

  const setSelectedWebsites = (websites: string[]) => {
    setConfig(prev => ({ ...prev, selectedWebsites: websites }))
  }

  const setSelectedClientTypes = (clientTypes: string[]) => {
    setConfig(prev => ({ ...prev, selectedClientTypes: clientTypes }))
  }

  const setSelectedLocations = (locations: string[]) => {
    setConfig(prev => ({ ...prev, selectedLocations: locations }))
  }

  const setRequireWebsite = (require: boolean) => {
    setConfig(prev => ({ ...prev, requireWebsite: require }))
  }

  const setValidateEmail = (validate: boolean) => {
    setConfig(prev => ({ ...prev, validateEmail: validate }))
  }

  const setValidateWebsite = (validate: boolean) => {
    setConfig(prev => ({ ...prev, validateWebsite: validate }))
  }

  const resetConfig = () => {
    setConfig({
      selectedWebsites: [],
      selectedClientTypes: [],
      selectedLocations: [],
      requireWebsite: false,
      validateEmail: false,
      validateWebsite: false,
    })
  }

  const isValidConfig = (): boolean => {
    return config.selectedWebsites.length > 0 && 
           config.selectedClientTypes.length > 0 &&
           config.selectedLocations.length > 0
  }

  const actions: Omit<SearchActions, 'handleSearch' | 'rerunSearch'> = {
    setSelectedWebsites,
    setSelectedClientTypes,
    setSelectedLocations,
    setRequireWebsite,
    setValidateEmail,
    setValidateWebsite,
    resetSearch: resetConfig,
  }

  return {
    config,
    actions,
    isValidConfig,
    resetConfig,
  }
}
