"use client"

import { formatDistanceToNow, format } from "date-fns"
import { es } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { 
  Search, 
  Mail, 
  Download, 
  Upload, 
  UserCheck, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Eye,
  Filter
} from "lucide-react"
import { useActivityTimeline } from "../hooks/useActivityTimeline"
import type { ActivityTimelineProps, ActivityItem } from "../types"
import styles from "../styles/ActivityTimeline.module.css"
import { memo, useMemo } from "react"

interface ActivityTimelineComponentProps extends Omit<ActivityTimelineProps, 'activities'> {
  onViewDetails: (activityId: string) => void
  maxItems?: number
  showFilters?: boolean
  compact?: boolean
  groupByDate?: boolean
}

// Move helper functions outside component to prevent recreation on each render
const getActivityIcon = (type: string, status: string) => {
  const iconClass = `${styles.activityIconSvg} ${
    status === 'error' ? styles.error : 
    status === 'success' ? styles.success : 
    styles.search
  }`

  switch (type) {
    case 'search':
      return <Search className={iconClass} />
    case 'campaign':
      return <Mail className={iconClass} />
    case 'export':
      return <Download className={iconClass} />
    case 'import':
      return <Upload className={iconClass} />
    case 'lead_update':
      return <UserCheck className={iconClass} />
    default:
      return <Clock className={iconClass} />
  }
}

const getActivityIconClass = (type: string, status: string) => {
  let baseClass = `${styles.activityIcon}`
  
  switch (type) {
    case 'search':
      baseClass += ` ${styles.search}`
      break
    case 'campaign':
      baseClass += ` ${styles.campaign}`
      break
    case 'export':
      baseClass += ` ${styles.export}`
      break
    case 'import':
      baseClass += ` ${styles.import}`
      break
    case 'lead_update':
      baseClass += ` ${styles.leadUpdate}`
      break
    default:
      baseClass += ` ${styles.system}`
  }

  if (status === 'error') baseClass += ` ${styles.error}`
  if (status === 'success') baseClass += ` ${styles.success}`

  return baseClass
}

const getActivityMarkerClass = (type: string, status: string) => {
  let baseClass = `${styles.activityMarker}`
  
  switch (type) {
    case 'search':
      baseClass += ` ${styles.search}`
      break
    case 'campaign':
      baseClass += ` ${styles.campaign}`
      break
    case 'export':
      baseClass += ` ${styles.export}`
      break
    case 'import':
      baseClass += ` ${styles.import}`
      break
    case 'lead_update':
      baseClass += ` ${styles.leadUpdate}`
      break
    default:
      baseClass += ` ${styles.system}`
  }

  if (status === 'error') baseClass += ` ${styles.error}`

  return baseClass
}

const getActivityTypeText = (type: string) => {
  switch (type) {
    case 'search':
      return 'Búsqueda'
    case 'campaign':
      return 'Campaña'
    case 'export':
      return 'Exportación'
    case 'import':
      return 'Importación'
    case 'lead_update':
      return 'Actualización'
    default:
      return type
  }
}

const getActivityTypeBadgeClass = (type: string) => {
  switch (type) {
    case 'search':
      return `${styles.activityTypeBadge} ${styles.search}`
    case 'campaign':
      return `${styles.activityTypeBadge} ${styles.campaign}`
    case 'export':
      return `${styles.activityTypeBadge} ${styles.export}`
    case 'import':
      return `${styles.activityTypeBadge} ${styles.import}`
    case 'lead_update':
      return `${styles.activityTypeBadge} ${styles.leadUpdate}`
    default:
      return styles.activityTypeBadge
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'success':
      return <CheckCircle className={styles.activityStatusIcon} />
    case 'error':
      return <AlertCircle className={styles.activityStatusIcon} />
    case 'pending':
      return <Clock className={styles.activityStatusIcon} />
    default:
      return <Clock className={styles.activityStatusIcon} />
  }
}

