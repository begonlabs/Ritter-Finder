// ===================================
// DATABASE TYPES (from Supabase schema)
// ===================================

// Activity logs table type
export interface ActivityLogRecord {
  id: string
  user_id: string
  activity_type: 'search' | 'campaign' | 'export' | 'import' | 'lead_update' | 'system' | 'user_action'
  action: string
  description: string
  resource_type: string
  resource_id: string
  timestamp: string
  ip_address?: string
  user_agent?: string
  before_data?: any
  after_data?: any
  changes?: any
}

// Search history table type
export interface SearchHistoryRecord {
  id: string
  user_id: string
  query_name?: string
  search_parameters: any
  filters_applied?: any
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'
  total_results: number
  valid_results: number
  duplicate_results: number
  execution_time_ms: number
  pages_scraped: number
  websites_searched: number
  started_at: string
  completed_at?: string
  error_message?: string
  search_config_id?: string
}

// Campaign table type
export interface CampaignRecord {
  id: string
  name: string
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'completed' | 'failed' | 'cancelled'
  created_by: string
  template_id?: string
  total_recipients: number
  emails_sent: number
  emails_delivered: number
  emails_opened: number
  emails_clicked: number
  open_rate: number
  click_rate: number
  created_at: string
  started_at?: string
  completed_at?: string
  subject?: string
  content?: string
}

// Campaign recipients table type
export interface CampaignRecipientRecord {
  id: string
  campaign_id: string
  email_address: string
  full_name?: string
  company_name?: string
  status: 'pending' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'failed'
  sent_at?: string
  delivered_at?: string
  opened_at?: string
  clicked_at?: string
  error_message?: string
  retry_count: number
}

// ===================================
// FRONTEND TYPES (for components)
// ===================================

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

// ===================================
// ENHANCED VIEW TYPES (from database views)
// ===================================

export interface ComprehensiveActivityHistoryView {
  id: string
  user_id: string
  user_name?: string
  user_email?: string
  activity_type: string
  action: string
  description: string
  resource_type: string
  resource_id: string
  timestamp: string
  ip_address?: string
  user_agent?: string
  before_data?: any
  after_data?: any
  changes?: any
}

export interface CampaignHistoryView {
  campaign_id: string
  campaign_name: string
  status: string
  created_at: string
  started_at?: string
  completed_at?: string
  total_recipients: number
  emails_sent: number
  emails_delivered: number
  emails_opened: number
  emails_clicked: number
  open_rate: number
  click_rate: number
  created_by_name?: string
  template_name?: string
  status_type: 'success' | 'error' | 'warning' | 'info'
}

export interface SearchHistoryDetailedView {
  id: string
  user_id: string
  user_name?: string
  query_name?: string
  search_parameters: any
  filters_applied?: any
  status: string
  total_results: number
  valid_results: number
  duplicate_results: number
  execution_time_ms: number
  pages_scraped: number
  websites_searched: number
  started_at: string
  completed_at?: string
  error_message?: string
  config_name?: string
  status_type: 'success' | 'error' | 'warning' | 'info'
  duration_seconds?: number
}

// ===================================
// ADAPTER FUNCTIONS TYPES
// ===================================

export interface HistoryDataAdapters {
  adaptActivityLog: (record: ActivityLogRecord) => ActivityItem
  adaptCampaignRecord: (record: CampaignRecord) => CampaignHistoryItem
  adaptSearchRecord: (record: SearchHistoryRecord) => SearchHistoryItem
  adaptActivityView: (view: ComprehensiveActivityHistoryView) => ActivityItem
  adaptCampaignView: (view: CampaignHistoryView) => CampaignHistoryItem
  adaptSearchView: (view: SearchHistoryDetailedView) => SearchHistoryItem
}

// ===================================
// LEGACY TYPES (maintained for compatibility)
// ===================================

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
