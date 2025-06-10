"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardNavigation } from "@/components/dashboard-navigation"
import { Onboarding } from "@/components/onboarding"
import { useDashboard } from "../hooks/useDashboard"
import { DashboardOverview } from "./DashboardOverview"
import { SearchTab } from "./SearchTab"
import { ResultsTab } from "./ResultsTab"
import { CampaignTab } from "./CampaignTab"
import { HistoryTab } from "./HistoryTab"
import { ScrapingTab } from "./ScrapingTab"
import { AnalyticsTab } from "./AnalyticsTab"

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <DashboardHeader />
      <Onboarding />

      <main className="container mx-auto py-6 px-4">
        <DashboardNavigation
          activeTab={state.activeTab}
          onTabChange={(tab: string) => actions.setActiveTab(tab as any)}
          searchComplete={state.searchComplete}
          selectedLeadsCount={state.selectedLeads.length}
        />

        <div className="space-y-6">
          {renderActiveTab()}
        </div>
      </main>
    </div>
  )
}
