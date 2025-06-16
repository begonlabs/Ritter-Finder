"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useLanguage } from "@/lib/language-context"
import type { SetPasswordCredentials, SetPasswordFormState, SetPasswordResponse } from "../types"

export function useSetPassword() {
  const [formState, setFormState] = useState<SetPasswordFormState>({
    password: "",
    confirmPassword: "",
    token: "",
    error: "",
    isLoading: false,
    success: false,
  })

  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useLanguage()

  // Get token from URL params on mount
  useEffect(() => {
    const token = searchParams.get("token")
    if (token) {
      setFormState(prev => ({ ...prev, token }))
    }
  }, [searchParams])

  // Set token programmatically (for demo or direct usage)
  const setToken = (token: string) => {
    setFormState(prev => ({ ...prev, token }))
  }

  const updateField = (field: keyof SetPasswordCredentials, value: string) => {
    setFormState(prev => ({
      ...prev,
      [field]: value,
      error: "", // Clear error when user types
      success: false, // Clear success state
    }))
  }

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return "La contraseña debe tener al menos 8 caracteres"
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return "La contraseña debe contener al menos una letra minúscula"
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return "La contraseña debe contener al menos una letra mayúscula"
    }
    if (!/(?=.*\d)/.test(password)) {
      return "La contraseña debe contener al menos un número"
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      return "La contraseña debe contener al menos un carácter especial (@$!%*?&)"
    }
    return null
  }

  const validateForm = (): string | null => {
    if (!formState.token) {
      return "Token de validación no encontrado"
    }
    
    if (!formState.password) {
      return "La contraseña es requerida"
    }

    const passwordError = validatePassword(formState.password)
    if (passwordError) {
      return passwordError
    }

    if (!formState.confirmPassword) {
      return "Confirma tu contraseña"
    }

    if (formState.password !== formState.confirmPassword) {
      return "Las contraseñas no coinciden"
    }

    return null
  }

  const handleSetPassword = async (credentials: SetPasswordCredentials): Promise<SetPasswordResponse> => {
    setFormState(prev => ({ ...prev, isLoading: true, error: "", success: false }))

    try {
      // Validate form
      const validationError = validateForm()
      if (validationError) {
        setFormState(prev => ({ ...prev, error: validationError, isLoading: false }))
        return { success: false, error: validationError }
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate token validation (in real app, this would be a server call)
      if (credentials.token && credentials.token.length > 10) {
        setFormState(prev => ({ ...prev, success: true, isLoading: false }))
        
        // Wait a moment to show success message
        setTimeout(() => {
          router.push("/?message=password-set-success")
        }, 1500)
        
        return { success: true, redirectUrl: "/" }
      } else {
        const error = "Token inválido o expirado"
        setFormState(prev => ({ ...prev, error, isLoading: false }))
        return { success: false, error }
      }
    } catch (error) {
      const errorMessage = "Error inesperado. Inténtalo de nuevo"
      setFormState(prev => ({ ...prev, error: errorMessage, isLoading: false }))
      return { success: false, error: errorMessage }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await handleSetPassword({
      token: formState.token,
      password: formState.password,
      confirmPassword: formState.confirmPassword,
    })
  }

  const getPasswordStrength = (password: string): { score: number; label: string; color: string } => {
    let score = 0
    
    if (password.length >= 8) score++
    if (/(?=.*[a-z])/.test(password)) score++
    if (/(?=.*[A-Z])/.test(password)) score++
    if (/(?=.*\d)/.test(password)) score++
    if (/(?=.*[@$!%*?&])/.test(password)) score++

    if (score <= 1) return { score, label: "Muy débil", color: "#dc2626" }
    if (score <= 2) return { score, label: "Débil", color: "#ea580c" }
    if (score <= 3) return { score, label: "Regular", color: "#d97706" }
    if (score <= 4) return { score, label: "Fuerte", color: "#65a30d" }
    return { score, label: "Muy fuerte", color: "#16a34a" }
  }

  return {
    formState,
    updateField,
    handleSubmit,
    handleSetPassword,
    validateForm,
    getPasswordStrength,
    setToken,
  }
} 