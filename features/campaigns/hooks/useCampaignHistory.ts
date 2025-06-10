"use client"

import { useState, useCallback, useMemo } from "react"
import type { Campaign, CampaignHistory, CampaignHistoryActions } from "../types"

export function useCampaignHistory(
  initialCampaigns: Campaign[] = [],
  onViewCampaign?: (campaignId: string) => void,
  onDuplicateCampaign?: (campaignId: string) => void
): CampaignHistory & CampaignHistoryActions {
  const [campaigns] = useState<Campaign[]>(initialCampaigns)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCampaigns = useMemo(() => {
    if (!searchTerm.trim()) {
      return campaigns
    }

    const term = searchTerm.toLowerCase()
    return campaigns.filter(campaign => 
      campaign.subject.toLowerCase().includes(term) ||
      campaign.senderName.toLowerCase().includes(term) ||
      campaign.recipients.some(recipient => 
        recipient.name.toLowerCase().includes(term) ||
        recipient.company.toLowerCase().includes(term)
      )
    )
  }, [campaigns, searchTerm])

  const filterCampaigns = useCallback((term: string) => {
    setSearchTerm(term)
  }, [])

  const handleViewCampaign = useCallback((campaignId: string) => {
    onViewCampaign?.(campaignId)
  }, [onViewCampaign])

  const handleDuplicateCampaign = useCallback((campaignId: string) => {
    onDuplicateCampaign?.(campaignId)
  }, [onDuplicateCampaign])

  return {
    // State
    campaigns,
    filteredCampaigns,
    searchTerm,
    
    // Actions
    setSearchTerm,
    onViewCampaign: handleViewCampaign,
    onDuplicateCampaign: handleDuplicateCampaign,
    filterCampaigns
  }
}
