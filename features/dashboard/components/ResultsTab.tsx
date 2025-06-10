"use client"

import { ResultsTableAdapter } from "@/features/results/components/ResultsTableAdapter"
import type { TabComponentProps } from "../types"
import styles from "../styles/ResultsTab.module.css"

export function ResultsTab({ state, actions }: TabComponentProps) {
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
          />
        </div>
      </div>
    </div>
  )
}
