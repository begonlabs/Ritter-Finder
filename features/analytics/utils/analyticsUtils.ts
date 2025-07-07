import type {
  DashboardOverviewRecord,
  DashboardSummaryRecord,
  TrendData
} from '../types'

// ===================================
// TREND CALCULATIONS
// ===================================

/**
 * Calculate trend data comparing current vs previous values
 */
export function calculateTrend(
  current: number, 
  previous: number, 
  label: string = "from previous period"
): TrendData {
  const difference = current - previous
  const percentage = previous > 0 ? Math.round((difference / previous) * 100) : 0
  
  return {
    value: current,
    percentage: Math.abs(percentage),
    positive: difference >= 0,
    label
  }
}

/**
 * Calculate percentage change between two values
 */
export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return Math.round(((current - previous) / previous) * 100)
}

/**
 * Calculate growth rate over a period
 */
export function calculateGrowthRate(values: number[]): number {
  if (values.length < 2) return 0
  
  const first = values[0]
  const last = values[values.length - 1]
  
  if (first === 0) return last > 0 ? 100 : 0
  return Math.round(((last - first) / first) * 100)
}



// ===================================
// DASHBOARD OVERVIEW METRICS
// ===================================

/**
 * Calculate lead generation efficiency based on searches and leads
 */
export function calculateLeadGenEfficiency(totalLeads: number, totalSearches: number): number {
  if (totalSearches === 0) return 0
  return Math.round((totalLeads / totalSearches) * 100) / 100
}

/**
 * Calculate campaign effectiveness based on campaigns and leads
 */
export function calculateCampaignEffectiveness(totalCampaigns: number, totalLeads: number): number {
  if (totalCampaigns === 0) return 0
  return Math.round((totalLeads / totalCampaigns) * 100) / 100
}

/**
 * Determine lead quality category based on score
 */
export function getLeadQualityCategory(score: number): {
  category: string
  color: string
  description: string
} {
  if (score >= 90) {
    return {
      category: 'Excelente',
      color: '#059669', // green-600
      description: 'Leads de máxima calidad'
    }
  } else if (score >= 80) {
    return {
      category: 'Muy Buena',
      color: '#0891b2', // cyan-600
      description: 'Leads de alta calidad'
    }
  } else if (score >= 70) {
    return {
      category: 'Buena',
      color: '#F2B705', // ritter-gold
      description: 'Leads de calidad aceptable'
    }
  } else if (score >= 60) {
    return {
      category: 'Regular',
      color: '#ea580c', // orange-600
      description: 'Leads que requieren mejora'
    }
  } else {
    return {
      category: 'Baja',
      color: '#dc2626', // red-600
      description: 'Leads de baja calidad'
    }
  }
}



// ===================================
// USER METRICS
// ===================================

/**
 * Calculate user engagement level
 */
export function calculateUserEngagement(
  totalUsers: number,
  totalSearches: number,
  totalCampaigns: number
): {
  level: string
  score: number
  averageActivityPerUser: number
} {
  if (totalUsers === 0) {
    return {
      level: 'Sin datos',
      score: 0,
      averageActivityPerUser: 0
    }
  }
  
  const totalActivity = totalSearches + totalCampaigns
  const averageActivityPerUser = Math.round((totalActivity / totalUsers) * 100) / 100
  
  let level: string
  let score: number
  
  if (averageActivityPerUser >= 10) {
    level = 'Muy Alto'
    score = 90
  } else if (averageActivityPerUser >= 7) {
    level = 'Alto'
    score = 75
  } else if (averageActivityPerUser >= 5) {
    level = 'Medio'
    score = 60
  } else if (averageActivityPerUser >= 2) {
    level = 'Bajo'
    score = 40
  } else {
    level = 'Muy Bajo'
    score = 20
  }
  
  return { level, score, averageActivityPerUser }
}

// ===================================
// PERFORMANCE METRICS
// ===================================

/**
 * Calculate success rate from a list of boolean outcomes
 */
export function calculateSuccessRate(outcomes: boolean[]): number {
  if (outcomes.length === 0) return 0
  const successes = outcomes.filter(Boolean).length
  return Math.round((successes / outcomes.length) * 100)
}

/**
 * Calculate cost per lead
 */
export function calculateCostPerLead(
  totalCost: number, 
  totalLeads: number
): number {
  if (totalLeads === 0) return 0
  return Math.round((totalCost / totalLeads) * 100) / 100
}

/**
 * Calculate ROI percentage
 */
export function calculateROI(
  revenue: number, 
  cost: number
): number {
  if (cost === 0) return revenue > 0 ? 100 : 0
  return Math.round(((revenue - cost) / cost) * 100)
}

// ===================================
// TIME UTILITIES
// ===================================

/**
 * Get date range for analytics queries
 */
export function getDateRange(period: 'day' | 'week' | 'month' | 'quarter' | 'year'): {
  start: Date
  end: Date
} {
  const end = new Date()
  const start = new Date()

  switch (period) {
    case 'day':
      start.setDate(start.getDate() - 1)
      break
    case 'week':
      start.setDate(start.getDate() - 7)
      break
    case 'month':
      start.setMonth(start.getMonth() - 1)
      break
    case 'quarter':
      start.setMonth(start.getMonth() - 3)
      break
    case 'year':
      start.setFullYear(start.getFullYear() - 1)
      break
  }

  return { start, end }
}

