"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Mail, Search, BarChart3, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useDashboardStats } from "../hooks/useDashboardStats"
import { useLanguage } from "@/lib/language-context"
import type { ReactNode } from "react"
import styles from "../styles/DashboardStats.module.css"

interface StatsCardProps {
  title: string
  value: string
  description: string
  icon: ReactNode
  trend?: {
    value: string
    label: string
    positive: boolean
  }
  isLoading?: boolean
}

function StatsCard({ title, value, description, icon, trend, isLoading }: StatsCardProps) {
  return (
    <Card className={`${styles.statCard} border-0 shadow-sm hover:shadow-md transition-shadow`}>
      <CardHeader className={`${styles.cardHeader} flex flex-row items-center justify-between pb-2`}>
        <CardTitle className={`${styles.cardTitle} text-sm font-medium`}>{title}</CardTitle>
        <div className={`${styles.cardIcon} bg-ritter-gold/10 p-2 rounded-full`}>
          <div className={styles.cardIconInner}>{icon}</div>
        </div>
      </CardHeader>
      <CardContent className={styles.cardContent}>
        <div className={`${styles.cardValue} ${isLoading ? styles.loading : ''} text-2xl font-bold`}>
          {isLoading ? (
            <div className="h-8 bg-gray-200 rounded animate-pulse" />
          ) : (
            value
          )}
        </div>
        <p className={`${styles.cardDescription} text-xs text-muted-foreground`}>{description}</p>
        {trend && !isLoading && (
          <div className={`${styles.trendIndicator} mt-2 flex items-center text-xs`}>
            <span
              className={`${styles.trendBadge} ${
                trend.positive 
                  ? `${styles.positive} text-green-600 bg-green-100 px-1 rounded` 
                  : `${styles.negative} text-red-600 bg-red-100 px-1 rounded`
              }`}
            >
              {trend.positive ? "↑" : "↓"} {trend.value}
            </span>
            <span className={`${styles.trendLabel} ml-1 text-muted-foreground`}>{trend.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface DashboardStatsProps {
  showRefreshButton?: boolean
  compact?: boolean
}

export function DashboardStats({ showRefreshButton = false, compact = false }: DashboardStatsProps) {
  const { t } = useLanguage()
  const { 
    totalLeads, 
    totalCampaigns, 
    totalSearches, 
    averageOpenRate, 
    trends,
    isLoading,
    refreshStats,
    lastUpdated
  } = useDashboardStats()

  const statsCards = [
    {
      title: t("dashboard.stats.leads"),
      value: totalLeads.toLocaleString(),
      description: t("dashboard.stats.leads.desc"),
      icon: <Users className="h-4 w-4 text-ritter-gold" />,
      trend: trends ? {
        value: `${trends.leads.percentage}%`,
        label: trends.leads.label,
        positive: trends.leads.positive,
      } : undefined,
    },
    {
      title: t("dashboard.stats.campaigns"),
      value: totalCampaigns.toString(),
      description: t("dashboard.stats.campaigns.desc"),
      icon: <Mail className="h-4 w-4 text-ritter-gold" />,
      trend: trends ? {
        value: `${trends.campaigns.percentage}%`,
        label: trends.campaigns.label,
        positive: trends.campaigns.positive,
      } : undefined,
    },
    {
      title: t("dashboard.stats.searches"),
      value: totalSearches.toString(),
      description: t("dashboard.stats.searches.desc"),
      icon: <Search className="h-4 w-4 text-ritter-gold" />,
      trend: trends ? {
        value: `${trends.searches.percentage}%`,
        label: trends.searches.label,
        positive: trends.searches.positive,
      } : undefined,
    },
    {
      title: t("dashboard.stats.openrate"),
      value: `${averageOpenRate}%`,
      description: t("dashboard.stats.openrate.desc"),
      icon: <BarChart3 className="h-4 w-4 text-ritter-gold" />,
      trend: trends ? {
        value: `${trends.openRate.percentage}%`,
        label: trends.openRate.label,
        positive: trends.openRate.positive,
      } : undefined,
    },
  ]

  return (
    <div className={`${styles.dashboardStats} space-y-4`}>
      {showRefreshButton && (
        <div className={`${styles.statsHeader} flex items-center justify-between`}>
          <div className={`${styles.headerInfo} text-sm text-muted-foreground`}>
            {lastUpdated && (
              <>Última actualización: {lastUpdated.toLocaleTimeString()}</>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshStats}
            disabled={isLoading}
            className={`${styles.refreshButton} flex items-center gap-2`}
          >
            <RefreshCw className={`${styles.refreshIcon} ${isLoading ? `${styles.spinning} animate-spin` : ''} h-4 w-4`} />
            Actualizar
          </Button>
        </div>
      )}
      
      <div className={`${styles.statsGrid} ${compact ? styles.compact : ''} grid gap-4 ${compact ? 'md:grid-cols-4' : 'md:grid-cols-2 lg:grid-cols-4'}`}>
        {statsCards.map((card, index) => (
          <StatsCard
            key={index}
            title={card.title}
            value={card.value}
            description={card.description}
            icon={card.icon}
            trend={card.trend}
            isLoading={isLoading}
          />
        ))}
      </div>
    </div>
  )
}
