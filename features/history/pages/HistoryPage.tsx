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
import { useSearchHistory } from "../hooks/useSearchHistory"
import { useCampaignHistory } from "../hooks/useCampaignHistory"
import { useActivityTimeline } from "../hooks/useActivityTimeline"
import { exportHistoryToExcel, exportSearchHistory, exportCampaignHistory, exportActivityTimeline } from "../utils/exportUtils"
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
  const [isExporting, setIsExporting] = useState(false)

  // Load data from hooks
  const searchHistory = useSearchHistory()
  const campaignHistory = useCampaignHistory()
  const activityTimeline = useActivityTimeline(maxItems)

  const handleExportHistory = async (type: 'search' | 'campaigns' | 'activity' | 'all') => {
    setIsExporting(true)
    
    try {
      let result

      switch (type) {
        case 'search':
          if (searchHistory.history.length === 0) {
            alert('No hay datos de búsquedas para exportar')
            return
          }
          result = await exportSearchHistory(searchHistory.history)
          break

        case 'campaigns':
          if (campaignHistory.campaigns.length === 0) {
            alert('No hay datos de campañas para exportar')
            return
          }
          result = await exportCampaignHistory(campaignHistory.campaigns)
          break

        case 'activity':
          if (activityTimeline.allActivities.length === 0) {
            alert('No hay datos de actividad para exportar')
            return
          }
          result = await exportActivityTimeline(activityTimeline.allActivities)
          break

        case 'all':
        default:
          // Export all available data
          const hasData = searchHistory.history.length > 0 || 
                         campaignHistory.campaigns.length > 0 || 
                         activityTimeline.allActivities.length > 0

          if (!hasData) {
            alert('No hay datos para exportar')
            return
          }

          result = await exportHistoryToExcel({
            searches: searchHistory.history,
            campaigns: campaignHistory.campaigns,
            activities: activityTimeline.allActivities,
            type: 'all'
          })
          break
      }

      if (result.success) {
        // Show success message
        const message = `✅ Historial exportado exitosamente como ${result.filename}`
        console.log(message)
        
        // You could replace this with a proper toast notification
        const notification = document.createElement('div')
        notification.innerHTML = message
        notification.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: #10b981;
          color: white;
          padding: 12px 16px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 1000;
          font-size: 14px;
          max-width: 300px;
        `
        document.body.appendChild(notification)
        
        setTimeout(() => {
          notification.remove()
        }, 5000)
      } else {
        throw new Error(result.error || 'Error desconocido')
      }

    } catch (error) {
      console.error('Error al exportar historial:', error)
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al exportar'
      
      // Show error message
      const notification = document.createElement('div')
      notification.innerHTML = `❌ Error al exportar: ${errorMessage}`
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ef4444;
        color: white;
        padding: 12px 16px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        font-size: 14px;
        max-width: 300px;
      `
      document.body.appendChild(notification)
      
      setTimeout(() => {
        notification.remove()
      }, 5000)
    } finally {
      setIsExporting(false)
    }
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
            
            <div className={styles.historyActions}>
              <button
                onClick={() => handleExportHistory(singleTab.id as 'search' | 'campaigns' | 'activity')}
                disabled={isExporting}
                className={styles.exportButton}
              >
                <Download className={styles.exportButtonIcon} />
                {isExporting ? 'Exportando...' : 'Exportar'}
              </button>
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
              onClick={() => handleExportHistory('all')}
              disabled={isExporting}
              className={styles.exportButton}
              title="Exportar todo el historial a Excel"
            >
              <Download className={styles.exportButtonIcon} />
              {isExporting ? 'Exportando...' : 'Exportar Todo'}
            </button>
            
            <button
              onClick={() => handleExportHistory(activeTab as 'search' | 'campaigns' | 'activity')}
              disabled={isExporting}
              className={styles.exportButton}
              title="Exportar solo la sección actual"
            >
              <Download className={styles.exportButtonIcon} />
              {isExporting ? 'Exportando...' : 'Exportar Actual'}
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