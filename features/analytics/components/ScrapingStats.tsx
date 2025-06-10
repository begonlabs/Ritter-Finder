"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Globe, 
  Users, 
  Euro, 
  TrendingUp, 
  Clock, 
  Target, 
  BarChart3, 
  Zap,
  RefreshCw 
} from "lucide-react"
import { useScrapingStats } from "../hooks/useScrapingStats"
import type { ReactNode } from "react"

interface StatsCardProps {
  title: string
  value: string | number
  description: string
  icon: ReactNode
  trend?: {
    value: string
    positive: boolean
  }
  color?: string
  isLoading?: boolean
}

function StatsCard({ title, value, description, icon, trend, color, isLoading }: StatsCardProps) {
  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`p-2 rounded-full ${color ? `bg-${color}/10` : 'bg-ritter-gold/10'}`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {isLoading ? (
            <div className="h-8 bg-gray-200 rounded animate-pulse" />
          ) : (
            value
          )}
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && !isLoading && (
          <div className="mt-2 flex items-center text-xs">
            <span className="text-green-600 bg-green-100 px-1 rounded">
              +{trend.value}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface ScrapingStatsProps {
  showHeader?: boolean
  showRefreshButton?: boolean
  compact?: boolean
}

export function ScrapingStats({ 
  showHeader = true, 
  showRefreshButton = false,
  compact = false 
}: ScrapingStatsProps) {
  const {
    sitesReviewed,
    leadsObtained,
    moneySaved,
    successRate,
    dailyStats,
    topSources,
    isLoading,
    refreshStats,
    formatCurrency,
    lastUpdated,
    metrics
  } = useScrapingStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      {showHeader && (
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Zap className="h-6 w-6 text-ritter-gold" />
              Estadísticas del Scraping
            </h2>
            <p className="text-gray-600">
              Datos en tiempo real de la recolección automatizada de leads
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <Clock className="h-3 w-3 mr-1" />
              Actualizado hace 2 min
            </Badge>
            {showRefreshButton && (
              <Button
                variant="outline"
                size="sm"
                onClick={refreshStats}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Actualizar
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Main Stats Grid */}
      <div className={`grid gap-4 ${compact ? 'md:grid-cols-4' : 'md:grid-cols-2 lg:grid-cols-4'}`}>
        <StatsCard
          title="Sitios Revisados"
          value={sitesReviewed.toLocaleString()}
          description="Total de sitios web analizados"
          icon={<Globe className="h-4 w-4 text-ritter-gold" />}
          trend={{ value: "47", positive: true }}
          isLoading={isLoading}
        />
        <StatsCard
          title="Leads Obtenidos"
          value={leadsObtained.toLocaleString()}
          description="Contactos válidos extraídos"
          icon={<Users className="h-4 w-4 text-blue-600" />}
          trend={{ value: "156", positive: true }}
          color="blue-600"
          isLoading={isLoading}
        />
        <StatsCard
          title="Dinero Ahorrado"
          value={formatCurrency(moneySaved)}
          description="Vs. compra de leads tradicional"
          icon={<Euro className="h-4 w-4 text-green-600" />}
          trend={{ value: "€2,340", positive: true }}
          color="green-600"
          isLoading={isLoading}
        />
        <StatsCard
          title="Tasa de Éxito"
          value={`${successRate}%`}
          description="Sitios con leads válidos"
          icon={<Target className="h-4 w-4 text-purple-600" />}
          trend={{ value: "2.1%", positive: true }}
          color="purple-600"
          isLoading={isLoading}
        />
      </div>

      {/* Detailed Analytics */}
      {!compact && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Daily Performance */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-ritter-gold" />
                Rendimiento Diario
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dailyStats.slice(-5).map((day, index) => (
                  <div key={day.date} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">
                        {new Date(day.date).toLocaleDateString("es-ES", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {day.sites} sitios • {day.leads} leads
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">{formatCurrency(day.savings)}</p>
                      <p className="text-xs text-muted-foreground">ahorrado</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Sources */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-ritter-gold" />
                Mejores Fuentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topSources.map((source, index) => (
                  <div key={source.website} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            index === 0
                              ? "bg-ritter-gold"
                              : index === 1
                                ? "bg-blue-500"
                                : index === 2
                                  ? "bg-green-500"
                                  : index === 3
                                    ? "bg-purple-500"
                                    : "bg-gray-400"
                          }`}
                        />
                        <span className="font-medium text-sm">{source.website}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{source.leads}</p>
                        <p className="text-xs text-muted-foreground">{source.percentage}%</p>
                      </div>
                    </div>
                    <Progress value={source.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Key Metrics Summary */}
      {metrics && !compact && (
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Resumen de Métricas Clave</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">
                  {metrics.averageLeadsPerDay}
                </p>
                <p className="text-sm text-blue-700">Leads promedio por día</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(metrics.costPerLead)}
                </p>
                <p className="text-sm text-green-700">Costo por lead</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">
                  {metrics.roi.toFixed(1)}%
                </p>
                <p className="text-sm text-purple-700">ROI estimado</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
