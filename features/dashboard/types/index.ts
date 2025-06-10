export type TabType = "dashboard" | "search" | "results" | "campaign" | "history" | "scraping" | "analytics"

export interface DashboardState {
  selectedWebsites: string[]
  selectedClientType: string
  isSearching: boolean
  searchComplete: boolean
  leads: Lead[]
  selectedLeads: string[]
  activeTab: TabType
  emailSent: boolean
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

export interface SearchConfig {
  websites: string[]
  clientType: string
}

export interface SearchHistoryItem {
  id: string
  date: string
  websites: string[]
  clientType: string
  leadsFound: number
  leadsContacted: number
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
  setSelectedClientType: (clientType: string) => void
  setActiveTab: (tab: TabType) => void
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
