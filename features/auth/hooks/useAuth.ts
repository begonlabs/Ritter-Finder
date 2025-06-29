"use client"

// Re-export the useAuth hook from AuthProvider
export { useAuth } from '../providers/AuthProvider'
import { useAuth } from '../providers/AuthProvider'

// Enhanced useAuth with additional business logic
export const useAuthService = () => {
  const auth = useAuth()
  
  // Extended auth service with business logic
  const loginWithRedirect = async (email: string, password: string, redirectTo?: string) => {
    try {
      const result = await auth.signIn(email, password)
      
      if (result.success && redirectTo) {
        window.location.href = redirectTo
      }
      
      return result
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed'
      }
    }
  }

  const setupPassword = async (email: string, password: string, confirmPassword: string) => {
    if (password !== confirmPassword) {
      return {
        success: false,
        error: 'Passwords do not match'
      }
    }

    if (password.length < 8) {
      return {
        success: false,
        error: 'Password must be at least 8 characters long'
      }
    }

    try {
      // For new user setup - sign up instead of sign in
      const result = await auth.signUp(email, password, {
        email_confirmed: false // Will need email confirmation
      })
      
      return result
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Setup failed'
      }
    }
  }

  const checkAuthStatus = () => {
    return {
      isAuthenticated: !!auth.user,
      isLoading: auth.isLoading,
      user: auth.user,
      session: auth.session
    }
  }

  const getUserProfile = async () => {
    if (!auth.user) return null

    // In a real app, you'd fetch from user_profiles table
    return {
      id: auth.user.id,
      email: auth.user.email,
      full_name: auth.user.user_metadata?.full_name || '',
      role: auth.user.user_metadata?.role || 'user',
      avatar_url: auth.user.user_metadata?.avatar_url || null,
      created_at: auth.user.created_at
    }
  }

  return {
    // Core auth functions
    ...auth,
    
    // Enhanced business logic
    loginWithRedirect,
    setupPassword,
    checkAuthStatus,
    getUserProfile,
    
    // Utility functions
    isAuthenticated: !!auth.user,
    isAdmin: auth.user?.user_metadata?.role === 'admin',
    isLoading: auth.isLoading
  }
}

// Export both hooks
export default useAuth 