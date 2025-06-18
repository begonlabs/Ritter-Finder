"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/language-context"
import type { LoginCredentials, LoginFormState, AuthResponse } from "../types"

export function useLogin() {
  const [formState, setFormState] = useState<LoginFormState>({
    email: "",
    password: "",
    twoFactorCode: "",
    showTwoFactor: false,
    error: "",
    isLoading: false,
    needsTwoFactor: false,
  })

  const router = useRouter()
  const { t } = useLanguage()

  const updateField = (field: keyof LoginFormState, value: string | boolean) => {
    setFormState(prev => ({
      ...prev,
      [field]: value,
      error: "", // Clear error when user types
    }))
  }

  // Email validation helper
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleLogin = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    setFormState(prev => ({ ...prev, isLoading: true, error: "" }))

    try {
      // Validate email format
      if (!isValidEmail(credentials.email)) {
        const error = "Por favor ingresa un email válido"
        setFormState(prev => ({ ...prev, error, isLoading: false }))
        return { success: false, error }
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Demo logic - check if user needs 2FA
      const userNeedsTwoFactor = credentials.email.includes("2fa") || credentials.email.includes("admin")
      
      if (credentials.password === "1234") {
        // Check if user needs 2FA and hasn't provided code yet
        if (userNeedsTwoFactor && !credentials.twoFactorCode) {
          setFormState(prev => ({ 
            ...prev, 
            isLoading: false,
            needsTwoFactor: true,
            showTwoFactor: true,
            error: ""
          }))
          return { 
            success: false, 
            error: "Se requiere código de verificación de dos factores" 
          }
        }

        // If 2FA required, validate the code
        if (userNeedsTwoFactor && credentials.twoFactorCode) {
          if (credentials.twoFactorCode !== "123456") {
            const error = "Código de verificación incorrecto"
            setFormState(prev => ({ ...prev, error, isLoading: false }))
            return { success: false, error }
          }
        }

        // Reset onboarding state
        localStorage.removeItem("hasSeenOnboarding")
        
        // Redirect to dashboard
        router.push("/dashboard")
        
        return { success: true, redirectUrl: "/dashboard" }
      } else {
        const error = t("login.error")
        setFormState(prev => ({ ...prev, error, isLoading: false }))
        return { success: false, error }
      }
    } catch (error) {
      const errorMessage = "Ocurrió un error inesperado"
      setFormState(prev => ({ ...prev, error: errorMessage, isLoading: false }))
      return { success: false, error: errorMessage }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await handleLogin({
      email: formState.email,
      password: formState.password,
      twoFactorCode: formState.twoFactorCode || undefined,
    })
  }

  return {
    formState,
    updateField,
    handleSubmit,
    handleLogin,
  }
} 