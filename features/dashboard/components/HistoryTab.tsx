"use client"

import { SearchHistory } from "@/components/search-history"
import { EmailHistory } from "@/features/campaigns"
import { mockSearchHistory, mockEmailCampaigns } from "@/lib/mock-data"
import type { TabComponentProps } from "../types"
import type { Campaign } from "@/features/campaigns"

export function HistoryTab({ state, actions }: TabComponentProps) {
  const handleViewCampaign = () => {
    actions.setActiveTab("campaign")
  }

  const handleDuplicateCampaign = () => {
    actions.setActiveTab("campaign")
  }

  // Convert mockEmailCampaigns to Campaign format
  const convertedCampaigns: Campaign[] = mockEmailCampaigns.map(mockCampaign => ({
    id: mockCampaign.id,
    subject: mockCampaign.subject,
    content: "", // Not available in mock data
    senderName: "Demo User",
    senderEmail: "demo@ritterfinder.com",
    recipients: [], // Not available in mock data
    sentAt: mockCampaign.date,
    estimatedDelivery: "2-5 minutes",
    openRate: mockCampaign.openRate,
    clickRate: mockCampaign.clickRate,
    status: mockCampaign.status as 'sent'
  }))

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
        campaigns={convertedCampaigns}
        onViewCampaign={handleViewCampaign}
        onDuplicateCampaign={handleDuplicateCampaign}
      />
    </div>
  )
}
