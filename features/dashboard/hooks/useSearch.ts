"use client"

import { useState } from "react"
import { mockLeads } from "@/lib/mock-data"
import type { Lead } from "../types"

export function useSearch() {
  const [selectedWebsites, setSelectedWebsites] = useState<string[]>([])
  const [selectedClientType, setSelectedClientType] = useState<string>("")
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const [searchComplete, setSearchComplete] = useState<boolean>(false)
  const [leads, setLeads] = useState<Lead[]>([])

  const canStartSearch: boolean = !!(selectedWebsites.length > 0 && selectedClientType && !isSearching)

  const handleSearch = () => {
    if (!canStartSearch) return

    setIsSearching(true)
    setSearchComplete(false)
    setLeads([])

    // Simulate search API call
    setTimeout(() => {
      setIsSearching(false)
      setSearchComplete(true)
      setLeads(mockLeads)
    }, 5000)
  }

  const resetSearch = () => {
    setSelectedWebsites([])
    setSelectedClientType("")
    setIsSearching(false)
    setSearchComplete(false)
    setLeads([])
  }

  const rerunSearch = (websites: string[], clientType: string) => {
    setSelectedWebsites(websites)
    setSelectedClientType(clientType)
    setSearchComplete(false)
    setLeads([])
  }

  return {
    selectedWebsites,
    selectedClientType,
    isSearching,
    searchComplete,
    leads,
    canStartSearch,
    setSelectedWebsites,
    setSelectedClientType,
    handleSearch,
    resetSearch,
    rerunSearch,
  }
}
