// Main components
export { DashboardPage } from "./components/DashboardPage"
export { DashboardOverview } from "./components/DashboardOverview"
export { SearchTab } from "./components/SearchTab"
export { ResultsTab } from "./components/ResultsTab"
export { CampaignTab } from "./components/CampaignTab"
export { HistoryTab } from "./components/HistoryTab"
export { ScrapingTab } from "./components/ScrapingTab"

// Hooks
export { useDashboard } from "./hooks/useDashboard"

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
