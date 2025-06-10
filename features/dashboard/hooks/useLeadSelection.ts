"use client"

import { useState } from "react"
import type { Lead } from "../types"

export function useLeadSelection(leads: Lead[]) {
  const [selectedLeads, setSelectedLeads] = useState<string[]>([])

  const handleSelectLead = (id: string) => {
    setSelectedLeads(prev =>
      prev.includes(id)
        ? prev.filter((leadId) => leadId !== id)
        : [...prev, id]
    )
  }

  const handleSelectAll = (select: boolean) => {
    setSelectedLeads(select ? leads.map((lead) => lead.id) : [])
  }

  const clearSelection = () => {
    setSelectedLeads([])
  }

  const selectedLeadsData = leads.filter((lead) => selectedLeads.includes(lead.id))
  const isAllSelected = leads.length > 0 && selectedLeads.length === leads.length
  const isIndeterminate = selectedLeads.length > 0 && selectedLeads.length < leads.length

  return {
    selectedLeads,
    selectedLeadsData,
    isAllSelected,
    isIndeterminate,
    handleSelectLead,
    handleSelectAll,
    clearSelection,
  }
}
