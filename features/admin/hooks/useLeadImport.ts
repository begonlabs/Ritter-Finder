"use client"

import { useState, useCallback } from 'react'
import Papa from 'papaparse'
import { createClient } from '@supabase/supabase-js'
import { useCategories } from './useCategories'

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface LeadData {
  company_name: string
  email?: string
  verified_email: boolean
  phone?: string
  verified_phone: boolean
  company_website?: string
  verified_website: boolean
  address?: string
  state?: string
  country?: string
  activity: string
  description?: string
  category?: string
  data_quality_score?: number
  created_at?: string
}

interface ValidationError {
  row: number
  field: string
  message: string
}

interface Notification {
  id: string
  type: 'success' | 'error' | 'info'
  title: string
  message: string
  duration?: number
}

interface UseLeadImportReturn {
  // State
  leads: LeadData[]
  isLoading: boolean
  error: string | null
  isImporting: boolean
  isCreating: boolean
  validationErrors: ValidationError[]
  previewData: LeadData[]
  notifications: Notification[]
  
  // Actions
  importFromCSV: (file: File) => Promise<void>
  createLead: (leadData: Partial<LeadData>) => Promise<void>
  validateLead: (lead: LeadData, index: number) => ValidationError[]
  clearLeads: () => void
  downloadTemplate: () => void
  importLeadsBulk: (leadsToImport: LeadData[]) => Promise<{ successCount: number; errorCount: number; results: { lead: LeadData; result: { success: boolean; id?: string; error?: string } }[] }>
  
  // Form state
  formData: Partial<LeadData>
  setFormData: (data: Partial<LeadData> | ((prev: Partial<LeadData>) => Partial<LeadData>)) => void
  resetForm: () => void
  
  // Notifications
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
}

const DEFAULT_FORM_DATA: Partial<LeadData> = {
  company_name: '',
  email: '',
  verified_email: false,
  phone: '',
  verified_phone: false,
  company_website: '',
  verified_website: false,
  address: '',
  state: '',
  country: '',
  activity: '',
  description: '',
  category: '',
  data_quality_score: 3,
  created_at: new Date().toISOString()
}

