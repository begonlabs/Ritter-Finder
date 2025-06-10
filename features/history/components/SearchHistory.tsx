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
        return <CheckCircle className={styles.statusIcon} />
      case 'failed':
        return <AlertCircle className={styles.statusIcon} />
      case 'cancelled':
        return <Clock className={styles.statusIcon} />
      default:
        return <Clock className={styles.statusIcon} />
    }
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'completed':
        return styles.completed
      case 'failed':
        return styles.failed
      case 'cancelled':
        return styles.cancelled
      default:
        return styles.completed
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completada'
      case 'failed':
        return 'Fallida'
      case 'cancelled':
        return 'Cancelada'
      default:
        return status
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
                  <TableRow key={item.id} className={styles.tableRow}>
                    <TableCell>
                      <div className={styles.dateCell}>
                        <Calendar className={styles.dateIcon} />
                        <div className={styles.dateContent}>
                          <div className={styles.dateValue}>
                            {format(new Date(item.date), "MMM d, yyyy")}
                          </div>
                          <div className={styles.timeValue}>
                            {format(new Date(item.date), "h:mm a")}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={styles.websiteTags}>
                        {item.websites.map((website, index) => (
                          <div key={index} className={styles.websiteTag}>
                            {website.replace("www.", "").replace(".com", "").replace(".net", "").replace(".org", "")}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={styles.clientTypeBadge}>
                        {item.clientType}
                      </div>
                    </TableCell>
                    <TableCell className={styles.center}>
                      <div className={styles.resultsStats}>
                        <div className={styles.resultsValue}>{item.leadsFound}</div>
                        {item.searchTime && (
                          <div className={styles.searchTime}>
                            {item.searchTime}s
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className={styles.center}>
                      <div className={styles.resultsValue}>
                        {item.leadsContacted}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={styles.statusCell}>
                        {getStatusIcon(item.status)}
                        <div className={`${styles.statusBadge} ${getStatusClass(item.status)}`}>
                          {getStatusText(item.status)}
                        </div>
                      </div>
                    </TableCell>
                    {showActions && (
                      <TableCell className={styles.actionsCell}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className={styles.actionsButton}>
                              <MoreHorizontal className={styles.actionsIcon} />
                              <span className="sr-only">Acciones</span>
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className={styles.dropdownContent}>
                            <button 
                              className={styles.dropdownItem}
                              onClick={() => onRerunSearch(item)}
                            >
                              <RefreshCw className={styles.dropdownItemIcon} />
                              Repetir Búsqueda
                            </button>
                            <button 
                              className={styles.dropdownItem}
                              onClick={() => onViewLeads(item.id)}
                            >
                              <Eye className={styles.dropdownItemIcon} />
                              Ver Leads
                            </button>
                            {onDeleteSearch && (
                              <button 
                                className={`${styles.dropdownItem} ${styles.danger}`}
                                onClick={() => onDeleteSearch(item.id)}
                              >
                                <Trash2 className={styles.dropdownItemIcon} />
                                Eliminar
                              </button>
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
