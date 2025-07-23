 "use client"

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export interface CategoryData {
  id: string
  name: string
  description?: string
  lead_count: number
  created_at: string
  updated_at: string
}

export interface CategoryOption {
  value: string
  label: string
  description?: string
  leadCount: number
  isNew?: boolean
}

interface UseCategoriesReturn {
  // State
  categories: CategoryData[]
  categoryOptions: CategoryOption[]
  isLoading: boolean
  error: string | null
  isCreating: boolean
  
  // Actions
  fetchCategories: () => Promise<void>
  createCategory: (name: string, description?: string) => Promise<CategoryData>
  updateCategory: (id: string, updates: Partial<CategoryData>) => Promise<CategoryData>
  deleteCategory: (id: string) => Promise<void>
  
  // Utilities
  getCategoryById: (id: string) => CategoryData | undefined
  getCategoryByName: (name: string) => CategoryData | undefined
  searchCategories: (query: string) => CategoryOption[]
  validateCategoryName: (name: string) => { isValid: boolean; error?: string }
}

export function useCategories(): UseCategoriesReturn {
  const [categories, setCategories] = useState<CategoryData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  // Cargar categorías al inicializar
  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Obtener categorías únicas de la tabla leads
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('leads')
        .select('category')
        .not('category', 'is', null)
        .not('category', 'eq', '')

      if (categoriesError) {
        throw new Error(`Error fetching categories: ${categoriesError.message}`)
      }

      // Contar leads por categoría
      const categoryCounts: Record<string, number> = {}
      categoriesData?.forEach(lead => {
        if (lead.category) {
          categoryCounts[lead.category] = (categoryCounts[lead.category] || 0) + 1
        }
      })

      // Crear objetos de categoría con conteos
      const uniqueCategories = [...new Set(categoriesData?.map(lead => lead.category).filter(Boolean) || [])]
      const categoriesWithCounts: CategoryData[] = uniqueCategories.map((category, index) => ({
        id: `category-${index + 1}`,
        name: category,
        description: `Categoría para ${category}`,
        lead_count: categoryCounts[category] || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }))

      // Ordenar por número de leads (descendente)
      categoriesWithCounts.sort((a, b) => b.lead_count - a.lead_count)

      setCategories(categoriesWithCounts)
    } catch (err) {
      console.error('Error fetching categories:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido al cargar categorías')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createCategory = useCallback(async (name: string, description?: string): Promise<CategoryData> => {
    setIsCreating(true)
    setError(null)

    try {
      // Validar que la categoría no exista
      const existingCategory = categories.find(cat => 
        cat.name.toLowerCase() === name.toLowerCase()
      )

      if (existingCategory) {
        throw new Error('Esta categoría ya existe')
      }

      // Crear nueva categoría
      const newCategory: CategoryData = {
        id: `category-${Date.now()}`,
        name: name.trim(),
        description: description?.trim(),
        lead_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      setCategories(prev => [newCategory, ...prev])
      return newCategory
    } catch (err) {
      console.error('Error creating category:', err)
      setError(err instanceof Error ? err.message : 'Error al crear categoría')
      throw err
    } finally {
      setIsCreating(false)
    }
  }, [categories])

  const updateCategory = useCallback(async (id: string, updates: Partial<CategoryData>): Promise<CategoryData> => {
    try {
      setCategories(prev => prev.map(cat => 
        cat.id === id 
          ? { ...cat, ...updates, updated_at: new Date().toISOString() }
          : cat
      ))

      const updatedCategory = categories.find(cat => cat.id === id)
      if (!updatedCategory) {
        throw new Error('Categoría no encontrada')
      }

      return { ...updatedCategory, ...updates }
    } catch (err) {
      console.error('Error updating category:', err)
      setError(err instanceof Error ? err.message : 'Error al actualizar categoría')
      throw err
    }
  }, [categories])

  const deleteCategory = useCallback(async (id: string): Promise<void> => {
    try {
      setCategories(prev => prev.filter(cat => cat.id !== id))
    } catch (err) {
      console.error('Error deleting category:', err)
      setError(err instanceof Error ? err.message : 'Error al eliminar categoría')
      throw err
    }
  }, [])

  const getCategoryById = useCallback((id: string): CategoryData | undefined => {
    return categories.find(cat => cat.id === id)
  }, [categories])

  const getCategoryByName = useCallback((name: string): CategoryData | undefined => {
    return categories.find(cat => 
      cat.name.toLowerCase() === name.toLowerCase()
    )
  }, [categories])

  const searchCategories = useCallback((query: string): CategoryOption[] => {
    const searchTerm = query.toLowerCase().trim()
    
    if (!searchTerm) {
      return categories.map(cat => ({
        value: cat.name,
        label: cat.name,
        description: cat.description,
        leadCount: cat.lead_count
      }))
    }

    const matchingCategories = categories.filter(cat =>
      cat.name.toLowerCase().includes(searchTerm) ||
      cat.description?.toLowerCase().includes(searchTerm)
    )

    // Si no hay coincidencias, agregar opción para crear nueva
    if (matchingCategories.length === 0) {
      return [{
        value: `new:${searchTerm}`,
        label: `Crear "${searchTerm}"`,
        description: 'Nueva categoría',
        leadCount: 0,
        isNew: true
      }]
    }

    return matchingCategories.map(cat => ({
      value: cat.name,
      label: cat.name,
      description: cat.description,
      leadCount: cat.lead_count
    }))
  }, [categories])

  const validateCategoryName = useCallback((name: string): { isValid: boolean; error?: string } => {
    const trimmedName = name.trim()
    
    if (!trimmedName) {
      return { isValid: false, error: 'El nombre de la categoría es requerido' }
    }

    if (trimmedName.length < 2) {
      return { isValid: false, error: 'El nombre debe tener al menos 2 caracteres' }
    }

    if (trimmedName.length > 50) {
      return { isValid: false, error: 'El nombre no puede exceder 50 caracteres' }
    }

    // Verificar si ya existe
    const existingCategory = getCategoryByName(trimmedName)
    if (existingCategory) {
      return { isValid: false, error: 'Esta categoría ya existe' }
    }

    return { isValid: true }
  }, [getCategoryByName])

  // Generar opciones para el selector
  const categoryOptions: CategoryOption[] = categories.map(cat => ({
    value: cat.name,
    label: cat.name,
    description: cat.description,
    leadCount: cat.lead_count
  }))

  return {
    categories,
    categoryOptions,
    isLoading,
    error,
    isCreating,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
    getCategoryByName,
    searchCategories,
    validateCategoryName
  }
}