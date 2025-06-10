export interface ScrapingStats {
  sitesReviewed: number
  leadsObtained: number
  moneySaved: number
  avgLeadsPerSite: number
  successRate: number
  lastUpdate: string
  dailyStats: {
    date: string
    sites: number
    leads: number
    savings: number
  }[]
  topSources: {
    website: string
    leads: number
    percentage: number
  }[]
}

export const mockScrapingStats: ScrapingStats = {
  sitesReviewed: 1247,
  leadsObtained: 3891,
  moneySaved: 58365, // en euros
  avgLeadsPerSite: 3.12,
  successRate: 87.3,
  lastUpdate: new Date().toISOString(),
  dailyStats: [
    { date: "2024-01-20", sites: 45, leads: 142, savings: 2130 },
    { date: "2024-01-21", sites: 52, leads: 168, savings: 2520 },
    { date: "2024-01-22", sites: 38, leads: 119, savings: 1785 },
    { date: "2024-01-23", sites: 61, leads: 195, savings: 2925 },
    { date: "2024-01-24", sites: 47, leads: 151, savings: 2265 },
    { date: "2024-01-25", sites: 55, leads: 178, savings: 2670 },
    { date: "2024-01-26", sites: 49, leads: 156, savings: 2340 },
  ],
  topSources: [
    { website: "solarinstallers.com", leads: 892, percentage: 22.9 },
    { website: "greenenergyfirms.net", leads: 734, percentage: 18.9 },
    { website: "renewableenergy.com", leads: 623, percentage: 16.0 },
    { website: "eco-consultants.org", leads: 445, percentage: 11.4 },
    { website: "sustainablesolutions.co", leads: 387, percentage: 9.9 },
  ],
}

export const calculateSavings = (leads: number, costPerLead = 15): number => {
  return leads * costPerLead
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
