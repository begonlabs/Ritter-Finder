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

  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 90) return "bg-green-100 text-green-800"
    if (confidence >= 80) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
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
        <SortAsc className="ml-1 h-3 w-3" />
      ) : (
        <SortDesc className="ml-1 h-3 w-3" />
      )
    }
    return null
  }

  const allSelected = filteredLeads.length > 0 && filteredLeads.every((lead) => selectedLeads.includes(lead.id))

  return (
    <div className="space-y-6">
      {/* Header with Search and Actions */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl">Resultados de Leads</CardTitle>
              <p className="text-sm text-muted-foreground">
                {formatMessage("Se encontraron {total} leads. {selected} seleccionados.", {
                  total: filteredLeads.length,
                  selected: selectedLeads.length,
                })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar leads..."
                  className="pl-8 w-64"
                  value={filters.searchTerm}
                  onChange={(e) => actions.setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              {selectedLeads.length > 0 && (
                <Button variant="outline" size="icon" onClick={exportSelectedLeads}>
                  <Download className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Results Table */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={allSelected} 
                      onCheckedChange={onSelectAll} 
                      aria-label="Select all" 
                    />
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort("name")} className="h-auto p-0 font-semibold">
                      Contacto
                      {getSortIcon("name")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort("company")} className="h-auto p-0 font-semibold">
                      Empresa
                      {getSortIcon("company")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort("confidence")} className="h-auto p-0 font-semibold">
                      Confianza
                      {getSortIcon("confidence")}
                    </Button>
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">Industria</TableHead>
                  <TableHead className="hidden xl:table-cell">Ubicación</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No se encontraron resultados.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLeads.map((lead) => (
                    <TableRow key={lead.id} className="hover:bg-gray-50">
                      <TableCell>
                        <Checkbox
                          checked={selectedLeads.includes(lead.id)}
                          onCheckedChange={() => onSelectLead(lead.id)}
                          aria-label={`Select ${lead.name}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{lead.name}</p>
                          <p className="text-sm text-muted-foreground">{lead.position}</p>
                          <p className="text-sm text-blue-600">{lead.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{lead.company}</p>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Users className="h-3 w-3" />
                            {lead.employees}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Euro className="h-3 w-3" />
                            {lead.revenue}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getConfidenceColor(lead.confidence)} border-0`}>
                          {lead.confidence}%
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Badge variant="outline">{lead.industry}</Badge>
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-3 w-3" />
                          {lead.location}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button variant="ghost" size="sm" onClick={() => handleViewLead(lead)}>
                          <Eye className="h-4 w-4" />
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
        <Card className="border-0 shadow-sm bg-ritter-gold/5 border-ritter-gold/20">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="bg-ritter-gold text-ritter-dark rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    {selectedLeads.length}
                  </div>
                  <span className="font-medium">
                    {selectedLeads.length === 1 ? "lead seleccionado" : "leads seleccionados"}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">Listo para crear campaña de email</div>
              </div>
              {onProceedToCampaign && (
                <Button
                  onClick={onProceedToCampaign}
                  className="bg-ritter-gold hover:bg-amber-500 text-ritter-dark"
                  size="lg"
                >
                  Crear Campaña de Email
                  <ExternalLink className="ml-2 h-4 w-4" />
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