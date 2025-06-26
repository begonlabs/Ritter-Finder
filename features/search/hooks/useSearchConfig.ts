"use client"

import { useState } from "react"
import type { SearchConfig, SearchActions } from "../types"

export function useSearchConfig() {
  const [config, setConfig] = useState<SearchConfig>({
    selectedClientTypes: [],
    selectedLocations: [],
    requireWebsite: false,
    validateEmail: false,
    validateWebsite: false,
    requirePhone: false,
    validatePhone: false,
  })

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

  const setRequirePhone = (require: boolean) => {
    setConfig(prev => ({ ...prev, requirePhone: require }))
  }

  const setValidatePhone = (validate: boolean) => {
    setConfig(prev => ({ ...prev, validatePhone: validate }))
  }

  const resetConfig = () => {
    setConfig({
      selectedClientTypes: [],
      selectedLocations: [],
      requireWebsite: false,
      validateEmail: false,
      validateWebsite: false,
      requirePhone: false,
      validatePhone: false,
    })
  }

  const isValidConfig = (): boolean => {
    return config.selectedClientTypes.length > 0 &&
           config.selectedLocations.length > 0
  }

  const actions: Omit<SearchActions, 'handleSearch' | 'rerunSearch'> = {
    setSelectedClientTypes,
    setSelectedLocations,
    setRequireWebsite,
    setValidateEmail,
    setValidateWebsite,
    setRequirePhone,
    setValidatePhone,
    resetSearch: resetConfig,
  }

  return {
    config,
    actions,
    isValidConfig,
    resetConfig,
  }
}
