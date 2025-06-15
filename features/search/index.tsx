// Pages
export { SearchPage } from "./pages/SearchPage"

// Styles  
export { default as SearchPageStyles } from "./styles/SearchPage.module.css"

// Components
export { SearchForm } from "./components/SearchForm"
export { WebsiteSelector } from "./components/WebsiteSelector"
export { ClientTypeSelector } from "./components/ClientTypeSelector"
export { LocationSelector } from "./components/LocationSelector"
export { ValidationOptions } from "./components/ValidationOptions"
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
  Website,
  Location,
  ValidationOptions as ValidationOptionsType
} from "./types"

// Styles - CSS Modules
import searchPageStyles from "./styles/SearchPage.module.css"
import searchFormStyles from "./styles/SearchForm.module.css"
import websiteSelectorStyles from "./styles/WebsiteSelector.module.css"
import clientTypeSelectorStyles from "./styles/ClientTypeSelector.module.css"
import locationSelectorStyles from "./styles/LocationSelector.module.css"
import validationOptionsStyles from "./styles/ValidationOptions.module.css"
import scrapingSimulationStyles from "./styles/ScrapingSimulation.module.css"

export { 
  searchPageStyles,
  searchFormStyles,
  websiteSelectorStyles,
  clientTypeSelectorStyles,
  locationSelectorStyles,
  validationOptionsStyles,
  scrapingSimulationStyles
}
