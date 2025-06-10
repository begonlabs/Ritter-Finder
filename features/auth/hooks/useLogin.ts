"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/language-context"
import type { LoginCredentials, LoginFormState, AuthResponse } from "../types"

export function useLogin() {
  const [formState, setFormState] = useState<LoginFormState>({
    username: "",
    password: "",
    error: "",
    isLoading: false,
  })

  const router = useRouter()
  const { t } = useLanguage()

  const updateField = (field: keyof LoginCredentials, value: string) => {
    setFormState(prev => ({
      ...prev,
      [field]: value,
      error: "", // Clear error when user types
    }))
  }

  const handleLogin = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    setFormState(prev => ({ ...prev, isLoading: true, error: "" }))

    try {
      // Simulate loading
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (credentials.password === "1234") {
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
      const errorMessage = "An unexpected error occurred"
      setFormState(prev => ({ ...prev, error: errorMessage, isLoading: false }))
      return { success: false, error: errorMessage }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await handleLogin({
      username: formState.username,
      password: formState.password,
    })
  }

  return {
    formState,
    updateField,
    handleSubmit,
    handleLogin,
  }
} 