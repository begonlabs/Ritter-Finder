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
  Users,
  Euro,
  ExternalLink,
  Filter,
  SortAsc,
  SortDesc,
  Download,
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
}

export function ResultsTableAdapter({ 
  leads, 
  selectedLeads, 
  onSelectLead, 
  onSelectAll, 
  onProceedToCampaign,
  showActions = true 
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

  // Map confidence levels to CSS module classes
  const getConfidenceStyle = (confidence: number): string => {
    if (confidence >= 90) return styles.confidenceHigh
    if (confidence >= 80) return styles.confidenceMedium
    return styles.confidenceLow
  }

  const exportSelectedLeads = () => {
    const selectedData = leads
      .filter(lead => selectedLeads.includes(lead.id))
      .map(lead => ({
        Name: lead.name,
        Company: lead.company,
        Email: lead.email,
        Phone: lead.phone,
        Position: lead.position,
        Website: lead.website,
        Industry: lead.industry,
        Location: lead.location,
        Confidence: `${lead.confidence}%`,
        Employees: lead.employees,
        Revenue: lead.revenue,
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
    link.setAttribute("download", `selected_leads_${new Date().toISOString().split('T')[0]}.csv`)
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
                  placeholder="Buscar leads..."
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
                    <Button variant="ghost" onClick={() => handleSort("name")} className={styles.sortButton}>
                      Contacto
                      {getSortIcon("name")}
                    </Button>
                  </TableHead>
                  <TableHead className={styles.tableHeaderCell}>
                    <Button variant="ghost" onClick={() => handleSort("company")} className={styles.sortButton}>
                      Empresa
                      {getSortIcon("company")}
                    </Button>
                  </TableHead>
                  <TableHead className={styles.tableHeaderCell}>
                    <Button variant="ghost" onClick={() => handleSort("confidence")} className={styles.sortButton}>
                      Confianza
                      {getSortIcon("confidence")}
                    </Button>
                  </TableHead>
                  <TableHead className={`${styles.tableHeaderCell} hidden lg:table-cell`}>Industria</TableHead>
                  <TableHead className={`${styles.tableHeaderCell} hidden xl:table-cell`}>Ubicación</TableHead>
                  <TableHead className={`${styles.tableHeaderCell} text-center`}>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className={styles.tableBody}>
                {filteredLeads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className={styles.emptyState}>
                      <p className={styles.emptyStateText}>No se encontraron resultados.</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLeads.map((lead) => (
                    <TableRow key={lead.id} className={styles.tableRow}>
                      <TableCell className={`${styles.tableCell} ${styles.checkboxCell}`}>
                        <Checkbox
                          checked={selectedLeads.includes(lead.id)}
                          onCheckedChange={() => onSelectLead(lead.id)}
                          aria-label={`Select ${lead.name}`}
                        />
                      </TableCell>
                      <TableCell className={styles.tableCell}>
                        <div className={styles.contactInfo}>
                          <p className={styles.contactName}>{lead.name}</p>
                          <p className={styles.contactPosition}>{lead.position}</p>
                          <p className={styles.contactEmail}>{lead.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className={styles.tableCell}>
                        <div className={styles.companyInfo}>
                          <p className={styles.companyName}>{lead.company}</p>
                          <div className={styles.companyDetails}>
                            <Users className={styles.companyIcon} />
                            {lead.employees}
                          </div>
                          <div className={styles.companyDetails}>
                            <Euro className={styles.companyIcon} />
                            {lead.revenue}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className={styles.tableCell}>
                        <span className={`${styles.confidenceBadge} ${getConfidenceStyle(lead.confidence)}`}>
                          {lead.confidence}%
                        </span>
                      </TableCell>
                      <TableCell className={`${styles.tableCell} hidden lg:table-cell`}>
                        <span className={styles.industryBadge}>{lead.industry}</span>
                      </TableCell>
                      <TableCell className={`${styles.tableCell} hidden xl:table-cell`}>
                        <div className={styles.locationInfo}>
                          <MapPin className={styles.locationIcon} />
                          {lead.location}
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
                    {selectedLeads.length === 1 ? "lead seleccionado" : "leads seleccionados"}
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