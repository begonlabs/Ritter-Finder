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
  type: 'search' | 'campaign' | 'export' | 'user_action' | 'system'
  title: string
  description: string
  date: string
  metadata: {
    leadsFound?: number
    clientType?: string
    recipients?: number
    subject?: string
    resourceType?: string
    resourceId?: string
    executionTimeMs?: number
    responseStatus?: number
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

// Database-aligned interfaces
export interface DashboardMetrics {
  id: string
  date: string
  periodType: 'daily' | 'weekly' | 'monthly' | 'yearly'
  totalLeads: number
  totalCampaigns: number
  totalSearches: number
  averageOpenRate: number
  leadsQualityScore: number
  campaignSuccessRate: number
  searchEfficiency: number
  costPerLead: number
  roiPercentage: number
  leadsTrendPercentage: number
  campaignsTrendPercentage: number
  searchesTrendPercentage: number
  openRateTrendPercentage: number
  estimatedMoneySaved: number
  costSavingsPercentage: number
  calculatedAt: string
}

export interface WebsiteSource {
  id: string
  websiteUrl: string
  websiteName: string
  domain: string
  totalLeadsFound: number
  totalSearches: number
  successRate: number
  averageLeadsPerSearch: number
  leadQualityScore: number
  validationSuccessRate: number
  averageResponseTimeMs: number
  errorRate: number
  lastSuccessfulScrape?: string
  isActive: boolean
  isBlocked: boolean
  blockedReason?: string
  blockedUntil?: string
  lastUsedAt?: string
  monthlyUsageCount: number
  totalUsageCount: number
  createdAt: string
  updatedAt: string
}

export interface AnalyticsDataPoint {
  id: string
  date: string
  metricType: string
  metricName: string
  countValue: number
  sumValue: number
  avgValue: number
  minValue: number
  maxValue: number
  userId?: string
  campaignId?: string
  searchHistoryId?: string
  dimensions: Record<string, any>
  createdAt: string
}
