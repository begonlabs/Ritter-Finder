"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

// Simple types for now - we'll get them from Supabase responses
type User = any // Will be populated by Supabase auth
type Session = any // Will be populated by Supabase auth  
type AuthError = { message: string; status?: number }

// Types
interface AuthContextType {
  user: User | null
  session: Session | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<AuthResponse>
  signUp: (email: string, password: string, metadata?: any) => Promise<AuthResponse>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<AuthResponse>
  updatePassword: (password: string) => Promise<AuthResponse>
  resendConfirmation: (email: string) => Promise<AuthResponse>
}

interface AuthResponse {
  success: boolean
  error?: string
  data?: any
}

interface AuthProviderProps {
  children: React.ReactNode
}

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// AuthProvider Component
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session: initialSession }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error.message)
        } else {
          setSession(initialSession)
          setUser(initialSession?.user ?? null)
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email)
        
        setSession(session)
        setUser(session?.user ?? null)
        setIsLoading(false)

        // Handle different auth events
        switch (event) {
          case 'SIGNED_IN':
            console.log('User signed in:', session?.user?.email)
            break
          case 'SIGNED_OUT':
            console.log('User signed out')
            // Clear any local storage or cached data
            localStorage.removeItem('hasSeenOnboarding')
            break
          case 'PASSWORD_RECOVERY':
            console.log('Password recovery initiated')
            break
          case 'TOKEN_REFRESHED':
            console.log('Token refreshed')
            break
          case 'USER_UPDATED':
            console.log('User updated')
            break
        }
      }
    )

    // Cleanup subscription
    return () => {
      subscription.unsubscribe()
    }
  }, [supabase.auth, router])

  // Sign In
  const signIn = async (email: string, password: string): Promise<AuthResponse> => {
    setIsLoading(true)
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password
      })

      if (error) {
        return { 
          success: false, 
          error: getErrorMessage(error) 
        }
      }

      if (data.user && !data.user.email_confirmed_at) {
        return {
          success: false,
          error: "Por favor verifica tu email antes de continuar. Revisa tu bandeja de entrada."
        }
      }

      // Successful login
      return { 
        success: true, 
        data: data.user 
      }

    } catch (error) {
      console.error('Sign in error:', error)
      return { 
        success: false, 
        error: "Error inesperado durante el login" 
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Sign Up  
  const signUp = async (email: string, password: string, metadata = {}): Promise<AuthResponse> => {
    setIsLoading(true)
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          data: metadata
        }
      })

      if (error) {
        return { 
          success: false, 
          error: getErrorMessage(error) 
        }
      }

      if (data.user && !data.user.email_confirmed_at) {
        return {
          success: true,
          data: data.user,
          error: "Registro exitoso. Por favor revisa tu email para confirmar tu cuenta."
        }
      }

      return { 
        success: true, 
        data: data.user 
      }

    } catch (error) {
      console.error('Sign up error:', error)
      return { 
        success: false, 
        error: "Error inesperado durante el registro" 
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Sign Out
  const signOut = async (): Promise<void> => {
    setIsLoading(true)
    
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Sign out error:', error.message)
      }
      
      // Clear local state
      setUser(null)
      setSession(null)
      
      // Redirect to login
      router.push('/')
      
    } catch (error) {
      console.error('Sign out error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Reset Password
  const resetPassword = async (email: string): Promise<AuthResponse> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/set-password`
      })

      if (error) {
        return { 
          success: false, 
          error: getErrorMessage(error) 
        }
      }

      return { 
        success: true, 
        error: "Se ha enviado un link de recuperación a tu email" 
      }

    } catch (error) {
      console.error('Reset password error:', error)
      return { 
        success: false, 
        error: "Error al enviar email de recuperación" 
      }
    }
  }

  // Update Password
  const updatePassword = async (password: string): Promise<AuthResponse> => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password
      })

      if (error) {
        return { 
          success: false, 
          error: getErrorMessage(error) 
        }
      }

      return { 
        success: true, 
        data: data.user 
      }

    } catch (error) {
      console.error('Update password error:', error)
      return { 
        success: false, 
        error: "Error al actualizar contraseña" 
      }
    }
  }

  // Resend Email Confirmation
  const resendConfirmation = async (email: string): Promise<AuthResponse> => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.toLowerCase().trim()
      })

      if (error) {
        return { 
          success: false, 
          error: getErrorMessage(error) 
        }
      }

      return { 
        success: true, 
        error: "Email de confirmación reenviado" 
      }

    } catch (error) {
      console.error('Resend confirmation error:', error)
      return { 
        success: false, 
        error: "Error al reenviar confirmación" 
      }
    }
  }

  // Helper function to get user-friendly error messages
  const getErrorMessage = (error: AuthError): string => {
    switch (error.message) {
      case 'Invalid login credentials':
        return 'Email o contraseña incorrectos'
      case 'Email not confirmed':
        return 'Por favor confirma tu email antes de continuar'
      case 'User already registered':
        return 'Este email ya está registrado'
      case 'Password should be at least 6 characters':
        return 'La contraseña debe tener al menos 6 caracteres'
      case 'Signup is disabled':
        return 'El registro está deshabilitado'
      case 'Email rate limit exceeded':
        return 'Demasiados intentos. Espera unos minutos'
      default:
        return error.message || 'Error de autenticación'
    }
  }

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    resendConfirmation
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}

// Export types
export type { AuthContextType, AuthResponse } 