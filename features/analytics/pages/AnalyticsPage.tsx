"use client"


import { Button } from "@/components/ui/button"
import { Download, FileText, BarChart3 } from "lucide-react"
import { DashboardStats } from "../components/DashboardStats"
import { LeadStats } from "../components/LeadStats"
import { RecentActivity } from "../components/RecentActivity"
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
  
  const handleExportData = async (format: 'csv' | 'pdf') => {
    // Simulate export
    console.log(`Exporting analytics data as ${format}`)
    // In real app, this would trigger download
  }

  const handleGenerateReport = async () => {
    // Simulate report generation
    console.log('Generating analytics report')
    // In real app, this would generate a comprehensive report
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
              onClick={() => handleExportData('csv')}
              className={styles.exportButton}
            >
              <Download className={styles.exportButtonIcon} />
              Exportar CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportData('pdf')}
              className={styles.exportButton}
            >
              <FileText className={styles.exportButtonIcon} />
              Exportar PDF
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