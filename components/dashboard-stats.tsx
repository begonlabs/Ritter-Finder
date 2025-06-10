"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Mail, Search, BarChart3 } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

interface StatsCardProps {
  title: string
  value: string
  description: string
  icon: React.ReactNode
  trend?: {
    value: string
    label: string
    positive: boolean
  }
}

function StatsCard({ title, value, description, icon, trend }: StatsCardProps) {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="bg-ritter-gold/10 p-2 rounded-full">{icon}</div>
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
            <span className="ml-1 text-muted-foreground">{trend.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function DashboardStats() {
  const { t } = useLanguage()

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title={t("dashboard.stats.leads")}
        value="1,234"
        description={t("dashboard.stats.leads.desc")}
        icon={<Users className="h-4 w-4 text-ritter-gold" />}
        trend={{
          value: "12%",
          label: t("time.from.month"),
          positive: true,
        }}
      />
      <StatsCard
        title={t("dashboard.stats.campaigns")}
        value="45"
        description={t("dashboard.stats.campaigns.desc")}
        icon={<Mail className="h-4 w-4 text-ritter-gold" />}
        trend={{
          value: "8%",
          label: t("time.from.month"),
          positive: true,
        }}
      />
      <StatsCard
        title={t("dashboard.stats.searches")}
        value="89"
        description={t("dashboard.stats.searches.desc")}
        icon={<Search className="h-4 w-4 text-ritter-gold" />}
        trend={{
          value: "5%",
          label: t("time.from.month"),
          positive: false,
        }}
      />
      <StatsCard
        title={t("dashboard.stats.openrate")}
        value="68%"
        description={t("dashboard.stats.openrate.desc")}
        icon={<BarChart3 className="h-4 w-4 text-ritter-gold" />}
        trend={{
          value: "3%",
          label: t("time.from.month"),
          positive: true,
        }}
      />
    </div>
  )
}
