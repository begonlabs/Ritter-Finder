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
  totalUsers: number
  averageLeadQuality: number
}

export interface TrendData {
  value: number
  percentage: number
  positive: boolean
  label: string
}

export interface AnalyticsOverview {
  totalLeads: number
  totalCampaigns: number
  totalSearches: number
  totalUsers: number
  averageLeadQuality: number
  monthlyTrends: MonthlyTrend[]
  keyMetrics: KeyMetric[]
}

export interface MonthlyTrend {
  month: string
  leadsFound: number
  leadsContacted: number
  campaigns: number
  searches: number
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

// Database record interfaces (matching dashboard.sql schema)
export interface DashboardOverviewRecord {
  section: string
  total_leads: number
  total_campaigns: number
  total_searches: number
  total_users: number
  avg_lead_quality: number
}

export interface DashboardSummaryRecord {
  total_leads: number
  total_campaigns: number
  total_searches: number
  active_users: number
  avg_lead_quality: number
  leads_growth_rate: number
  campaigns_growth_rate: number
  searches_growth_rate: number
}

export interface DailyDashboardStatsRecord {
  stats_date: string
  total_leads: number
  total_campaigns: number
  total_searches: number
  active_users: number
  avg_lead_quality: number
}

export interface RecentActivityFeedRecord {
  id: string
  user_id: string
  user_name: string
  activity_type: string
  action: string
  description: string
  resource_type: string
  resource_id: string
  timestamp: string
  ip_address: string
}

// Data adapter function types
export type DashboardOverviewAdapter = (record: DashboardOverviewRecord) => DashboardStats
export type DashboardSummaryAdapter = (record: DashboardSummaryRecord) => DashboardStats

// Lead Statistics Types (replacing TrendChart)
export interface LeadCategoryStats {
  category: string
  total_leads: number
  verified_emails: number
  verified_phones: number
  verified_websites: number
  avg_quality_score: number
  latest_lead_date: string
}

export interface LeadCountryStats {
  country: string
  total_leads: number
  avg_quality_score: number
  high_quality_leads: number
  high_quality_percentage: number
  verified_emails: number
  verified_phones: number
  email_verification_rate: number
  phone_verification_rate: number
  top_categories: string
  first_lead_date: string
  latest_lead_date: string
}

export interface LeadStateStats {
  country: string
  state: string
  total_leads: number
  avg_quality_score: number
  high_quality_leads: number
  high_quality_percentage: number
  verified_emails: number
  verified_phones: number
  leads_with_phone: number
  leads_with_email: number
  contactable_percentage: number
  top_activities: string
  leads_last_30_days: number
}

export interface LeadSpainRegionStats {
  comunidad_autonoma: string
  total_leads: number
  calidad_promedio: number
  leads_alta_calidad: number
  telefonos_verificados: number
  emails_verificados: number
  con_website: number
  contactabilidad_porcentaje: number
  categoria_principal: string
  primer_lead: string
  ultimo_lead: string
}

export interface LeadStatsProps {
  showHeader?: boolean
  compact?: boolean
  viewType?: 'category' | 'country' | 'state' | 'spain-region'
  maxItems?: number
}
