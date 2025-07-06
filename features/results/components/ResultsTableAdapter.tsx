"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Eye,
  MapPin,
  Building,
  Star,
  ExternalLink,
  Filter,
  SortAsc,
  SortDesc,
  Download,
  Globe,
  Mail,
  CheckCircle,
  XCircle,
  Phone,
} from "lucide-react"
import { useLanguage, formatMessage } from "@/lib/language-context"
import { LeadDetailsModal } from "./LeadDetailsModal"
import { useResultsFiltering } from "../hooks/useResultsFiltering"
import type { Lead } from "../types"
import styles from "../styles/ResultsTable.module.css"

interface ResultsTableAdapterProps {
  leads: Lead[]
  selectedLeads: string[]
  onSelectLead: (id: string) => void
  onSelectAll: (select: boolean) => void
  onProceedToCampaign?: () => void
  showActions?: boolean
  // ✅ New prop for showing no results with criteria message
  noResultsWithCriteria?: boolean
}

export function ResultsTableAdapter({ 
  leads, 
  selectedLeads, 
  onSelectLead, 
  onSelectAll, 
  onProceedToCampaign,
  showActions = true,
  noResultsWithCriteria = false
}: ResultsTableAdapterProps) {
  const { t } = useLanguage()
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const {
    filters,
    sorting,
    filteredLeads,
    actions,
  } = useResultsFiltering(leads, selectedLeads)

  // Map quality score to CSS module classes
  const getQualityStyle = (score: number): string => {
    if (score >= 4) return styles.confidenceHigh
    if (score >= 3) return styles.confidenceMedium
    return styles.confidenceLow
  }

  // Validation indicators component
  const ValidationIndicators = ({ lead }: { lead: Lead }) => (
    <div className={styles.validationIndicators}>
      <div className={styles.validationItem}>
        <Globe className={styles.validationIcon} />
        {lead.company_website || lead.website ? (
          lead.verified_website ? (
            <CheckCircle className={`${styles.validationStatus} ${styles.validationSuccess}`} />
          ) : (
            <XCircle className={`${styles.validationStatus} ${styles.validationError}`} />
          )
        ) : (
          <XCircle className={`${styles.validationStatus} ${styles.validationError}`} />
        )}
      </div>
      <div className={styles.validationItem}>
        <Mail className={styles.validationIcon} />
        {lead.email ? (
          lead.verified_email ? (
            <CheckCircle className={`${styles.validationStatus} ${styles.validationSuccess}`} />
          ) : (
            <XCircle className={`${styles.validationStatus} ${styles.validationError}`} />
          )
        ) : (
          <XCircle className={`${styles.validationStatus} ${styles.validationError}`} />
        )}
      </div>
      <div className={styles.validationItem}>
        <Phone className={styles.validationIcon} />
        {lead.phone ? (
          lead.verified_phone ? (
            <CheckCircle className={`${styles.validationStatus} ${styles.validationSuccess}`} />
          ) : (
            <XCircle className={`${styles.validationStatus} ${styles.validationError}`} />
          )
        ) : (
          <XCircle className={`${styles.validationStatus} ${styles.validationError}`} />
        )}
      </div>
    </div>
  )

  const exportSelectedLeads = () => {
    const selectedData = leads
      .filter(lead => selectedLeads.includes(lead.id))
      .map(lead => ({
        'Nombre Empresa': lead.company_name || lead.company,
        'Actividad': lead.activity || 'No especificado',
        'Categoría': lead.category || lead.industry || 'Otros',
        'Email': lead.email || 'Sin email',
        'Teléfono': lead.phone || 'Sin teléfono',
        'Sitio Web': lead.company_website || lead.website || 'Sin sitio web',
        'Ubicación': lead.location || `${lead.state || ''}, ${lead.country || ''}`.replace(/^, |, $/, ''),
        'Dirección': lead.address || 'No disponible',
        'Email Verificado': lead.verified_email ? 'Sí' : 'No',
        'Teléfono Verificado': lead.verified_phone ? 'Sí' : 'No',
        'Sitio Web Verificado': lead.verified_website ? 'Sí' : 'No',
        'Calidad de Datos': `${lead.data_quality_score || 1}/5`,
        'Descripción': lead.description || 'Sin descripción',
        'Fuente': lead.source || 'RitterFinder Database',
      }))

    if (selectedData.length === 0) return

    // Create CSV content
    const headers = Object.keys(selectedData[0])
    const csvContent = [
      headers.join(","),
      ...selectedData.map(row => 
        headers.map(header => `"${row[header as keyof typeof row] || ''}"`).join(",")
      )
    ].join("\n")

    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `leads_ritterfinder_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead)
    setIsModalOpen(true)
  }

  const handleSort = (field: keyof Lead) => {
    actions.setSorting(field)
  }

  const getSortIcon = (field: keyof Lead) => {
    if (sorting.sortField === field) {
      return sorting.sortDirection === "asc" ? (
        <SortAsc className={styles.sortIcon} />
      ) : (
        <SortDesc className={styles.sortIcon} />
      )
    }
    return null
  }

  const allSelected = filteredLeads.length > 0 && filteredLeads.every((lead) => selectedLeads.includes(lead.id))

  return (
    <div className={styles.tableContainer}>
      {/* Header with Search and Actions */}
      <Card className={styles.headerCard}>
        <CardHeader>
          <div className={styles.headerContent}>
            <div className={styles.headerInfo}>
              <CardTitle className={styles.headerTitle}>Resultados de Leads</CardTitle>
              <p className={styles.headerSubtitle}>
                {formatMessage("Se encontraron {total} leads. {selected} seleccionados.", {
                  total: filteredLeads.length,
                  selected: selectedLeads.length,
                })}
              </p>
            </div>
            <div className={styles.headerActions}>
              <div className={styles.searchContainer}>
                <Search className={styles.searchIcon} />
                <Input
                  placeholder="Buscar empresas, actividades..."
                  className={styles.searchInput}
                  value={filters.searchTerm}
                  onChange={(e) => actions.setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon" className={styles.actionButton}>
                <Filter className={styles.actionButtonIcon} />
              </Button>
              {selectedLeads.length > 0 && (
                <Button variant="outline" size="icon" className={styles.actionButton} onClick={exportSelectedLeads}>
                  <Download className={styles.actionButtonIcon} />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Results Table */}
      <Card className={styles.tableCard}>
        <CardContent className="p-0">
          <div className={styles.tableWrapper}>
            <Table className={styles.table}>
              <TableHeader className={styles.tableHeader}>
                <TableRow className={styles.tableHeaderRow}>
                  <TableHead className={`${styles.tableHeaderCell} ${styles.checkboxCell}`}>
                    <Checkbox 
                      checked={allSelected} 
                      onCheckedChange={onSelectAll} 
                      aria-label="Select all" 
                    />
                  </TableHead>
                  <TableHead className={styles.tableHeaderCell}>
                    <Button variant="ghost" onClick={() => handleSort("company_name")} className={styles.sortButton}>
                      Empresa
                      {getSortIcon("company_name")}
                    </Button>
                  </TableHead>
                  <TableHead className={styles.tableHeaderCell}>
                    <Button variant="ghost" onClick={() => handleSort("activity")} className={styles.sortButton}>
                      Actividad
                      {getSortIcon("activity")}
                    </Button>
                  </TableHead>
                  <TableHead className={styles.tableHeaderCell}>
                    <Button variant="ghost" onClick={() => handleSort("data_quality_score")} className={styles.sortButton}>
                      Calidad
                      {getSortIcon("data_quality_score")}
                    </Button>
                  </TableHead>
                  <TableHead className={`${styles.tableHeaderCell} hidden lg:table-cell`}>Validación</TableHead>
                  <TableHead className={`${styles.tableHeaderCell} hidden lg:table-cell`}>Categoría</TableHead>
                  <TableHead className={`${styles.tableHeaderCell} hidden xl:table-cell`}>Ubicación</TableHead>
                  <TableHead className={`${styles.tableHeaderCell} text-center`}>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className={styles.tableBody}>
                {filteredLeads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className={styles.emptyState}>
                      {noResultsWithCriteria ? (
                        <div className={styles.noResultsMessage}>
                          <div className={styles.noResultsIcon}>🔍</div>
                          <h3 className={styles.noResultsTitle}>No se encontraron resultados con los criterios especificados</h3>
                          <p className={styles.noResultsText}>
                            Los filtros aplicados son muy específicos. Intenta:
                          </p>
                          <ul className={styles.noResultsSuggestions}>
                            <li>• Seleccionar una ubicación más amplia</li>
                            <li>• Cambiar el tipo de cliente</li>
                            <li>• Quitar algunos filtros de datos (email, teléfono, sitio web)</li>
                            <li>• Intentar una búsqueda diferente</li>
                          </ul>
                        </div>
                      ) : (
                        <p className={styles.emptyStateText}>No se encontraron resultados.</p>
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLeads.map((lead) => (
                    <TableRow key={lead.id} className={styles.tableRow}>
                      <TableCell className={`${styles.tableCell} ${styles.checkboxCell}`}>
                        <Checkbox
                          checked={selectedLeads.includes(lead.id)}
                          onCheckedChange={() => onSelectLead(lead.id)}
                          aria-label={`Select ${lead.company_name || lead.company}`}
                        />
                      </TableCell>
                      <TableCell className={styles.tableCell}>
                        <div className={styles.contactInfo}>
                          <p className={styles.contactName}>{lead.company_name || lead.company}</p>
                          {lead.email && (
                            <p className={styles.contactEmail}>{lead.email}</p>
                          )}
                          {lead.phone && (
                            <p className={styles.contactPosition}>{lead.phone}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className={styles.tableCell}>
                        <div className={styles.companyInfo}>
                          <p className={styles.companyName}>{lead.activity || 'Actividad no especificada'}</p>
                          {lead.description && (
                            <div className={styles.companyDetails}>
                              <Building className={styles.companyIcon} />
                              {lead.description.length > 50 ? `${lead.description.substring(0, 50)}...` : lead.description}
                            </div>
                          )}
                          {lead.company_website && (
                            <div className={styles.companyDetails}>
                              <Globe className={styles.companyIcon} />
                              Sitio web disponible
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className={styles.tableCell}>
                        <div className={styles.qualityScore}>
                          <span className={`${styles.confidenceBadge} ${getQualityStyle(lead.data_quality_score || 1)}`}>
                            {lead.data_quality_score || 1}/5
                          </span>
                          <div className={styles.qualityStars}>
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`${styles.star} ${i < (lead.data_quality_score || 1) ? styles.starFilled : styles.starEmpty}`}
                              />
                            ))}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className={`${styles.tableCell} hidden lg:table-cell`}>
                        <ValidationIndicators lead={lead} />
                      </TableCell>
                      <TableCell className={`${styles.tableCell} hidden lg:table-cell`}>
                        <span className={styles.industryBadge}>{lead.category || lead.industry || 'Sin categoría'}</span>
                      </TableCell>
                      <TableCell className={`${styles.tableCell} hidden xl:table-cell`}>
                        <div className={styles.locationInfo}>
                          <MapPin className={styles.locationIcon} />
                          {lead.location || `${lead.state || ''}, ${lead.country || ''}`.replace(/^, |, $/, '') || 'Ubicación no disponible'}
                        </div>
                      </TableCell>
                      <TableCell className={`${styles.tableCell} text-center`}>
                        <Button variant="ghost" size="sm" className={styles.viewButton} onClick={() => handleViewLead(lead)}>
                          <Eye className={styles.viewButtonIcon} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Action Bar */}
      {showActions && selectedLeads.length > 0 && (
        <Card className={styles.actionBar}>
          <CardContent className={styles.actionBarContent}>
            <div className={styles.actionBarInner}>
              <div className={styles.actionBarLeft}>
                <div className={styles.selectionCounter}>
                  <div className={styles.selectionBadge}>
                    {selectedLeads.length}
                  </div>
                  <span className={styles.selectionText}>
                    {selectedLeads.length === 1 ? "empresa seleccionada" : "empresas seleccionadas"}
                  </span>
                </div>
                <div className={styles.selectionSubtext}>Listo para crear campaña de email</div>
              </div>
              {onProceedToCampaign && (
                <Button
                  onClick={onProceedToCampaign}
                  className={styles.campaignButton}
                  size="lg"
                >
                  Crear Campaña de Email
                  <ExternalLink className={styles.campaignButtonIcon} />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lead Details Modal */}
      <LeadDetailsModal
        lead={selectedLead}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedLead(null)
        }}
      />
    </div>
  )
} 