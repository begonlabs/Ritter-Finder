// Analytics Feature Exports
// Modular analytics components for RitterFinder

// Pages
export { AnalyticsPage } from "./pages/AnalyticsPage"

// Components
export { DashboardStats } from "./components/DashboardStats"
export { ScrapingStats } from "./components/ScrapingStats"
export { TrendChart } from "./components/TrendChart"
export { RecentActivity } from "./components/RecentActivity"

// Hooks
export { useDashboardStats } from "./hooks/useDashboardStats"
export { useScrapingStats, formatCurrency } from "./hooks/useScrapingStats"

// Styles
export { default as AnalyticsPageStyles } from "./styles/AnalyticsPage.module.css"
export { default as DashboardStatsStyles } from "./styles/DashboardStats.module.css"
export { default as TrendChartStyles } from "./styles/TrendChart.module.css"
export { default as RecentActivityStyles } from "./styles/RecentActivity.module.css"
export { default as ScrapingStatsStyles } from "./styles/ScrapingStats.module.css"

// Types
export type {
  StatsCard,
  DashboardStats as DashboardStatsType,
  TrendData,
  ScrapingStats as ScrapingStatsType,
  DailyScrapingStats,
  SourceStats,
  AnalyticsOverview,
  MonthlyTrend,
  ActivityItem,
  KeyMetric,
  ChartDataPoint,
  PerformanceMetrics,
  AnalyticsFilters,
  AnalyticsActions,
  AnalyticsState,
  AnalyticsTabProps
} from "./types"
