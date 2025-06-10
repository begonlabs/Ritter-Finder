// Analytics Feature Exports
// Modular analytics components for RitterFinder

// Components
export { DashboardStats } from "./components/DashboardStats"
export { ScrapingStats } from "./components/ScrapingStats"
export { TrendChart } from "./components/TrendChart"
export { RecentActivity } from "./components/RecentActivity"
export { AnalyticsPage } from "./components/AnalyticsPage"

// Hooks
export { useDashboardStats } from "./hooks/useDashboardStats"
export { useScrapingStats, formatCurrency } from "./hooks/useScrapingStats"

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
