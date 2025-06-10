"use client"

import { useState } from "react"
import { mockLeads } from "@/lib/mock-data"
import type { DashboardState, DashboardActions, TabType, CampaignData, SearchHistoryItem } from "../types"

export function useDashboard() {
  const [state, setState] = useState<DashboardState>({
    selectedWebsites: [],
    selectedClientType: "",
    isSearching: false,
    searchComplete: false,
    leads: [],
    selectedLeads: [],
    activeTab: "dashboard",
    emailSent: false,
  })

  const setSelectedWebsites = (websites: string[]) => {
    setState(prev => ({ ...prev, selectedWebsites: websites }))
  }

  const setSelectedClientType = (clientType: string) => {
    setState(prev => ({ ...prev, selectedClientType: clientType }))
  }

  const setActiveTab = (tab: TabType) => {
    setState(prev => ({ ...prev, activeTab: tab }))
  }

  const handleSearch = () => {
    if (state.selectedWebsites.length === 0 || !state.selectedClientType) {
      return
    }

    setState(prev => ({
      ...prev,
      isSearching: true,
      searchComplete: false,
      leads: [],
      selectedLeads: [],
      emailSent: false,
    }))

    setTimeout(() => {
      setState(prev => ({
        ...prev,
        isSearching: false,
        searchComplete: true,
        leads: mockLeads,
        activeTab: "results",
      }))
    }, 5000)
  }

  const handleSelectLead = (id: string) => {
    setState(prev => ({
      ...prev,
      selectedLeads: prev.selectedLeads.includes(id)
        ? prev.selectedLeads.filter((leadId) => leadId !== id)
        : [...prev.selectedLeads, id]
    }))
  }

  const handleSelectAll = (select: boolean) => {
    setState(prev => ({
      ...prev,
      selectedLeads: select ? prev.leads.map((lead) => lead.id) : []
    }))
  }

  const handleSendCampaign = (campaignData: CampaignData) => {
    setState(prev => ({ ...prev, emailSent: true }))
    console.log("Campaign sent:", campaignData)
    
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        activeTab: "dashboard",
        selectedWebsites: [],
        selectedClientType: "",
        searchComplete: false,
        leads: [],
        selectedLeads: [],
        emailSent: false,
      }))
    }, 5000)
  }

  const handleRerunSearch = (searchData: SearchHistoryItem) => {
    setState(prev => ({
      ...prev,
      selectedWebsites: searchData.websites,
      selectedClientType: searchData.clientType,
      activeTab: "search",
    }))
  }

  const handleViewLeads = () => {
    setState(prev => ({
      ...prev,
      leads: mockLeads,
      activeTab: "results",
    }))
  }

  const actions: DashboardActions = {
    setSelectedWebsites,
    setSelectedClientType,
    setActiveTab,
    handleSearch,
    handleSelectLead,
    handleSelectAll,
    handleSendCampaign,
    handleRerunSearch,
    handleViewLeads,
  }

  // Computed values
  const canStartSearch: boolean = !!(state.selectedWebsites.length > 0 && state.selectedClientType && !state.isSearching)
  const selectedLeadsData = state.leads.filter((lead) => state.selectedLeads.includes(lead.id))

  return {
    state,
    actions,
    canStartSearch,
    selectedLeadsData,
  }
}
