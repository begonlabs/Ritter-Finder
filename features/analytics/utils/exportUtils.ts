import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { 
  DashboardStats, 
  LeadCategoryStats, 
  LeadCountryStats, 
  LeadStateStats, 
  LeadSpainRegionStats
} from '../types'

// ===================================
// PDF EXPORT UTILITIES
// ===================================

/**
 * Generate PDF report with analytics data
 */
export async function generatePDFReport(
  dashboardStats: DashboardStats,
  leadStats: any[],
  viewType: string = 'category'
): Promise<void> {
  const doc = new jsPDF()
  
  // Add header
  doc.setFontSize(20)
  doc.setTextColor(242, 183, 5) // ritter-gold
  doc.text('RitterFinder Analytics Report', 20, 20)
  
  doc.setFontSize(12)
  doc.setTextColor(100, 100, 100)
  doc.text(`Generated on: ${new Date().toLocaleDateString('es-ES')}`, 20, 30)
  
  let yPosition = 50
  
  // Dashboard Overview Section
  yPosition = addDashboardOverviewSection(doc, dashboardStats, yPosition)
  
  // Lead Statistics Section
  yPosition = addLeadStatisticsSection(doc, leadStats, viewType, yPosition)
  
  // Footer
  addFooter(doc)
  
  // Save the PDF
  doc.save(`ritterfinder-analytics-${new Date().toISOString().split('T')[0]}.pdf`)
}

/**
 * Add dashboard overview section to PDF
 */
function addDashboardOverviewSection(
  doc: jsPDF, 
  stats: DashboardStats, 
  startY: number
): number {
  doc.setFontSize(16)
  doc.setTextColor(26, 32, 44) // ritter-dark
  doc.text('Dashboard Overview', 20, startY)
  
  const tableData = [
    ['Metric', 'Value', 'Trend'],
    ['Total Leads', stats.totalLeads.toLocaleString(), 
     stats.trendsFromLastMonth.leads.positive ? '+' : '-' + 
     stats.trendsFromLastMonth.leads.percentage + '%'],
    ['Total Campaigns', stats.totalCampaigns.toLocaleString(),
     stats.trendsFromLastMonth.campaigns.positive ? '+' : '-' + 
     stats.trendsFromLastMonth.campaigns.percentage + '%'],
    ['Total Searches', stats.totalSearches.toLocaleString(),
     stats.trendsFromLastMonth.searches.positive ? '+' : '-' + 
     stats.trendsFromLastMonth.searches.percentage + '%'],
    ['Active Users', stats.totalUsers.toLocaleString(), '-'],
    ['Avg Lead Quality', stats.averageLeadQuality.toFixed(1) + '%', '-']
  ]
  
  autoTable(doc, {
    head: [tableData[0]],
    body: tableData.slice(1),
    startY: startY + 10,
    styles: {
      fontSize: 10,
      cellPadding: 5
    },
    headStyles: {
      fillColor: [242, 183, 5],
      textColor: [26, 32, 44]
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    }
  })
  
  return (doc as any).lastAutoTable.finalY + 20
}

/**
 * Add lead statistics section to PDF
 */
function addLeadStatisticsSection(
  doc: jsPDF, 
  leadStats: any[], 
  viewType: string, 
  startY: number
): number {
  doc.setFontSize(16)
  doc.setTextColor(26, 32, 44)
  
  const viewTitle = getViewTitle(viewType)
  doc.text(`Lead Statistics - ${viewTitle}`, 20, startY)
  
  if (leadStats.length === 0) {
    doc.setFontSize(12)
    doc.setTextColor(100, 100, 100)
    doc.text('No data available', 20, startY + 10)
    return startY + 20
  }
  
  const headers = getLeadStatsHeaders(viewType)
  const tableData = leadStats.slice(0, 10).map(item => 
    getLeadStatsRow(item, viewType)
  )
  
  autoTable(doc, {
    head: [headers],
    body: tableData,
    startY: startY + 10,
    styles: {
      fontSize: 9,
      cellPadding: 4
    },
    headStyles: {
      fillColor: [242, 183, 5],
      textColor: [26, 32, 44]
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    }
  })
  
  return (doc as any).lastAutoTable.finalY + 20
}

/**
 * Add footer to PDF
 */
function addFooter(doc: jsPDF): void {
  const pageHeight = doc.internal.pageSize.height
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text('RitterFinder Analytics Report', 20, pageHeight - 20)
  doc.text(`Page ${doc.getCurrentPageInfo().pageNumber}`, 20, pageHeight - 15)
}

// ===================================
// CSV EXPORT UTILITIES
// ===================================

/**
 * Generate CSV report with analytics data
 */
