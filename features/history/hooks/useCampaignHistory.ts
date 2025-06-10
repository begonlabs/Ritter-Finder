"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import type { CampaignHistoryItem } from "../types"

// Mock data - in real app this would come from API
const mockCampaignHistory: CampaignHistoryItem[] = [
  {
    id: "campaign-1",
    subject: "Oferta especial de energía solar",
    content: "Estimado [Contact Name], tenemos una oferta especial en paneles solares...",
    senderName: "Demo User",
    senderEmail: "demo@ritterfinder.com",
    recipients: 18,
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    openRate: 68.5,
    clickRate: 23.1,
    responseRate: 12.3,
    status: "sent",
    template: "promotional_solar",
    metadata: {
      tags: ["solar", "promo"],
      campaign_type: "promotional",
      target_segment: "residential",
      ab_test: false
    }
  },
  {
    id: "campaign-2",
    subject: "Información sobre paneles solares",
    content: "Hola [Contact Name], gracias por su interés en nuestros servicios...",
    senderName: "Demo User", 
    senderEmail: "demo@ritterfinder.com",
    recipients: 25,
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
    openRate: 72.0,
    clickRate: 28.5,
    responseRate: 15.7,
    status: "sent",
    template: "info_solar",
    metadata: {
      tags: ["information", "solar"],
      campaign_type: "follow_up",
      target_segment: "commercial",
      ab_test: false
    }
  },
  {
    id: "campaign-3",
    subject: "Consultoría energética gratuita",
    content: "Estimado [Contact Name], ofrecemos consultoría energética gratuita...",
    senderName: "Demo User",
    senderEmail: "demo@ritterfinder.com",
    recipients: 32,
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    openRate: 65.2,
    clickRate: 19.8,
    responseRate: 8.9,
    status: "sent",
    template: "consultation",
    metadata: {
      tags: ["consultation", "free"],
      campaign_type: "promotional",
      target_segment: "industrial",
      ab_test: true
    }
  },
  {
    id: "campaign-4",
    subject: "Seguimiento - Propuesta de energía renovable",
    content: "Hola [Contact Name], quería hacer seguimiento a nuestra propuesta...",
    senderName: "Demo User",
    senderEmail: "demo@ritterfinder.com",
    recipients: 15,
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    openRate: 84.3,
    clickRate: 31.2,
    responseRate: 18.7,
    status: "sent",
    template: "follow_up",
    metadata: {
      tags: ["follow-up", "proposal"],
      campaign_type: "follow_up",
      target_segment: "commercial",
      ab_test: false
    }
  },
  {
    id: "campaign-5",
    subject: "Newsletter - Tendencias en Energía Verde",
    content: "Este mes en energía renovable...",
    senderName: "Demo User",
    senderEmail: "demo@ritterfinder.com", 
    recipients: 156,
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
    openRate: 45.8,
    clickRate: 12.7,
    responseRate: 3.2,
    status: "sent",
    template: "newsletter",
    metadata: {
      tags: ["newsletter", "trends"],
      campaign_type: "newsletter",
      target_segment: "all",
      ab_test: false
    }
  }
]

export function useCampaignHistory() {
  const [campaigns, setCampaigns] = useState<CampaignHistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  // Load campaign history data
  const loadCampaigns = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 700))
      setCampaigns(mockCampaignHistory)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load campaign history')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Filter campaigns based on search term, status, and type
  const filteredCampaigns = useMemo(() => {
    let filtered = campaigns

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(campaign =>
        campaign.subject.toLowerCase().includes(term) ||
        campaign.senderName.toLowerCase().includes(term) ||
        campaign.template?.toLowerCase().includes(term) ||
        campaign.metadata?.tags?.some(tag => tag.toLowerCase().includes(term))
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(campaign => campaign.status === statusFilter)
    }

    // Filter by type
    if (typeFilter !== "all") {
      filtered = filtered.filter(campaign => campaign.metadata?.campaign_type === typeFilter)
    }

    // Sort by date (newest first)
    return filtered.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime())
  }, [campaigns, searchTerm, statusFilter, typeFilter])

  // View campaign details
  const viewCampaign = useCallback((campaignId: string) => {
    console.log('Viewing campaign:', campaignId)
    // In real app, this would navigate to campaign details
  }, [])

  // Duplicate campaign
  const duplicateCampaign = useCallback(async (campaignId: string) => {
    const campaign = campaigns.find(c => c.id === campaignId)
    if (!campaign) return

    const duplicatedCampaign: CampaignHistoryItem = {
      ...campaign,
      id: `${campaign.id}-copy-${Date.now()}`,
      subject: `Copy of ${campaign.subject}`,
      status: 'draft',
      sentAt: new Date().toISOString(),
      openRate: 0,
      clickRate: 0,
      responseRate: 0,
      recipients: 0
    }

    setCampaigns(prev => [duplicatedCampaign, ...prev])
    console.log('Campaign duplicated:', duplicatedCampaign)
  }, [campaigns])

  // Delete campaign
  const deleteCampaign = useCallback(async (campaignId: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      setCampaigns(prev => prev.filter(campaign => campaign.id !== campaignId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete campaign')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Calculate campaign stats
  const stats = useMemo(() => {
    const sentCampaigns = campaigns.filter(campaign => campaign.status === 'sent')
    
    return {
      totalCampaigns: campaigns.length,
      sentCampaigns: sentCampaigns.length,
      totalRecipients: sentCampaigns.reduce((sum, campaign) => sum + campaign.recipients, 0),
      averageOpenRate: sentCampaigns.length > 0
        ? Number((sentCampaigns.reduce((sum, campaign) => sum + campaign.openRate, 0) / sentCampaigns.length).toFixed(1))
        : 0,
      averageClickRate: sentCampaigns.length > 0
        ? Number((sentCampaigns.reduce((sum, campaign) => sum + campaign.clickRate, 0) / sentCampaigns.length).toFixed(1))
        : 0,
      averageResponseRate: sentCampaigns.length > 0
        ? Number((sentCampaigns.reduce((sum, campaign) => sum + campaign.responseRate, 0) / sentCampaigns.length).toFixed(1))
        : 0
    }
  }, [campaigns])

  // Auto-load on mount
  useEffect(() => {
    loadCampaigns()
  }, [loadCampaigns])

  return {
    // State
    campaigns: filteredCampaigns,
    allCampaigns: campaigns,
    isLoading,
    error,
    searchTerm,
    statusFilter,
    typeFilter,
    stats,

    // Actions
    setSearchTerm,
    setStatusFilter,
    setTypeFilter,
    viewCampaign,
    duplicateCampaign,
    deleteCampaign,
    loadCampaigns,

    // Computed
    hasCampaigns: campaigns.length > 0,
    hasFilteredResults: filteredCampaigns.length > 0
  }
} 