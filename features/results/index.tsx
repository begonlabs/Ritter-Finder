// Pages
export { ResultsPage } from "./pages/ResultsPage"

// Components
export { ResultsTableAdapter as ResultsTable } from "./components/ResultsTableAdapter"  // Main table component (external state)
export { LeadDetailsModal } from "./components/LeadDetailsModal"

// Hooks
export { useResults } from "./hooks/useResults"
export { useLeadSelection } from "./hooks/useLeadSelection"
export { useResultsFiltering } from "./hooks/useResultsFiltering"

// Types
export type {
  Lead,
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

export { 
  resultsPageStyles, 
  resultsTableStyles, 
  leadDetailsModalStyles 
}
