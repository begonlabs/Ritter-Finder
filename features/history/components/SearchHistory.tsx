"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MoreHorizontal, RefreshCw, Eye, Calendar, Trash2, Clock, AlertCircle, CheckCircle } from "lucide-react"
import { useSearchHistory } from "../hooks/useSearchHistory"
import type { SearchHistoryProps } from "../types"
import styles from "../styles/SearchHistory.module.css"

export function SearchHistory({
  onRerunSearch,
  onViewLeads,
  onDeleteSearch,
  showActions = true,
  compact = false
}: Omit<SearchHistoryProps, 'history'>) {
  const history = useSearchHistory()

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-3 w-3 text-green-500" />
      case 'failed':
        return <AlertCircle className="h-3 w-3 text-red-500" />
      case 'cancelled':
        return <Clock className="h-3 w-3 text-gray-500" />
      default:
        return <Clock className="h-3 w-3 text-blue-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200'
    }
  }

  if (history.isLoading) {
    return (
      <div className={styles.searchHistory}>
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner}></div>
          <span className={styles.loadingText}>Cargando historial...</span>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.searchHistory}>
      <div className={`${styles.header} ${compact ? styles.compact : ''}`}>
        <div className={styles.headerContent}>
          <div>
            <h3 className={`${styles.title} ${compact ? styles.compact : ''}`}>
              Historial de Búsquedas
            </h3>
            <p className={styles.subtitle}>
              Ver y repetir búsquedas anteriores ({history.stats.totalSearches} búsquedas)
            </p>
          </div>
          
          {!compact && (
            <div className={styles.headerActions}>
              <div className={styles.filters}>
                <div className={styles.searchWrapper}>
                  <Search className={styles.searchIcon} />
                  <input
                    placeholder="Filtrar historial..."
                    className={styles.searchInput}
                    value={history.searchTerm}
                    onChange={(e) => history.setSearchTerm(e.target.value)}
                  />
                </div>
                <select 
                  value={history.statusFilter} 
                  onChange={(e) => history.setStatusFilter(e.target.value)}
                  className={`${styles.searchInput} ${styles.statusFilter}`}
                >
                  <option value="all">Todos</option>
                  <option value="completed">Completadas</option>
                  <option value="failed">Fallidas</option>
                  <option value="cancelled">Canceladas</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className={`${styles.content} ${compact ? styles.compact : ''}`}>
        {!history.hasHistory ? (
          <div className={styles.emptyState}>
            <Search className={styles.emptyStateIcon} />
            <h3 className={styles.emptyStateTitle}>
              No hay historial de búsquedas
            </h3>
            <p className={styles.emptyStateDescription}>
              Comienza realizando tu primera búsqueda de leads
            </p>
          </div>
        ) : !history.hasFilteredResults ? (
          <div className={styles.emptyState}>
            <Search className={styles.emptyStateIcon} />
            <h3 className={styles.emptyStateTitle}>
              No se encontraron búsquedas
            </h3>
            <p className={styles.emptyStateDescription}>
              Intenta ajustar tus filtros de búsqueda
            </p>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Sitios Web</TableHead>
                  <TableHead>Tipo de Cliente</TableHead>
                  <TableHead className="text-center">Leads Encontrados</TableHead>
                  <TableHead className="text-center">Contactados</TableHead>
                  <TableHead>Estado</TableHead>
                  {showActions && <TableHead className="text-right">Acciones</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.history.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">
                            {format(new Date(item.date), "MMM d, yyyy")}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {format(new Date(item.date), "h:mm a")}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-48">
                        {item.websites.map((website, index) => (
                          <Badge key={index} variant="outline" className="bg-blue-50 text-xs">
                            {website.replace("www.", "").replace(".com", "").replace(".net", "").replace(".org", "")}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {item.clientType}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="font-medium">{item.leadsFound}</div>
                      {item.searchTime && (
                        <div className="text-xs text-muted-foreground">
                          {item.searchTime}s
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {item.leadsContacted}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(item.status)}
                        <Badge className={`border ${getStatusColor(item.status)}`}>
                          {item.status === 'completed' ? 'Completada' :
                           item.status === 'failed' ? 'Fallida' :
                           item.status === 'cancelled' ? 'Cancelada' : item.status}
                        </Badge>
                      </div>
                    </TableCell>
                    {showActions && (
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Acciones</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onRerunSearch(item)}>
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Repetir Búsqueda
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onViewLeads(item.id)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Ver Leads
                            </DropdownMenuItem>
                            {onDeleteSearch && (
                              <DropdownMenuItem 
                                onClick={() => onDeleteSearch(item.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Eliminar
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Quick Stats */}
        {history.hasHistory && !compact && (
          <div className={styles.statsGrid}>
            <div className={`${styles.statCard} ${styles.blue}`}>
              <div className={`${styles.statValue} ${styles.blue}`}>{history.stats.totalSearches}</div>
              <div className={`${styles.statLabel} ${styles.blue}`}>Búsquedas Totales</div>
            </div>
            <div className={`${styles.statCard} ${styles.green}`}>
              <div className={`${styles.statValue} ${styles.green}`}>{history.stats.totalLeadsFound}</div>
              <div className={`${styles.statLabel} ${styles.green}`}>Leads Encontrados</div>
            </div>
            <div className={`${styles.statCard} ${styles.purple}`}>
              <div className={`${styles.statValue} ${styles.purple}`}>{history.stats.averageSearchTime}s</div>
              <div className={`${styles.statLabel} ${styles.purple}`}>Tiempo Promedio</div>
            </div>
            <div className={`${styles.statCard} ${styles.orange}`}>
              <div className={`${styles.statValue} ${styles.orange}`}>{history.stats.successRate}%</div>
              <div className={`${styles.statLabel} ${styles.orange}`}>Tasa de Éxito</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
