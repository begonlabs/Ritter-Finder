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
  Phone,
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
import { useResults } from "../hooks/useResults"
import type { Lead, ResultsTableProps } from "../types"

export function ResultsTable({ 
  leads, 
  selectedLeads, 
  onSelectLead, 
  onSelectAll, 
  onProceedToCampaign,
  showActions = true 
}: ResultsTableProps) {
  const { t } = useLanguage()
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const {
    state,
    actions,
    filteredStats,
    getConfidenceColor,
    exportSelectedLeads,
  } = useResults(leads)

  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead)
    setIsModalOpen(true)
  }

  const handleSort = (field: keyof Lead) => {
    actions.setSorting(field)
  }

  const getSortIcon = (field: keyof Lead) => {
    if (state.sorting.sortField === field) {
      return state.sorting.sortDirection === "asc" ? (
        <SortAsc className="ml-1 h-3 w-3" />
      ) : (
        <SortDesc className="ml-1 h-3 w-3" />
      )
    }
    return null
  }

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
                  total: state.filteredLeads.length,
                  selected: state.selection.selectedLeads.length,
                })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar leads..."
                  className="pl-8 w-64"
                  value={state.filters.searchTerm}
                  onChange={(e) => actions.setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              {state.selection.selectedLeads.length > 0 && (
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
                      checked={state.selection.isAllSelected} 
                      onCheckedChange={actions.selection.handleSelectAll} 
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
                {state.filteredLeads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No se encontraron resultados.
                    </TableCell>
                  </TableRow>
                ) : (
                  state.filteredLeads.map((lead) => (
                    <TableRow key={lead.id} className="hover:bg-gray-50">
                      <TableCell>
                        <Checkbox
                          checked={state.selection.selectedLeads.includes(lead.id)}
                          onCheckedChange={() => actions.selection.handleSelectLead(lead.id)}
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
      {showActions && state.selection.selectedLeads.length > 0 && (
        <Card className="border-0 shadow-sm bg-ritter-gold/5 border-ritter-gold/20">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="bg-ritter-gold text-ritter-dark rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    {state.selection.selectedLeads.length}
                  </div>
                  <span className="font-medium">
                    {state.selection.selectedLeads.length === 1 ? "lead seleccionado" : "leads seleccionados"}
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