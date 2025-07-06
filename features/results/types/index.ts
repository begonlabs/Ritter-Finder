export interface Lead {
  id: string
  
  // ✅ Primary database fields (matching Supabase schema)
  // Contact Information
  email?: string | null // Can be null in database
  verified_email: boolean
  phone?: string | null // Can be null in database
  verified_phone: boolean
  
  // Company Information  
  company_name: string // Required in database - NOT NULL
  company_website?: string | null // Can be null in database
  verified_website: boolean
  
  // Location Information
  address?: string | null
  state?: string | null
  country?: string | null
  
  // Business Information
  activity: string // Required in database - NOT NULL
  description?: string | null
  category?: string | null // Can be null in database
  
  // Data Quality Score (1-5 scale)
  data_quality_score: number // 1-5 calculated from verifications
  
  // System fields
  created_at?: string
  updated_at?: string
  last_contacted_at?: string
  
  // ✅ Legacy compatibility fields (computed from primary fields)
  name?: string // Can be derived from company contact
  company?: string // Computed from company_name
  website?: string // Computed from company_website
  position?: string
  location?: string // Can be derived from address/state/country
  industry?: string // Can be derived from category
  employees?: string
  revenue?: string
  source?: string
  confidence?: number // Can be derived from data_quality_score
  lastActivity?: string
  notes?: string
  
  // Computed flags
  hasWebsite?: boolean // Can be derived from company_website existence
  websiteExists?: boolean // Can be derived from verified_website
  emailValidated?: boolean // Can be derived from verified_email
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
    // Legacy compatibility fields (mapped from real data)
    id: normalized.id,
    name: `Contacto - ${normalized.company_name}`,
    company: normalized.company_name,
    email: normalized.email || '',
    website: normalized.company_website || '',
    phone: normalized.phone || '',
    position: inferPosition(normalized),
    location: createLocationString(normalized),
    industry: normalized.category || normalized.activity || 'Otros',
    employees: 'No especificado',
    revenue: 'No especificado',
    source: getSourceDisplayName(normalized.source_type),
    confidence: convertQualityScoreToConfidence(normalized.data_quality_score || 1),
    lastActivity: normalized.updated_at || normalized.created_at,
    notes: normalized.description || '',
    
    // Real database fields (direct mapping)
    company_name: normalized.company_name,
    company_website: normalized.company_website,
    activity: normalized.activity,
    description: normalized.description,
    category: normalized.category,
    address: normalized.address,
    state: normalized.state,
    country: normalized.country,
    data_quality_score: normalized.data_quality_score || 1,
    created_at: normalized.created_at,
    updated_at: normalized.updated_at,
    last_contacted_at: normalized.last_contacted_at,
    
    // Validation flags
    verified_email: normalized.verified_email,
    verified_phone: normalized.verified_phone,
    verified_website: normalized.verified_website,
    
    // Legacy compatibility flags
    hasWebsite: !!normalized.company_website,
    websiteExists: normalized.verified_website,
    emailValidated: normalized.verified_email
  }
}

export function leadToNormalized(lead: Lead): Partial<NormalizedLead> {
  return {
    id: lead.id,
    // Use real database fields if available, fallback to legacy
    company_name: lead.company_name || lead.company,
    email: lead.email || undefined,
    company_website: lead.company_website || lead.website || undefined,
    phone: lead.phone || undefined,
    activity: lead.activity || lead.industry,
    description: lead.description || lead.notes || undefined,
    category: lead.category || lead.industry || undefined,
    address: lead.address || undefined,
    state: lead.state || extractStateFromLocation(lead.location),
    country: lead.country || extractCountryFromLocation(lead.location),
    data_quality_score: lead.data_quality_score || convertConfidenceToQualityScore(lead.confidence || 0),
    verified_email: lead.verified_email || lead.emailValidated,
    verified_phone: lead.verified_phone || false,
    verified_website: lead.verified_website || lead.websiteExists,
    created_at: lead.created_at || new Date().toISOString(),
    updated_at: lead.updated_at || new Date().toISOString(),
    last_contacted_at: lead.last_contacted_at || undefined
  }
}

// Helper functions
function inferPosition(normalized: NormalizedLead): string {
  // Infer position based on available data
  if (normalized.legal_form?.includes('AUTONOMO')) return 'Propietario'
  if (normalized.legal_form?.includes('SOCIEDAD')) return 'Gerente/Director'
  if (normalized.activity?.toLowerCase().includes('medic')) return 'Profesional Sanitario'
  if (normalized.activity?.toLowerCase().includes('abogad')) return 'Abogado'
  if (normalized.activity?.toLowerCase().includes('restaurant')) return 'Propietario/Gerente'
  if (normalized.activity?.toLowerCase().includes('clinic')) return 'Director Médico'
  if (normalized.activity?.toLowerCase().includes('taller')) return 'Propietario/Jefe de Taller'
  return 'Contacto Comercial'
}

function createLocationString(normalized: NormalizedLead): string {
  const parts = []
  if (normalized.state && normalized.state !== 'Sin Estado') parts.push(normalized.state)
  if (normalized.country && normalized.country !== 'Sin País') parts.push(normalized.country)
  return parts.join(', ') || 'Ubicación no disponible'
}

function extractStateFromLocation(location?: string): string | undefined {
  if (!location) return undefined
  const parts = location.split(',')
  return parts[0]?.trim() || undefined
}

function extractCountryFromLocation(location?: string): string | undefined {
  if (!location) return undefined
  const parts = location.split(',')
  return parts[1]?.trim() || undefined
}

function convertQualityScoreToConfidence(qualityScore: number): number {
  // Convert 1-5 scale to 0-100 percentage
  return Math.round(((qualityScore - 1) / 4) * 100)
}

function convertConfidenceToQualityScore(confidence: number): number {
  // Convert 0-100 percentage to 1-5 scale
  return Math.round((confidence / 100) * 4) + 1
}

function getSourceDisplayName(sourceType?: string): string {
  const sourceMap: Record<string, string> = {
    'paginas_amarillas': 'Páginas Amarillas',
    'axesor': 'Axesor',
  }
  return sourceMap[sourceType || ''] || 'RitterFinder Database'
}
