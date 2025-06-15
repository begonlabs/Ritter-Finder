"use client"

import { useState } from "react"
import { DashboardLayout, UserProfileComponent } from "@/features/layout"
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
import type { UserProfile as UserProfileType } from "@/features/layout/types"
import styles from "../styles/DashboardPage.module.css"

export function DashboardPage() {
  const { state, actions } = useDashboard()
  const [showProfile, setShowProfile] = useState(false)

  // Computed values
  const canStartSearch = !!(
    state.selectedWebsites.length > 0 && 
    state.selectedClientTypes.length > 0 && 
    state.selectedLocations.length > 0 && 
    !state.isSearching
  )
  
  const selectedLeadsData = state.leads.filter((lead) => state.selectedLeads.includes(lead.id))

  // Mock user data
  const mockUser: UserProfileType = {
    id: "user_001",
    name: "Juan Carlos Pérez",
    email: "juan.perez@ritterfinder.com",
    avatar: undefined,
    role: "Admin"
  }

  const handleProfileClick = () => {
    setShowProfile(true)
  }

  const handleBackToDashboard = () => {
    setShowProfile(false)
  }

  const handleLogout = () => {
    console.log("Cerrando sesión...")
    // Here you would typically handle logout logic
    // For now, just redirect to home
    window.location.href = "/"
  }

  const handleProfileUpdate = (data: any) => {
    console.log("Perfil actualizado:", data)
    // Here you would typically call an API to update the user profile
  }

  const handlePasswordChange = (data: any) => {
    console.log("Contraseña cambiada:", data)
    // Here you would typically call an API to change the password
  }

  // Handle tab change from navigation - this should work from profile view too
  const handleTabChange = (tab: string) => {
    // If we're in profile view and user clicks a navigation tab, go back to dashboard first
    if (showProfile) {
      setShowProfile(false)
    }
    // Then change to the selected tab
    actions.setActiveTab(tab as any)
  }

  // If showing profile, render profile view
  if (showProfile) {
    return (
      <DashboardLayout
        activeTab={state.activeTab} // Keep the actual active tab, not "profile"
        onTabChange={handleTabChange} // Enable navigation from profile
        searchComplete={state.searchComplete}
        selectedLeadsCount={state.selectedLeads.length}
        user={mockUser}
        onLogout={handleLogout}
        headerProps={{
          onProfileClick: handleProfileClick
        }}
      >
        <div className={styles.dashboardPage}>
          <div className={styles.profileContainer}>
            <div className={styles.profileHeader}>
              <button
                onClick={handleBackToDashboard}
                className={styles.backButton}
              >
                ← Volver al Dashboard
              </button>
              <h1 className={styles.profileTitle}>Mi Perfil</h1>
              <p className={styles.profileSubtitle}>
                Gestiona tu información personal y configuración de seguridad
              </p>
            </div>
            <UserProfileComponent
              user={mockUser}
              onProfileUpdate={handleProfileUpdate}
              onPasswordChange={handlePasswordChange}
            />
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const renderActiveTab = () => {
    switch (state.activeTab) {
      case "dashboard":
        return <DashboardOverview state={state} actions={actions} />
      case "search":
        return <SearchTab state={state} actions={actions} />
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
      onTabChange={handleTabChange}
      searchComplete={state.searchComplete}
      selectedLeadsCount={state.selectedLeads.length}
      user={mockUser}
      onLogout={handleLogout}
      headerProps={{
        onProfileClick: handleProfileClick
      }}
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
