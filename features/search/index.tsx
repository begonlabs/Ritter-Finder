// Pages
export { SearchPage } from "./pages/SearchPage"

// Components
export { SearchForm } from "./components/SearchForm"
export { WebsiteSelector } from "./components/WebsiteSelector"
export { ClientTypeSelector } from "./components/ClientTypeSelector"
export { ScrapingSimulation } from "./components/ScrapingSimulation"

// Hooks
export { useSearch } from "./hooks/useSearch"
export { useSearchConfig } from "./hooks/useSearchConfig"

// Types
export type {
  SearchConfig,
  SearchState,
  SearchActions,
  SearchResults,
  Lead,
  ScrapingStep,
  SearchHistoryItem,
  ClientType,
  Website
} from "./types"
