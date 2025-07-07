import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import type { ActivityItem, SearchHistoryItem, CampaignHistoryItem } from '../types'

// Activity Timeline data transformation
const transformActivityData = (activities: ActivityItem[]) => {
  return activities.map(activity => ({
    'Fecha': format(new Date(activity.timestamp), 'dd/MM/yyyy HH:mm', { locale: es }),
    'Tipo': getActivityTypeText(activity.type),
    'Título': activity.title,
    'Descripción': activity.description,
    'Estado': getStatusText(activity.status),
    'Usuario': activity.userId,
    'Leads': activity.metadata?.leadsCount || '',
    'Duración (s)': activity.metadata?.duration || '',
    'Formato': activity.metadata?.exportFormat || '',
    'Error': activity.metadata?.errorMessage || ''
  }))
}

// Search History data transformation
const transformSearchData = (searches: SearchHistoryItem[]) => {
  return searches.map(search => ({
    'Fecha': format(new Date(search.date), 'dd/MM/yyyy HH:mm', { locale: es }),
    'Sitios Web': search.websites.join(', '),
    'Tipo de Cliente': search.clientType,
    'Leads Encontrados': search.leadsFound,
    'Leads Contactados': search.leadsContacted,
    'Tiempo de Búsqueda (s)': search.searchTime || '',
    'Estado': getSearchStatusText(search.status),
    'Query': search.query || '',
    'Industria': search.filters?.industry?.join(', ') || '',
    'Ubicación': search.filters?.location?.join(', ') || '',
    'Tamaño de Empresa': search.filters?.companySize?.join(', ') || '',
    'Confianza': search.filters?.confidence || ''
  }))
}

// Campaign History data transformation  
const transformCampaignData = (campaigns: CampaignHistoryItem[]) => {
  return campaigns.map(campaign => ({
    'Fecha de Envío': format(new Date(campaign.sentAt), 'dd/MM/yyyy HH:mm', { locale: es }),
    'Asunto': campaign.subject,
    'Remitente': campaign.senderName,
    'Email Remitente': campaign.senderEmail,
    'Tipo de Campaña': getCampaignTypeText(campaign.metadata?.campaign_type),
    'Destinatarios': campaign.recipients,
    'Tasa de Apertura (%)': campaign.openRate.toFixed(2),
    'Tasa de Clicks (%)': campaign.clickRate.toFixed(2),
    'Tasa de Respuesta (%)': campaign.responseRate.toFixed(2),
    'Estado': getCampaignStatusText(campaign.status),
    'Plantilla': campaign.template || '',
    'Segmento Objetivo': campaign.metadata?.target_segment || '',
    'Etiquetas': campaign.metadata?.tags?.join(', ') || '',
    'Prueba A/B': campaign.metadata?.ab_test ? 'Sí' : 'No'
  }))
}

// Helper functions for text conversion
const getActivityTypeText = (type: string) => {
  switch (type) {
    case 'search': return 'Búsqueda'
    case 'campaign': return 'Campaña'
    case 'export': return 'Exportación'
    case 'import': return 'Importación'
    case 'lead_update': return 'Actualización'
    default: return type
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'success': return 'Éxito'
    case 'error': return 'Error'
    case 'pending': return 'Pendiente'
    default: return status
  }
}

const getSearchStatusText = (status: string) => {
  switch (status) {
    case 'completed': return 'Completada'
    case 'failed': return 'Fallida'
    case 'cancelled': return 'Cancelada'
    default: return status
  }
}

const getCampaignStatusText = (status: string) => {
  switch (status) {
    case 'sent': return 'Enviada'
    case 'draft': return 'Borrador'
    case 'scheduled': return 'Programada'
    case 'failed': return 'Fallida'
    default: return status
  }
}

const getCampaignTypeText = (type?: string) => {
  switch (type) {
    case 'promotional': return 'Promocional'
    case 'follow_up': return 'Seguimiento'
    case 'newsletter': return 'Newsletter'
    default: return 'General'
  }
}

