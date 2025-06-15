export interface SearchConfig {
  selectedWebsites: string[]
  selectedClientType: string
}

export interface SearchState extends SearchConfig {
  isSearching: boolean
  searchComplete: boolean
  searchProgress: number
  currentStep: string
}

export interface SearchActions {
  setSelectedWebsites: (websites: string[]) => void
  setSelectedClientType: (clientType: string) => void
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
  clientType: string
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
