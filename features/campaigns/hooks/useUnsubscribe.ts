import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'

interface UnsubscribeData {
  email: string
  company_name?: string
  unsubscribe_reason?: string
  ip_address?: string
  user_agent?: string
}

interface UseUnsubscribeReturn {
  isUnsubscribed: boolean
  isLoading: boolean
  error: string | null
  unsubscribeEmail: (data: UnsubscribeData) => Promise<boolean>
  checkUnsubscribeStatus: (email: string) => Promise<boolean>
}

export const useUnsubscribe = (): UseUnsubscribeReturn => {
  const [isUnsubscribed, setIsUnsubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  const unsubscribeEmail = async (data: UnsubscribeData): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      // Obtener IP del usuario
      const ipResponse = await fetch('https://api.ipify.org?format=json')
      const ipData = await ipResponse.json()
      
      const unsubscribeRecord = {
        ...data,
        ip_address: ipData.ip
      }

      const { error: insertError } = await supabase
        .from('unsubscribe')
        .insert([unsubscribeRecord])

      if (insertError) {
        throw insertError
      }

      setIsUnsubscribed(true)
      return true
    } catch (err) {
      console.error('Error al dar de baja:', err)
      setError('Hubo un error al procesar tu solicitud. Por favor, intenta de nuevo.')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const checkUnsubscribeStatus = async (email: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('unsubscribe')
        .select('email')
        .eq('email', email)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      return !!data
    } catch (err) {
      console.error('Error al verificar estado de baja:', err)
      return false
    }
  }

  return {
    isUnsubscribed,
    isLoading,
    error,
    unsubscribeEmail,
    checkUnsubscribeStatus
  }
} 