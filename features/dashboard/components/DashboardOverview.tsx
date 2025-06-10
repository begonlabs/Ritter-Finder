"use client"

import { DashboardStats, TrendChart, RecentActivity } from "@/features/analytics"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, ArrowRight, History, Search } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import type { TabComponentProps } from "../types"

export function DashboardOverview({ state, actions }: TabComponentProps) {
  const { t } = useLanguage()

  return (
    <div className="space-y-6">
      <DashboardStats />

      <div className="grid gap-6 md:grid-cols-2">
        <TrendChart showHeader={true} compact={false} />
        <RecentActivity showHeader={true} compact={false} maxItems={3} />
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-ritter-gold" />
            Acciones Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Button
              onClick={() => actions.setActiveTab("search")}
              className="bg-ritter-gold hover:bg-amber-500 text-ritter-dark h-12 justify-between"
            >
              <span className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Iniciar Nueva Búsqueda
              </span>
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => actions.setActiveTab("history")}
              variant="outline"
              className="h-12 justify-between border-ritter-gold/20 hover:bg-ritter-gold/5"
            >
              <span className="flex items-center gap-2">
                <History className="h-4 w-4" />
                Ver Historial
              </span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
