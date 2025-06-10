"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Download, History, Mail, Clock, BarChart3 } from "lucide-react"
import { SearchHistory } from "../components/SearchHistory"
import { CampaignHistory } from "../components/CampaignHistory"
import { ActivityTimeline } from "../components/ActivityTimeline"
import type { HistoryPageProps } from "../types"
import styles from "../styles/HistoryPage.module.css"

interface HistoryPageComponentProps extends HistoryPageProps {
  onNavigateToSearch?: () => void
  onNavigateToCampaigns?: () => void
  onNavigateToResults?: () => void
  onRerunSearch?: (searchData: any) => void
  onViewLeads?: (searchId: string) => void
  onViewCampaign?: (campaignId: string) => void
  onDuplicateCampaign?: (campaignId: string) => void
  onViewActivityDetails?: (activityId: string) => void
}

export function HistoryPage({
  showSearchHistory = true,
  showCampaignHistory = true,
  showActivityTimeline = true,
  compactMode = false,
  maxItems = 50,
  onNavigateToSearch,
  onNavigateToCampaigns,
  onNavigateToResults,
  onRerunSearch = () => {},
  onViewLeads = () => {},
  onViewCampaign = () => {},
  onDuplicateCampaign = () => {},
  onViewActivityDetails = () => {}
}: HistoryPageComponentProps) {
  const [activeTab, setActiveTab] = useState("search")

  const handleExportHistory = async (type: 'search' | 'campaign' | 'activity') => {
    console.log(`Exporting ${type} history...`)
    // In real app, this would trigger export functionality
  }

  const handleRerunSearchWrapper = (searchData: any) => {
    onRerunSearch(searchData)
    onNavigateToSearch?.()
  }

  const handleViewLeadsWrapper = (searchId: string) => {
    onViewLeads(searchId)
    onNavigateToResults?.()
  }

  const handleViewCampaignWrapper = (campaignId: string) => {
    onViewCampaign(campaignId)
    onNavigateToCampaigns?.()
  }

  const handleDuplicateCampaignWrapper = (campaignId: string) => {
    onDuplicateCampaign(campaignId)
    onNavigateToCampaigns?.()
  }

  // Determine which tabs to show
  const availableTabs = []
  if (showSearchHistory) availableTabs.push({ id: "search", label: "Búsquedas", icon: History })
  if (showCampaignHistory) availableTabs.push({ id: "campaigns", label: "Campañas", icon: Mail })
  if (showActivityTimeline) availableTabs.push({ id: "activity", label: "Actividad", icon: Clock })

  // If only one tab is available, don't show tabs UI
  const showTabs = availableTabs.length > 1

  if (!showTabs && availableTabs.length === 1) {
    const singleTab = availableTabs[0]
    
    return (
      <div className={`${styles.historyPage} ${compactMode ? styles.compact : ''}`}>
        {!compactMode && (
          <div className={styles.historyHeader}>
            <div className={styles.historyHeaderContent}>
              <h2 className={styles.historyTitle}>
                Historial y Análisis
              </h2>
              <p className={styles.historySubtitle}>
                Revisa tu historial y analiza el rendimiento de tus actividades
              </p>
            </div>
          </div>
        )}

        <div className={styles.tabContent}>
          {singleTab.id === "search" && showSearchHistory && (
            <SearchHistory
              onRerunSearch={handleRerunSearchWrapper}
              onViewLeads={handleViewLeadsWrapper}
              compact={compactMode}
            />
          )}
          
          {singleTab.id === "campaigns" && showCampaignHistory && (
            <CampaignHistory
              onViewCampaign={handleViewCampaignWrapper}
              onDuplicateCampaign={handleDuplicateCampaignWrapper}
              compact={compactMode}
            />
          )}
          
          {singleTab.id === "activity" && showActivityTimeline && (
            <ActivityTimeline
              onViewDetails={onViewActivityDetails}
              maxItems={maxItems}
              compact={compactMode}
            />
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={`${styles.historyPage} ${compactMode ? styles.compact : ''}`}>
      {!compactMode && (
        <div className={styles.historyHeader}>
          <div className={styles.historyHeaderContent}>
            <h2 className={styles.historyTitle}>
              Historial y Análisis
            </h2>
            <p className={styles.historySubtitle}>
              Revisa tu historial y analiza el rendimiento de tus actividades
            </p>
          </div>
          
          <div className={styles.historyActions}>
            <button
              onClick={() => handleExportHistory(activeTab as 'search' | 'campaign' | 'activity')}
              className={styles.exportButton}
            >
              <Download className={styles.exportButtonIcon} />
              Exportar
            </button>
          </div>
        </div>
      )}

      {showTabs ? (
        <div className={styles.tabsContainer}>
          <div className={styles.tabsList}>
            {availableTabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${styles.tabsTrigger} ${activeTab === tab.id ? styles.active : ''}`}
                >
                  <Icon className={styles.tabIcon} />
                  {tab.label}
                </button>
              )
            })}
          </div>

          <div className={styles.tabContent}>
            {activeTab === "search" && showSearchHistory && (
              <SearchHistory
                onRerunSearch={handleRerunSearchWrapper}
                onViewLeads={handleViewLeadsWrapper}
                compact={compactMode}
              />
            )}

            {activeTab === "campaigns" && showCampaignHistory && (
              <CampaignHistory
                onViewCampaign={handleViewCampaignWrapper}
                onDuplicateCampaign={handleDuplicateCampaignWrapper}
                compact={compactMode}
              />
            )}

            {activeTab === "activity" && showActivityTimeline && (
              <ActivityTimeline
                onViewDetails={onViewActivityDetails}
                maxItems={maxItems}
                compact={compactMode}
              />
            )}
          </div>
        </div>
      ) : (
        <div className={styles.tabContent}>
          {showSearchHistory && (
            <SearchHistory
              onRerunSearch={handleRerunSearchWrapper}
              onViewLeads={handleViewLeadsWrapper}
              compact={compactMode}
            />
          )}
          
          {showCampaignHistory && (
            <CampaignHistory
              onViewCampaign={handleViewCampaignWrapper}
              onDuplicateCampaign={handleDuplicateCampaignWrapper}
              compact={compactMode}
            />
          )}
          
          {showActivityTimeline && (
            <ActivityTimeline
              onViewDetails={onViewActivityDetails}
              maxItems={maxItems}
              compact={compactMode}
            />
          )}
        </div>
      )}
    </div>
  )
} 