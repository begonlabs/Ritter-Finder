"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useLanguage, formatMessage } from "@/lib/language-context"

interface ResultsTableProps {
  leads: any[]
  selectedLeads: string[]
  onSelectLead: (id: string) => void
  onSelectAll: (select: boolean) => void
}

export function ResultsTable({ leads, selectedLeads, onSelectLead, onSelectAll }: ResultsTableProps) {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredLeads = leads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.website.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const allSelected = filteredLeads.length > 0 && filteredLeads.every((lead) => selectedLeads.includes(lead.id))

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t("results.title")}</CardTitle>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("results.search")}
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox checked={allSelected} onCheckedChange={onSelectAll} aria-label="Select all" />
                </TableHead>
                <TableHead>{t("results.name")}</TableHead>
                <TableHead>{t("results.company")}</TableHead>
                <TableHead>{t("results.email")}</TableHead>
                <TableHead className="hidden md:table-cell">{t("results.website")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    {t("results.empty")}
                  </TableCell>
                </TableRow>
              ) : (
                filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedLeads.includes(lead.id)}
                        onCheckedChange={() => onSelectLead(lead.id)}
                        aria-label={`Select ${lead.name}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>{lead.company}</TableCell>
                    <TableCell>{lead.email}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <a
                        href={`https://${lead.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {lead.website}
                      </a>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 text-sm text-muted-foreground">
          {formatMessage(t("results.selected"), { selected: selectedLeads.length, total: filteredLeads.length })}
        </div>
      </CardContent>
    </Card>
  )
}
