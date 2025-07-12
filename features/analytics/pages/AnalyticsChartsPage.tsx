"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, BarChart3, PieChart, TrendingUp, Globe, MapPin, Building2, Flag } from "lucide-react"
import { DashboardStats } from "../components/DashboardStats"
import { LeadStats } from "../components/LeadStats"
import { BarChart, PieChart as PieChartComponent, DoughnutChart, QualityScoreChart } from "../components/ChartComponents"
import { useDashboardStats } from "../hooks/useDashboardStats"
import { useLeadStats } from "../hooks/useLeadStats"
import { exportAnalyticsAsPDF, exportAnalyticsAsCSV } from "../utils/exportUtils"
import type { AnalyticsTabProps } from "../types"
import styles from "../styles/AnalyticsChartsPage.module.css"

interface AnalyticsChartsPageProps extends AnalyticsTabProps {
  showDetailedView?: boolean
}

type ViewType = 'category' | 'country' | 'state' | 'spain-region'
type ChartType = 'bar' | 'pie' | 'doughnut'

export function AnalyticsChartsPage({ 
  showDetailed = true, 
  period = 'month',
  showDetailedView = true 
}: AnalyticsChartsPageProps) {
  
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
            height={400}
          />
        )
      case 'pie':
        return (
          <PieChartComponent
            data={leadStats}
            viewType={selectedView}
            chartType="pie"
            title={chartTitle}
            height={400}
          />
        )
      case 'doughnut':
        return (
          <DoughnutChart
            data={leadStats}
            viewType={selectedView}
            chartType="doughnut"
            title={chartTitle}
            height={400}
          />
        )
      default:
        return (
          <BarChart
            data={leadStats}
            viewType={selectedView}
            chartType="bar"
            title={chartTitle}
            height={400}
          />
        )
    }
  }

  return (
    <div className={styles.analyticsChartsPage}>
      {/* Header */}
      <div className={styles.analyticsHeader}>
        <div className={styles.analyticsHeaderContent}>
          <h2 className={styles.analyticsTitle}>
            <BarChart3 className={styles.analyticsTitleIcon} />
            Analytics con Gráficos Geográficos
          </h2>
          <p className={styles.analyticsSubtitle}>
            Visualización avanzada de datos de RitterFinder con análisis geográfico
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
              <BarChart3 className={styles.generateReportButtonIcon} />
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

      {/* Chart Controls */}
      {showDetailedView && (
        <div className={styles.chartControls}>
          <div className={styles.controlGroup}>
            <label className={styles.controlLabel}>Vista de Datos:</label>
            <Select value={selectedView} onValueChange={(value: ViewType) => setSelectedView(value)}>
              <SelectTrigger className={styles.selectTrigger}>
                <SelectValue />
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

          <div className={styles.controlGroup}>
            <label className={styles.controlLabel}>Tipo de Gráfico:</label>
            <Select value={selectedChartType} onValueChange={(value: ChartType) => setSelectedChartType(value)}>
              <SelectTrigger className={styles.selectTrigger}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bar">
                  <BarChart3 className={styles.selectIcon} />
                  Gráfico de Barras
                </SelectItem>
                <SelectItem value="pie">
                  <PieChart className={styles.selectIcon} />
                  Gráfico de Pastel
                </SelectItem>
                <SelectItem value="doughnut">
                  <PieChart className={styles.selectIcon} />
                  Gráfico de Dona
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      {showDetailedView && (
        <div className={styles.chartsGrid}>
          {/* Main Chart */}
          <div className={styles.mainChart}>
            {renderChart()}
          </div>

          {/* Quality Score Chart */}
          <div className={styles.qualityChart}>
            <QualityScoreChart
              data={leadStats || []}
              viewType={selectedView}
              chartType="bar"
              title={`Puntuaciones de Calidad - ${getViewTitle(selectedView)}`}
              height={300}
            />
          </div>

          {/* Lead Statistics Table */}
          <div className={styles.statsTable}>
            <LeadStats 
              showHeader={true} 
              compact={false} 
              viewType={selectedView} 
              maxItems={8} 
            />
          </div>
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