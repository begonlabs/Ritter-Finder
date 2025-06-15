"use client"

import { useState } from "react"
import type { SearchConfig, SearchActions } from "../types"

export function useSearchConfig() {
  const [config, setConfig] = useState<SearchConfig>({
    selectedWebsites: [],
    selectedClientType: "",
  })

  const setSelectedWebsites = (websites: string[]) => {
    setConfig(prev => ({ ...prev, selectedWebsites: websites }))
  }

  const setSelectedClientType = (clientType: string) => {
    setConfig(prev => ({ ...prev, selectedClientType: clientType }))
  }

  const resetConfig = () => {
    setConfig({
      selectedWebsites: [],
      selectedClientType: "",
    })
  }

  const isValidConfig = (): boolean => {
    return config.selectedWebsites.length > 0 && config.selectedClientType !== ""
  }

  const actions: Omit<SearchActions, 'handleSearch' | 'rerunSearch'> = {
    setSelectedWebsites,
    setSelectedClientType,
    resetSearch: resetConfig,
  }

  return {
    config,
    actions,
    isValidConfig,
    resetConfig,
  }
}