// Memoized activity item component to prevent unnecessary re-renders
const ActivityItemComponent = memo(({ 
  activity, 
  onViewDetails 
}: { 
  activity: ActivityItem
  onViewDetails: (activityId: string) => void 
}) => (
  <div className={styles.activityItem}>
    {/* Activity Marker */}
    <div className={getActivityMarkerClass(activity.type, activity.status)}></div>

    {/* Activity Icon */}
    <div className={getActivityIconClass(activity.type, activity.status)}>
      {getActivityIcon(activity.type, activity.status)}
    </div>

    {/* Activity Content */}
    <div className={styles.activityContent}>
      <div className={styles.activityHeader}>
        <div>
          <div className={styles.activityTitle}>
            {activity.title}
          </div>
          
          <p className={styles.activityDescription}>
            {activity.description}
          </p>

          {/* Activity Badges */}
          <div className={styles.activityBadges}>
            <div className={getActivityTypeBadgeClass(activity.type)}>
              {getActivityTypeText(activity.type)}
            </div>
            {getStatusIcon(activity.status)}
          </div>

          {/* Activity Metadata */}
          {activity.metadata && Object.keys(activity.metadata).length > 0 && (
            <div className={styles.activityMetadata}>
              {activity.metadata.leadsCount && (
                <span className={styles.metadataTag}>
                  {activity.metadata.leadsCount} leads
                </span>
              )}
              {activity.metadata.duration && (
                <span className={styles.metadataTag}>
                  {activity.metadata.duration}s
                </span>
              )}
              {activity.metadata.exportFormat && (
                <span className={styles.metadataTag}>
                  {activity.metadata.exportFormat.toUpperCase()}
                </span>
              )}
              {activity.metadata.errorMessage && (
                <span className={`${styles.metadataTag} ${styles.error}`}>
                  {activity.metadata.errorMessage}
                </span>
              )}
            </div>
          )}

          {/* Activity Footer */}
          <div className={styles.activityFooter}>
            <div className={styles.activityTime}>
              <span className={styles.activityTimestamp}>
                {formatDistanceToNow(new Date(activity.timestamp), { 
                  addSuffix: true, 
                  locale: es 
                })}
              </span>
              <span>
                {format(new Date(activity.timestamp), "h:mm a")}
              </span>
            </div>
          </div>
        </div>

        {/* View Details Button */}
        <button
          onClick={() => onViewDetails(activity.id)}
          className={styles.viewDetailsButton}
        >
          <Eye className={styles.viewDetailsIcon} />
        </button>
      </div>
    </div>
  </div>
))

ActivityItemComponent.displayName = 'ActivityItemComponent'

