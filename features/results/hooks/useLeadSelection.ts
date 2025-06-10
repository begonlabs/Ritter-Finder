"use client"

import { useState, useMemo } from "react"
import type { Lead, LeadSelection, LeadSelectionActions } from "../types"

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

  const toggleSelectAll = () => {
    const allSelected = leads.length > 0 && selectedLeads.length === leads.length
    handleSelectAll(!allSelected)
  }

  const selectByConfidence = (minConfidence: number) => {
    const highConfidenceLeads = leads
      .filter(lead => lead.confidence >= minConfidence)
      .map(lead => lead.id)
    setSelectedLeads(highConfidenceLeads)
  }

  const selectByIndustry = (industry: string) => {
    const industryLeads = leads
      .filter(lead => lead.industry.toLowerCase() === industry.toLowerCase())
      .map(lead => lead.id)
    setSelectedLeads(industryLeads)
  }

  const selection: LeadSelection = useMemo(() => {
    const isAllSelected = leads.length > 0 && selectedLeads.length === leads.length
    const isIndeterminate = selectedLeads.length > 0 && selectedLeads.length < leads.length

    return {
      selectedLeads,
      isAllSelected,
      isIndeterminate,
    }
  }, [selectedLeads, leads.length])

  const selectedLeadsData = useMemo(() => 
    leads.filter((lead) => selectedLeads.includes(lead.id)),
    [leads, selectedLeads]
  )

  const actions: LeadSelectionActions = {
    handleSelectLead,
    handleSelectAll,
    clearSelection,
  }

  const extendedActions = {
    ...actions,
    toggleSelectAll,
    selectByConfidence,
    selectByIndustry,
  }

  return {
    selection,
    selectedLeadsData,
    actions: extendedActions,
  }
} 