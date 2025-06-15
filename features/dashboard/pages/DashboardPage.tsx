"use client"

import { DashboardLayout } from "@/features/layout"
// import { OnboardingModal } from "@/features/onboarding" // Temporalmente desactivado
import { AdminDashboard } from "@/features/admin"
import { useDashboard } from "../hooks/useDashboard"
import { DashboardOverview } from "../components/DashboardOverview"
import { SearchTab } from "../components/SearchTab"
import { ResultsTab } from "../components/ResultsTab"
import { CampaignTab } from "../components/CampaignTab"
import { HistoryTab } from "../components/HistoryTab"
import { ScrapingTab } from "../components/ScrapingTab"
import { AnalyticsTab } from "../components/AnalyticsTab"
import styles from "../styles/DashboardPage.module.css"

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
      case "admin":
        return <AdminDashboard />
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
      <div className={styles.dashboardPage}>
        {/* Onboarding Modal - Temporalmente desactivado hasta decisión del cliente */}
        {/* <OnboardingModal /> */}
        <div className={styles.tabContent}>
          {renderActiveTab()}
        </div>
      </div>
    </DashboardLayout>
  )
}
