"use client"

import { useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function EmergencyLogoutPage() {
  
  useEffect(() => {
    const forceLogout = async () => {
      console.log('🚨 EMERGENCY LOGOUT: Starting force logout...')
      
      try {
        // Create Supabase client
        const supabase = createClient()
        
        // Try to sign out (ignore errors)
        try {
          await supabase.auth.signOut()
          console.log('✅ EMERGENCY: Supabase signOut completed')
        } catch (error) {
          console.log('⚠️ EMERGENCY: Supabase signOut failed, continuing...')
        }
        
        // Clear ALL possible localStorage keys
        const keysToRemove = [
          'hasSeenOnboarding',
          'sb-localhost-auth-token',
          'sb-ritterback.begonlabs.com-auth-token',
          'supabase.auth.token'
        ]
        
        keysToRemove.forEach(key => {
          localStorage.removeItem(key)
          console.log(`🧹 EMERGENCY: Removed ${key}`)
        })
        
        // Clear sessionStorage too
        sessionStorage.clear()
        console.log('🧹 EMERGENCY: Cleared sessionStorage')
        
        // Clear all cookies
        document.cookie.split(";").forEach(function(c) { 
          document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
        })
        console.log('🧹 EMERGENCY: Cleared cookies')
        
        console.log('🔄 EMERGENCY: Forcing redirect in 2 seconds...')
        
        // Force redirect after 2 seconds
        setTimeout(() => {
          window.location.href = '/'
        }, 2000)
        
      } catch (error) {
        console.error('🚨 EMERGENCY: Critical error:', error)
        // Force redirect anyway
        setTimeout(() => {
          window.location.href = '/'
        }, 1000)
      }
    }
    
    forceLogout()
  }, [])

  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center p-6">
      <div className="max-w-md mx-auto text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-6xl mb-4">🚨</div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Emergency Logout
          </h1>
          <p className="text-gray-600 mb-6">
            Forzando cierre de sesión y limpieza de datos...
          </p>
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
            <span className="text-sm text-gray-500">Procesando...</span>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            Serás redirigido al login automáticamente
          </p>
        </div>
      </div>
    </div>
  )
} 