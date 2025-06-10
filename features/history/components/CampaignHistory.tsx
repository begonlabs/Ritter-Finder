"use client"

import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Search, MoreHorizontal, Copy, Eye, Mail, Calendar, Trash2, Clock, Send } from "lucide-react"
import { useCampaignHistory } from "../hooks/useCampaignHistory"
import type { CampaignHistoryProps } from "../types"
import styles from "../styles/CampaignHistory.module.css"

export function CampaignHistory({
  onViewCampaign,
  onDuplicateCampaign,
  onDeleteCampaign,
  showActions = true,
  compact = false
}: Omit<CampaignHistoryProps, 'campaigns'>) {
  const campaigns = useCampaignHistory()

  const getCampaignTypeText = (type?: string) => {
    switch (type) {
      case 'promotional':
        return 'Promocional'
      case 'follow_up':
        return 'Seguimiento'
      case 'newsletter':
        return 'Newsletter'
      default:
        return 'General'
    }
  }

  const getCampaignTypeClass = (type?: string) => {
    switch (type) {
      case 'promotional':
        return styles.promotional
      case 'follow_up':
        return styles.followUp
      case 'newsletter':
        return styles.newsletter
      default:
        return styles.default
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'sent':
        return 'Enviada'
      case 'draft':
        return 'Borrador'
      case 'scheduled':
        return 'Programada'
      case 'failed':
        return 'Fallida'
      default:
        return status
    }
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'sent':
        return styles.sent
      case 'draft':
        return styles.draft
      case 'scheduled':
        return styles.scheduled
      case 'failed':
        return styles.failed
      default:
        return styles.draft
    }
  }

  if (campaigns.isLoading) {
    return (
      <div className={styles.campaignHistory}>
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner}></div>
          <span className={styles.loadingText}>Cargando historial de campañas...</span>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.campaignHistory}>
      <div className={`${styles.header} ${compact ? styles.compact : ''}`}>
        <div className={styles.headerContent}>
          <div>
            <h3 className={`${styles.title} ${compact ? styles.compact : ''}`}>
              Historial de Campañas
            </h3>
            <p className={styles.subtitle}>
              Seguimiento del rendimiento de tus campañas de email ({campaigns.stats.totalCampaigns} campañas)
            </p>
          </div>
          
          {!compact && (
            <div className={styles.headerActions}>
              <div className={styles.filters}>
                <div className={styles.searchWrapper}>
                  <Search className={styles.searchIcon} />
                  <input
                    placeholder="Buscar campañas..."
                    className={styles.searchInput}
                    value={campaigns.searchTerm}
                    onChange={(e) => campaigns.setSearchTerm(e.target.value)}
                  />
                </div>
                <select 
                  value={campaigns.statusFilter} 
                  onChange={(e) => campaigns.setStatusFilter(e.target.value)}
                  className={`${styles.searchInput} ${styles.statusFilter}`}
                >
                  <option value="all">Todas</option>
                  <option value="sent">Enviadas</option>
                  <option value="draft">Borradores</option>
                  <option value="scheduled">Programadas</option>
                  <option value="failed">Fallidas</option>
                </select>
                <select 
                  value={campaigns.typeFilter} 
                  onChange={(e) => campaigns.setTypeFilter(e.target.value)}
                  className={`${styles.searchInput} ${styles.typeFilter}`}
                >
                  <option value="all">Todos los tipos</option>
                  <option value="promotional">Promocional</option>
                  <option value="follow_up">Seguimiento</option>
                  <option value="newsletter">Newsletter</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className={`${styles.content} ${compact ? styles.compact : ''}`}>
        {!campaigns.hasCampaigns ? (
          <div className={styles.emptyState}>
            <Mail className={styles.emptyStateIcon} />
            <h3 className={styles.emptyStateTitle}>
              No hay campañas de email
            </h3>
            <p className={styles.emptyStateDescription}>
              Crea tu primera campaña para comenzar a ver el historial
            </p>
          </div>
        ) : !campaigns.hasFilteredResults ? (
          <div className={styles.emptyState}>
            <Search className={styles.emptyStateIcon} />
            <h3 className={styles.emptyStateTitle}>
              No se encontraron campañas
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
                  <TableHead>Asunto</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-center">Destinatarios</TableHead>
                  <TableHead>Tasa de Apertura</TableHead>
                  <TableHead>Tasa de Clicks</TableHead>
                  <TableHead>Estado</TableHead>
                  {showActions && <TableHead className="text-right">Acciones</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.campaigns.map((campaign) => (
                  <TableRow key={campaign.id} className={styles.tableRow}>
                    <TableCell>
                      <div className={styles.dateCell}>
                        <Calendar className={styles.dateIcon} />
                        <div className={styles.dateContent}>
                          <div className={styles.dateValue}>
                            {format(new Date(campaign.sentAt), "MMM d, yyyy")}
                          </div>
                          <div className={styles.timeValue}>
                            {format(new Date(campaign.sentAt), "h:mm a")}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={styles.subjectCell}>
                        <div className={styles.subjectTitle} title={campaign.subject}>
                          {campaign.subject}
                        </div>
                        <div className={styles.subjectSender}>
                          {campaign.senderName}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={`${styles.campaignTypeBadge} ${getCampaignTypeClass(campaign.metadata?.campaign_type)}`}>
                        {getCampaignTypeText(campaign.metadata?.campaign_type)}
                      </div>
                    </TableCell>
                    <TableCell className={styles.center}>
                      <div className={styles.recipientsCell}>
                        <Send className={styles.recipientsIcon} />
                        <span className={styles.recipientsValue}>{campaign.recipients}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {campaign.status === 'sent' ? (
                        <div className={styles.progressCell}>
                          <div className={styles.progressContainer}>
                            <div className={styles.progressHeader}>
                              <span className={styles.progressValue}>{campaign.openRate.toFixed(1)}%</span>
                            </div>
                            <div className={styles.progressBar}>
                              <div 
                                className={styles.progressFill} 
                                style={{ width: `${campaign.openRate}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span className={styles.progressUnavailable}>-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {campaign.status === 'sent' ? (
                        <div className={styles.progressCell}>
                          <div className={styles.progressContainer}>
                            <div className={styles.progressHeader}>
                              <span className={styles.progressValue}>{campaign.clickRate.toFixed(1)}%</span>
                            </div>
                            <div className={styles.progressBar}>
                              <div 
                                className={styles.progressFill} 
                                style={{ width: `${campaign.clickRate}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span className={styles.progressUnavailable}>-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className={`${styles.statusBadge} ${getStatusClass(campaign.status)}`}>
                        {getStatusText(campaign.status)}
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
                              onClick={() => onViewCampaign(campaign.id)}
                            >
                              <Eye className={styles.dropdownItemIcon} />
                              Ver Detalles
                            </button>
                            <button 
                              className={styles.dropdownItem}
                              onClick={() => onDuplicateCampaign(campaign.id)}
                            >
                              <Copy className={styles.dropdownItemIcon} />
                              Duplicar Campaña
                            </button>
                            {onDeleteCampaign && (
                              <button 
                                className={`${styles.dropdownItem} ${styles.danger}`}
                                onClick={() => onDeleteCampaign(campaign.id)}
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

        {/* Campaign Stats */}
        {campaigns.hasCampaigns && !compact && (
          <div className={styles.statsGrid}>
            <div className={`${styles.statCard} ${styles.blue}`}>
              <div className={`${styles.statValue} ${styles.blue}`}>{campaigns.stats.totalCampaigns}</div>
              <div className={`${styles.statLabel} ${styles.blue}`}>Campañas Totales</div>
            </div>
            <div className={`${styles.statCard} ${styles.green}`}>
              <div className={`${styles.statValue} ${styles.green}`}>{campaigns.stats.totalRecipients}</div>
              <div className={`${styles.statLabel} ${styles.green}`}>Destinatarios</div>
            </div>
            <div className={`${styles.statCard} ${styles.purple}`}>
              <div className={`${styles.statValue} ${styles.purple}`}>{campaigns.stats.averageOpenRate}%</div>
              <div className={`${styles.statLabel} ${styles.purple}`}>Apertura Promedio</div>
            </div>
            <div className={`${styles.statCard} ${styles.orange}`}>
              <div className={`${styles.statValue} ${styles.orange}`}>{campaigns.stats.averageClickRate}%</div>
              <div className={`${styles.statLabel} ${styles.orange}`}>Clicks Promedio</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 