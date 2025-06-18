"use client"

import { EmailComposer } from "@/features/campaigns"
import type { TabComponentProps, CampaignData } from "../types"
import { leadToLegacyFormat } from "../types"
import type { Campaign } from "@/features/campaigns"
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
      sentAt: campaignData.sentAt?.toISOString() || new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 3600000).toISOString() // 1 hour from now
    }
    actions.handleSendCampaign(dashboardCampaignData)
  }

  // Convert dashboard leads to campaign leads format using legacy transformation
  const campaignLeads = selectedLeadsData.map(lead => {
    // Transform to legacy format for campaigns module compatibility
    const legacyLead = leadToLegacyFormat(lead)
    return {
      id: legacyLead.id,
      company_name: legacyLead.company, // Use company_name as required by Campaign Lead type
      email: legacyLead.email,
      phone: legacyLead.phone,
      activity: legacyLead.industry, // Map industry to activity as required
      verified_email: legacyLead.emailValidated,
      verified_phone: Boolean(legacyLead.phone),
      verified_website: legacyLead.websiteExists,
      company_website: legacyLead.website,
      state: legacyLead.location.split(',')[1]?.trim() || '',
      country: legacyLead.location.split(',')[0]?.trim() || '',
      category: legacyLead.industry,
      data_quality_score: Math.ceil((legacyLead.confidence || 0) / 20),
      
      // Legacy compatibility fields
      name: legacyLead.name,
      company: legacyLead.company,
      website: legacyLead.website,
      position: legacyLead.position,
      industry: legacyLead.industry,
      location: legacyLead.location
    }
  })

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
