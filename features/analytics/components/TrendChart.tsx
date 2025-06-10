"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import styles from "../styles/TrendChart.module.css"

interface TrendData {
  month: string
  leadsFound: number
  leadsContacted: number
  change: number
  positive: boolean
}

interface TrendChartProps {
  data?: TrendData[]
  showHeader?: boolean
  compact?: boolean
}

// Mock trend data - in real app this would come from API
const mockTrendData: TrendData[] = [
  { month: "mayo", leadsFound: 120, leadsContacted: 95, change: 8, positive: true },
  { month: "junio", leadsFound: 150, leadsContacted: 120, change: 12, positive: true },
  { month: "julio", leadsFound: 135, leadsContacted: 110, change: -3, positive: false },
  { month: "agosto", leadsFound: 180, leadsContacted: 145, change: 15, positive: true },
]

export function TrendChart({ 
  data = mockTrendData, 
  showHeader = true, 
  compact = false 
}: TrendChartProps) {
  const { t } = useLanguage()
  
  // Get current month data (last in array)
  const currentData = data[data.length - 1]
  
  if (!currentData) {
    return (
      <Card className={`${styles.trendChart} border-0 shadow-sm`}>
        <CardContent className={`${styles.chartContent} p-6`}>
          <div className={styles.emptyState}>
            <TrendingUp className={styles.emptyIcon} />
            <p className={`${styles.emptyText} text-muted-foreground text-center`}>
              No hay datos de tendencias disponibles
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`${styles.trendChart} border-0 shadow-sm hover:shadow-md transition-shadow`}>
      {showHeader && (
        <CardHeader className={styles.chartHeader}>
          <div className={styles.headerContent}>
            <TrendingUp className={`${styles.headerIcon} h-5 w-5 text-ritter-gold`} />
            <CardTitle className={`${styles.chartTitle} flex items-center gap-2`}>
              {t("dashboard.trend.title")}
            </CardTitle>
          </div>
          <CardDescription className={styles.chartDescription}>
            {t("dashboard.trend.subtitle")}
          </CardDescription>
        </CardHeader>
      )}
      
      <CardContent className={styles.chartContent}>
        <div className="space-y-4">
          {/* Current Month Highlight */}
          <div className={`${styles.currentHighlight} flex justify-between items-center p-4 bg-gradient-to-r from-ritter-gold/10 to-ritter-gold/5 rounded-lg border border-ritter-gold/20`}>
            <div className={styles.highlightItem}>
              <p className={`${styles.highlightLabel} text-sm text-muted-foreground capitalize`}>
                {currentData.month}
              </p>
              <p className={`${styles.highlightValue} ${styles.primary} text-2xl font-bold text-ritter-gold`}>
                {currentData.leadsFound}
              </p>
              <p className={`${styles.highlightDescription} text-xs text-muted-foreground`}>
                {t("dashboard.trend.found")}
              </p>
            </div>
            <div className={styles.highlightItem}>
              <p className={`${styles.highlightLabel} text-sm text-muted-foreground capitalize`}>
                {currentData.month}
              </p>
              <p className={`${styles.highlightValue} ${styles.secondary} text-2xl font-bold text-ritter-dark`}>
                {currentData.leadsContacted}
              </p>
              <p className={`${styles.highlightDescription} text-xs text-muted-foreground`}>
                {t("dashboard.trend.contacted")}
              </p>
            </div>
          </div>

          {/* Trend Indicator */}
          <div className={styles.trendIndicator}>
            <p className={`${styles.trendText} ${
              currentData.positive ? styles.positive : styles.negative
            } text-sm font-medium flex items-center justify-center gap-1 ${
              currentData.positive ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp className={`${styles.trendIcon} h-4 w-4`} />
              {currentData.positive ? '↑' : '↓'} {Math.abs(currentData.change)}% {t("time.from.month")}
            </p>
          </div>

          {/* Historical Trend (if not compact) */}
          {!compact && data.length > 1 && (
            <div className={`${styles.historicalTrend} space-y-3`}>
              <h4 className={`${styles.historyTitle} text-sm font-medium text-muted-foreground`}>
                Tendencia de últimos meses
              </h4>
              <div className={`${styles.historyGrid} grid gap-2`}>
                {data.slice(-4).map((item, index) => {
                  const conversionRate = ((item.leadsContacted / item.leadsFound) * 100).toFixed(1)
                  return (
                    <div key={item.month} className={`${styles.historyItem} flex items-center justify-between p-2 bg-gray-50 rounded`}>
                      <div className={`${styles.historyLeft} flex items-center gap-3`}>
                        <div className={`${styles.historyDot} ${
                          index === data.slice(-4).length - 1 ? styles.current : styles.past
                        } w-2 h-2 rounded-full ${
                          index === data.slice(-4).length - 1 ? 'bg-ritter-gold' : 'bg-gray-400'
                        }`} />
                        <span className={`${styles.historyMonth} text-sm font-medium capitalize`}>
                          {item.month}
                        </span>
                      </div>
                      <div className={`${styles.historyRight} flex items-center gap-4 text-sm`}>
                        <div className={styles.historyStats}>
                          <span className={`${styles.historyStat} text-muted-foreground`}>
                            {item.leadsFound} encontrados
                          </span>
                          <span className={`${styles.historyStat} text-muted-foreground`}>
                            {item.leadsContacted} contactados
                          </span>
                        </div>
                        <span className={`${styles.historyConversion} font-medium text-ritter-gold`}>
                          {conversionRate}%
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Quick Stats */}
          {!compact && (
            <div className={`${styles.quickStats} grid grid-cols-3 gap-4 pt-4 border-t`}>
              <div className={`${styles.quickStat} text-center`}>
                <p className={`${styles.quickStatValue} ${styles.primary} text-lg font-bold text-ritter-gold`}>
                  {data.reduce((sum, item) => sum + item.leadsFound, 0)}
                </p>
                <p className={`${styles.quickStatLabel} text-xs text-muted-foreground`}>
                  Total encontrados
                </p>
              </div>
              <div className={`${styles.quickStat} text-center`}>
                <p className={`${styles.quickStatValue} ${styles.secondary} text-lg font-bold text-ritter-dark`}>
                  {data.reduce((sum, item) => sum + item.leadsContacted, 0)}
                </p>
                <p className={`${styles.quickStatLabel} text-xs text-muted-foreground`}>
                  Total contactados
                </p>
              </div>
              <div className={`${styles.quickStat} text-center`}>
                <p className={`${styles.quickStatValue} ${styles.success} text-lg font-bold text-green-600`}>
                  {(
                    (data.reduce((sum, item) => sum + item.leadsContacted, 0) / 
                     data.reduce((sum, item) => sum + item.leadsFound, 0)) * 100
                  ).toFixed(1)}%
                </p>
                <p className={`${styles.quickStatLabel} text-xs text-muted-foreground`}>
                  Tasa conversión
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
