export interface Lead {
  id: string
  name: string
  email: string
  company: string
  position: string
  industry: string
  phone?: string
  linkedin?: string
  website?: string
  notes?: string
  tags?: string[]
  score?: number
  lastContact?: Date
  status?: 'new' | 'contacted' | 'qualified' | 'converted'
}

export interface EmailTemplate {
  id: string
  name: string
  description: string
  subject: string
  htmlContent: string
  plainTextContent?: string
  thumbnailUrl?: string
  category: 'marketing' | 'sales' | 'follow-up' | 'welcome' | 'custom'
  isActive: boolean
  variables: TemplateVariable[]
  createdBy: string
  createdAt: Date
  updatedAt: Date
  usageCount: number
}

export interface TemplateVariable {
  key: string
  label: string
  description: string
  defaultValue?: string
  required: boolean
  type: 'text' | 'email' | 'url' | 'date' | 'number'
}

export interface Campaign {
  id: string
  subject: string
  content: string
  htmlContent?: string
  templateId?: string
  recipients: Lead[]
  senderName: string
  senderEmail: string
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused'
  sentAt: Date
  openRate?: number
  clickRate?: number
  bounceRate?: number
  unsubscribeRate?: number
  scheduledAt?: Date
  tags?: string[]
}

export interface EmailComposerState {
  subject: string
  content: string
  htmlContent?: string
  selectedTemplate?: EmailTemplate
  isHtmlMode: boolean
  senderName: string
  senderEmail: string
  isLoading: boolean
  emailSent: boolean
  previewLead?: Lead
  templateVariables: Record<string, string>
}

export interface EmailComposerActions {
  setSubject: (subject: string) => void
  setContent: (content: string) => void
  setHtmlContent: (htmlContent: string) => void
  setSenderName: (name: string) => void
  setSenderEmail: (email: string) => void
  setPreviewLead: (lead: Lead) => void
  setSelectedTemplate: (template: EmailTemplate | null) => void
  setIsHtmlMode: (isHtml: boolean) => void
  setTemplateVariable: (key: string, value: string) => void
  sendCampaign: (leads: Lead[]) => Promise<void>
  loadTemplate: (templateId?: string) => Promise<void>
  personalizeEmail: (content: string, lead: Lead) => string
  renderHtmlContent: (lead: Lead) => string
}

export interface CampaignHistory {
  campaigns: Campaign[]
  searchTerm: string
  isLoading: boolean
}

export interface CampaignHistoryActions {
  setSearchTerm: (term: string) => void
  onViewCampaign: (campaignId: string) => void
  onDuplicateCampaign: (campaignId: string) => void
  filteredCampaigns: Campaign[]
}

export type Language = 'es' | 'en'

export interface TemplateData {
  contactName: string
  companyName: string
  senderName: string
  senderEmail: string
  customFields?: Record<string, string>
}

export interface CampaignTabProps {
  selectedLeads: Lead[]
  onSendCampaign: (campaignData: Campaign) => void
  emailSent?: boolean
}

export interface TemplateFilters {
  category: string
  isActive: boolean | null
  searchTerm: string
}

export interface UseTemplatesReturn {
  templates: EmailTemplate[]
  filteredTemplates: EmailTemplate[]
  isLoading: boolean
  error: string | null
  filters: TemplateFilters
  setFilters: (filters: Partial<TemplateFilters>) => void
  createTemplate: (template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>) => Promise<void>
  updateTemplate: (id: string, updates: Partial<EmailTemplate>) => Promise<void>
  deleteTemplate: (id: string) => Promise<void>
  duplicateTemplate: (id: string) => Promise<void>
  refreshTemplates: () => Promise<void>
}
