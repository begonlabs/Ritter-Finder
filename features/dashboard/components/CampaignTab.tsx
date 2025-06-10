"use client"

import { EmailComposer } from "@/features/campaigns"
import type { TabComponentProps, CampaignData } from "../types"
import type { Campaign, Lead as CampaignLead } from "@/features/campaigns"
import styles from "../styles/CampaignTab.module.css"

interface CampaignTabProps extends TabComponentProps {
  selectedLeadsData: any[]
}

export function CampaignTab({ state, actions, selectedLeadsData }: CampaignTabProps) {
  const handleSendCampaign = (campaignData: Campaign) => {
    // Convert campaign leads to dashboard lead format
    const dashboardCampaignData: CampaignData = {
      subject: campaignData.subject,
      content: campaignData.content,
      senderName: campaignData.senderName,
      senderEmail: campaignData.senderEmail,
      recipients: selectedLeadsData, // Use original dashboard leads
      sentAt: campaignData.sentAt,
      estimatedDelivery: campaignData.estimatedDelivery
    }
    actions.handleSendCampaign(dashboardCampaignData)
  }

  // Convert dashboard leads to campaign leads format
  const campaignLeads: CampaignLead[] = selectedLeadsData.map(lead => ({
    id: lead.id,
    name: lead.name,
    company: lead.company,
    email: lead.email,
    position: lead.position,
    industry: lead.industry,
    location: lead.location,
    phone: lead.phone,
    website: lead.website,
    confidence: lead.confidence
  }))

  return (
    <div className={`${styles.campaignTab} space-y-6`}>
      <div className={styles.campaignContainer}>
        <div className={styles.campaignWrapper}>
          <EmailComposer
            selectedLeads={campaignLeads}
            onSendCampaign={handleSendCampaign}
            emailSent={state.emailSent}
          />
        </div>
      </div>
    </div>
  )
}
