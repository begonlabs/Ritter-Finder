"use client"

import { SearchHistory } from "@/components/search-history"
import { EmailHistory } from "@/components/email-history"
import { mockSearchHistory, mockEmailCampaigns } from "@/lib/mock-data"
import type { TabComponentProps } from "../types"

export function HistoryTab({ state, actions }: TabComponentProps) {
  const handleViewCampaign = () => {
    actions.setActiveTab("campaign")
  }

  const handleDuplicateCampaign = () => {
    actions.setActiveTab("campaign")
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Historial y Análisis</h2>
        <p className="text-gray-600">Revisa tus búsquedas anteriores y el rendimiento de tus campañas</p>
      </div>

      <SearchHistory
        history={mockSearchHistory}
        onRerunSearch={actions.handleRerunSearch}
        onViewLeads={actions.handleViewLeads}
      />

      <EmailHistory
        campaigns={mockEmailCampaigns}
        onViewCampaign={handleViewCampaign}
        onDuplicateCampaign={handleDuplicateCampaign}
      />
    </div>
  )
}
