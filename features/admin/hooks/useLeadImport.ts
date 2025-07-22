"use client"

import { useState, useCallback } from 'react'
import Papa from 'papaparse'

// Types based on the CSV structure
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

interface UseLeadImportReturn {
  // State
  leads: LeadData[]
  isLoading: boolean
  error: string | null
  isImporting: boolean
  isCreating: boolean
  validationErrors: ValidationError[]
  previewData: LeadData[]
  
  // Actions
  importFromCSV: (file: File) => Promise<void>
  createLead: (leadData: Partial<LeadData>) => Promise<void>
  validateLead: (lead: LeadData, index: number) => ValidationError[]
  clearLeads: () => void
  downloadTemplate: () => void
  
  // Form state
  formData: Partial<LeadData>
  setFormData: (data: Partial<LeadData> | ((prev: Partial<LeadData>) => Partial<LeadData>)) => void
  resetForm: () => void
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
  category: 'Empresas Personalizadas',
  data_quality_score: 1
}

export function useLeadImport(): UseLeadImportReturn {
  const [leads, setLeads] = useState<LeadData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
  const [formData, setFormDataState] = useState<Partial<LeadData>>(DEFAULT_FORM_DATA)
  
  const setFormData = useCallback((data: Partial<LeadData> | ((prev: Partial<LeadData>) => Partial<LeadData>)) => {
    if (typeof data === 'function') {
      setFormDataState(data)
    } else {
      setFormDataState(data)
    }
  }, [])

  // Import CSV file
  const importFromCSV = useCallback(async (file: File) => {
    setIsLoading(true)
    setError(null)
    setValidationErrors([])

    try {
      const text = await file.text()
      const result = Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header: string) => header.trim()
      })

      if (result.errors.length > 0) {
        throw new Error(`Error parsing CSV: ${result.errors[0].message}`)
      }

      const parsedLeads: LeadData[] = result.data.map((row: any, index: number) => ({
        company_name: row.company_name || '',
        email: row.email || '',
        verified_email: row.verified_email === 'true' || row.verified_email === true,
        phone: row.phone || '',
        verified_phone: row.verified_phone === 'true' || row.verified_phone === true,
        company_website: row.company_website || '',
        verified_website: row.verified_website === 'true' || row.verified_website === true,
        address: row.address || '',
        state: row.state || '',
        country: row.country || '',
        activity: row.activity || '',
        description: row.description || '',
        category: row.category || 'Empresas Personalizadas',
        data_quality_score: parseInt(row.data_quality_score) || 1,
        created_at: row.created_at || new Date().toISOString()
      }))

      // Validate all leads
      const errors: ValidationError[] = []
      parsedLeads.forEach((lead, index) => {
        const leadErrors = validateLead(lead, index)
        errors.push(...leadErrors)
      })

      setLeads(parsedLeads)
      setValidationErrors(errors)
      
      console.log(`✅ Imported ${parsedLeads.length} leads`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error importing CSV')
      console.error('❌ Error importing CSV:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Validate a single lead
  const validateLead = useCallback((lead: LeadData, index: number): ValidationError[] => {
    const errors: ValidationError[] = []

    // Required fields
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

    // Email validation
    if (lead.email && !isValidEmail(lead.email)) {
      errors.push({
        row: index,
        field: 'email',
        message: 'El formato del email no es válido'
      })
    }

    // Website validation
    if (lead.company_website && !isValidUrl(lead.company_website)) {
      errors.push({
        row: index,
        field: 'company_website',
        message: 'El formato de la URL no es válido'
      })
    }

    // Data quality score validation
    if (lead.data_quality_score && (lead.data_quality_score < 1 || lead.data_quality_score > 5)) {
      errors.push({
        row: index,
        field: 'data_quality_score',
        message: 'El score de calidad debe estar entre 1 y 5'
      })
    }

    return errors
  }, [])

  // Create a single lead
  const createLead = useCallback(async (leadData: Partial<LeadData>) => {
    setIsCreating(true)
    setError(null)

    try {
      // Validate the lead data
      const validationErrors = validateLead(leadData as LeadData, 0)
      if (validationErrors.length > 0) {
        throw new Error(validationErrors[0].message)
      }

      // Here you would typically send the data to your API
      const newLead: LeadData = {
        ...leadData,
        company_name: leadData.company_name!,
        activity: leadData.activity!,
        verified_email: leadData.verified_email || false,
        verified_phone: leadData.verified_phone || false,
        verified_website: leadData.verified_website || false,
        data_quality_score: leadData.data_quality_score || 1,
        created_at: new Date().toISOString()
      } as LeadData

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log('✅ Lead created:', newLead)
      
      // Add to leads list
      setLeads(prev => [...prev, newLead])
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating lead')
      console.error('❌ Error creating lead:', err)
      throw err
    } finally {
      setIsCreating(false)
    }
  }, [validateLead])

  // Clear all leads
  const clearLeads = useCallback(() => {
    setLeads([])
    setValidationErrors([])
    setError(null)
  }, [])

  // Download CSV template
  const downloadTemplate = useCallback(() => {
    const template = [
      'company_name,email,verified_email,phone,verified_phone,company_website,verified_website,address,state,country,activity,description,category,data_quality_score',
      'Empresa Ejemplo S.L.,contacto@empresa.com,false,+34 600 000 000,false,https://empresa.com,false,Calle Ejemplo 123,Madrid,España,Actividad de ejemplo,Descripción del negocio,Empresas Personalizadas,2'
    ].join('\n')

    const blob = new Blob([template], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'leads_template.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [])

  // Reset form data
  const resetForm = useCallback(() => {
    setFormData(DEFAULT_FORM_DATA)
  }, [])

  // Helper functions
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

  return {
    // State
    leads,
    isLoading,
    error,
    isImporting,
    isCreating,
    validationErrors,
    previewData: leads.slice(0, 10), // Show first 10 for preview
    
    // Actions
    importFromCSV,
    createLead,
    validateLead,
    clearLeads,
    downloadTemplate,
    
    // Form state
    formData,
    setFormData,
    resetForm
  }
} 