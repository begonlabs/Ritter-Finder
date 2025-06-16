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
  // Validation status fields
  hasWebsite: boolean
  websiteExists: boolean
  emailValidated: boolean
}

export interface NormalizedLead {
  id: string
  name: string
  description?: string
  address: string
  phone?: string
  website?: string
  cif_nif?: string
  legal_form?: string
  constitution_date?: string
  business_object?: string
  cnae_code?: string
  sic_code?: string
  industry: string
  activities?: string
  source_url: string
  source_type: 'paginas_amarillas' | 'axesor'
  confidence_score: number
  location_normalized: string
  city: string
  province: string
  postal_code?: string
  email_found?: string
  email_validated: boolean
  website_validated: boolean
  phone_validated: boolean
  estimated_employees: string
  estimated_revenue: string
  scraped_at: string
  processed_at?: string
  last_updated: string
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
