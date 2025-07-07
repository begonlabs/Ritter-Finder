"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { createClient } from "@/utils/supabase/client"
import type { 
  CampaignHistoryItem, 
  CampaignHistoryView, 
  CampaignRecord 
} from "../types"

// Fixed UUID for anonymous users (from previous conversation)
const ANONYMOUS_USER_ID = "550e8400-e29b-41d4-a716-446655440000"

// Data adapter functions
const adaptCampaignView = (view: CampaignHistoryView): CampaignHistoryItem => {
  return {
    id: view.campaign_id,
    subject: `Campaign: ${view.campaign_name}`, // Will be improved when we have actual subject data
    content: view.campaign_name, // Placeholder content
    senderName: view.created_by_name || 'Sistema',
    senderEmail: 'system@ritterfinder.com', // Placeholder
    recipients: view.total_recipients,
    sentAt: view.started_at || view.created_at,
    openRate: view.open_rate,
    clickRate: view.click_rate,
    responseRate: 0, // Not available in current schema
    status: mapCampaignStatus(view.status),
    template: view.template_name || undefined,
    metadata: {
      tags: [],
      campaign_type: 'promotional', // Default type
      target_segment: 'all',
      ab_test: false
    }
  }
}

const adaptCampaignRecord = (record: CampaignRecord): CampaignHistoryItem => {
  return {
    id: record.id,
    subject: record.subject || `Campaign: ${record.name}`,
    content: record.content || record.name,
    senderName: 'Sistema', // Will be improved when we join with user data
    senderEmail: 'system@ritterfinder.com', // Placeholder
    recipients: record.total_recipients,
    sentAt: record.started_at || record.created_at,
    openRate: record.open_rate,
    clickRate: record.click_rate,
    responseRate: 0, // Not available in current schema
    status: mapCampaignStatus(record.status),
    template: undefined, // Will be improved when we join with template data
    metadata: {
      tags: [],
      campaign_type: 'promotional', // Default type
      target_segment: 'all',
      ab_test: false
    }
  }
}

const mapCampaignStatus = (dbStatus: string): 'draft' | 'sent' | 'scheduled' | 'failed' => {
  switch (dbStatus) {
    case 'draft':
      return 'draft'
    case 'scheduled':
      return 'scheduled'
    case 'sent':
    case 'completed':
      return 'sent'
    case 'failed':
    case 'cancelled':
      return 'failed'
    default:
      return 'draft'
  }
}

export function useCampaignHistory() {
  const [campaigns, setCampaigns] = useState<CampaignHistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  
  const supabase = createClient()

  // Get current user ID
  const getCurrentUserId = async (): Promise<string> => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      return user?.id || ANONYMOUS_USER_ID
    } catch (error) {
      console.warn('Could not get user, using anonymous ID:', error)
      return ANONYMOUS_USER_ID
    }
  }

  // Load campaign history data from Supabase
  const loadCampaigns = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const userId = await getCurrentUserId()
      console.log('🔄 Loading campaign history for user:', userId)

      // First try to use the campaign_history view
      let { data, error: viewError } = await supabase
        .from('campaign_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100) // Get a reasonable number of campaigns

      if (viewError) {
        console.warn('📊 Campaign history view not available, falling back to campaigns table:', viewError.message)
        
        // Fallback to direct campaigns table
        const { data: fallbackData, error: tableError } = await supabase
          .from('campaigns')
          .select('*')
          .eq('created_by', userId)
          .order('created_at', { ascending: false })
          .limit(100)

        if (tableError) {
          throw new Error(`Failed to load campaign data: ${tableError.message}`)
        }

        console.log(`✅ Loaded ${fallbackData?.length || 0} campaign records from campaigns table`)

        // Convert campaigns records to frontend format
        const adaptedCampaigns = (fallbackData || []).map(adaptCampaignRecord)
        setCampaigns(adaptedCampaigns)
        return
      }

      console.log(`✅ Loaded ${data?.length || 0} campaign records from campaign_history view`)

      // Convert database view records to frontend format
      const adaptedCampaigns = (data || []).map(adaptCampaignView)
      setCampaigns(adaptedCampaigns)

    } catch (err) {
      console.error('❌ Error loading campaign history:', err)
      setError(err instanceof Error ? err.message : 'Failed to load campaign history')
      
      // Set empty array on error rather than keeping old data
      setCampaigns([])
    } finally {
      setIsLoading(false)
    }
  }, [supabase])

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

    try {
      setIsLoading(true)
      const userId = await getCurrentUserId()

      // Create a new campaign record in the database
      const { data: newCampaign, error } = await supabase
        .from('campaigns')
        .insert({
          name: `Copy of ${campaign.subject}`,
          status: 'draft',
          created_by: userId,
          total_recipients: 0,
          emails_sent: 0,
          emails_delivered: 0,
          emails_opened: 0,
          emails_clicked: 0,
          open_rate: 0,
          click_rate: 0,
          subject: `Copy of ${campaign.subject}`,
          content: campaign.content
        })
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to duplicate campaign: ${error.message}`)
      }

      // Reload campaigns to include the new one
      await loadCampaigns()
      
      console.log('Campaign duplicated successfully:', newCampaign)
    } catch (err) {
      console.error('Error duplicating campaign:', err)
      setError(err instanceof Error ? err.message : 'Failed to duplicate campaign')
    } finally {
      setIsLoading(false)
    }
  }, [campaigns, supabase, loadCampaigns])

  // Delete campaign
  const deleteCampaign = useCallback(async (campaignId: string) => {
    try {
      setIsLoading(true)

      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', campaignId)

      if (error) {
        throw new Error(`Failed to delete campaign: ${error.message}`)
      }

      // Remove from local state
      setCampaigns(prev => prev.filter(campaign => campaign.id !== campaignId))
      
      console.log('Campaign deleted successfully:', campaignId)
    } catch (err) {
      console.error('Error deleting campaign:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete campaign')
    } finally {
      setIsLoading(false)
    }
  }, [supabase])

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