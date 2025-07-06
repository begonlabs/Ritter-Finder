"use client"

import { ResultsTableAdapter } from "@/features/results/components/ResultsTableAdapter"
import type { TabComponentProps } from "../types"
import styles from "../styles/ResultsTab.module.css"

export function ResultsTab({ state, actions }: TabComponentProps) {
  // ✅ Debug logging to track leads in ResultsTab
  console.log('🎯 ResultsTab rendered with:', {
    leadsCount: state.leads.length,
    selectedCount: state.selectedLeads.length,
    isSearching: state.isSearching,
    searchComplete: state.searchComplete,
    firstLead: state.leads[0] ? {
      id: state.leads[0].id,
      company_name: state.leads[0].company_name,
      activity: state.leads[0].activity
    } : null
  })

  return (
    <div className={`${styles.resultsTab} space-y-6`}>
      <div className={styles.resultsContainer}>
        <div className={styles.tableWrapper}>
          <ResultsTableAdapter
            leads={state.leads}
            selectedLeads={state.selectedLeads}
            onSelectLead={actions.handleSelectLead}
            onSelectAll={actions.handleSelectAll}
            onProceedToCampaign={() => actions.setActiveTab("campaign")}
            showActions={true}
            noResultsWithCriteria={state.noResultsWithCriteria}
          />
        </div>
      </div>
    </div>
  )
}
