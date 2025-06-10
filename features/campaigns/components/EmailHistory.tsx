"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MoreHorizontal, Copy, Eye, Mail, Calendar } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { format } from "date-fns"
import { useCampaignHistory } from "../hooks/useCampaignHistory"
import type { Campaign } from "../types"
import styles from "../styles/EmailHistory.module.css"

interface EmailHistoryProps {
  campaigns: Campaign[]
  onViewCampaign: (campaignId: string) => void
  onDuplicateCampaign: (campaignId: string) => void
}

export function EmailHistory({ campaigns, onViewCampaign, onDuplicateCampaign }: EmailHistoryProps) {
  const history = useCampaignHistory(campaigns, onViewCampaign, onDuplicateCampaign)

  return (
    <Card className={styles.emailHistory}>
      <CardHeader className={`${styles.header} flex flex-row items-center justify-between`}>
        <div className={styles.headerContent}>
          <CardTitle className={`${styles.title} text-xl`}>Historial de Campañas</CardTitle>
          <CardDescription className={styles.description}>
            Revisa el rendimiento de tus campañas de email anteriores
          </CardDescription>
        </div>
        <div className={`${styles.searchContainer} relative w-64`}>
          <Search className={`${styles.searchIcon} absolute left-2 top-2.5 h-4 w-4 text-muted-foreground`} />
          <Input
            placeholder="Buscar campañas..."
            className={`${styles.searchInput} pl-8`}
            value={history.searchTerm}
            onChange={(e) => history.setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      
      <CardContent className={styles.content}>
        <div className={`${styles.tableContainer} rounded-md border`}>
          <Table className={styles.table}>
            <TableHeader className={styles.tableHeader}>
              <TableRow className={styles.tableHeaderRow}>
                <TableHead className={styles.tableHead}>Fecha</TableHead>
                <TableHead className={styles.tableHead}>Asunto</TableHead>
                <TableHead className={`${styles.tableHead} ${styles.tableHeadCenter} text-center`}>Destinatarios</TableHead>
                <TableHead className={styles.tableHead}>Tasa de Apertura</TableHead>
                <TableHead className={styles.tableHead}>Tasa de Click</TableHead>
                <TableHead className={`${styles.tableHead} ${styles.tableHeadRight} text-right`}>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className={styles.tableBody}>
              {history.filteredCampaigns.length === 0 ? (
                <TableRow className={styles.tableRow}>
                  <TableCell colSpan={6} className={`${styles.tableCell} ${styles.emptyState} h-24 text-center`}>
                    <div className={styles.emptyStateText}>
                      {history.searchTerm ? 
                        "No se encontraron campañas que coincidan con tu búsqueda" :
                        "No hay campañas de email en el historial"
                      }
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                history.filteredCampaigns.map((campaign) => (
                  <TableRow key={campaign.id} className={styles.tableRow}>
                    <TableCell className={styles.tableCell}>
                      <div className={`${styles.dateCell} flex items-center gap-2`}>
                        <Calendar className={`${styles.dateIcon} h-4 w-4 text-muted-foreground`} />
                        {format(new Date(campaign.sentAt), "MMM d, yyyy")}
                      </div>
                    </TableCell>
                    
                    <TableCell className={styles.tableCell}>
                      <div className={`${styles.subjectCell} flex items-center gap-2`}>
                        <Mail className={`${styles.subjectIcon} h-4 w-4 text-muted-foreground`} />
                        <span className={`${styles.subjectText} font-medium`}>{campaign.subject}</span>
                      </div>
                    </TableCell>
                    
                    <TableCell className={`${styles.tableCell} ${styles.tableCellCenter} text-center`}>
                      <span className={styles.recipientCount}>{campaign.recipients.length}</span>
                    </TableCell>
                    
                    <TableCell className={styles.tableCell}>
                      <div className={`${styles.progressContainer} flex items-center gap-2`}>
                        <div className={styles.progressBar}>
                          <div 
                            className={`${styles.progressFill} ${styles.progressOpenRate}`}
                            style={{ width: `${campaign.openRate || 0}%` }}
                          />
                        </div>
                        <span className={`${styles.progressText} text-sm`}>{campaign.openRate || 0}%</span>
                      </div>
                    </TableCell>
                    
                    <TableCell className={styles.tableCell}>
                      <div className={`${styles.progressContainer} flex items-center gap-2`}>
                        <div className={styles.progressBar}>
                          <div 
                            className={`${styles.progressFill} ${styles.progressClickRate}`}
                            style={{ width: `${campaign.clickRate || 0}%` }}
                          />
                        </div>
                        <span className={`${styles.progressText} text-sm`}>{campaign.clickRate || 0}%</span>
                      </div>
                    </TableCell>
                    
                    <TableCell className={`${styles.tableCell} ${styles.tableCellRight} text-right`}>
                      <div className={styles.actionsDropdown}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className={styles.actionsButton}>
                              <MoreHorizontal className={`${styles.actionsIcon} h-4 w-4`} />
                              <span className="sr-only">Acciones</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className={styles.dropdownMenu}>
                            <DropdownMenuItem 
                              onClick={() => history.onViewCampaign(campaign.id)}
                              className={styles.dropdownItem}
                            >
                              <Eye className={`${styles.dropdownItemIcon} mr-2 h-4 w-4`} />
                              Ver Detalles
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => history.onDuplicateCampaign(campaign.id)}
                              className={styles.dropdownItem}
                            >
                              <Copy className={`${styles.dropdownItemIcon} mr-2 h-4 w-4`} />
                              Duplicar Campaña
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
