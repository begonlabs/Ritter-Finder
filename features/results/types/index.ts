export interface Lead {
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
  // New simplified validation status fields (boolean flags)
  verified_email: boolean
  verified_phone: boolean  
  verified_website: boolean
  // Legacy compatibility for existing components
  hasWebsite: boolean
  websiteExists: boolean
  emailValidated: boolean
}

export interface NormalizedLead {
  id: string
  // Contact Information
  email?: string
  verified_email: boolean
  phone?: string
  verified_phone: boolean
  
  // Company Information (updated field names)
  company_name: string // Changed from 'name'
  company_website?: string
  verified_website: boolean
  
  // Location Information (simplified)
  address?: string
  state?: string
  country?: string
  
  // New fields from schema
  activity: string // Business activity
  description?: string
  category?: string
  
  // Data Quality Score (1-5 scale, not 0-100)
  data_quality_score: number // 1-5 calculated from verifications
  
  // Legacy fields for compatibility
  name?: string // For contact name if available
  cif_nif?: string
  legal_form?: string
  constitution_date?: string
  business_object?: string
  cnae_code?: string
  sic_code?: string
  industry?: string
  activities?: string
  source_url?: string
  source_type?: 'paginas_amarillas' | 'axesor'
  confidence_score?: number // Legacy - use data_quality_score instead
  location_normalized?: string
  city?: string
  province?: string
  estimated_employees?: string
  estimated_revenue?: string
  scraped_at?: string
  processed_at?: string
  last_updated?: string
  created_at: string
  updated_at: string
  last_contacted_at?: string
}

export interface LeadsApiResponse {
  success: boolean
  data: NormalizedLead[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

export interface LeadsSearchParams {
  city?: string
  province?: string
  industry?: string
  source_type?: 'paginas_amarillas' | 'axesor'
  confidence_min?: number
  has_website?: boolean
  has_email?: boolean
  has_phone?: boolean
  search_term?: string
  page?: number
  limit?: number
}

export interface LeadSelection {
  selectedLeads: string[]
  isAllSelected: boolean
  isIndeterminate: boolean
}

export interface LeadSelectionActions {
  handleSelectLead: (id: string) => void
  handleSelectAll: (select: boolean) => void
  clearSelection: () => void
}

export interface ResultsFilters {
  searchTerm: string
  industryFilter: string
  locationFilter: string
  confidenceRange: [number, number]
  showOnlySelected: boolean
}

export interface ResultsSorting {
  sortField: keyof Lead
  sortDirection: 'asc' | 'desc'
}

export interface ResultsState {
  leads: Lead[]
  filteredLeads: Lead[]
  selection: LeadSelection
  filters: ResultsFilters
  sorting: ResultsSorting
  isLoading: boolean
}

export interface ResultsActions {
  selection: LeadSelectionActions
  setSearchTerm: (term: string) => void
  setIndustryFilter: (industry: string) => void
  setLocationFilter: (location: string) => void
  setConfidenceRange: (range: [number, number]) => void
  setShowOnlySelected: (show: boolean) => void
  setSorting: (field: keyof Lead) => void
  resetFilters: () => void
}

export interface LeadDetailsModalProps {
  lead: Lead | null
  isOpen: boolean
  onClose: () => void
}

export interface ResultsTableProps {
  leads: Lead[]
  selectedLeads: string[]
  onSelectLead: (id: string) => void
  onSelectAll: (select: boolean) => void
  onProceedToCampaign?: () => void
  showActions?: boolean
}

export interface ResultsHeaderProps {
  totalLeads: number
  selectedCount: number
  onSearch: (term: string) => void
  onFilter: () => void
  onExport?: () => void
}

export interface ResultsStatsProps {
  totalLeads: number
  selectedLeads: number
  averageConfidence: number
  topIndustries: string[]
}

export type ConfidenceLevel = 'high' | 'medium' | 'low'

export interface LeadSummary {
  total: number
  byConfidence: Record<ConfidenceLevel, number>
  byIndustry: Record<string, number>
  byLocation: Record<string, number>
}

// Transformation functions for backward compatibility
export function normalizedToLead(normalized: NormalizedLead): Lead {
  return {
    id: normalized.id,
    name: normalized.name || 'Unknown Contact',
    company: normalized.company_name,
    email: normalized.email || '',
    website: normalized.company_website || '',
    phone: normalized.phone || '',
    position: inferPosition(normalized),
    location: createLocationString(normalized),
    industry: normalized.industry || normalized.category || 'Other',
    employees: normalized.estimated_employees || 'Unknown',
    revenue: normalized.estimated_revenue || 'Unknown',
    source: normalized.source_type || 'Web Scraping',
    confidence: convertQualityScoreToConfidence(normalized.data_quality_score),
    lastActivity: normalized.last_updated || normalized.created_at,
    notes: createNotesFromNormalized(normalized),
    // New boolean flags
    verified_email: normalized.verified_email,
    verified_phone: normalized.verified_phone,
    verified_website: normalized.verified_website,
    // Legacy compatibility
    hasWebsite: !!normalized.company_website,
    websiteExists: normalized.verified_website,
    emailValidated: normalized.verified_email
  }
}

export function leadToNormalized(lead: Lead): Partial<NormalizedLead> {
  return {
    id: lead.id,
    company_name: lead.company,
    email: lead.email || undefined,
    company_website: lead.website || undefined,
    phone: lead.phone || undefined,
    activity: lead.industry, // Map industry to activity
    industry: lead.industry,
    verified_email: lead.verified_email || lead.emailValidated,
    verified_phone: lead.verified_phone || false,
    verified_website: lead.verified_website || lead.websiteExists,
    data_quality_score: convertConfidenceToQualityScore(lead.confidence),
    estimated_employees: lead.employees,
    estimated_revenue: lead.revenue,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
}

// Helper functions
function inferPosition(normalized: NormalizedLead): string {
  if (normalized.legal_form?.includes('AUTONOMO')) return 'Owner'
  if (normalized.legal_form?.includes('SOCIEDAD')) return 'CEO/Director'
  if (normalized.cnae_code?.startsWith('62')) return 'CTO/Technical Director'
  return 'Business Contact'
}

function createLocationString(normalized: NormalizedLead): string {
  const parts = []
  if (normalized.city) parts.push(normalized.city)
  if (normalized.state) parts.push(normalized.state)
  if (normalized.country) parts.push(normalized.country)
  return parts.join(', ') || normalized.address || 'Unknown Location'
}

function createNotesFromNormalized(normalized: NormalizedLead): string {
  const notes: string[] = []
  if (normalized.description) notes.push(`Description: ${normalized.description}`)
  if (normalized.activity) notes.push(`Activity: ${normalized.activity}`)
  if (normalized.cif_nif) notes.push(`CIF/NIF: ${normalized.cif_nif}`)
  if (normalized.legal_form) notes.push(`Legal Form: ${normalized.legal_form}`)
  return notes.join(' | ')
}

function convertQualityScoreToConfidence(qualityScore: number): number {
  // Convert 1-5 scale to 0-100 percentage
  return Math.round(((qualityScore - 1) / 4) * 100)
}

function convertConfidenceToQualityScore(confidence: number): number {
  // Convert 0-100 percentage to 1-5 scale
  return Math.round((confidence / 100) * 4) + 1
}
