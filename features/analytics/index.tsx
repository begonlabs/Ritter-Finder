// Analytics Feature Exports
// Modular analytics components for RitterFinder

// Pages
export { AnalyticsPage } from "./pages/AnalyticsPage"

// Components
export { DashboardStats } from "./components/DashboardStats"
export { LeadStats } from "./components/LeadStats"

// Hooks
export { useDashboardStats } from "./hooks/useDashboardStats"
export { useLeadStats } from "./hooks/useLeadStats"

// Utils
export {
  // Trend calculations
  calculateTrend,
  calculatePercentageChange,
  calculateGrowthRate,
  
  // Dashboard overview metrics
  calculateLeadGenEfficiency,
  calculateCampaignEffectiveness,
  getLeadQualityCategory,
  calculateUserEngagement,
  
  // Performance metrics
  calculateSuccessRate,
  calculateCostPerLead,
  calculateROI,
  
  // Time utilities
  getDateRange,
  formatAnalyticsDate,
  formatRelativeTime,
  
  // Formatting utilities
  formatAnalyticsCurrency,
  formatAnalyticsNumber,
  formatPercentage,
  formatDuration,
  
  // Data validation
  validateDashboardOverviewData,
  normalizeDashboardOverviewData
} from "./utils/analyticsUtils"

// Export utilities
export {
  exportAnalyticsAsPDF,
  exportAnalyticsAsCSV
} from "./utils/exportUtils"

// Styles
export { default as AnalyticsPageStyles } from "./styles/AnalyticsPage.module.css"
export { default as DashboardStatsStyles } from "./styles/DashboardStats.module.css"
export { default as LeadStatsStyles } from "./styles/LeadStats.module.css"

// Types
export type {
  StatsCard,
  DashboardStats as DashboardStatsType,
  TrendData,
  AnalyticsOverview,
  MonthlyTrend,
  KeyMetric,
  ChartDataPoint,
  PerformanceMetrics,
  AnalyticsFilters,
  AnalyticsActions,
  AnalyticsState,
  AnalyticsTabProps,
  DashboardOverviewRecord,
  DashboardSummaryRecord,
  DailyDashboardStatsRecord,
  RecentActivityFeedRecord,
  LeadCategoryStats,
  LeadCountryStats,
  LeadStateStats,
  LeadSpainRegionStats,
  LeadStatsProps
} from "./types"
