"use client"

import { HistoryPage } from "@/features/history"
import type { TabComponentProps } from "../types"

export function HistoryTab({ state, actions }: TabComponentProps) {
  const handleViewCampaign = () => {
    actions.setActiveTab("campaign")
  }

  const handleDuplicateCampaign = () => {
    actions.setActiveTab("campaign")
  }

  const handleNavigateToSearch = () => {
    actions.setActiveTab("search")
  }

  const handleNavigateToCampaigns = () => {
    actions.setActiveTab("campaign")
  }

  const handleNavigateToResults = () => {
    actions.setActiveTab("results")
  }

  return (
    <HistoryPage
      showSearchHistory={true}
      showCampaignHistory={true}
      showActivityTimeline={true}
      compactMode={false}
      onNavigateToSearch={handleNavigateToSearch}
      onNavigateToCampaigns={handleNavigateToCampaigns}
      onNavigateToResults={handleNavigateToResults}
      onRerunSearch={actions.handleRerunSearch}
      onViewLeads={actions.handleViewLeads}
      onViewCampaign={handleViewCampaign}
      onDuplicateCampaign={handleDuplicateCampaign}
      onViewActivityDetails={(activityId) => console.log('Viewing activity:', activityId)}
    />
  )
}
