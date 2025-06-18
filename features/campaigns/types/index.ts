export interface Lead {
  id: string
  
  // Contact Information (simplified)
  email?: string
  verified_email?: boolean
  phone?: string
  verified_phone?: boolean
  
  // Company Information (aligned with database)
  company_name: string // Renamed from 'company' to match DB
  company_website?: string // Renamed from 'website' to match DB
  verified_website?: boolean
  
  // Location Information (simplified - NO postal_code)
  address?: string
  state?: string
  country?: string
  
  // New Fields (from simplified schema)
  activity: string // Required in DB
  description?: string
  category?: string
  
  // Data Quality Score (1-5, NOT for use in email campaigns - only for filtering)
  data_quality_score?: number // 1-5 based on verification flags
  
  // System Fields
  created_at?: Date
  updated_at?: Date
  last_contacted_at?: Date
  
  // Legacy fields for campaign compatibility (computed fields)
  name?: string // Computed from company_name
  company?: string // Alias for company_name
  website?: string // Alias for company_website
  position?: string // Computed from activity
  industry?: string // Computed from category
  location?: string // Computed from address/state
  emailValidated?: boolean // Computed from verified_email
  phoneValidated?: boolean // Computed from verified_phone
  websiteExists?: boolean // Computed from verified_website
  
  // Campaign specific fields
  tags?: string[]
  score?: number
  lastContact?: Date
  status?: 'new' | 'contacted' | 'qualified' | 'converted'
}

// Simplified NormalizedLead interface to match database
export interface NormalizedLead {
  id: string
  
  // Contact Information
  email?: string
  verified_email: boolean
  phone?: string
  verified_phone: boolean
  
  // Company Information
  company_name: string
  company_website?: string
  verified_website: boolean
  
  // Location Information (NO postal_code)
  address?: string
  state?: string
  country?: string
  
  // New Fields
  activity: string
  description?: string
  category?: string
  
  // Data Quality Score (1-5, calculated from verification flags)
  data_quality_score: number // 1-5 based on verifications
  
  // System Fields
  created_at: string
  updated_at: string
  last_contacted_at?: string
}

// Funciones de adaptación
export interface LeadAdapter {
  fromNormalized: (normalized: NormalizedLead) => Lead
  toNormalized: (lead: Lead) => Partial<NormalizedLead>
  inferPosition: (legalForm?: string, industry?: string) => string
  createCompanyName: (name: string, legalForm?: string) => string
  formatNotes: (normalized: NormalizedLead) => string
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

// Variables que se cargan automáticamente desde la base de datos (simplified schema)
// NOTA: data_quality_score NO se incluye porque no debe usarse en campañas de email
export const AUTO_VARIABLES = [
  'lead_id', 'email', 'phone', 'company_name', 'company_website',
  'address', 'state', 'country', 'activity', 'description', 'category',
  'verified_email', 'verified_phone', 'verified_website',
  'created_at', 'updated_at',
  // Legacy computed fields for template compatibility
  'contact_name', 'contact_email', 'contact_phone', 'name', 'company', 'website',
  'position', 'industry', 'location', 'emailValidated', 'phoneValidated', 'websiteExists'
];

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
