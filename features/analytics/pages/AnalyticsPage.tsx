"use client"


import { Button } from "@/components/ui/button"
import { Download, FileText, BarChart3 } from "lucide-react"
import { DashboardStats } from "../components/DashboardStats"
import { LeadStats } from "../components/LeadStats"
import { RecentActivity } from "../components/RecentActivity"
import { useDashboardStats } from "../hooks/useDashboardStats"
import { useLeadStats } from "../hooks/useLeadStats"
import { useActivityTimeline } from "../../history/hooks/useActivityTimeline"
import { exportAnalyticsAsPDF, exportAnalyticsAsCSV } from "../utils/exportUtils"
import type { AnalyticsTabProps, ActivityItem as AnalyticsActivityItem } from "../types"
import type { ActivityItem as HistoryActivityItem } from "../../history/types"
import styles from "../styles/AnalyticsPage.module.css"

interface AnalyticsPageProps extends AnalyticsTabProps {
  showDetailedView?: boolean
}

export function AnalyticsPage({ 
  showDetailed = true, 
  period = 'month',
  showDetailedView = true 
}: AnalyticsPageProps) {
  
  // Get data from hooks
  const { stats: dashboardStats, isLoading: statsLoading } = useDashboardStats()
  const { data: leadStats, isLoading: leadStatsLoading } = useLeadStats('category')
  const { activities: recentActivity, isLoading: activityLoading } = useActivityTimeline()
  
  // Convert history activities to analytics format
  const adaptHistoryToAnalytics = (historyActivities: HistoryActivityItem[]): AnalyticsActivityItem[] => {
    return historyActivities.map(activity => ({
      id: activity.id,
      type: activity.type as 'search' | 'campaign' | 'export',
      title: activity.title,
      description: activity.description,
      date: activity.timestamp,
      metadata: {
        leadsFound: activity.metadata?.leadsCount,
        clientType: activity.metadata?.clientType,
        recipients: activity.metadata?.recipients,
        subject: activity.metadata?.subject
      }
    }))
  }
  
  const handleExportData = async () => {
    try {
      if (!dashboardStats) {
        console.error('Dashboard stats not available')
        return
      }
      
      exportAnalyticsAsCSV(
        dashboardStats,
        leadStats || [],
        adaptHistoryToAnalytics(recentActivity || []),
        'category'
      )
    } catch (error) {
      console.error('Error exporting CSV:', error)
      // In a real app, you'd show a toast notification here
    }
  }

  const handleGenerateReport = async () => {
    try {
      if (!dashboardStats) {
        console.error('Dashboard stats not available')
        return
      }
      
      // Generate comprehensive PDF report
      await exportAnalyticsAsPDF(
        dashboardStats,
        leadStats || [],
        adaptHistoryToAnalytics(recentActivity || []),
        'category'
      )
    } catch (error) {
      console.error('Error generating report:', error)
      // In a real app, you'd show a toast notification here
    }
  }

  return (
    <div className={styles.analyticsPage}>
      {/* Header */}
      <div className={styles.analyticsHeader}>
        <div className={styles.analyticsHeaderContent}>
          <h2 className={styles.analyticsTitle}>
            <BarChart3 className={styles.analyticsTitleIcon} />
            Analytics y Métricas
          </h2>
          <p className={styles.analyticsSubtitle}>
            Panel completo de análisis y rendimiento de RitterFinder
          </p>
        </div>
        
        {showDetailedView && (
          <div className={styles.analyticsActions}>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportData}
              className={styles.exportButton}
            >
              <Download className={styles.exportButtonIcon} />
              Exportar CSV
            </Button>
            <Button
              onClick={handleGenerateReport}
              className={styles.generateReportButton}
            >
              <FileText className={styles.generateReportButtonIcon} />
              Generar Reporte
            </Button>
          </div>
        )}
      </div>

      {/* Main Stats */}
      <DashboardStats 
        showRefreshButton={showDetailedView} 
        compact={!showDetailedView} 
      />

      {/* Lead Statistics and Activity */}
      {showDetailedView && (
        <div className={styles.chartsGrid}>
          <LeadStats showHeader={true} compact={false} viewType="category" maxItems={5} />
          <RecentActivity showHeader={true} compact={false} />
        </div>
      )}


    </div>
  )
} 