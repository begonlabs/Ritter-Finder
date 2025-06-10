"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/shared/lib/language-context"
import { simulateLogin, validateLoginCredentials, clearOnboardingState } from "../utils/auth.utils"
import type { LoginCredentials, LoginFormData } from "../types/auth.types"

export function useAuth() {
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
    isLoading: false,
    error: ""
  })
  
  const router = useRouter()
  const { t } = useLanguage()

  const updateField = (field: keyof LoginCredentials, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      error: "" // Clear error when user types
    }))
  }

  const login = async (credentials: LoginCredentials) => {
    // Validate credentials
    const validationError = validateLoginCredentials(credentials)
    if (validationError) {
      setFormData(prev => ({
        ...prev,
        error: validationError
      }))
      return false
    }

    setFormData(prev => ({ ...prev, isLoading: true, error: "" }))

    try {
      const isValid = await simulateLogin(credentials)
      
      if (isValid) {
        clearOnboardingState()
        router.push("/dashboard")
        return true
      } else {
        setFormData(prev => ({
          ...prev,
          error: t("login.error"),
          isLoading: false
        }))
        return false
      }
    } catch (error) {
      setFormData(prev => ({
        ...prev,
        error: "An unexpected error occurred",
        isLoading: false
      }))
      return false
    }
  }

  return {
    formData,
    updateField,
    login,
    isLoading: formData.isLoading,
    error: formData.error
  }
} 