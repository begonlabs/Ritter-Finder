"use client"

import { ResultsTableAdapter } from "@/features/results/components/ResultsTableAdapter"
import type { TabComponentProps } from "../types"

export function ResultsTab({ state, actions }: TabComponentProps) {
  return (
    <div className="space-y-6">
      <ResultsTableAdapter
        leads={state.leads}
        selectedLeads={state.selectedLeads}
        onSelectLead={actions.handleSelectLead}
        onSelectAll={actions.handleSelectAll}
        onProceedToCampaign={() => actions.setActiveTab("campaign")}
        showActions={true}
      />
    </div>
  )
}
