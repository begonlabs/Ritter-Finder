export interface Lead {
  id: string
  name: string
  company: string
  email: string
  position: string
  industry: string
  location?: string
  phone?: string
  website?: string
  confidence?: number
}

export interface EmailTemplate {
  subject: string
  content: string
}

export interface Campaign {
  id: string
  subject: string
  content: string
  senderName: string
  senderEmail: string
  recipients: Lead[]
  sentAt: string
  estimatedDelivery: string
  openRate?: number
  clickRate?: number
  status: 'draft' | 'sending' | 'sent' | 'failed'
}

export interface EmailComposerState {
  subject: string
  content: string
  senderName: string
  senderEmail: string
  previewLead: Lead | null
  isLoading: boolean
  emailSent: boolean
}

export interface EmailComposerActions {
  setSubject: (subject: string) => void
  setContent: (content: string) => void
  setSenderName: (name: string) => void
  setSenderEmail: (email: string) => void
  setPreviewLead: (lead: Lead | null) => void
  loadTemplate: (template?: EmailTemplate) => void
  sendCampaign: (leads: Lead[]) => Promise<void>
  resetComposer: () => void
}

export interface CampaignHistory {
  campaigns: Campaign[]
  filteredCampaigns: Campaign[]
  searchTerm: string
}

export interface CampaignHistoryActions {
  setSearchTerm: (term: string) => void
  onViewCampaign: (campaignId: string) => void
  onDuplicateCampaign: (campaignId: string) => void
  filterCampaigns: (term: string) => void
}

export type Language = 'en' | 'es' | 'de'

export interface TemplateData {
  [key: string]: EmailTemplate
}

// Para integración con dashboard
export interface CampaignTabProps {
  selectedLeads: Lead[]
  onSendCampaign: (campaignData: Campaign) => void
  emailSent: boolean
}
