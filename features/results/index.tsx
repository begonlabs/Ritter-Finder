// Components
export { ResultsTable } from "./components/ResultsTable"  // Standalone with internal state
export { ResultsTableAdapter } from "./components/ResultsTableAdapter"  // For external state integration
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
