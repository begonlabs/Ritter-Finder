"use client"

import { Button } from "@/components/ui/button"
import { Download, FileText, BarChart3 } from "lucide-react"
import { DashboardStats } from "../components/DashboardStats"
import { LeadStats } from "../components/LeadStats"
import { useDashboardStats } from "../hooks/useDashboardStats"
import { useLeadStats } from "../hooks/useLeadStats"
import { exportAnalyticsAsPDF, exportAnalyticsAsCSV } from "../utils/exportUtils"
import type { AnalyticsTabProps } from "../types"
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
  
  const handleExportData = async () => {
    try {
      if (!dashboardStats) {
        console.error('Dashboard stats not available')
        return
      }
      
      exportAnalyticsAsCSV(
        dashboardStats,
        leadStats || [],
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

      {/* Lead Statistics */}
      {showDetailedView && (
        <div className={styles.leadStatsContainer}>
          <LeadStats showHeader={true} compact={false} viewType="category" maxItems={5} />
        </div>
      )}

    </div>
  )
} 