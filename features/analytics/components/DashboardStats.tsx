"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Mail, Search, BarChart3, RefreshCw, Clock, Target, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useDashboardStats } from "../hooks/useDashboardStats"
import { useLanguage } from "@/lib/language-context"
import type { ReactNode } from "react"
import styles from "../styles/DashboardStats.module.css"

interface StatsCardProps {
  title: string
  value: string
  description: string
  icon: ReactNode
  isLoading?: boolean
}

function StatsCard({ title, value, description, icon, isLoading }: StatsCardProps) {
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
    totalUsers,
    averageLeadQuality,
    isLoading,
    refreshStats,
    lastUpdated
  } = useDashboardStats()

  const statsCards = [
    {
      title: t("dashboard.stats.leads") || "Total Leads",
      value: totalLeads.toLocaleString(),
      description: t("dashboard.stats.leads.desc") || "Leads generados",
      icon: <Users className="h-4 w-4 text-ritter-gold" />,
    },
    {
      title: t("dashboard.stats.campaigns") || "Campañas",
      value: totalCampaigns.toString(),
      description: t("dashboard.stats.campaigns.desc") || "Campañas creadas",
      icon: <Mail className="h-4 w-4 text-ritter-gold" />,
    },
    {
      title: t("dashboard.stats.searches") || "Búsquedas",
      value: totalSearches.toString(),
      description: t("dashboard.stats.searches.desc") || "Búsquedas realizadas",
      icon: <Search className="h-4 w-4 text-ritter-gold" />,
    },
    {
      title: "Usuarios Activos",
      value: totalUsers.toString(),
      description: "Usuarios registrados",
      icon: <Users className="h-4 w-4 text-ritter-gold" />,
    },
    {
      title: "Calidad de Leads",
      value: `${averageLeadQuality.toFixed(1)}%`,
      description: "Puntuación promedio de calidad",
      icon: <Award className="h-4 w-4 text-ritter-gold" />,
    },
  ]

  // Filter cards based on compact mode
  const displayCards = compact ? statsCards.slice(0, 4) : statsCards

  return (
    <div className={`${styles.dashboardStats} space-y-4`}>
      {showRefreshButton && (
        <div className={`${styles.statsHeader} flex items-center justify-between`}>
          <div className={`${styles.headerActions} flex items-center gap-3`}>
            {lastUpdated && (
              <Badge variant="outline" className={`${styles.statusBadge} bg-green-50 text-green-700 border-green-200`}>
                <Clock className={`${styles.statusIcon} h-3 w-3 mr-1`} />
                Actualizado hace {Math.floor((Date.now() - lastUpdated.getTime()) / (1000 * 60))} min
              </Badge>
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
      
      <div className={`${styles.statsGrid} ${compact ? styles.compact : ''} grid gap-4 ${compact ? 'md:grid-cols-4' : 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'}`}>
        {displayCards.map((card, index) => (
          <StatsCard
            key={index}
            title={card.title}
            value={card.value}
            description={card.description}
            icon={card.icon}
            isLoading={isLoading}
          />
        ))}
      </div>
    </div>
  )
}