// Main export function
export const exportHistoryToExcel = async (data: {
  activities?: ActivityItem[]
  searches?: SearchHistoryItem[]
  campaigns?: CampaignHistoryItem[]
  type?: 'all' | 'search' | 'campaigns' | 'activity'
}) => {
  const { activities = [], searches = [], campaigns = [], type = 'all' } = data
  
  // Create a new workbook
  const workbook = XLSX.utils.book_new()
  
  try {
    // Add sheets based on type or all data
    if (type === 'all' || type === 'search') {
      if (searches.length > 0) {
        const searchData = transformSearchData(searches)
        const searchWorksheet = XLSX.utils.json_to_sheet(searchData)
        
        // Auto-size columns
        const searchCols = [
          { wch: 18 }, // Fecha
          { wch: 25 }, // Sitios Web
          { wch: 15 }, // Tipo de Cliente
          { wch: 12 }, // Leads Encontrados
          { wch: 12 }, // Leads Contactados
          { wch: 15 }, // Tiempo de Búsqueda
          { wch: 12 }, // Estado
          { wch: 20 }, // Query
          { wch: 15 }, // Industria
          { wch: 15 }, // Ubicación
          { wch: 15 }, // Tamaño de Empresa
          { wch: 10 }  // Confianza
        ]
        searchWorksheet['!cols'] = searchCols
        
        XLSX.utils.book_append_sheet(workbook, searchWorksheet, 'Historial de Búsquedas')
      }
    }
    
    if (type === 'all' || type === 'campaigns') {
      if (campaigns.length > 0) {
        const campaignData = transformCampaignData(campaigns)
        const campaignWorksheet = XLSX.utils.json_to_sheet(campaignData)
        
        // Auto-size columns
        const campaignCols = [
          { wch: 18 }, // Fecha de Envío
          { wch: 30 }, // Asunto
          { wch: 20 }, // Remitente
          { wch: 25 }, // Email Remitente
          { wch: 15 }, // Tipo de Campaña
          { wch: 12 }, // Destinatarios
          { wch: 15 }, // Tasa de Apertura
          { wch: 15 }, // Tasa de Clicks
          { wch: 15 }, // Tasa de Respuesta
          { wch: 12 }, // Estado
          { wch: 20 }, // Plantilla
          { wch: 15 }, // Segmento Objetivo
          { wch: 20 }, // Etiquetas
          { wch: 10 }  // Prueba A/B
        ]
        campaignWorksheet['!cols'] = campaignCols
        
        XLSX.utils.book_append_sheet(workbook, campaignWorksheet, 'Historial de Campañas')
      }
    }
    
    if (type === 'all' || type === 'activity') {
      if (activities.length > 0) {
        const activityData = transformActivityData(activities)
        const activityWorksheet = XLSX.utils.json_to_sheet(activityData)
        
        // Auto-size columns
        const activityCols = [
          { wch: 18 }, // Fecha
          { wch: 12 }, // Tipo
          { wch: 30 }, // Título
          { wch: 40 }, // Descripción
          { wch: 10 }, // Estado
          { wch: 25 }, // Usuario
          { wch: 8 },  // Leads
          { wch: 12 }, // Duración
          { wch: 10 }, // Formato
          { wch: 30 }  // Error
        ]
        activityWorksheet['!cols'] = activityCols
        
        XLSX.utils.book_append_sheet(workbook, activityWorksheet, 'Línea de Tiempo')
      }
    }
    
    // Check if workbook has any sheets
    if (workbook.SheetNames.length === 0) {
      throw new Error('No hay datos para exportar')
    }
    
    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, { 
      bookType: 'xlsx', 
      type: 'array',
      compression: true
    })
    
    // Create blob and download
    const data_blob = new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    })
    
    const filename = `ritterfinder_historial_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.xlsx`
    saveAs(data_blob, filename)
    
    return { success: true, filename }
    
  } catch (error) {
    console.error('Error al exportar historial:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido al exportar' 
    }
  }
}

// Export individual sections
export const exportSearchHistory = (searches: SearchHistoryItem[]) => 
  exportHistoryToExcel({ searches, type: 'search' })

export const exportCampaignHistory = (campaigns: CampaignHistoryItem[]) => 
  exportHistoryToExcel({ campaigns, type: 'campaigns' })

export const exportActivityTimeline = (activities: ActivityItem[]) => 
  exportHistoryToExcel({ activities, type: 'activity' }) 