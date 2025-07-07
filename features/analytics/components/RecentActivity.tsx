"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users, Search, Mail, Download } from "lucide-react"
import { useLanguage, formatMessage } from "@/lib/language-context"
import { useActivityTimeline } from "../../history/hooks/useActivityTimeline"
import type { ActivityItem as HistoryActivityItem } from "../../history/types"
import styles from "../styles/RecentActivity.module.css"

interface ActivityItem {
  id: string
  type: 'search' | 'campaign' | 'export'
  title: string
  description: string
  date: string
  metadata?: {
    leadsFound?: number
    clientType?: string
    recipients?: number
    subject?: string
  }
}

interface RecentActivityProps {
  showHeader?: boolean
  compact?: boolean
  maxItems?: number
}

// Data adapter to convert history ActivityItem to analytics ActivityItem
const adaptHistoryActivity = (historyItem: HistoryActivityItem): ActivityItem => {
  // Map activity types from history to analytics
  let type: 'search' | 'campaign' | 'export' = 'search'
  let title = historyItem.title
  let description = historyItem.description

  // Use the correct activity types from history module
  switch (historyItem.type) {
    case 'search':
      type = 'search'
      break
    case 'campaign':
      type = 'campaign'
      break
    case 'export':
      type = 'export'
      break
    case 'import':
    case 'lead_update':
    default:
      type = 'search' // Default fallback
  }

  // Extract metadata from the history item
  const metadata: ActivityItem['metadata'] = {
    leadsFound: historyItem.metadata?.leadsCount,
    clientType: historyItem.metadata?.clientType,
    recipients: historyItem.metadata?.recipients,
    subject: historyItem.metadata?.subject
  }

  return {
    id: historyItem.id,
    type,
    title,
    description,
    date: historyItem.timestamp,
    metadata
  }
}

function getActivityIcon(type: string) {
  switch (type) {
    case 'search':
      return <Search className={`${styles.activityIconInner} h-4 w-4 text-ritter-gold`} />
    case 'campaign':
      return <Mail className={`${styles.activityIconInner} h-4 w-4 text-blue-600`} />
    case 'export':
      return <Download className={`${styles.activityIconInner} h-4 w-4 text-green-600`} />
    default:
      return <Users className={`${styles.activityIconInner} h-4 w-4 text-gray-500`} />
  }
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) {
    return 'Hace unos segundos'
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `Hace ${diffInMinutes} ${diffInMinutes === 1 ? 'minuto' : 'minutos'}`
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `Hace ${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`
  }
  
  return date.toLocaleDateString('es-ES', { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function RecentActivity({ 
  showHeader = true, 
  compact = false, 
  maxItems = 5 
}: RecentActivityProps) {
  const { t } = useLanguage()
  
  // Use the activity timeline hook from history module
  const { activities, isLoading, error } = useActivityTimeline()

  // Convert history activities to analytics format and limit results
  const displayItems = activities
    .slice(0, maxItems)
    .map(adaptHistoryActivity)

  if (isLoading) {
    return (
      <Card className={`${styles.recentActivity} border-0 shadow-sm`}>
        {showHeader && (
          <CardHeader className={styles.activityHeader}>
            <div className={styles.headerContent}>
              <Users className={`${styles.headerIcon} h-5 w-5 text-ritter-gold`} />
              <CardTitle className={`${styles.activityTitle} flex items-center gap-2`}>
                {t("dashboard.activity")}
              </CardTitle>
            </div>
            <CardDescription className={styles.activityDescription}>
              {t("dashboard.activity.desc")}
            </CardDescription>
          </CardHeader>
        )}
        
        <CardContent className={styles.activityContent}>
          <div className={`${styles.activityList} space-y-4`}>
            {[...Array(3)].map((_, index) => (
              <div key={index} className={`${styles.activityItem} flex items-start gap-4 pb-4`}>
                <div className={`${styles.activityIcon} ${styles.search} bg-gray-200 p-2 rounded-full animate-pulse`}>
                  <div className="h-4 w-4 bg-gray-300 rounded" />
                </div>
                <div className={`${styles.activityDetails} flex-1 min-w-0`}>
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`${styles.recentActivity} border-0 shadow-sm hover:shadow-md transition-shadow`}>
      {showHeader && (
        <CardHeader className={styles.activityHeader}>
          <div className={styles.headerContent}>
            <Users className={`${styles.headerIcon} h-5 w-5 text-ritter-gold`} />
            <CardTitle className={`${styles.activityTitle} flex items-center gap-2`}>
              {t("dashboard.activity")}
            </CardTitle>
          </div>
          <CardDescription className={styles.activityDescription}>
            {t("dashboard.activity.desc")}
          </CardDescription>
        </CardHeader>
      )}
      
      <CardContent className={styles.activityContent}>
        <div className={`${styles.activityList} space-y-4`}>
          {displayItems.map((item) => (
            <div 
              key={item.id} 
              className={`${styles.activityItem} flex items-start gap-4 pb-4 border-b last:border-0`}
            >
              <div className={`${styles.activityIcon} ${styles[item.type]} bg-ritter-gold/10 p-2 rounded-full`}>
                {getActivityIcon(item.type)}
              </div>
              <div className={`${styles.activityDetails} flex-1 min-w-0`}>
                <p className={`${styles.activityItemTitle} font-medium text-sm`}>
                  {item.title}
                </p>
                <p className={`${styles.activityItemDescription} text-sm text-muted-foreground`}>
                  {item.description}
                </p>
                <div className={styles.activityMeta}>
                  <p className={`${styles.activityTime} text-xs text-muted-foreground mt-1`}>
                    {formatRelativeTime(item.date)}
                  </p>
                </div>
              </div>
              {!compact && item.metadata && (
                <div className={`${styles.activityMetadata} text-right`}>
                  {item.type === 'search' && item.metadata.leadsFound && (
                    <div className={`${styles.metadataValue} ${styles.search} text-xs text-ritter-gold font-medium`}>
                      {item.metadata.leadsFound} leads
                    </div>
                  )}
                  {item.type === 'campaign' && item.metadata.recipients && (
                    <div className={`${styles.metadataValue} ${styles.campaign} text-xs text-blue-600 font-medium`}>
                      {item.metadata.recipients} destinatarios
                    </div>
                  )}
                  {item.type === 'export' && item.metadata.leadsFound && (
                    <div className={`${styles.metadataValue} ${styles.export} text-xs text-green-600 font-medium`}>
                      {item.metadata.leadsFound} registros
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          
          {displayItems.length === 0 && !isLoading && (
            <div className={`${styles.emptyState} text-center py-8`}>
              <Users className={`${styles.emptyIcon} h-12 w-12 text-gray-300 mx-auto mb-4`} />
              <p className={`${styles.emptyTitle} text-gray-500`}>No hay actividad reciente</p>
              <p className={`${styles.emptyDescription} text-sm text-gray-400`}>
                La actividad aparecerá aquí cuando realices búsquedas o campañas
              </p>
            </div>
          )}

          {error && (
            <div className={`${styles.emptyState} text-center py-8`}>
              <Users className={`${styles.emptyIcon} h-12 w-12 text-red-300 mx-auto mb-4`} />
              <p className={`${styles.emptyTitle} text-red-500`}>Error al cargar actividad</p>
              <p className={`${styles.emptyDescription} text-sm text-red-400`}>
                {error}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 