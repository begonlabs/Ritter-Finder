export interface StatsCard {
  title: string
  value: string | number
  description: string
  icon: string
  trend?: {
    value: string
    label: string
    positive: boolean
  }
  color?: string
}

export interface DashboardStats {
  totalLeads: number
  totalCampaigns: number
  totalSearches: number
  averageOpenRate: number
  trendsFromLastMonth: {
    leads: TrendData
    campaigns: TrendData
    searches: TrendData
    openRate: TrendData
  }
}

export interface TrendData {
  value: number
  percentage: number
  positive: boolean
  label: string
}

export interface ScrapingStats {
  sitesReviewed: number
  leadsObtained: number
  moneySaved: number
  avgLeadsPerSite: number
  successRate: number
  lastUpdate: string
  dailyStats: DailyScrapingStats[]
  topSources: SourceStats[]
}

export interface DailyScrapingStats {
  date: string
  sites: number
  leads: number
  savings: number
}

export interface SourceStats {
  website: string
  leads: number
  percentage: number
}

export interface AnalyticsOverview {
  totalLeads: number
  totalCampaigns: number
  totalSearches: number
  averageOpenRate: number
  monthlyTrends: MonthlyTrend[]
  recentActivity: ActivityItem[]
  keyMetrics: KeyMetric[]
}

export interface MonthlyTrend {
  month: string
  leadsFound: number
  leadsContacted: number
  campaigns: number
  searches: number
}

export interface ActivityItem {
  id: string
  type: 'search' | 'campaign' | 'export'
  title: string
  description: string
  date: string
  metadata: {
    leadsFound?: number
    clientType?: string
    recipients?: number
    subject?: string
  }
}

export interface KeyMetric {
  label: string
  value: string | number
  change: number
  positive: boolean
  icon: string
  color: string
}

export interface ChartDataPoint {
  name: string
  value: number
  percentage?: number
  color?: string
}

export interface PerformanceMetrics {
  searchEfficiency: number
  campaignEffectiveness: number
  leadQuality: number
  costPerLead: number
  roi: number
}

export interface AnalyticsFilters {
  dateRange: {
    start: Date
    end: Date
  }
  metrics: string[]
  comparison: 'previous_period' | 'previous_year' | 'none'
}

export interface AnalyticsActions {
  refreshStats: () => Promise<void>
  exportData: (format: 'csv' | 'pdf') => Promise<void>
  updateFilters: (filters: Partial<AnalyticsFilters>) => void
  generateReport: () => Promise<void>
}

export interface AnalyticsState {
  dashboardStats: DashboardStats | null
  scrapingStats: ScrapingStats | null
  analyticsOverview: AnalyticsOverview | null
  performanceMetrics: PerformanceMetrics | null
  isLoading: boolean
  error: string | null
  lastUpdated: Date | null
  filters: AnalyticsFilters
}

// Para integración con dashboard
export interface AnalyticsTabProps {
  showDetailed?: boolean
  period?: 'week' | 'month' | 'quarter' | 'year'
}
