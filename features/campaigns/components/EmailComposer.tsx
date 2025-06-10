"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { useEmailComposer } from "../hooks/useEmailComposer"
import { ComposeTab } from "./ComposeTab"
import { RecipientsTab } from "./RecipientsTab"
import { PreviewTab } from "./PreviewTab"
import { CampaignSuccess } from "./CampaignSuccess"
import type { Lead, Campaign, Language } from "../types"

interface EmailComposerProps {
  selectedLeads: Lead[]
  onSendCampaign: (campaignData: Campaign) => void
  emailSent?: boolean
}

export function EmailComposer({ selectedLeads, onSendCampaign, emailSent = false }: EmailComposerProps) {
  const { language } = useLanguage()
  const composer = useEmailComposer(language as Language, onSendCampaign)

  if (selectedLeads.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Campaña de Email</CardTitle>
          <CardDescription>No hay leads seleccionados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-muted-foreground">
              Selecciona algunos leads primero para crear una campaña de email.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (emailSent || composer.emailSent) {
    return <CampaignSuccess selectedLeads={selectedLeads} />
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="compose" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="compose">Componer</TabsTrigger>
          <TabsTrigger value="recipients">Destinatarios</TabsTrigger>
          <TabsTrigger value="preview">Vista Previa</TabsTrigger>
        </TabsList>

        <TabsContent value="compose">
          <ComposeTab 
            composer={composer}
            selectedLeads={selectedLeads}
          />
        </TabsContent>

        <TabsContent value="recipients">
          <RecipientsTab selectedLeads={selectedLeads} />
        </TabsContent>

        <TabsContent value="preview">
          <PreviewTab 
            composer={composer}
            selectedLeads={selectedLeads}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
