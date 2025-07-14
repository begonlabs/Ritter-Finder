"use client"

import { useState } from "react"
import type { SearchConfig, SearchActions } from "../types"

export function useSearchConfig() {
  const [config, setConfig] = useState<SearchConfig>({
    selectedClientTypes: [],
    selectedLocations: [],
    requireWebsite: false,
    requireEmail: false,
    requirePhone: false,
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

  const setRequireEmail = (require: boolean) => {
    setConfig(prev => ({ ...prev, requireEmail: require }))
  }

  const setRequirePhone = (require: boolean) => {
    setConfig(prev => ({ ...prev, requirePhone: require }))
  }

  const resetConfig = () => {
    setConfig({
      selectedClientTypes: [],
      selectedLocations: [],
      requireWebsite: false,
      requireEmail: false,
      requirePhone: false,
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
    setRequireEmail,
    setRequirePhone,
    resetSearch: resetConfig,
  }

  return {
    config,
    actions,
    isValidConfig,
    resetConfig,
  }
}
