// Pages
export { DashboardPage } from "./pages/DashboardPage"

// Main components
export { DashboardOverview } from "./components/DashboardOverview"
export { SearchTab } from "./components/SearchTab"
export { ResultsTab } from "./components/ResultsTab"
export { CampaignTab } from "./components/CampaignTab"
export { HistoryTab } from "./components/HistoryTab"
export { ScrapingTab } from "./components/ScrapingTab"
export { AnalyticsTab } from "./components/AnalyticsTab"

// Hooks
export { useDashboard } from "./hooks/useDashboard"
export { useLeadsSearch } from "./hooks/useLeadsSearch"
export { useSupabaseTest } from "./hooks/useSupabaseTest"

// Styles
export { default as dashboardPageStyles } from './styles/DashboardPage.module.css'
export { default as dashboardOverviewStyles } from './styles/DashboardOverview.module.css'
export { default as searchTabStyles } from './styles/SearchTab.module.css'
export { default as resultsTabStyles } from './styles/ResultsTab.module.css'
export { default as campaignTabStyles } from './styles/CampaignTab.module.css'
export { default as historyTabStyles } from './styles/HistoryTab.module.css'
export { default as scrapingTabStyles } from './styles/ScrapingTab.module.css'
export { default as analyticsTabStyles } from './styles/AnalyticsTab.module.css'

// Types
export type {
  TabType,
  DashboardState,
  DashboardActions,
  DashboardProps,
  TabComponentProps,
  Lead,
  SearchConfig,
  SearchHistoryItem,
  EmailCampaign,
  CampaignData,
} from "./types"
