"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Globe, Users, Euro, TrendingUp, Clock, Target, BarChart3, Zap } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { mockScrapingStats, formatCurrency } from "@/lib/scraping-data"

interface StatsCardProps {
  title: string
  value: string | number
  description: string
  icon: React.ReactNode
  trend?: {
    value: string
    positive: boolean
  }
  color?: string
}

function StatsCard({ title, value, description, icon, trend, color = "ritter-gold" }: StatsCardProps) {
  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`bg-${color}/10 p-2 rounded-full`}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && (
          <div className="mt-2 flex items-center text-xs">
            <span
              className={
                trend.positive ? "text-green-600 bg-green-100 px-1 rounded" : "text-red-600 bg-red-100 px-1 rounded"
              }
            >
              {trend.positive ? "↑" : "↓"} {trend.value}
            </span>
            <span className="ml-1 text-muted-foreground">últimas 24h</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function ScrapingStats() {
  const { t } = useLanguage()
  const stats = mockScrapingStats

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Zap className="h-6 w-6 text-ritter-gold" />
            Estadísticas del Scraping
          </h2>
          <p className="text-gray-600">Datos en tiempo real de la recolección automatizada de leads</p>
        </div>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <Clock className="h-3 w-3 mr-1" />
          Actualizado hace 2 min
        </Badge>
      </div>

      {/* Main Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Sitios Revisados"
          value={stats.sitesReviewed.toLocaleString()}
          description="Total de sitios web analizados"
          icon={<Globe className="h-4 w-4 text-ritter-gold" />}
          trend={{ value: "+47", positive: true }}
        />
        <StatsCard
          title="Leads Obtenidos"
          value={stats.leadsObtained.toLocaleString()}
          description="Contactos válidos extraídos"
          icon={<Users className="h-4 w-4 text-blue-600" />}
          trend={{ value: "+156", positive: true }}
          color="blue-600"
        />
        <StatsCard
          title="Dinero Ahorrado"
          value={formatCurrency(stats.moneySaved)}
          description="Vs. compra de leads tradicional"
          icon={<Euro className="h-4 w-4 text-green-600" />}
          trend={{ value: "+€2,340", positive: true }}
          color="green-600"
        />
        <StatsCard
          title="Tasa de Éxito"
          value={`${stats.successRate}%`}
          description="Sitios con leads válidos"
          icon={<Target className="h-4 w-4 text-purple-600" />}
          trend={{ value: "+2.1%", positive: true }}
          color="purple-600"
        />
      </div>

      {/* Detailed Analytics */}
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
              {stats.dailyStats.slice(-5).map((day, index) => (
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
              {stats.topSources.map((source, index) => (
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

      {/* Key Metrics Summary */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-ritter-gold/5 to-ritter-gold/10 border-ritter-gold/20">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3 text-center">
            <div>
              <p className="text-2xl font-bold text-ritter-gold">{stats.avgLeadsPerSite}</p>
              <p className="text-sm text-muted-foreground">Promedio de leads por sitio</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-ritter-gold">€15</p>
              <p className="text-sm text-muted-foreground">Costo evitado por lead</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-ritter-gold">24/7</p>
              <p className="text-sm text-muted-foreground">Scraping automatizado</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
