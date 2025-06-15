"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/language-context"
import type { SetupPasswordCredentials, SetupPasswordFormState, SetupPasswordResponse } from "../types"

export function useSetupPassword(token: string) {
  const [formState, setFormState] = useState<SetupPasswordFormState>({
    password: "",
    confirmPassword: "",
    error: "",
    isLoading: false,
    token,
  })

  const router = useRouter()
  const { t } = useLanguage()

  const updateField = (field: keyof SetupPasswordCredentials, value: string) => {
    setFormState(prev => ({
      ...prev,
      [field]: value,
      error: "", // Clear error when user types
    }))
  }

  const validatePasswords = (): string | null => {
    if (formState.password.length < 8) {
      return "La contraseña debe tener al menos 8 caracteres"
    }
    
    if (formState.password !== formState.confirmPassword) {
      return "Las contraseñas no coinciden"
    }
    
    return null
  }

  const handleSetupPassword = async (credentials: SetupPasswordCredentials): Promise<SetupPasswordResponse> => {
    setFormState(prev => ({ ...prev, isLoading: true, error: "" }))

    try {
      const validationError = validatePasswords()
      if (validationError) {
        setFormState(prev => ({ ...prev, error: validationError, isLoading: false }))
        return { success: false, error: validationError }
      }

      // Simulate API call to setup password
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Here you would make the actual API call to your backend
      // const response = await fetch('/api/auth/setup-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ token, password: credentials.password })
      // })

      // For demo purposes, we'll simulate success
      router.push("/login?setup=success")
      return { success: true, redirectUrl: "/login?setup=success" }
      
    } catch (error) {
      const errorMessage = "Error al configurar la contraseña"
      setFormState(prev => ({ ...prev, error: errorMessage, isLoading: false }))
      return { success: false, error: errorMessage }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await handleSetupPassword({
      password: formState.password,
      confirmPassword: formState.confirmPassword,
    })
  }

  return {
    formState,
    updateField,
    handleSubmit,
    handleSetupPassword,
  }
} 