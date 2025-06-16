// Pages
export { ResultsPage } from "./pages/ResultsPage"
export { LeadsResultsPage } from "./pages/LeadsResultsPage"  // New API-integrated page

// Components
export { ResultsTableAdapter as ResultsTable } from "./components/ResultsTableAdapter"  // Main table component (external state)
export { LeadDetailsModal } from "./components/LeadDetailsModal"
export { CampaignActionButton } from "./components/CampaignActionButton"  // Campaign integration button

// Hooks
export { useResults } from "./hooks/useResults"
export { useLeadSelection } from "./hooks/useLeadSelection"
export { useResultsFiltering } from "./hooks/useResultsFiltering"
export { useLeadsApi } from "./hooks/useLeadsApi"  // New API hook
export { useLeadsAdapter } from "./hooks/useLeadsAdapter"  // New adapter hook
export { useSearchResultsIntegration } from "./hooks/useSearchResultsIntegration"  // Dashboard integration

// Types
export type {
  Lead,
  NormalizedLead,  // New normalized type
  LeadsApiResponse,  // New API response type
  LeadsSearchParams,  // New search params type
  LeadSelection,
  LeadSelectionActions,
  ResultsFilters,
  ResultsSorting,
  ResultsState,
  ResultsActions,
  LeadDetailsModalProps,
  ResultsTableProps,
  ResultsHeaderProps,
  ResultsStatsProps,
  ConfidenceLevel,
  LeadSummary
} from "./types"

// Styles - CSS Modules
import resultsPageStyles from './styles/ResultsPage.module.css'
import resultsTableStyles from './styles/ResultsTable.module.css'
import leadDetailsModalStyles from './styles/LeadDetailsModal.module.css'
import campaignActionButtonStyles from './styles/CampaignActionButton.module.css'

export { 
  resultsPageStyles, 
  resultsTableStyles, 
  leadDetailsModalStyles,
  campaignActionButtonStyles
}
