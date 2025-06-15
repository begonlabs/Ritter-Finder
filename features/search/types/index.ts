export interface SearchConfig {
  selectedWebsites: string[]
  selectedClientTypes: string[]
  selectedLocations: string[]
  requireWebsite: boolean
  validateEmail: boolean
  validateWebsite: boolean
}

export interface SearchState extends SearchConfig {
  isSearching: boolean
  searchComplete: boolean
  searchProgress: number
  currentStep: string
}

export interface SearchActions {
  setSelectedWebsites: (websites: string[]) => void
  setSelectedClientTypes: (clientTypes: string[]) => void
  setSelectedLocations: (locations: string[]) => void
  setRequireWebsite: (require: boolean) => void
  setValidateEmail: (validate: boolean) => void
  setValidateWebsite: (validate: boolean) => void
  handleSearch: () => void
  resetSearch: () => void
  rerunSearch: (config: SearchConfig) => void
}

export interface SearchResults {
  leads: Lead[]
  totalFound: number
  searchTime: number
  searchId: string
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
  // Validation status fields
  hasWebsite: boolean
  websiteExists: boolean
  emailValidated: boolean
}

export interface ScrapingStep {
  id: string
  website: string
  status: 'pending' | 'processing' | 'completed' | 'error'
  progress: number
  leadsFound: number
  estimatedTime: number
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

export interface ClientType {
  id: string
  name: string
  description: string
  icon: string
  enabled: boolean
}

export interface Website {
  id: string
  name: string
  url: string
  category: string
  enabled: boolean
  scrapeTime: number
  maxLeads: number
}

export interface Location {
  id: string
  name: string
  region: string
  country: string
  enabled: boolean
}

export interface ValidationOptions {
  requireWebsite: boolean
  validateEmail: boolean
  validateWebsite: boolean
}