/**
 * Format date for display
 */
export function formatAnalyticsDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

/**
 * Format relative time for analytics
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000)
  
  if (diffInSeconds < 60) {
    return 'Hace unos segundos'
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `Hace ${diffInMinutes} ${diffInMinutes === 1 ? 'minuto' : 'minutos'}`
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `Hace ${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`
  }
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `Hace ${diffInDays} ${diffInDays === 1 ? 'día' : 'días'}`
  }
  
  return formatAnalyticsDate(d)
}

// ===================================
// FORMATTING UTILITIES
// ===================================

/**
 * Format currency for analytics display
 */
export function formatAnalyticsCurrency(amount: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format number with locale-specific separators
 */
export function formatAnalyticsNumber(num: number): string {
  return new Intl.NumberFormat('es-ES').format(num)
}

/**
 * Format percentage for display
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`
}

/**
 * Format duration in minutes to human readable format
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${Math.round(minutes)}m`
  }
  
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = Math.round(minutes % 60)
  
  if (hours < 24) {
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
  }
  
  const days = Math.floor(hours / 24)
  const remainingHours = hours % 24
  
  return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`
}

// ===================================
// DATA VALIDATION
// ===================================

/**
 * Validate analytics data for completeness
 */
export function validateAnalyticsData(data: any): {
  isValid: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []

  if (!data) {
    errors.push('Data is null or undefined')
    return { isValid: false, errors, warnings }
  }

  // Check for required numeric fields
  const numericFields = ['totalLeads', 'totalCampaigns', 'totalSearches', 'averageOpenRate']
  numericFields.forEach(field => {
    if (typeof data[field] !== 'number' || isNaN(data[field])) {
      errors.push(`Field ${field} must be a valid number`)
    }
  })

  // Check for negative values where they shouldn't exist
  const positiveFields = ['totalLeads', 'totalCampaigns', 'totalSearches']
  positiveFields.forEach(field => {
    if (data[field] < 0) {
      warnings.push(`Field ${field} has negative value: ${data[field]}`)
    }
  })

  // Check percentage fields
  if (data.averageOpenRate && (data.averageOpenRate < 0 || data.averageOpenRate > 100)) {
    warnings.push(`averageOpenRate (${data.averageOpenRate}) is outside normal range (0-100)`)
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Clean and normalize analytics data
 */
export function normalizeAnalyticsData(data: any): any {
  if (!data) return data

  const normalized = { ...data }

  // Ensure numeric fields are numbers
  const numericFields = ['totalLeads', 'totalCampaigns', 'totalSearches', 'averageOpenRate']
  numericFields.forEach(field => {
    if (normalized[field] !== undefined) {
      const num = Number(normalized[field])
      normalized[field] = isNaN(num) ? 0 : num
    }
  })

  // Clamp percentage values
  if (normalized.averageOpenRate !== undefined) {
    normalized.averageOpenRate = Math.max(0, Math.min(100, normalized.averageOpenRate))
  }

  return normalized
}

/**
 * Validate dashboard overview data for completeness
 */
export function validateDashboardOverviewData(data: DashboardOverviewRecord): {
  isValid: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []

  if (!data) {
    errors.push('Data is null or undefined')
    return { isValid: false, errors, warnings }
  }

  // Check for required numeric fields
  const numericFields = [
    'total_leads', 
    'total_campaigns', 
    'total_searches', 
    'total_users',
    'avg_lead_quality'
  ]
  
  numericFields.forEach(field => {
    if (typeof data[field as keyof DashboardOverviewRecord] !== 'number' || 
        isNaN(data[field as keyof DashboardOverviewRecord] as number)) {
      errors.push(`Field ${field} must be a valid number`)
    }
  })

  // Check for negative values where they shouldn't exist
  const positiveFields = ['total_leads', 'total_campaigns', 'total_searches', 'total_users']
  positiveFields.forEach(field => {
    const value = data[field as keyof DashboardOverviewRecord] as number
    if (value < 0) {
      warnings.push(`Field ${field} has negative value: ${value}`)
    }
  })

  // Check percentage fields
  if (data.avg_lead_quality && (data.avg_lead_quality < 0 || data.avg_lead_quality > 100)) {
    warnings.push(`avg_lead_quality (${data.avg_lead_quality}) is outside normal range (0-100)`)
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Clean and normalize dashboard overview data
 */
export function normalizeDashboardOverviewData(data: DashboardOverviewRecord): DashboardOverviewRecord {
  if (!data) return data

  const normalized = { ...data }

  // Ensure numeric fields are numbers
  const numericFields = [
    'total_leads', 
    'total_campaigns', 
    'total_searches', 
    'total_users',
    'avg_lead_quality'
  ]
  
  numericFields.forEach(field => {
    const key = field as keyof DashboardOverviewRecord
    if (normalized[key] !== undefined) {
      const num = Number(normalized[key])
      ;(normalized as any)[key] = isNaN(num) ? 0 : num
    }
  })

  // Clamp percentage values
  if (normalized.avg_lead_quality !== undefined) {
    normalized.avg_lead_quality = Math.max(0, Math.min(100, normalized.avg_lead_quality))
  }

  return normalized
} 