export function useLeadImport(): UseLeadImportReturn {
  const [leads, setLeads] = useState<LeadData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
  const [formData, setFormDataState] = useState<Partial<LeadData>>(DEFAULT_FORM_DATA)
  const [notifications, setNotifications] = useState<Notification[]>([])
  
  // Integrar categorías
  const categories = useCategories()

  const setFormData = useCallback((data: Partial<LeadData> | ((prev: Partial<LeadData>) => Partial<LeadData>)) => {
    if (typeof data === 'function') {
      setFormDataState(data)
    } else {
      setFormDataState(data)
    }
  }, [])

  // Funciones auxiliares
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  // Función para validar lead
  const validateLead = useCallback((lead: LeadData, index: number): ValidationError[] => {
    const errors: ValidationError[] = []
    
    // Validar campos obligatorios
    if (!lead.company_name.trim()) {
      errors.push({
        row: index,
        field: 'company_name',
        message: 'El nombre de la empresa es obligatorio'
      })
    }
    
    if (!lead.activity.trim()) {
      errors.push({
        row: index,
        field: 'activity',
        message: 'La actividad es obligatoria'
      })
    }
    
    // Validar email si existe
    if (lead.email && !isValidEmail(lead.email)) {
      errors.push({
        row: index,
        field: 'email',
        message: 'El formato del email no es válido'
      })
    }
    
    // Validar website si existe
    if (lead.company_website && !isValidUrl(lead.company_website)) {
      errors.push({
        row: index,
        field: 'company_website',
        message: 'El formato de la URL no es válido'
      })
    }
    
    // Validar score de calidad
    if (lead.data_quality_score && (lead.data_quality_score < 1 || lead.data_quality_score > 5)) {
      errors.push({
        row: index,
        field: 'data_quality_score',
        message: 'El score de calidad debe estar entre 1 y 5'
      })
    }
    
    return errors
  }, [])

  // Función para agregar notificaciones
  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString()
    const newNotification = { ...notification, id }
    
    setNotifications(prev => [...prev, newNotification])
    
    // Auto-remover notificaciones después de un tiempo
    if (notification.duration !== 0) {
      setTimeout(() => {
        removeNotification(id)
      }, notification.duration || 5000)
    }
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const clearNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  // Función para limpiar leads
  const clearLeads = useCallback(() => {
    setLeads([])
    setValidationErrors([])
    setError(null)
    addNotification({
      type: 'info',
      title: 'Leads Limpiados',
      message: 'Se han limpiado todos los leads cargados'
    })
  }, [addNotification])

  // Función para resetear formulario
  const resetForm = useCallback(() => {
    setFormDataState(DEFAULT_FORM_DATA)
  }, [])

  // Función para crear lead individual en Supabase
  const createLeadInDatabase = async (leadData: LeadData): Promise<{ success: boolean, id?: string, error?: string }> => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .insert([leadData])
        .select('id')
      
      if (error) {
        console.error('Error inserting lead:', error)
        return { success: false, error: error.message }
      }
      
      if (data && data.length > 0) {
        return { success: true, id: data[0].id }
      } else {
        return { success: false, error: 'No se recibió ID de inserción' }
      }
    } catch (error: any) {
      console.error('Unexpected error inserting lead:', error)
      return { success: false, error: String(error) }
    }
  }

  // Función para importar desde CSV
  const importFromCSV = useCallback(async (file: File) => {
    setIsImporting(true)
    setError(null)
    setValidationErrors([])
    
    try {
      const text = await file.text()
      
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header: string) => header.trim(),
        complete: (results) => {
          const parsedLeads: LeadData[] = []
          const errors: ValidationError[] = []
          
          results.data.forEach((row: any, index: number) => {
            const lead: LeadData = {
              company_name: row.company_name || '',
              email: row.email || undefined,
              verified_email: row.verified_email === 'true',
              phone: row.phone || undefined,
              verified_phone: row.verified_phone === 'true',
              company_website: row.company_website || undefined,
              verified_website: row.verified_website === 'true',
              address: row.address || undefined,
              state: row.state || undefined,
              country: row.country || undefined,
              activity: row.activity || '',
              description: row.description || undefined,
              category: row.category || undefined,
              data_quality_score: row.data_quality_score ? parseInt(row.data_quality_score) : undefined,
              created_at: row.created_at || new Date().toISOString()
            }
            
            // Validar lead
            const leadErrors = validateLead(lead, index)
            if (leadErrors.length > 0) {
              errors.push(...leadErrors)
            } else {
              parsedLeads.push(lead)
            }
          })
          
          setLeads(parsedLeads)
          setValidationErrors(errors)
          
          if (parsedLeads.length > 0) {
            addNotification({
              type: 'success',
              title: 'CSV Importado',
              message: `Se cargaron ${parsedLeads.length} leads exitosamente${errors.length > 0 ? ` con ${errors.length} errores` : ''}`
            })
          }
          
          if (errors.length > 0) {
            addNotification({
              type: 'error',
              title: 'Errores de Validación',
              message: `Se encontraron ${errors.length} errores en el archivo CSV`
            })
          }
        },
                 error: (error: any) => {
           setError(`Error al parsear CSV: ${error.message}`)
           addNotification({
             type: 'error',
             title: 'Error de CSV',
             message: `No se pudo procesar el archivo CSV: ${error.message}`
           })
         }
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setError(`Error al leer archivo: ${errorMessage}`)
      addNotification({
        type: 'error',
        title: 'Error de Archivo',
        message: `No se pudo leer el archivo: ${errorMessage}`
      })
    } finally {
      setIsImporting(false)
    }
  }, [addNotification])

  // Función para crear lead manualmente
  const createLead = useCallback(async (leadData: Partial<LeadData>) => {
    setIsCreating(true)
    setError(null)
    
    try {
      // Validar datos obligatorios
      if (!leadData.company_name?.trim()) {
        throw new Error('El nombre de la empresa es obligatorio')
      }
      
      if (!leadData.activity?.trim()) {
        throw new Error('La actividad es obligatoria')
      }
      
      // Preparar datos para inserción
      const leadToInsert: LeadData = {
        company_name: leadData.company_name,
        email: leadData.email,
        verified_email: leadData.verified_email || false,
        phone: leadData.phone,
        verified_phone: leadData.verified_phone || false,
        company_website: leadData.company_website,
        verified_website: leadData.verified_website || false,
        address: leadData.address,
        state: leadData.state,
        country: leadData.country,
        activity: leadData.activity,
        description: leadData.description,
        category: leadData.category,
        data_quality_score: leadData.data_quality_score || 3,
        created_at: new Date().toISOString()
      }
      
      // Insertar en base de datos
      const result = await createLeadInDatabase(leadToInsert)
      
      if (result.success) {
        addNotification({
          type: 'success',
          title: 'Lead Creado',
          message: `Lead "${leadToInsert.company_name}" creado exitosamente`
        })
        
        // Resetear formulario
        resetForm()
      } else {
        throw new Error(result.error || 'Error desconocido al crear lead')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setError(errorMessage)
      addNotification({
        type: 'error',
        title: 'Error al Crear Lead',
        message: errorMessage
      })
      throw error
    } finally {
      setIsCreating(false)
    }
  }, [addNotification, resetForm])

  // Función para descargar plantilla
  const downloadTemplate = useCallback(() => {
    const headers = [
      'company_name',
      'email',
      'verified_email',
      'phone',
      'verified_phone',
      'company_website',
      'verified_website',
      'address',
      'state',
      'country',
      'activity',
      'description',
      'category',
      'data_quality_score',
      'created_at'
    ]
    
    const sampleData = [
      'Empresa Ejemplo',
      'contacto@empresa.com',
      'true',
      '+34 600 000 000',
      'false',
      'https://empresa.com',
      'true',
      'Calle Ejemplo 123, Madrid',
      'Madrid',
      'España',
      'Actividad de ejemplo',
      'Descripción de la empresa',
      'Empresas Personalizadas',
      '4',
      new Date().toISOString()
    ]
    
    const csvContent = [headers.join(','), sampleData.join(',')].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'plantilla-leads.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    addNotification({
      type: 'success',
      title: 'Plantilla Descargada',
      message: 'Se ha descargado la plantilla CSV'
    })
  }, [addNotification])

  // Función para importar leads en lote
  const importLeadsBulk = useCallback(async (leadsToImport: LeadData[]) => {
    setIsImporting(true)
    setError(null)
    
    try {
      const results = []
      let successCount = 0
      let errorCount = 0
      
      for (const lead of leadsToImport) {
        const result = await createLeadInDatabase(lead)
        results.push({ lead, result })
        
        if (result.success) {
          successCount++
        } else {
          errorCount++
        }
        
        // Pequeña pausa entre inserciones
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      
      // Mostrar resultados
      if (successCount > 0) {
        addNotification({
          type: 'success',
          title: 'Importación Completada',
          message: `Se importaron ${successCount} leads exitosamente${errorCount > 0 ? `, ${errorCount} fallaron` : ''}`
        })
      }
      
      if (errorCount > 0) {
        addNotification({
          type: 'error',
          title: 'Errores en Importación',
          message: `${errorCount} leads no se pudieron importar`
        })
      }
      
      // Limpiar leads después de importación
      clearLeads()
      
      return { successCount, errorCount, results }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setError(errorMessage)
      addNotification({
        type: 'error',
        title: 'Error en Importación',
        message: errorMessage
      })
      throw error
    } finally {
      setIsImporting(false)
    }
  }, [addNotification, clearLeads])



  return {
    // State
    leads,
    isLoading,
    error,
    isImporting,
    isCreating,
    validationErrors,
    previewData: leads,
    notifications,
    
    // Actions
    importFromCSV,
    createLead,
    validateLead,
    clearLeads,
    downloadTemplate,
    importLeadsBulk,
    
    // Form state
    formData,
    setFormData,
    resetForm,
    
    // Notifications
    addNotification,
    removeNotification,
    clearNotifications
  }
} 