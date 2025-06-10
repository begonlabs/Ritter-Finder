export interface SearchHistoryItem {
  id: string
  date: string
  websites: string[]
  clientType: string
  leadsFound: number
  leadsContacted: number
  searchTime: number
  status: 'completed' | 'failed' | 'cancelled'
  query?: string
  filters?: SearchFilters
}

export interface SearchFilters {
  industry?: string[]
  location?: string[]
  companySize?: string[]
  confidence?: number
}

export interface CampaignHistoryItem {
  id: string
  subject: string
  content: string
  senderName: string
  senderEmail: string
  recipients: number
  sentAt: string
  openRate: number
  clickRate: number
  responseRate: number
  status: 'draft' | 'sent' | 'scheduled' | 'failed'
  template?: string
  metadata?: CampaignMetadata
}

export interface CampaignMetadata {
  tags?: string[]
  campaign_type?: 'promotional' | 'follow_up' | 'newsletter'
  target_segment?: string
  ab_test?: boolean
}

export interface ActivityItem {
  id: string
  type: 'search' | 'campaign' | 'export' | 'import' | 'lead_update'
  title: string
  description: string
  timestamp: string
  userId: string
  metadata: ActivityMetadata
  status: 'success' | 'error' | 'pending'
}

export interface ActivityMetadata {
  searchId?: string
  campaignId?: string
  leadsCount?: number
  exportFormat?: 'csv' | 'pdf' | 'xlsx'
  duration?: number
  errorMessage?: string
  [key: string]: any
}

export interface HistoryFilters {
  dateRange: {
    start: Date
    end: Date
  }
  types: string[]
  status: string[]
  searchTerm: string
}

export interface HistoryStats {
  totalSearches: number
  totalCampaigns: number
  totalLeadsFound: number
  totalLeadsContacted: number
  averageSearchTime: number
  averageOpenRate: number
  successRate: number
  lastActivity: string
}

export interface HistoryState {
  searchHistory: SearchHistoryItem[]
  campaignHistory: CampaignHistoryItem[]
  activityTimeline: ActivityItem[]
  filters: HistoryFilters
  stats: HistoryStats | null
  isLoading: boolean
  error: string | null
  currentPage: number
  totalPages: number
  pageSize: number
}

export interface HistoryActions {
  loadSearchHistory: (filters?: Partial<HistoryFilters>) => Promise<void>
  loadCampaignHistory: (filters?: Partial<HistoryFilters>) => Promise<void>
  loadActivityTimeline: (filters?: Partial<HistoryFilters>) => Promise<void>
  updateFilters: (filters: Partial<HistoryFilters>) => void
  deleteSearchRecord: (id: string) => Promise<void>
  deleteCampaignRecord: (id: string) => Promise<void>
  rerunSearch: (searchData: SearchHistoryItem) => Promise<void>
  duplicateCampaign: (campaignData: CampaignHistoryItem) => Promise<void>
  exportHistory: (type: 'search' | 'campaign' | 'activity', format: 'csv' | 'pdf') => Promise<void>
  refreshStats: () => Promise<void>
  setPage: (page: number) => void
  clearHistory: (type: 'search' | 'campaign' | 'all') => Promise<void>
}

export interface HistoryPageProps {
  showSearchHistory?: boolean
  showCampaignHistory?: boolean
  showActivityTimeline?: boolean
  compactMode?: boolean
  maxItems?: number
}

export interface SearchHistoryProps {
  history: SearchHistoryItem[]
  onRerunSearch: (searchData: SearchHistoryItem) => void
  onViewLeads: (searchId: string) => void
  onDeleteSearch?: (searchId: string) => void
  searchTerm?: string
  onSearchTermChange?: (term: string) => void
  isLoading?: boolean
  showActions?: boolean
  compact?: boolean
}

export interface CampaignHistoryProps {
  campaigns: CampaignHistoryItem[]
  onViewCampaign: (campaignId: string) => void
  onDuplicateCampaign: (campaignId: string) => void
  onDeleteCampaign?: (campaignId: string) => void
  searchTerm?: string
  onSearchTermChange?: (term: string) => void
  isLoading?: boolean
  showActions?: boolean
  compact?: boolean
}

export interface ActivityTimelineProps {
  activities: ActivityItem[]
  onViewDetails: (activityId: string) => void
  maxItems?: number
  showFilters?: boolean
  compact?: boolean
  groupByDate?: boolean
}

// Para integración con otros features
export interface HistoryIntegration {
  onNavigateToSearch?: () => void
  onNavigateToCampaigns?: () => void
  onNavigateToResults?: () => void
  selectedLeads?: string[]
}
