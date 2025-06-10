"use client"

import { EmailComposer } from "../components/EmailComposer"
import { EmailHistory } from "../components/EmailHistory"
import type { Lead, Campaign } from "../types"
import styles from "../styles/CampaignPage.module.css"

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
    <div className={`${styles.campaignPage} space-y-8`}>
      <div className={`${styles.campaignHeader} text-center mb-6`}>
        <div className={styles.campaignHeaderContent}>
          <h2 className={`${styles.campaignTitle} text-2xl font-bold text-gray-900 mb-2`}>
            Campañas de Email
          </h2>
          <p className={`${styles.campaignSubtitle} text-gray-600`}>
            Crea y envía campañas personalizadas a tus leads de energías renovables
          </p>
        </div>
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