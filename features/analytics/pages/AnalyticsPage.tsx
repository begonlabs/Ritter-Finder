"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText, BarChart3 } from "lucide-react"
import { DashboardStats } from "../components/DashboardStats"
import { ScrapingStats } from "../components/ScrapingStats"
import { TrendChart } from "../components/TrendChart"
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

      {/* Trend Analysis and Activity */}
      {showDetailedView && (
        <div className={styles.chartsGrid}>
          <TrendChart showHeader={true} compact={false} />
          <RecentActivity showHeader={true} compact={false} />
        </div>
      )}

      {/* Scraping Analytics */}
      <ScrapingStats 
        showHeader={showDetailedView} 
        showRefreshButton={showDetailedView}
        compact={!showDetailedView} 
      />

      {/* Performance Summary */}
      {showDetailedView && (
        <Card className={styles.chartCard}>
          <CardHeader className={styles.chartCardHeader}>
            <CardTitle className={styles.chartCardTitle}>
              <BarChart3 className={styles.chartCardTitleIcon} />
              Resumen de Rendimiento - {period === 'month' ? 'Este Mes' : 'Este Período'}
            </CardTitle>
          </CardHeader>
          <CardContent className={styles.chartCardContent}>
            <div className={styles.performanceMetrics}>
              {/* Lead Generation Performance */}
              <div className={styles.performanceSection}>
                <h3 className={styles.performanceSectionTitle}>Generación de Leads</h3>
                <div className={styles.performanceSectionMetrics}>
                  <div className={`${styles.performanceMetric} ${styles.performanceMetricBlue}`}>
                    <span className={styles.performanceMetricLabel}>
                      Eficiencia de búsqueda
                    </span>
                    <span className={`${styles.performanceMetricValue} ${styles.performanceMetricValueBlue}`}>
                      92%
                    </span>
                  </div>
                  <div className={`${styles.performanceMetric} ${styles.performanceMetricGreen}`}>
                    <span className={styles.performanceMetricLabel}>
                      Calidad promedio
                    </span>
                    <span className={`${styles.performanceMetricValue} ${styles.performanceMetricValueGreen}`}>
                      87%
                    </span>
                  </div>
                  <div className={`${styles.performanceMetric} ${styles.performanceMetricPurple}`}>
                    <span className={styles.performanceMetricLabel}>
                      Leads por búsqueda
                    </span>
                    <span className={`${styles.performanceMetricValue} ${styles.performanceMetricValuePurple}`}>
                      24
                    </span>
                  </div>
                </div>
              </div>

              {/* Campaign Performance */}
              <div className={styles.performanceSection}>
                <h3 className={styles.performanceSectionTitle}>Rendimiento de Campañas</h3>
                <div className={styles.performanceSectionMetrics}>
                  <div className={`${styles.performanceMetric} ${styles.performanceMetricOrange}`}>
                    <span className={styles.performanceMetricLabel}>
                      Tasa de apertura
                    </span>
                    <span className={`${styles.performanceMetricValue} ${styles.performanceMetricValueOrange}`}>
                      68%
                    </span>
                  </div>
                  <div className={`${styles.performanceMetric} ${styles.performanceMetricRed}`}>
                    <span className={styles.performanceMetricLabel}>
                      Tasa de click
                    </span>
                    <span className={`${styles.performanceMetricValue} ${styles.performanceMetricValueRed}`}>
                      23%
                    </span>
                  </div>
                  <div className={`${styles.performanceMetric} ${styles.performanceMetricIndigo}`}>
                    <span className={styles.performanceMetricLabel}>
                      Respuestas
                    </span>
                    <span className={`${styles.performanceMetricValue} ${styles.performanceMetricValueIndigo}`}>
                      12%
                    </span>
                  </div>
                </div>
              </div>

              {/* Cost Analysis */}
              <div className={styles.performanceSection}>
                <h3 className={styles.performanceSectionTitle}>Análisis de Costos</h3>
                <div className={styles.performanceSectionMetrics}>
                  <div className={`${styles.performanceMetric} ${styles.performanceMetricEmerald}`}>
                    <span className={styles.performanceMetricLabel}>
                      Costo por lead
                    </span>
                    <span className={`${styles.performanceMetricValue} ${styles.performanceMetricValueEmerald}`}>
                      €15
                    </span>
                  </div>
                  <div className={`${styles.performanceMetric} ${styles.performanceMetricCyan}`}>
                    <span className={styles.performanceMetricLabel}>
                      ROI estimado
                    </span>
                    <span className={`${styles.performanceMetricValue} ${styles.performanceMetricValueCyan}`}>
                      340%
                    </span>
                  </div>
                  <div className={`${styles.performanceMetric} ${styles.performanceMetricAmber}`}>
                    <span className={styles.performanceMetricLabel}>
                      Ahorro total
                    </span>
                    <span className={`${styles.performanceMetricValue} ${styles.performanceMetricValueAmber}`}>
                      €58K
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 