"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, FileText, BarChart3, Globe, MapPin, Building2, Flag } from "lucide-react"
import { DashboardStats } from "../components/DashboardStats"
import { LeadStats } from "../components/LeadStats"
import { BarChart, PieChart, DoughnutChart, QualityScoreChart } from "../components/ChartComponents"
import { useDashboardStats } from "../hooks/useDashboardStats"
import { useLeadStats } from "../hooks/useLeadStats"
import { exportAnalyticsAsPDF, exportAnalyticsAsCSV } from "../utils/exportUtils"
import type { AnalyticsTabProps } from "../types"
import styles from "../styles/AnalyticsPage.module.css"

interface AnalyticsPageProps extends AnalyticsTabProps {
  showDetailedView?: boolean
}

type ViewType = 'category' | 'country' | 'state' | 'spain-region'
type ChartType = 'bar' | 'pie' | 'doughnut'

export function AnalyticsPage({ 
  showDetailed = true, 
  period = 'month',
  showDetailedView = true 
}: AnalyticsPageProps) {
  
  const [selectedView, setSelectedView] = useState<ViewType>('category')
  const [selectedChartType, setSelectedChartType] = useState<ChartType>('bar')
  
  // Get data from hooks
  const { stats: dashboardStats, isLoading: statsLoading } = useDashboardStats()
  const { data: leadStats, isLoading: leadStatsLoading } = useLeadStats(selectedView)
  
  const handleExportData = async () => {
    try {
      if (!dashboardStats) {
        console.error('Dashboard stats not available')
        return
      }
      
      console.log(`📊 Exporting CSV with ${leadStats?.length || 0} total records for ${selectedView} view`)
      
      exportAnalyticsAsCSV(
        dashboardStats,
        leadStats || [],
        selectedView
      )
    } catch (error) {
      console.error('Error exporting CSV:', error)
    }
  }

  const handleGenerateReport = async () => {
    try {
      if (!dashboardStats) {
        console.error('Dashboard stats not available')
        return
      }
      
      console.log(`📊 Generating PDF report with ${leadStats?.length || 0} total records for ${selectedView} view`)
      
      await exportAnalyticsAsPDF(
        dashboardStats,
        leadStats || [],
        selectedView
      )
    } catch (error) {
      console.error('Error generating report:', error)
    }
  }

  const getViewTitle = (viewType: ViewType) => {
    switch (viewType) {
      case 'category':
        return 'Leads por Categoría'
      case 'country':
        return 'Leads por País'
      case 'state':
        return 'Leads por Estado/Región'
      case 'spain-region':
        return 'Leads por Comunidad Autónoma'
      default:
        return 'Estadísticas de Leads'
    }
  }

  const getChartTitle = (viewType: ViewType, chartType: ChartType) => {
    const viewTitle = getViewTitle(viewType)
    switch (chartType) {
      case 'bar':
        return `${viewTitle} - Gráfico de Barras`
      case 'pie':
        return `${viewTitle} - Gráfico de Pastel`
      case 'doughnut':
        return `${viewTitle} - Gráfico de Dona`
      default:
        return viewTitle
    }
  }

  const getViewIcon = (viewType: ViewType) => {
    switch (viewType) {
      case 'category':
        return <Building2 className="h-4 w-4" />
      case 'country':
        return <Globe className="h-4 w-4" />
      case 'state':
        return <MapPin className="h-4 w-4" />
      case 'spain-region':
        return <Flag className="h-4 w-4" />
      default:
        return <BarChart3 className="h-4 w-4" />
    }
  }

  const renderChart = () => {
    if (!leadStats || leadStats.length === 0) {
      return (
        <div className={styles.noDataState}>
          <BarChart3 className={styles.noDataIcon} />
          <p className={styles.noDataText}>
            No hay datos disponibles para esta vista
          </p>
        </div>
      )
    }

    const chartTitle = getChartTitle(selectedView, selectedChartType)

    switch (selectedChartType) {
      case 'bar':
        return (
          <BarChart
            data={leadStats}
            viewType={selectedView}
            chartType="bar"
            title={chartTitle}
            height={300}
          />
        )
      case 'pie':
        return (
          <PieChart
            data={leadStats}
            viewType={selectedView}
            chartType="pie"
            title={chartTitle}
            height={300}
          />
        )
      case 'doughnut':
        return (
          <DoughnutChart
            data={leadStats}
            viewType={selectedView}
            chartType="doughnut"
            title={chartTitle}
            height={300}
          />
        )
      default:
        return (
          <BarChart
            data={leadStats}
            viewType={selectedView}
            chartType="bar"
            title={chartTitle}
            height={300}
          />
        )
    }
  }

  return (
    <div className={styles.analyticsPage}>
      {/* Header */}
      <div className={styles.analyticsHeader}>
        <div className={styles.analyticsHeaderContent}>
          <h2 className={styles.analyticsTitle}>
            <BarChart3 className={styles.analyticsTitleIcon} />
            Analytics y Métricas Geográficas
          </h2>
          <p className={styles.analyticsSubtitle}>
            Panel completo de análisis y rendimiento de RitterFinder con análisis geográfico
          </p>
        </div>
        
        {showDetailedView && (
          <div className={styles.analyticsActions}>
            <div className={styles.viewSelector}>
              <Select value={selectedView} onValueChange={(value: ViewType) => setSelectedView(value)}>
                <SelectTrigger className={styles.headerSelectTrigger}>
                  <SelectValue placeholder="Vista de Datos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="category">
                    <Building2 className={styles.selectIcon} />
                    Por Categoría
                  </SelectItem>
                  <SelectItem value="country">
                    <Globe className={styles.selectIcon} />
                    Por País
                  </SelectItem>
                  <SelectItem value="state">
                    <MapPin className={styles.selectIcon} />
                    Por Estado/Región
                  </SelectItem>
                  <SelectItem value="spain-region">
                    <Flag className={styles.selectIcon} />
                    Por Comunidad Autónoma
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
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

      {/* Charts Section */}
      {showDetailedView && leadStats && leadStats.length > 0 && (
        <div className={styles.chartsSection}>
          <div className={styles.chartsGrid2x2}>
            {/* Fila 1 */}
            <div className={styles.gridItem}>
              <PieChart
                data={leadStats}
                viewType={selectedView}
                chartType="pie"
                title={`Leads por ${getViewTitle(selectedView)} - Gráfico de Pastel`}
                height={350}
              />
            </div>
            <div className={styles.gridItem}>
              <QualityScoreChart
                data={leadStats}
                viewType={selectedView}
                chartType="bar"
                title={`Puntuaciones de Calidad - ${getViewTitle(selectedView)}`}
                height={350}
              />
            </div>
            {/* Fila 2 */}
            <div className={styles.gridItem}>
              <BarChart
                data={leadStats}
                viewType={selectedView}
                chartType="bar"
                title={`Análisis Detallado - ${getViewTitle(selectedView)}`}
                height={250}
              />
            </div>
            <div className={styles.gridItem}>
              <PieChart
                data={leadStats}
                viewType={selectedView}
                chartType="pie"
                title={`Distribución - ${getViewTitle(selectedView)}`}
                height={250}
              />
            </div>
          </div>
        </div>
      )}

      {/* Lead Statistics */}
      {showDetailedView && (
        <div className={styles.leadStatsContainer}>
          <LeadStats 
            showHeader={true} 
            compact={false} 
            viewType={selectedView} 
            maxItems={8} 
          />
                  </div>
      )}

      {/* Loading State */}
      {(statsLoading || leadStatsLoading) && (
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner} />
          <p className={styles.loadingText}>Cargando datos de analytics geográficos...</p>
            </div>
      )}
    </div>
  )
} 