"use client"

import { EnhancedEmailComposer } from "@/components/enhanced-email-composer"
import type { TabComponentProps } from "../types"

interface CampaignTabProps extends TabComponentProps {
  selectedLeadsData: any[]
}

export function CampaignTab({ state, actions, selectedLeadsData }: CampaignTabProps) {
  return (
    <div className="space-y-6">
      <EnhancedEmailComposer
        selectedLeads={selectedLeadsData}
        onSendCampaign={actions.handleSendCampaign}
        emailSent={state.emailSent}
      />
    </div>
  )
}
