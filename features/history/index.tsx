// Types
export type * from "./types"

// Hooks
export { useSearchHistory } from "./hooks/useSearchHistory"
export { useCampaignHistory } from "./hooks/useCampaignHistory"
export { useActivityTimeline } from "./hooks/useActivityTimeline"

// Pages
export { HistoryPage } from "./pages/HistoryPage"

// Components
export { SearchHistory } from "./components/SearchHistory"
export { CampaignHistory } from "./components/CampaignHistory"
export { ActivityTimeline } from "./components/ActivityTimeline"

// Styles
export { default as HistoryPageStyles } from "./styles/HistoryPage.module.css"
export { default as SearchHistoryStyles } from "./styles/SearchHistory.module.css"
export { default as CampaignHistoryStyles } from "./styles/CampaignHistory.module.css"
export { default as ActivityTimelineStyles } from "./styles/ActivityTimeline.module.css"

// Type aliases to avoid naming conflicts
export type {
  SearchHistoryItem as HistorySearchItem,
  CampaignHistoryItem as HistoryCampaignItem,
  ActivityItem as HistoryActivityItem,
  HistoryPageProps as HistoryPageOptions,
  SearchHistoryProps as HistorySearchProps,
  CampaignHistoryProps as HistoryCampaignProps,
  ActivityTimelineProps as HistoryTimelineProps
} from "./types"
