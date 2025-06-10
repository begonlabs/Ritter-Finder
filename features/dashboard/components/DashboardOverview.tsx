"use client"

import { DashboardStats } from "@/components/dashboard-stats"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, TrendingUp, Users, Sparkles, ArrowRight, History } from "lucide-react"
import { useLanguage, formatMessage } from "@/lib/language-context"
import { mockSearchHistory } from "@/lib/mock-data"
import type { TabComponentProps } from "../types"

export function DashboardOverview({ state, actions }: TabComponentProps) {
  const { t } = useLanguage()

  return (
    <div className="space-y-6">
      <DashboardStats />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Trend Chart */}
        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-ritter-gold" />
              {t("dashboard.trend.title")}
            </CardTitle>
            <CardDescription>{t("dashboard.trend.subtitle")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-ritter-gold/10 to-ritter-gold/5 rounded-lg border border-ritter-gold/20">
                <div>
                  <p className="text-sm text-muted-foreground">{t("month.jun")}</p>
                  <p className="text-2xl font-bold text-ritter-gold">150</p>
                  <p className="text-xs text-muted-foreground">{t("dashboard.trend.found")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("month.jun")}</p>
                  <p className="text-2xl font-bold text-ritter-dark">120</p>
                  <p className="text-xs text-muted-foreground">{t("dashboard.trend.contacted")}</p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-green-600 font-medium flex items-center justify-center gap-1">
                  <TrendingUp className="h-4 w-4" />↑ 12% {t("time.from.month")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-ritter-gold" />
              {t("dashboard.activity")}
            </CardTitle>
            <CardDescription>{t("dashboard.activity.desc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockSearchHistory.slice(0, 3).map((item, index) => (
                <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0">
                  <div className="bg-ritter-gold/10 p-2 rounded-full">
                    <Search className="h-4 w-4 text-ritter-gold" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{t("dashboard.search.completed")}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatMessage(t("dashboard.search.found"), {
                        count: item.leadsFound,
                        type: t(`client.${item.clientType}`),
                      })}
                    </p>
                    <p className="text-xs text-muted-foreground">{new Date(item.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
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
