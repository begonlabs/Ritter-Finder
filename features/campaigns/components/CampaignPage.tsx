"use client"

import { EmailComposer } from "./EmailComposer"
import { EmailHistory } from "./EmailHistory"
import type { Lead, Campaign } from "../types"

interface CampaignPageProps {
  selectedLeads: Lead[]
  campaigns?: Campaign[]
  onSendCampaign: (campaignData: Campaign) => void
  onViewCampaign?: (campaignId: string) => void
  onDuplicateCampaign?: (campaignId: string) => void
  emailSent?: boolean
}

export function CampaignPage({ 
  selectedLeads, 
  campaigns = [],
  onSendCampaign, 
  onViewCampaign = () => {},
  onDuplicateCampaign = () => {},
  emailSent = false 
}: CampaignPageProps) {
  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Campañas de Email
        </h2>
        <p className="text-gray-600">
          Crea y envía campañas personalizadas a tus leads de energías renovables
        </p>
      </div>

      <EmailComposer 
        selectedLeads={selectedLeads}
        onSendCampaign={onSendCampaign}
        emailSent={emailSent}
      />

      {campaigns.length > 0 && (
        <EmailHistory
          campaigns={campaigns}
          onViewCampaign={onViewCampaign}
          onDuplicateCampaign={onDuplicateCampaign}
        />
      )}
    </div>
  )
} 