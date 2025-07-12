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
  addHeader(doc)
  
  let currentY = 40
  
  // Add dashboard overview section
  currentY = addDashboardOverviewSection(doc, dashboardStats, currentY)
  
  // Add lead statistics summary section
  currentY = addLeadStatisticsSummarySection(doc, leadStats, viewType, currentY)
  
  // Add complete lead statistics section (all data)
  currentY = addCompleteLeadStatisticsSection(doc, leadStats, viewType, currentY)
  
  // Add footer
  addFooter(doc)
  
  // Save PDF
  doc.save(`ritterfinder-analytics-${new Date().toISOString().split('T')[0]}.pdf`)
}

/**
 * Add header to PDF
 */
function addHeader(doc: jsPDF): void {
  doc.setFontSize(24)
  doc.setTextColor(26, 32, 44)
  doc.text('RitterFinder Analytics Report', 20, 20)
  
  doc.setFontSize(12)
  doc.setTextColor(100, 100, 100)
  doc.text(`Generated on: ${new Date().toLocaleDateString('es-ES')}`, 20, 30)
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
  doc.setTextColor(26, 32, 44)
  doc.text('Dashboard Overview', 20, startY)
  
  const tableData = [
    ['Metric', 'Value'],
    ['Total Leads', stats.totalLeads.toLocaleString()],
    ['Total Campaigns', stats.totalCampaigns.toLocaleString()],
    ['Total Searches', stats.totalSearches.toLocaleString()],
    ['Active Users', stats.totalUsers.toLocaleString()],
    ['Avg Lead Quality', stats.averageLeadQuality.toFixed(1) + '%']
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
 * Add lead statistics summary section to PDF
 */
function addLeadStatisticsSummarySection(
  doc: jsPDF, 
  leadStats: any[], 
  viewType: string, 
  startY: number
): number {
  doc.setFontSize(16)
  doc.setTextColor(26, 32, 44)
  
  const viewTitle = getViewTitle(viewType)
  doc.text(`Lead Statistics Summary - ${viewTitle}`, 20, startY)
  
  if (leadStats.length === 0) {
    doc.setFontSize(12)
    doc.setTextColor(100, 100, 100)
    doc.text('No data available', 20, startY + 10)
    return startY + 20
  }
  
  // Calculate summary statistics
  const totalLeads = leadStats.reduce((sum, item) => sum + (item.total_leads || 0), 0)
  const avgQuality = leadStats.reduce((sum, item) => sum + (item.avg_quality_score || item.calidad_promedio || 0), 0) / leadStats.length
  const topItems = leadStats.slice(0, 5) // Top 5 items for summary
  
  const summaryData = [
    ['Summary Metric', 'Value'],
    ['Total Records', leadStats.length.toString()],
    ['Total Leads', totalLeads.toLocaleString()],
    ['Average Quality Score', avgQuality.toFixed(2)],
    ['Top Items Count', '5']
  ]
  
  autoTable(doc, {
    head: [summaryData[0]],
    body: summaryData.slice(1),
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
 * Add complete lead statistics section to PDF (all data)
 */
function addCompleteLeadStatisticsSection(
  doc: jsPDF, 
  leadStats: any[], 
  viewType: string, 
  startY: number
): number {
  doc.setFontSize(16)
  doc.setTextColor(26, 32, 44)
  
  const viewTitle = getViewTitle(viewType)
  doc.text(`Complete Lead Statistics - ${viewTitle} (All Data)`, 20, startY)
  
  if (leadStats.length === 0) {
    doc.setFontSize(12)
    doc.setTextColor(100, 100, 100)
    doc.text('No data available', 20, startY + 10)
    return startY + 20
  }
  
  const headers = getCompleteLeadStatsHeaders(viewType)
  const tableData = leadStats.map(item => 
    getCompleteLeadStatsRow(item, viewType)
  )
  
  autoTable(doc, {
    head: [headers],
    body: tableData,
    startY: startY + 10,
    styles: {
      fontSize: 8,
      cellPadding: 3
    },
    headStyles: {
      fillColor: [242, 183, 5],
      textColor: [26, 32, 44]
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    didDrawPage: function (data) {
      // Add page numbers
      const pageCount = doc.getNumberOfPages()
      doc.setFontSize(10)
      doc.setTextColor(100, 100, 100)
      doc.text(`Page ${data.pageNumber} of ${pageCount}`, 20, doc.internal.pageSize.height - 10)
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
  doc.text(`Generated on: ${new Date().toLocaleDateString('es-ES')}`, 20, pageHeight - 15)
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
  csvData.push('Metric,Value')
  csvData.push(`Total Leads,${dashboardStats.totalLeads.toLocaleString()}`)
  csvData.push(`Total Campaigns,${dashboardStats.totalCampaigns.toLocaleString()}`)
  csvData.push(`Total Searches,${dashboardStats.totalSearches.toLocaleString()}`)
  csvData.push(`Active Users,${dashboardStats.totalUsers.toLocaleString()}`)
  csvData.push(`Avg Lead Quality,${dashboardStats.averageLeadQuality.toFixed(1)}%`)
  csvData.push('')
  
  // Lead Statistics Summary
  const viewTitle = getViewTitle(viewType)
  csvData.push(`Lead Statistics Summary - ${viewTitle}`)
  
  if (leadStats.length > 0) {
    const totalLeads = leadStats.reduce((sum, item) => sum + (item.total_leads || 0), 0)
    const avgQuality = leadStats.reduce((sum, item) => sum + (item.avg_quality_score || item.calidad_promedio || 0), 0) / leadStats.length
    
    csvData.push('Summary Metric,Value')
    csvData.push(`Total Records,${leadStats.length}`)
    csvData.push(`Total Leads,${totalLeads.toLocaleString()}`)
    csvData.push(`Average Quality Score,${avgQuality.toFixed(2)}`)
    csvData.push('')
  } else {
    csvData.push('No data available')
    csvData.push('')
  }
  
  // Complete Lead Statistics (all data)
  csvData.push(`Complete Lead Statistics - ${viewTitle} (All Data)`)
  
  if (leadStats.length > 0) {
    const headers = getCompleteLeadStatsHeaders(viewType)
    csvData.push(headers.join(','))
    
    leadStats.forEach(item => {
      const row = getCompleteLeadStatsRow(item, viewType)
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
 * Get headers for complete lead statistics table based on view type
 */
function getCompleteLeadStatsHeaders(viewType: string): string[] {
  switch (viewType) {
    case 'category':
      return [
        'Category', 'Total Leads', 'Verified Emails', 'Verified Phones', 
        'Verified Websites', 'Avg Quality Score', 'Latest Lead Date'
      ]
    case 'country':
      return [
        'Country', 'Total Leads', 'High Quality Leads', 'High Quality %', 
        'Verified Emails', 'Verified Phones', 'Email Verification Rate %',
        'Phone Verification Rate %', 'Top Categories', 'Avg Quality Score',
        'First Lead Date', 'Latest Lead Date'
      ]
    case 'state':
      return [
        'State', 'Country', 'Total Leads', 'High Quality Leads', 'High Quality %',
        'Verified Emails', 'Verified Phones', 'Leads with Phone', 'Leads with Email',
        'Contactable %', 'Top Activities', 'Leads Last 30 Days', 'Avg Quality Score'
      ]
    case 'spain-region':
      return [
        'Comunidad Autónoma', 'Total Leads', 'Leads Alta Calidad', 'Calidad Promedio',
        'Teléfonos Verificados', 'Emails Verificados', 'Con Website', 
        'Contactabilidad %', 'Categoría Principal', 'Primer Lead', 'Último Lead'
      ]
    default:
      return [
        'Category', 'Total Leads', 'Verified Emails', 'Verified Phones', 
        'Verified Websites', 'Avg Quality Score', 'Latest Lead Date'
      ]
  }
}

/**
 * Get row data for complete lead statistics table based on view type
 */
function getCompleteLeadStatsRow(item: any, viewType: string): string[] {
  switch (viewType) {
    case 'category':
      return [
        item.category || '',
        (item.total_leads || 0).toString(),
        (item.verified_emails || 0).toString(),
        (item.verified_phones || 0).toString(),
        (item.verified_websites || 0).toString(),
        (item.avg_quality_score || 0).toString(),
        item.latest_lead_date || ''
      ]
    case 'country':
      return [
        item.country || '',
        (item.total_leads || 0).toString(),
        (item.high_quality_leads || 0).toString(),
        (item.high_quality_percentage || 0).toString() + '%',
        (item.verified_emails || 0).toString(),
        (item.verified_phones || 0).toString(),
        (item.email_verification_rate || 0).toString() + '%',
        (item.phone_verification_rate || 0).toString() + '%',
        item.top_categories || '',
        (item.avg_quality_score || 0).toString(),
        item.first_lead_date || '',
        item.latest_lead_date || ''
      ]
    case 'state':
      return [
        item.state || '',
        item.country || '',
        (item.total_leads || 0).toString(),
        (item.high_quality_leads || 0).toString(),
        (item.high_quality_percentage || 0).toString() + '%',
        (item.verified_emails || 0).toString(),
        (item.verified_phones || 0).toString(),
        (item.leads_with_phone || 0).toString(),
        (item.leads_with_email || 0).toString(),
        (item.contactable_percentage || 0).toString() + '%',
        item.top_activities || '',
        (item.leads_last_30_days || 0).toString(),
        (item.avg_quality_score || 0).toString()
      ]
    case 'spain-region':
      return [
        item.comunidad_autonoma || '',
        (item.total_leads || 0).toString(),
        (item.leads_alta_calidad || 0).toString(),
        (item.calidad_promedio || 0).toString(),
        (item.telefonos_verificados || 0).toString(),
        (item.emails_verificados || 0).toString(),
        (item.con_website || 0).toString(),
        (item.contactabilidad_porcentaje || 0).toString() + '%',
        item.categoria_principal || '',
        item.primer_lead || '',
        item.ultimo_lead || ''
      ]
    default:
      return [
        item.category || '',
        (item.total_leads || 0).toString(),
        (item.verified_emails || 0).toString(),
        (item.verified_phones || 0).toString(),
        (item.verified_websites || 0).toString(),
        (item.avg_quality_score || 0).toString(),
        item.latest_lead_date || ''
      ]
  }
}

/**
 * Get headers for lead statistics table based on view type (legacy function)
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
 * Get row data for lead statistics table based on view type (legacy function)
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