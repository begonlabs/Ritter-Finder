"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Users, Mail, Eye, ChevronDown, Check } from "lucide-react"
import { useResponsive } from "@/features/layout/hooks/useResponsive"
import { cn } from "@/lib/utils"
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
  const [activeTab, setActiveTab] = useState("compose")
  const { isSmallScreen, isMediumScreen, isLargeScreen } = useResponsive()

  // Campaign tabs configuration
  const campaignTabs = [
    {
      id: "compose",
      label: "Componer",
      labelMobile: "Componer",
      icon: Mail,
    },
    {
      id: "recipients", 
      label: "Destinatarios",
      labelMobile: `Destinatarios (${selectedLeads.length})`,
      icon: Users,
    },
    {
      id: "preview",
      label: "Vista Previa",
      labelMobile: "Vista Previa",
      icon: Eye,
    },
  ]

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
    <div className={cn(
      styles.emailComposer,
      isSmallScreen && styles.emailComposerMobile,
      isMediumScreen && styles.emailComposerTablet
    )}>
      {/* Campaign Navigation - Conditional rendering */}
      {isSmallScreen ? (
        // Mobile: Dropdown Navigation
        <div className={cn(styles.mobileNavigation)}>
          <Select value={activeTab} onValueChange={setActiveTab}>
            <SelectTrigger className={cn(styles.mobileSelector)}>
              <div className="flex items-center gap-2">
                {(() => {
                  const currentTab = campaignTabs.find(tab => tab.id === activeTab)
                  const Icon = currentTab?.icon || Mail
                  return (
                    <>
                      <Icon className="h-4 w-4 text-ritter-gold" />
                      <span className="font-medium">{currentTab?.labelMobile || 'Seleccionar sección'}</span>
                    </>
                  )
                })()}
              </div>
              <ChevronDown className="h-4 w-4 opacity-50 custom-chevron" />
            </SelectTrigger>
            <SelectContent className={cn(styles.mobileSelectorContent)}>
              {campaignTabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <SelectItem 
                    key={tab.id} 
                    value={tab.id}
                    className={cn(styles.mobileSelectorItem)}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <Icon className="h-4 w-4 text-ritter-gold" />
                      <span className="font-medium flex-1">{tab.labelMobile}</span>
                      {activeTab === tab.id && (
                        <Check className="h-4 w-4 text-ritter-gold custom-check ml-auto" />
                      )}
                    </div>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>
      ) : (
        // Tablet/Desktop: Tab Navigation
        <Tabs value={activeTab} onValueChange={setActiveTab} className={cn(
          styles.tabsContainer
        )}>
          <TabsList className={cn(
            styles.tabsList,
            "grid w-full grid-cols-3"
          )}>
            {campaignTabs.map((tab) => {
              const Icon = tab.icon
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className={cn(
                    styles.tabsTrigger,
                    "flex items-center gap-2 relative"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>
        </Tabs>
      )}

      {/* Content - Always rendered outside tabs for mobile compatibility */}
      <div className={cn(
        styles.tabsContent,
        isSmallScreen && styles.tabsContentMobile,
        isMediumScreen && styles.tabsContentTablet
      )}>
        {activeTab === "compose" && (
          <ComposeTab 
            composer={composer}
            selectedLeads={selectedLeads}
            recipientCount={selectedLeads.length}
          />
        )}

        {activeTab === "recipients" && (
          <RecipientsTab selectedLeads={selectedLeads} />
        )}

        {activeTab === "preview" && (
          <PreviewTab 
            composer={composer}
            selectedLeads={selectedLeads}
          />
        )}
      </div>
    </div>
  )
}