export function ActivityTimeline({
  onViewDetails,
  maxItems = 50,
  showFilters = true,
  compact = false,
  groupByDate = true
}: ActivityTimelineComponentProps) {
  const timeline = useActivityTimeline(maxItems)

  // Memoize loading state to prevent unnecessary re-renders
  const loadingContent = useMemo(() => (
    <div className={styles.activityTimeline}>
      <div className={styles.loadingState}>
        <div className={styles.loadingSpinner}></div>
        <span className={styles.loadingText}>Cargando actividad...</span>
      </div>
    </div>
  ), [])

  // Memoize empty states to prevent unnecessary re-renders
  const emptyStates = useMemo(() => ({
    noActivity: (
      <div className={styles.emptyState}>
        <Clock className={styles.emptyStateIcon} />
        <h3 className={styles.emptyStateTitle}>
          No hay actividad reciente
        </h3>
        <p className={styles.emptyStateDescription}>
          Comienza a usar la plataforma para ver tu actividad aquí
        </p>
      </div>
    ),
    noFilteredResults: (
      <div className={styles.emptyState}>
        <Filter className={styles.emptyStateIcon} />
        <h3 className={styles.emptyStateTitle}>
          No hay actividad que coincida
        </h3>
        <p className={styles.emptyStateDescription}>
          Intenta ajustar tus filtros
        </p>
      </div>
    )
  }), [])

  if (timeline.isLoading) {
    return loadingContent
  }

  return (
    <div className={styles.activityTimeline}>
      <div className={`${styles.header} ${compact ? styles.compact : ''}`}>
        <div className={styles.headerContent}>
          <div>
            <h3 className={`${styles.title} ${compact ? styles.compact : ''}`}>
              Línea de Tiempo de Actividad
            </h3>
            <p className={styles.subtitle}>
              Actividad reciente en tu cuenta ({timeline.stats.totalActivities} actividades)
            </p>
          </div>

          {showFilters && !compact && (
            <div className={styles.headerActions}>
              <div className={styles.filters}>
                <select 
                  value={timeline.typeFilter} 
                  onChange={(e) => timeline.setTypeFilter(e.target.value)}
                  className={`${styles.searchInput} ${styles.typeFilter}`}
                >
                  <option value="all">Todos los tipos</option>
                  <option value="search">Búsquedas</option>
                  <option value="campaign">Campañas</option>
                  <option value="export">Exportaciones</option>
                  <option value="import">Importaciones</option>
                  <option value="lead_update">Actualizaciones</option>
                </select>
                
                <select 
                  value={timeline.statusFilter} 
                  onChange={(e) => timeline.setStatusFilter(e.target.value)}
                  className={`${styles.searchInput} ${styles.statusFilter}`}
                >
                  <option value="all">Todos</option>
                  <option value="success">Éxito</option>
                  <option value="error">Error</option>
                  <option value="pending">Pendiente</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={`${styles.content} ${compact ? styles.compact : ''}`}>
        {!timeline.hasActivities ? emptyStates.noActivity : 
         !timeline.hasFilteredResults ? emptyStates.noFilteredResults : (
          <div className={styles.timelineContainer}>
            {groupByDate ? (
              /* Grouped by Date */
              Object.entries(timeline.groupedActivities).map(([date, activities]) => (
                <div key={date} className={styles.dateGroup}>
                  <div className={styles.dateHeader}>
                    <h3 className={styles.dateTitle}>
                      {format(new Date(date), "EEEE, d 'de' MMMM", { locale: es })}
                    </h3>
                    <div className={styles.dateSeparator}></div>
                    <div className={styles.dateCount}>
                      {activities.length} actividad{activities.length !== 1 ? 'es' : ''}
                    </div>
                  </div>
                  
                  <div className={styles.activityList}>
                    {activities.map((activity) => (
                      <ActivityItemComponent 
                        key={activity.id} 
                        activity={activity} 
                        onViewDetails={onViewDetails}
                      />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              /* Simple List */
              <div className={styles.simpleList}>
                {timeline.activities.map((activity) => (
                  <div key={activity.id} className={styles.simpleListItem}>
                    <ActivityItemComponent 
                      activity={activity} 
                      onViewDetails={onViewDetails}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quick Stats */}
        {timeline.hasActivities && !compact && (
          <div className={styles.statsSection}>
            <div className={styles.statsGrid}>
              <div className={`${styles.statCard} ${styles.blue}`}>
                <div className={`${styles.statValue} ${styles.blue}`}>{timeline.stats.activitiesLast24h}</div>
                <div className={`${styles.statLabel} ${styles.blue}`}>Últimas 24h</div>
              </div>
              <div className={`${styles.statCard} ${styles.green}`}>
                <div className={`${styles.statValue} ${styles.green}`}>{timeline.stats.activitiesLast7d}</div>
                <div className={`${styles.statLabel} ${styles.green}`}>Últimos 7 días</div>
              </div>
              <div className={`${styles.statCard} ${styles.purple}`}>
                <div className={`${styles.statValue} ${styles.purple}`}>{timeline.stats.successRate}%</div>
                <div className={`${styles.statLabel} ${styles.purple}`}>Tasa de Éxito</div>
              </div>
              <div className={`${styles.statCard} ${styles.orange}`}>
                <div className={`${styles.statValue} ${styles.orange}`}>{timeline.stats.failedActivities}</div>
                <div className={`${styles.statLabel} ${styles.orange}`}>Actividades Fallidas</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
