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
  // Nuevos campos para datos normalizados
  location?: string
  confidence?: number
  source?: 'paginas_amarillas' | 'axesor' | 'manual'
  sourceUrl?: string
  hasWebsite?: boolean
  websiteExists?: boolean
  emailValidated?: boolean
  phoneValidated?: boolean
  employees?: string
  revenue?: string
  cif?: string
  legalForm?: string
  cnaeCode?: string
}

// Interfaz para los datos normalizados de la API
export interface NormalizedLead {
  id: string
  name: string
  description?: string
  address: string
  phone?: string
  website?: string
  cif_nif?: string
  legal_form?: string
  constitution_date?: string
  business_object?: string
  cnae_code?: string
  sic_code?: string
  industry: string
  activities?: string
  source_url: string
  source_type: 'paginas_amarillas' | 'axesor'
  confidence_score: number
  location_normalized: string
  city: string
  province: string
  postal_code?: string
  email_found?: string
  email_validated: boolean
  website_validated: boolean
  phone_validated: boolean
  estimated_employees: string
  estimated_revenue: string
  scraped_at: string
  processed_at?: string
  last_updated: string
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

// Variables que se cargan automáticamente desde la base de datos
export const AUTO_VARIABLES = [
  'contact_name', 'company_name', 'contact_email', 'contact_phone',
  'first_name', 'last_name', 'full_name', 'lead_id', 'position', 'industry',
  'location', 'confidence_score', 'source_type', 'website', 'cif_nif',
  'legal_form', 'cnae_code', 'employees', 'revenue'
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
