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

interface ActivityTimelineComponentProps extends Omit<ActivityTimelineProps, 'activities'> {
  onViewDetails: (activityId: string) => void
  maxItems?: number
  showFilters?: boolean
  compact?: boolean
  groupByDate?: boolean
}

export function ActivityTimeline({
  onViewDetails,
  maxItems = 50,
  showFilters = true,
  compact = false,
  groupByDate = true
}: ActivityTimelineComponentProps) {
  const timeline = useActivityTimeline(maxItems)

  const getActivityIcon = (type: string, status: string) => {
    const iconClass = `h-4 w-4 ${status === 'error' ? 'text-red-500' : 
                                 status === 'success' ? 'text-green-500' : 
                                 'text-blue-500'}`

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

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'search':
        return 'bg-blue-100 text-blue-800'
      case 'campaign':
        return 'bg-purple-100 text-purple-800'
      case 'export':
        return 'bg-green-100 text-green-800'
      case 'import':
        return 'bg-orange-100 text-orange-800'
      case 'lead_update':
        return 'bg-indigo-100 text-indigo-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-3 w-3 text-green-500" />
      case 'error':
        return <AlertCircle className="h-3 w-3 text-red-500" />
      case 'pending':
        return <Clock className="h-3 w-3 text-blue-500" />
      default:
        return <Clock className="h-3 w-3 text-gray-500" />
    }
  }

  const ActivityItem = ({ activity }: { activity: ActivityItem }) => (
    <div className="flex items-start gap-3 group">
      {/* Activity Icon */}
      <div className={`flex-shrink-0 p-2 rounded-full border-2 border-white shadow-sm ${
        activity.status === 'error' ? 'bg-red-50' :
        activity.status === 'success' ? 'bg-green-50' :
        'bg-blue-50'
      }`}>
        {getActivityIcon(activity.type, activity.status)}
      </div>

      {/* Activity Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {activity.title}
              </h4>
              <Badge className={getActivityColor(activity.type)}>
                {getActivityTypeText(activity.type)}
              </Badge>
              {getStatusIcon(activity.status)}
            </div>
            
            <p className="text-sm text-gray-600 mb-2">
              {activity.description}
            </p>

            {/* Activity Metadata */}
            {activity.metadata && Object.keys(activity.metadata).length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {activity.metadata.leadsCount && (
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {activity.metadata.leadsCount} leads
                  </span>
                )}
                {activity.metadata.duration && (
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {activity.metadata.duration}s
                  </span>
                )}
                {activity.metadata.exportFormat && (
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {activity.metadata.exportFormat.toUpperCase()}
                  </span>
                )}
                {activity.metadata.errorMessage && (
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                    {activity.metadata.errorMessage}
                  </span>
                )}
              </div>
            )}

            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>
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

          {/* Action Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetails(activity.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Eye className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  )

  if (timeline.isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-muted-foreground">Cargando actividad...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className={compact ? "pb-4" : ""}>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className={compact ? "text-lg" : "text-xl"}>
              Línea de Tiempo de Actividad
            </CardTitle>
            <CardDescription>
              Actividad reciente en tu cuenta ({timeline.stats.totalActivities} actividades)
            </CardDescription>
          </div>

          {showFilters && !compact && (
            <div className="flex items-center gap-2">
              <Select value={timeline.typeFilter} onValueChange={timeline.setTypeFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="search">Búsquedas</SelectItem>
                  <SelectItem value="campaign">Campañas</SelectItem>
                  <SelectItem value="export">Exportaciones</SelectItem>
                  <SelectItem value="import">Importaciones</SelectItem>
                  <SelectItem value="lead_update">Actualizaciones</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={timeline.statusFilter} onValueChange={timeline.setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="success">Éxito</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="pending">Pendiente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {!timeline.hasActivities ? (
          <div className="text-center py-12">
            <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay actividad reciente
            </h3>
            <p className="text-gray-500">
              Comienza a usar la plataforma para ver tu actividad aquí
            </p>
          </div>
        ) : !timeline.hasFilteredResults ? (
          <div className="text-center py-12">
            <Filter className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay actividad que coincida
            </h3>
            <p className="text-gray-500">
              Intenta ajustar tus filtros
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {groupByDate ? (
              /* Grouped by Date */
              Object.entries(timeline.groupedActivities).map(([date, activities]) => (
                <div key={date} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-sm font-medium text-gray-900">
                      {format(new Date(date), "EEEE, d 'de' MMMM", { locale: es })}
                    </h3>
                    <Separator className="flex-1" />
                    <Badge variant="secondary" className="text-xs">
                      {activities.length} actividad{activities.length !== 1 ? 'es' : ''}
                    </Badge>
                  </div>
                  
                  <div className="space-y-4 pl-4 border-l-2 border-gray-200">
                    {activities.map((activity, index) => (
                      <div key={activity.id}>
                        <ActivityItem activity={activity} />
                        {index < activities.length - 1 && <div className="h-4" />}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              /* Simple List */
              <div className="space-y-4">
                {timeline.activities.map((activity, index) => (
                  <div key={activity.id}>
                    <ActivityItem activity={activity} />
                    {index < timeline.activities.length - 1 && <Separator className="my-4" />}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quick Stats */}
        {timeline.hasActivities && !compact && (
          <div className="mt-8 pt-6 border-t">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-lg font-semibold text-blue-700">{timeline.stats.activitiesLast24h}</div>
                <div className="text-xs text-blue-600">Últimas 24h</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-lg font-semibold text-green-700">{timeline.stats.activitiesLast7d}</div>
                <div className="text-xs text-green-600">Últimos 7 días</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-lg font-semibold text-purple-700">{timeline.stats.successRate}%</div>
                <div className="text-xs text-purple-600">Tasa de Éxito</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-lg font-semibold text-orange-700">{timeline.stats.failedActivities}</div>
                <div className="text-xs text-orange-600">Actividades Fallidas</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
