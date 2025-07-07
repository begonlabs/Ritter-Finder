"use client"

import { DashboardStats, LeadStats, RecentActivity } from "@/features/analytics"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, ArrowRight, History, Search } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import type { TabComponentProps } from "../types"
import styles from "../styles/DashboardOverview.module.css"

export function DashboardOverview({ state, actions }: TabComponentProps) {
  const { t } = useLanguage()

  return (
    <div className={`${styles.dashboardOverview} space-y-6`}>
      <div className={styles.statsSection}>
        <DashboardStats />
      </div>

      <div className={`${styles.chartsGrid} grid gap-6 md:grid-cols-2`}>
        <LeadStats showHeader={true} compact={false} />
        <RecentActivity showHeader={true} compact={false} maxItems={3} />
      </div>

      {/* Quick Actions */}
      <Card className={`${styles.quickActionsCard} border-0 shadow-sm`}>
        <CardHeader className={styles.quickActionsHeader}>
          <CardTitle className={`${styles.quickActionsTitle} flex items-center gap-2`}>
            <Sparkles className={`${styles.titleIcon} h-5 w-5 text-ritter-gold`} />
            Acciones Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent className={styles.quickActionsContent}>
          <div className={`${styles.actionsGrid} grid gap-4 md:grid-cols-2`}>
            <Button
              onClick={() => actions.setActiveTab("search")}
              className={`${styles.actionButton} ${styles.actionButtonPrimary} bg-ritter-gold hover:bg-amber-500 text-ritter-dark h-12 justify-between`}
            >
              <span className={`${styles.buttonContent} flex items-center gap-2`}>
                <Search className={`${styles.buttonIcon} h-4 w-4`} />
                Iniciar Nueva Búsqueda
              </span>
              <ArrowRight className={`${styles.buttonArrow} h-4 w-4`} />
            </Button>
            <Button
              onClick={() => actions.setActiveTab("history")}
              variant="outline"
              className={`${styles.actionButton} ${styles.actionButtonSecondary} h-12 justify-between border-ritter-gold/20 hover:bg-ritter-gold/5`}
            >
              <span className={`${styles.buttonContent} flex items-center gap-2`}>
                <History className={`${styles.buttonIcon} h-4 w-4`} />
                Ver Historial
              </span>
              <ArrowRight className={`${styles.buttonArrow} h-4 w-4`} />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
