export type TabType = "dashboard" | "search" | "results" | "campaign" | "history" | "analytics" | "admin"

export interface DashboardState {
  selectedWebsites: string[]
  selectedClientTypes: string[]
  selectedLocations: string[]
  requireWebsite: boolean
  requireEmail: boolean
  requirePhone: boolean
  validateEmail: boolean
  validateWebsite: boolean
  validatePhone: boolean
  isSearching: boolean
  searchComplete: boolean
  searchProgress: number
  currentStep: string
  leads: Lead[]
  selectedLeads: string[]
  activeTab: TabType
  emailSent: boolean
  searchResults: SearchResults | null
  searchHistory: SearchHistoryItem[]
  // ✅ New state for no results with criteria message
  noResultsWithCriteria: boolean
}

export interface Lead {
  id: string
  
  // Contact Information - ✅ Fixed to match database schema (nullable fields)
  email?: string | null // Can be null in database
  verified_email: boolean
  phone?: string | null // Can be null in database
  verified_phone: boolean
  
  // Company Information  
  company_name: string // Required in database - NOT NULL
  company_website?: string | null // Can be null in database
  verified_website: boolean
  
  // Location Information
  address?: string | null
  state?: string | null
  country?: string | null
  
  // New Fields from schema
  activity: string // Required in database - NOT NULL
  description?: string | null
  category?: string | null // Can be null in database
  
  // Data Quality Score (1-5 scale)
  data_quality_score: number // 1-5 calculated from verifications
  
  // Legacy fields for compatibility (can be computed from new structure)
  name?: string // Can be derived from company contact
  position?: string
  location?: string // Can be derived from address/state/country
  industry?: string // Can be derived from category
  employees?: string
  revenue?: string
  source?: string
  confidence?: number // Can be derived from data_quality_score
  lastActivity?: string
  notes?: string
  
  // Computed flags
  hasWebsite?: boolean // Can be derived from company_website existence
  websiteExists?: boolean // Can be derived from verified_website
  emailValidated?: boolean // Can be derived from verified_email
  
  // System fields
  created_at?: string
  updated_at?: string
  last_contacted_at?: string
}

export interface SearchConfig {
  websites: string[]
  clientType: string
}

export interface SearchHistoryItem {
  id: string
  date: string
  websites: string[]
  clientTypes: string[]
  locations: string[]
  requireWebsite: boolean
  validateEmail: boolean
  validateWebsite: boolean
  leadsFound: number
  leadsContacted: number
  searchTime: number
  status: 'completed' | 'failed' | 'cancelled'
}

export interface EmailCampaign {
  id: string
  subject: string
  date: string
  recipients: number
  openRate: number
  clickRate: number
}

export interface CampaignData {
  subject: string
  content: string
  senderName: string
  senderEmail: string
  recipients: Lead[]
  sentAt: string
  estimatedDelivery: string
}

export interface DashboardActions {
  setSelectedWebsites: (websites: string[]) => void
  setSelectedClientTypes: (clientTypes: string[]) => void
  setSelectedLocations: (locations: string[]) => void
  setRequireWebsite: (require: boolean) => void
  setRequireEmail: (require: boolean) => void
  setRequirePhone: (require: boolean) => void
  setValidateEmail: (validate: boolean) => void
  setValidateWebsite: (validate: boolean) => void
  setValidatePhone: (validate: boolean) => void
  setActiveTab: (tab: TabType) => void
  setIsSearching: (searching: boolean) => void
  setSearchComplete: (complete: boolean) => void
  setSearchProgress: (progress: number) => void
  setCurrentStep: (step: string) => void
  setSearchResults: (results: SearchResults | null) => void
  addSearchToHistory: (search: SearchHistoryItem) => void
  clearSearchHistory: () => void
  resetSearch: () => void
  handleSearch: () => void
  handleSelectLead: (id: string) => void
  handleSelectAll: (select: boolean) => void
  handleSendCampaign: (campaignData: CampaignData) => void
  handleRerunSearch: (searchData: SearchHistoryItem) => void
  handleViewLeads: () => void
}

export interface DashboardProps {
  state: DashboardState
  actions: DashboardActions
}

export interface TabComponentProps {
  state: DashboardState
  actions: DashboardActions
}

export interface SearchResults {
  leads: Lead[]
  totalFound: number
  searchTime: number
  searchId: string
}

// Helper type for backward compatibility - maps new Lead structure to old format
export interface LegacyLead {
  id: string
  name: string
  company: string
  email: string
  website: string
  phone: string
  position: string
  location: string
  industry: string
  employees: string
  revenue: string
  source: string
  confidence: number
  lastActivity: string
  notes: string
  hasWebsite: boolean
  websiteExists: boolean
  emailValidated: boolean
}

// Utility functions for Lead transformation - ✅ Fixed null handling
export const leadToLegacyFormat = (lead: Lead): LegacyLead => ({
  id: lead.id,
  name: lead.name || `Contact at ${lead.company_name}`,
  company: lead.company_name,
  email: lead.email || '', // Handle null/undefined
  website: lead.company_website || '', // Handle null/undefined
  phone: lead.phone || '', // Handle null/undefined
  position: lead.position || 'Contact',
  location: lead.location || `${lead.state || ''}, ${lead.country || ''}`.trim(),
  industry: lead.industry || lead.category || '', // Handle null/undefined
  employees: lead.employees || 'Unknown',
  revenue: lead.revenue || 'Unknown',
  source: lead.source || 'RitterFinder Search',
  confidence: lead.confidence || (lead.data_quality_score * 20), // Convert 1-5 to 0-100 scale
  lastActivity: lead.lastActivity || lead.updated_at || '',
  notes: lead.notes || lead.description || '',
  hasWebsite: Boolean(lead.company_website),
  websiteExists: lead.verified_website,
  emailValidated: lead.verified_email
})

export const legacyToLeadFormat = (legacy: LegacyLead): Lead => ({
  id: legacy.id,
  email: legacy.email || null, // Handle empty strings as null
  verified_email: legacy.emailValidated,
  phone: legacy.phone || null, // Handle empty strings as null
  verified_phone: Boolean(legacy.phone),
  company_name: legacy.company,
  company_website: legacy.website || null, // Handle empty strings as null
  verified_website: legacy.websiteExists,
  address: null,
  state: legacy.location.split(',')[1]?.trim() || null,
  country: legacy.location.split(',')[0]?.trim() || null,
  activity: legacy.industry,
  description: legacy.notes || null,
  category: legacy.industry || null,
  data_quality_score: Math.ceil((legacy.confidence || 0) / 20), // Convert 0-100 to 1-5 scale
  
  // Legacy compatibility fields
  name: legacy.name,
  position: legacy.position,
  location: legacy.location,
  industry: legacy.industry,
  employees: legacy.employees,
  revenue: legacy.revenue,
  source: legacy.source,
  confidence: legacy.confidence,
  lastActivity: legacy.lastActivity,
  notes: legacy.notes,
  hasWebsite: legacy.hasWebsite,
  websiteExists: legacy.websiteExists,
  emailValidated: legacy.emailValidated
})
