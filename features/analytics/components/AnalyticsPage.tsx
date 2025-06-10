"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText, BarChart3 } from "lucide-react"
import { DashboardStats } from "./DashboardStats"
import { ScrapingStats } from "./ScrapingStats"
import { TrendChart } from "./TrendChart"
import { RecentActivity } from "./RecentActivity"
import type { AnalyticsTabProps } from "../types"

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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-ritter-gold" />
            Analytics y Métricas
          </h2>
          <p className="text-gray-600">
            Panel completo de análisis y rendimiento de RitterFinder
          </p>
        </div>
        
        {showDetailedView && (
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportData('csv')}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Exportar CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportData('pdf')}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Exportar PDF
            </Button>
            <Button
              onClick={handleGenerateReport}
              className="bg-ritter-gold hover:bg-amber-500 text-ritter-dark flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
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
        <div className="grid gap-6 md:grid-cols-2">
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
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-ritter-gold" />
              Resumen de Rendimiento - {period === 'month' ? 'Este Mes' : 'Este Período'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              {/* Lead Generation Performance */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Generación de Leads</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium">Eficiencia de búsqueda</span>
                    <span className="text-lg font-bold text-blue-600">92%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium">Calidad promedio</span>
                    <span className="text-lg font-bold text-green-600">87%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="text-sm font-medium">Leads por búsqueda</span>
                    <span className="text-lg font-bold text-purple-600">24</span>
                  </div>
                </div>
              </div>

              {/* Campaign Performance */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Rendimiento de Campañas</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <span className="text-sm font-medium">Tasa de apertura</span>
                    <span className="text-lg font-bold text-orange-600">68%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span className="text-sm font-medium">Tasa de click</span>
                    <span className="text-lg font-bold text-red-600">23%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg">
                    <span className="text-sm font-medium">Respuestas</span>
                    <span className="text-lg font-bold text-indigo-600">12%</span>
                  </div>
                </div>
              </div>

              {/* Cost Analysis */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Análisis de Costos</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
                    <span className="text-sm font-medium">Costo por lead</span>
                    <span className="text-lg font-bold text-emerald-600">€15</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-cyan-50 rounded-lg">
                    <span className="text-sm font-medium">ROI estimado</span>
                    <span className="text-lg font-bold text-cyan-600">340%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                    <span className="text-sm font-medium">Ahorro total</span>
                    <span className="text-lg font-bold text-amber-600">€58K</span>
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