"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users } from "lucide-react"
import { useEmailComposer } from "../hooks/useEmailComposer"
import { ComposeTab } from "./ComposeTab"
import { RecipientsTab } from "./RecipientsTab"
import { PreviewTab } from "./PreviewTab"
import { CampaignSuccess } from "./CampaignSuccess"
import type { Lead, Campaign } from "../types"
import styles from "../styles/EmailComposer.module.css"

interface EmailComposerProps {
  selectedLeads: Lead[]
  onSendCampaign: (campaignData: Campaign) => void
  emailSent?: boolean
  campaignResult?: {
    sentCount: number
    failedCount: number
    results?: Array<{
      email: string
      success: boolean
      messageId?: string
      error?: string
    }>
  }
}

export function EmailComposer({ selectedLeads, onSendCampaign, emailSent = false, campaignResult }: EmailComposerProps) {
  const composer = useEmailComposer()

  if (selectedLeads.length === 0) {
    return (
      <Card className={styles.emptyState}>
        <CardHeader className={styles.emptyStateHeader}>
          <CardTitle className={styles.emptyStateTitle}>Campaña de Email</CardTitle>
          <CardDescription className={styles.emptyStateDescription}>No hay leads seleccionados</CardDescription>
        </CardHeader>
        <CardContent className={styles.emptyStateContent}>
          <Users className={`${styles.emptyStateIcon} mx-auto h-12 w-12 text-gray-400 mb-4`} />
          <p className={`${styles.emptyStateText} text-muted-foreground`}>
            Selecciona algunos leads primero para crear una campaña de email.
          </p>
        </CardContent>
      </Card>
    )
  }

  if (emailSent || composer.data.emailSent) {
    return <CampaignSuccess selectedLeads={selectedLeads} campaignResult={campaignResult} />
  }

  return (
    <div className={`${styles.emailComposer} space-y-6`}>
      <Tabs defaultValue="compose" className={`${styles.tabsContainer} space-y-6`}>
        <TabsList className={`${styles.tabsList} grid w-full grid-cols-3`}>
          <TabsTrigger value="compose" className={styles.tabsTrigger}>Componer</TabsTrigger>
          <TabsTrigger value="recipients" className={styles.tabsTrigger}>Destinatarios</TabsTrigger>
          <TabsTrigger value="preview" className={styles.tabsTrigger}>Vista Previa</TabsTrigger>
        </TabsList>

        <TabsContent value="compose" className={styles.tabsContent}>
          <ComposeTab 
            composer={composer}
            selectedLeads={selectedLeads}
            recipientCount={selectedLeads.length}
          />
        </TabsContent>

        <TabsContent value="recipients" className={styles.tabsContent}>
          <RecipientsTab selectedLeads={selectedLeads} />
        </TabsContent>

        <TabsContent value="preview" className={styles.tabsContent}>
          <PreviewTab 
            composer={composer}
            selectedLeads={selectedLeads}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
