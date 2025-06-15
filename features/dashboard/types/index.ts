export type TabType = "dashboard" | "search" | "results" | "campaign" | "history" | "scraping" | "analytics" | "admin"

export interface DashboardState {
  selectedWebsites: string[]
  selectedClientTypes: string[]
  selectedLocations: string[]
  requireWebsite: boolean
  validateEmail: boolean
  validateWebsite: boolean
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
}

export interface Lead {
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
  setValidateEmail: (validate: boolean) => void
  setValidateWebsite: (validate: boolean) => void
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
