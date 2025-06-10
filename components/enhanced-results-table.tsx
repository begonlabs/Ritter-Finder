"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Search,
  Eye,
  Phone,
  MapPin,
  Users,
  Euro,
  Calendar,
  ExternalLink,
  Filter,
  SortAsc,
  SortDesc,
} from "lucide-react"
import { useLanguage, formatMessage } from "@/lib/language-context"

interface Lead {
  id: string
  name: string
  company: string
  email: string
  website: string
  phone: string
  position: string
  location: string
  industry: string
  employees: string
  revenue: string
  source: string
  confidence: number
  lastActivity: string
  notes: string
}

interface EnhancedResultsTableProps {
  leads: Lead[]
  selectedLeads: string[]
  onSelectLead: (id: string) => void
  onSelectAll: (select: boolean) => void
  onProceedToCampaign: () => void
}

export function EnhancedResultsTable({
  leads,
  selectedLeads,
  onSelectLead,
  onSelectAll,
  onProceedToCampaign,
}: EnhancedResultsTableProps) {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<keyof Lead>("confidence")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

  const filteredLeads = leads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const sortedLeads = [...filteredLeads].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    }

    return 0
  })

  const allSelected = sortedLeads.length > 0 && sortedLeads.every((lead) => selectedLeads.includes(lead.id))

  const handleSort = (field: keyof Lead) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "bg-green-100 text-green-800"
    if (confidence >= 80) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
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
                  total: sortedLeads.length,
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
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
                    <Checkbox checked={allSelected} onCheckedChange={onSelectAll} aria-label="Select all" />
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort("name")} className="h-auto p-0 font-semibold">
                      Contacto
                      {sortField === "name" &&
                        (sortDirection === "asc" ? (
                          <SortAsc className="ml-1 h-3 w-3" />
                        ) : (
                          <SortDesc className="ml-1 h-3 w-3" />
                        ))}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort("company")} className="h-auto p-0 font-semibold">
                      Empresa
                      {sortField === "company" &&
                        (sortDirection === "asc" ? (
                          <SortAsc className="ml-1 h-3 w-3" />
                        ) : (
                          <SortDesc className="ml-1 h-3 w-3" />
                        ))}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("confidence")}
                      className="h-auto p-0 font-semibold"
                    >
                      Confianza
                      {sortField === "confidence" &&
                        (sortDirection === "asc" ? (
                          <SortAsc className="ml-1 h-3 w-3" />
                        ) : (
                          <SortDesc className="ml-1 h-3 w-3" />
                        ))}
                    </Button>
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">Industria</TableHead>
                  <TableHead className="hidden xl:table-cell">Ubicación</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedLeads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No se encontraron resultados.
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedLeads.map((lead) => (
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
                        <Badge className={`${getConfidenceColor(lead.confidence)} border-0`}>{lead.confidence}%</Badge>
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
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedLead(lead)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Detalles del Lead</DialogTitle>
                            </DialogHeader>
                            {selectedLead && (
                              <div className="space-y-6">
                                <div className="grid gap-4 md:grid-cols-2">
                                  <div className="space-y-3">
                                    <div>
                                      <label className="text-sm font-medium text-gray-500">Contacto</label>
                                      <p className="font-medium">{selectedLead.name}</p>
                                      <p className="text-sm text-muted-foreground">{selectedLead.position}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-500">Email</label>
                                      <p className="text-blue-600">{selectedLead.email}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-500">Teléfono</label>
                                      <p className="flex items-center gap-1">
                                        <Phone className="h-3 w-3" />
                                        {selectedLead.phone}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="space-y-3">
                                    <div>
                                      <label className="text-sm font-medium text-gray-500">Empresa</label>
                                      <p className="font-medium">{selectedLead.company}</p>
                                      <a
                                        href={`https://${selectedLead.website}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                                      >
                                        {selectedLead.website}
                                        <ExternalLink className="h-3 w-3" />
                                      </a>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-500">Ubicación</label>
                                      <p className="flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        {selectedLead.location}
                                      </p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-500">Industria</label>
                                      <Badge variant="outline">{selectedLead.industry}</Badge>
                                    </div>
                                  </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-3">
                                  <div>
                                    <label className="text-sm font-medium text-gray-500">Empleados</label>
                                    <p className="flex items-center gap-1">
                                      <Users className="h-3 w-3" />
                                      {selectedLead.employees}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-500">Ingresos</label>
                                    <p className="flex items-center gap-1">
                                      <Euro className="h-3 w-3" />
                                      {selectedLead.revenue}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-500">Confianza</label>
                                    <Badge className={`${getConfidenceColor(selectedLead.confidence)} border-0`}>
                                      {selectedLead.confidence}%
                                    </Badge>
                                  </div>
                                </div>

                                <div>
                                  <label className="text-sm font-medium text-gray-500">Notas</label>
                                  <p className="text-sm">{selectedLead.notes}</p>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t">
                                  <div className="text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      Última actividad: {new Date(selectedLead.lastActivity).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <div className="text-sm text-muted-foreground">Fuente: {selectedLead.source}</div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
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
      {selectedLeads.length > 0 && (
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
              <Button
                onClick={onProceedToCampaign}
                className="bg-ritter-gold hover:bg-amber-500 text-ritter-dark"
                size="lg"
              >
                Crear Campaña de Email
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
