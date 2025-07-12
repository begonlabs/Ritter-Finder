// Analytics Feature Exports
// Modular analytics components for RitterFinder with geographic analysis

// Pages
export { AnalyticsPage } from "./pages/AnalyticsPage"
export { AnalyticsChartsPage } from "./pages/AnalyticsChartsPage"

// Components
export { DashboardStats } from "./components/DashboardStats"
export { LeadStats } from "./components/LeadStats"
export { 
  BarChart, 
  PieChart as PieChartComponent, 
  DoughnutChart, 
  QualityScoreChart 
} from "./components/ChartComponents"

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
export { default as AnalyticsChartsPageStyles } from "./styles/AnalyticsChartsPage.module.css"
export { default as DashboardStatsStyles } from "./styles/DashboardStats.module.css"
export { default as LeadStatsStyles } from "./styles/LeadStats.module.css"
export { default as ChartComponentsStyles } from "./styles/ChartComponents.module.css"

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

// Geographic Analysis Types
export type ViewType = 'category' | 'country' | 'state' | 'spain-region'
export type ChartType = 'bar' | 'pie' | 'doughnut'
