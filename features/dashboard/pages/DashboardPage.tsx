"use client"

import { DashboardLayout } from "@/features/layout"
import { Onboarding } from "@/components/onboarding"
import { useDashboard } from "../hooks/useDashboard"
import { DashboardOverview } from "../components/DashboardOverview"
import { SearchTab } from "../components/SearchTab"
import { ResultsTab } from "../components/ResultsTab"
import { CampaignTab } from "../components/CampaignTab"
import { HistoryTab } from "../components/HistoryTab"
import { ScrapingTab } from "../components/ScrapingTab"
import { AnalyticsTab } from "../components/AnalyticsTab"

export function DashboardPage() {
  const { state, actions, canStartSearch, selectedLeadsData } = useDashboard()

  const renderActiveTab = () => {
    switch (state.activeTab) {
      case "dashboard":
        return <DashboardOverview state={state} actions={actions} />
      case "search":
        return <SearchTab state={state} actions={actions} canStartSearch={canStartSearch} />
      case "results":
        return <ResultsTab state={state} actions={actions} />
      case "campaign":
        return <CampaignTab state={state} actions={actions} selectedLeadsData={selectedLeadsData} />
      case "history":
        return <HistoryTab state={state} actions={actions} />
      case "scraping":
        return <ScrapingTab state={state} actions={actions} />
      case "analytics":
        return <AnalyticsTab state={state} actions={actions} />
      default:
        return <DashboardOverview state={state} actions={actions} />
    }
  }

  return (
    <DashboardLayout
      activeTab={state.activeTab}
      onTabChange={(tab: string) => actions.setActiveTab(tab as any)}
      searchComplete={state.searchComplete}
      selectedLeadsCount={state.selectedLeads.length}
    >
      <Onboarding />
      {renderActiveTab()}
    </DashboardLayout>
  )
}
