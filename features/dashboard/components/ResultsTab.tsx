"use client"

import { EnhancedResultsTable } from "@/components/enhanced-results-table"
import type { TabComponentProps } from "../types"

export function ResultsTab({ state, actions }: TabComponentProps) {
  return (
    <div className="space-y-6">
      <EnhancedResultsTable
        leads={state.leads}
        selectedLeads={state.selectedLeads}
        onSelectLead={actions.handleSelectLead}
        onSelectAll={actions.handleSelectAll}
        onProceedToCampaign={() => actions.setActiveTab("campaign")}
      />
    </div>
  )
}
