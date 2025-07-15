"use client"

import { useState } from 'react'
import { useAuth } from '../providers/AuthProvider'

export interface ChangePasswordCredentials {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface ChangePasswordState {
  currentPassword: string
  newPassword: string
  confirmPassword: string
  error: string
  isLoading: boolean
  success: boolean
}

export interface ChangePasswordResponse {
  success: boolean
  error?: string
  message?: string
}

export function useChangePassword() {
  const { updatePassword, signIn, user } = useAuth()
  
  const [state, setState] = useState<ChangePasswordState>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    error: '',
    isLoading: false,
    success: false
  })

  const updateField = (field: keyof ChangePasswordCredentials, value: string) => {
    setState(prev => ({
      ...prev,
      [field]: value,
      error: '', // Clear error when user types
      success: false // Clear success state when user types
    }))
  }

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return 'La contraseña debe tener al menos 8 caracteres'
    }
    
    if (!/(?=.*[a-z])/.test(password)) {
      return 'La contraseña debe contener al menos una letra minúscula'
    }
    
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'La contraseña debe contener al menos una letra mayúscula'
    }
    
    if (!/(?=.*\d)/.test(password)) {
      return 'La contraseña debe contener al menos un número'
    }
    
    return null
  }

  const validateForm = (): string | null => {
    if (!state.currentPassword) {
      return 'Debes ingresar tu contraseña actual'
    }
    
    if (!state.newPassword) {
      return 'Debes ingresar una nueva contraseña'
    }
    
    if (!state.confirmPassword) {
      return 'Debes confirmar tu nueva contraseña'
    }
    
    if (state.newPassword !== state.confirmPassword) {
      return 'Las contraseñas no coinciden'
    }
    
    if (state.currentPassword === state.newPassword) {
      return 'La nueva contraseña debe ser diferente a la actual'
    }
    
    const passwordError = validatePassword(state.newPassword)
    if (passwordError) {
      return passwordError
    }
    
    return null
  }

  const handleChangePassword = async (credentials: ChangePasswordCredentials): Promise<ChangePasswordResponse> => {
    setState(prev => ({ ...prev, isLoading: true, error: '', success: false }))
    
    try {
      // Check if we have the current user's email
      if (!user?.email) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'No se pudo obtener la información del usuario'
        }))
        
        return {
          success: false,
          error: 'No se pudo obtener la información del usuario'
        }
      }

      // First, verify current password by attempting to sign in with the correct email
      const currentUser = await signIn(user.email, credentials.currentPassword)
      if (!currentUser.success) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'La contraseña actual es incorrecta'
        }))
        
        return {
          success: false,
          error: 'La contraseña actual es incorrecta'
        }
      }
      
      // Update password using Supabase
      const result = await updatePassword(credentials.newPassword)
      
      if (result.success) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          success: true,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }))
        
        return {
          success: true,
          message: 'Contraseña actualizada exitosamente'
        }
      } else {
        const errorMessage = result.error || 'Error al actualizar la contraseña'
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: errorMessage
        }))
        
        return {
          success: false,
          error: errorMessage
        }
      }
      
    } catch (error) {
      // Handle errors gracefully without throwing exceptions
      const errorMessage = error instanceof Error ? error.message : 'Error inesperado al cambiar la contraseña'
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }))
      
      return {
        success: false,
        error: errorMessage
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validationError = validateForm()
    if (validationError) {
      setState(prev => ({ ...prev, error: validationError }))
      return
    }
    
    const credentials: ChangePasswordCredentials = {
      currentPassword: state.currentPassword,
      newPassword: state.newPassword,
      confirmPassword: state.confirmPassword
    }
    
    try {
      await handleChangePassword(credentials)
    } catch (error) {
      // Handle any unexpected errors in form submission
      const errorMessage = error instanceof Error ? error.message : 'Error inesperado al procesar el formulario'
      setState(prev => ({ ...prev, error: errorMessage }))
    }
  }

  const resetForm = () => {
    setState({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      error: '',
      isLoading: false,
      success: false
    })
  }

  const getPasswordStrength = (password: string): { score: number; label: string; color: string } => {
    if (!password) return { score: 0, label: '', color: 'transparent' }
    
    let score = 0
    if (password.length >= 8) score++
    if (/(?=.*[a-z])/.test(password)) score++
    if (/(?=.*[A-Z])/.test(password)) score++
    if (/(?=.*\d)/.test(password)) score++
    if (/(?=.*[!@#$%^&*])/.test(password)) score++
    
    switch (score) {
      case 0:
      case 1:
        return { score, label: 'Muy débil', color: '#ef4444' }
      case 2:
        return { score, label: 'Débil', color: '#f97316' }
      case 3:
        return { score, label: 'Media', color: '#eab308' }
      case 4:
        return { score, label: 'Fuerte', color: '#22c55e' }
      case 5:
        return { score, label: 'Muy fuerte', color: '#16a34a' }
      default:
        return { score, label: '', color: 'transparent' }
    }
  }

  return {
    state,
    updateField,
    validateForm,
    validatePassword,
    handleChangePassword,
    handleSubmit,
    resetForm,
    getPasswordStrength
  }
} 