export function generateCSVReport(
  dashboardStats: DashboardStats,
  leadStats: any[],
  viewType: string = 'category'
): void {
  const csvData: string[] = []
  
  // Add header
  csvData.push('RitterFinder Analytics Report')
  csvData.push(`Generated on: ${new Date().toLocaleDateString('es-ES')}`)
  csvData.push('')
  
  // Dashboard Overview
  csvData.push('Dashboard Overview')
  csvData.push('Metric,Value,Trend')
  csvData.push(`Total Leads,${dashboardStats.totalLeads.toLocaleString()},${dashboardStats.trendsFromLastMonth.leads.positive ? '+' : '-'}${dashboardStats.trendsFromLastMonth.leads.percentage}%`)
  csvData.push(`Total Campaigns,${dashboardStats.totalCampaigns.toLocaleString()},${dashboardStats.trendsFromLastMonth.campaigns.positive ? '+' : '-'}${dashboardStats.trendsFromLastMonth.campaigns.percentage}%`)
  csvData.push(`Total Searches,${dashboardStats.totalSearches.toLocaleString()},${dashboardStats.trendsFromLastMonth.searches.positive ? '+' : '-'}${dashboardStats.trendsFromLastMonth.searches.percentage}%`)
  csvData.push(`Active Users,${dashboardStats.totalUsers.toLocaleString()},-`)
  csvData.push(`Avg Lead Quality,${dashboardStats.averageLeadQuality.toFixed(1)}%,-`)
  csvData.push('')
  
  // Lead Statistics
  const viewTitle = getViewTitle(viewType)
  csvData.push(`Lead Statistics - ${viewTitle}`)
  
  if (leadStats.length > 0) {
    const headers = getLeadStatsHeaders(viewType)
    csvData.push(headers.join(','))
    
    leadStats.slice(0, 10).forEach(item => {
      const row = getLeadStatsRow(item, viewType)
      csvData.push(row.join(','))
    })
  } else {
    csvData.push('No data available')
  }
  csvData.push('')
  
  // Create and download CSV
  const csvContent = csvData.join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `ritterfinder-analytics-${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// ===================================
// HELPER FUNCTIONS
// ===================================

/**
 * Get view title for different lead statistics views
 */
function getViewTitle(viewType: string): string {
  switch (viewType) {
    case 'category':
      return 'By Category'
    case 'country':
      return 'By Country'
    case 'state':
      return 'By State/Region'
    case 'spain-region':
      return 'By Spanish Region'
    default:
      return 'By Category'
  }
}

/**
 * Get headers for lead statistics table based on view type
 */
function getLeadStatsHeaders(viewType: string): string[] {
  switch (viewType) {
    case 'category':
      return ['Category', 'Total Leads', 'Verified Emails', 'Verified Phones', 'Avg Quality Score']
    case 'country':
      return ['Country', 'Total Leads', 'High Quality %', 'Verified Emails', 'Avg Quality Score']
    case 'state':
      return ['State', 'Country', 'Total Leads', 'Contactable %', 'Avg Quality Score']
    case 'spain-region':
      return ['Region', 'Total Leads', 'Contactability %', 'Main Category', 'Avg Quality']
    default:
      return ['Category', 'Total Leads', 'Verified Emails', 'Verified Phones', 'Avg Quality Score']
  }
}

/**
 * Get row data for lead statistics table based on view type
 */
function getLeadStatsRow(item: any, viewType: string): string[] {
  switch (viewType) {
    case 'category':
      return [
        item.category,
        item.total_leads.toString(),
        item.verified_emails.toString(),
        item.verified_phones.toString(),
        item.avg_quality_score.toString()
      ]
    case 'country':
      return [
        item.country,
        item.total_leads.toString(),
        item.high_quality_percentage.toString() + '%',
        item.verified_emails.toString(),
        item.avg_quality_score.toString()
      ]
    case 'state':
      return [
        item.state,
        item.country,
        item.total_leads.toString(),
        item.contactable_percentage.toString() + '%',
        item.avg_quality_score.toString()
      ]
    case 'spain-region':
      return [
        item.comunidad_autonoma,
        item.total_leads.toString(),
        item.contactabilidad_porcentaje.toString() + '%',
        item.categoria_principal,
        item.calidad_promedio.toString()
      ]
    default:
      return [
        item.category,
        item.total_leads.toString(),
        item.verified_emails.toString(),
        item.verified_phones.toString(),
        item.avg_quality_score.toString()
      ]
  }
}

// ===================================
// EXPORT FUNCTIONS FOR COMPONENTS
// ===================================

/**
 * Export analytics data as PDF
 */
export async function exportAnalyticsAsPDF(
  dashboardStats: DashboardStats,
  leadStats: any[],
  viewType: string = 'category'
): Promise<void> {
  try {
    await generatePDFReport(dashboardStats, leadStats, viewType)
  } catch (error) {
    console.error('Error generating PDF report:', error)
    throw new Error('Failed to generate PDF report')
  }
}

/**
 * Export analytics data as CSV
 */
export function exportAnalyticsAsCSV(
  dashboardStats: DashboardStats,
  leadStats: any[],
  viewType: string = 'category'
): void {
  try {
    generateCSVReport(dashboardStats, leadStats, viewType)
  } catch (error) {
    console.error('Error generating CSV report:', error)
    throw new Error('Failed to generate CSV report')
  }
} 