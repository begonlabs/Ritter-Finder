export interface SearchConfig {
  selectedClientTypes: string[]
  selectedLocations: string[]
  requireWebsite: boolean
  validateEmail: boolean
  validateWebsite: boolean
  // New search criteria based on simplified schema
  minQualityScore?: number // 1-5 scale
  activityFilter?: string[] // Filter by business activity
  categoryFilter?: string[] // Filter by category
}

export interface SearchState extends SearchConfig {
  isSearching: boolean
  searchComplete: boolean
  searchProgress: number
  currentStep: string
}

export interface SearchActions {
  setSelectedClientTypes: (clientTypes: string[]) => void
  setSelectedLocations: (locations: string[]) => void
  setRequireWebsite: (require: boolean) => void
  setValidateEmail: (validate: boolean) => void
  setValidateWebsite: (validate: boolean) => void
  handleSearch: () => void
  resetSearch: () => void
  rerunSearch: (config: SearchConfig) => void
}

export interface SearchResults {
  leads: SearchLead[]
  totalFound: number
  searchTime: number
  searchId: string
  // Enhanced search metadata
  qualityDistribution: QualityDistribution
  locationBreakdown: Record<string, number>
  activityBreakdown: Record<string, number>
}

// Updated Lead interface compatible with simplified database schema
export interface SearchLead {
  id: string
  // Contact Information
  email?: string
  verified_email: boolean
  phone?: string
  verified_phone: boolean
  
  // Company Information (updated field names)
  company_name: string // Changed from 'company'
  company_website?: string
  verified_website: boolean
  
  // Location Information (simplified)
  address?: string
  state?: string
  country?: string
  
  // New fields from schema
  activity: string // Business activity - primary search criteria
  description?: string
  category?: string
  
  // Data Quality Score (1-5 scale, not 0-100)
  data_quality_score: number // 1-5 calculated from verifications
  
  // Timestamps
  created_at: string
  updated_at: string
  last_contacted_at?: string
  
  // Legacy compatibility fields for existing components
  name?: string // For contact name if available
  company?: string // Maps to company_name
  website?: string // Maps to company_website
  position?: string // Inferred from business context
  location?: string // Formatted location string
  industry?: string // Maps to activity/category
  employees?: string // Estimated size
  revenue?: string // Estimated revenue
  source?: string // Data source
  confidence?: number // Converted from data_quality_score (1-5 → 0-100%)
  lastActivity?: string // Maps to updated_at
  notes?: string // Generated from description/activity
  // Legacy validation fields
  hasWebsite?: boolean // Maps to !!company_website
  websiteExists?: boolean // Maps to verified_website
  emailValidated?: boolean // Maps to verified_email
}

// Legacy Lead interface for backward compatibility
export interface Lead extends SearchLead {}

export interface QualityDistribution {
  score1: number // Poor quality leads
  score2: number // Below average
  score3: number // Average quality
  score4: number // Good quality
  score5: number // Excellent quality
}

export interface ScrapingStep {
  id: string
  website: string
  status: 'pending' | 'processing' | 'completed' | 'error'
  progress: number
  leadsFound: number
  estimatedTime: number
  // Enhanced scraping metadata
  qualityScore: number // Average quality of leads found
  activitiesFound: string[] // Types of activities discovered
  verificationsPassed: number // Count of verified contacts
}

export interface SearchHistoryItem {
  id: string
  date: string
  clientTypes: string[]
  locations: string[]
  requireWebsite: boolean
  validateEmail: boolean
  validateWebsite: boolean
  // Enhanced search history
  minQualityScore?: number
  activityFilters?: string[]
  categoryFilters?: string[]
  leadsFound: number
  leadsContacted: number
  searchTime: number
  status: 'completed' | 'failed' | 'cancelled'
  // Quality metrics
  averageQualityScore: number
  verificationRate: number
}

export interface ClientType {
  id: string
  name: string
  description: string
  icon: string
  enabled: boolean
}

export interface Website {
  id: string
  name: string
  url: string
  category: string
  enabled: boolean
  scrapeTime: number
  maxLeads: number
}

export interface Location {
  id: string
  name: string
  region: string
  country: string
  enabled: boolean
}

export interface ValidationOptions {
  requireWebsite: boolean
  validateEmail: boolean
  validateWebsite: boolean
  // New validation options
  minQualityScore?: number // Minimum quality score (1-5)
  requirePhone?: boolean // Require phone number
  verifyPhone?: boolean // Verify phone numbers
}

// Search criteria mapping functions for database integration
export interface SearchCriteriaMapping {
  // Map client types to database activities/categories
  clientTypeToActivity: (clientType: string) => string[]
  clientTypeToCategory: (clientType: string) => string[]
  
  // Map locations to database fields
  locationToSearchParams: (location: string) => {
    state?: string
    country?: string
    isCountrywide?: boolean
  }
  
  // Convert validation options to database search params
  validationToSearchParams: (options: ValidationOptions) => {
    has_website?: boolean
    has_email?: boolean
    has_phone?: boolean
    verified_email?: boolean
    verified_phone?: boolean
    verified_website?: boolean
    quality_score_min?: number
  }
}

// Transformation functions for converting between search formats
export function searchLeadToLegacyLead(searchLead: SearchLead): Lead {
  return {
    ...searchLead,
    name: searchLead.name || 'Unknown Contact',
    company: searchLead.company_name,
    email: searchLead.email || '',
    website: searchLead.company_website || '',
    phone: searchLead.phone || '',
    position: searchLead.position || 'Unknown Position',
    location: searchLead.location || `${searchLead.state || ''}, ${searchLead.country || ''}`.trim().replace(/^,\s*/, ''),
    industry: searchLead.activity || searchLead.category || 'Other',
    employees: searchLead.employees || 'Unknown',
    revenue: searchLead.revenue || 'Unknown',
    source: searchLead.source || 'Search',
    confidence: searchLead.confidence || (searchLead.data_quality_score * 20), // Convert 1-5 to 0-100%
    lastActivity: searchLead.lastActivity || searchLead.updated_at,
    notes: searchLead.notes || searchLead.description || '',
    hasWebsite: !!searchLead.company_website,
    websiteExists: searchLead.verified_website,
    emailValidated: searchLead.verified_email,
  }
}
