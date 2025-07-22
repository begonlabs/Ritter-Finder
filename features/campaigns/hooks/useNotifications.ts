import { useState, useCallback } from 'react'

interface NotificationData {
  to: string
  subject: string
  message: string
  htmlContent?: string
  name?: string
}

interface NotificationResult {
  success: boolean
  messageId?: string
  error?: string
  timestamp?: string
}

interface UseNotificationsReturn {
  // State
  isSending: boolean
  lastResult: NotificationResult | null
  
  // Actions
  sendNotification: (data: NotificationData) => Promise<NotificationResult>
  sendSystemNotification: (to: string, subject: string, message: string) => Promise<NotificationResult>
  sendCampaignNotification: (to: string, campaignName: string, status: string) => Promise<NotificationResult>
  sendWelcomeNotification: (to: string, name: string) => Promise<NotificationResult>
  
  // Utils
  reset: () => void
}

export function useNotifications(): UseNotificationsReturn {
  const [isSending, setIsSending] = useState(false)
  const [lastResult, setLastResult] = useState<NotificationResult | null>(null)

  const sendNotification = useCallback(async (data: NotificationData): Promise<NotificationResult> => {
    setIsSending(true)
    setLastResult(null)

    try {
      const response = await fetch('/api/notifications/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        const successResult: NotificationResult = {
          success: true,
          messageId: result.messageId,
          timestamp: result.timestamp
        }
        setLastResult(successResult)
        return successResult
      } else {
        const errorResult: NotificationResult = {
          success: false,
          error: result.error || result.details || 'Unknown error'
        }
        setLastResult(errorResult)
        return errorResult
      }
    } catch (error) {
      const errorResult: NotificationResult = {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      }
      setLastResult(errorResult)
      return errorResult
    } finally {
      setIsSending(false)
    }
  }, [])

  const sendSystemNotification = useCallback(async (
    to: string, 
    subject: string, 
    message: string
  ): Promise<NotificationResult> => {
    return sendNotification({
      to,
      subject,
      message,
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
            <h2 style="color: #333; margin: 0 0 20px 0;">RitterFinder</h2>
            <div style="background: white; padding: 20px; border-radius: 8px;">
              <h3 style="color: #2563eb; margin: 0 0 15px 0;">${subject}</h3>
              <div style="color: #374151; line-height: 1.6;">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
              <p style="margin: 0;">Este es un mensaje automático del sistema RitterFinder.</p>
              <p style="margin: 5px 0 0 0;">Si tienes alguna pregunta, contacta con nuestro equipo de soporte.</p>
            </div>
          </div>
        </div>
      `
    })
  }, [sendNotification])

  const sendCampaignNotification = useCallback(async (
    to: string, 
    campaignName: string, 
    status: string
  ): Promise<NotificationResult> => {
    const subject = `Campaña ${campaignName} - ${status}`
    const message = `
      Tu campaña "${campaignName}" ha sido ${status.toLowerCase()}.
      
      Detalles de la campaña:
      - Nombre: ${campaignName}
      - Estado: ${status}
      - Fecha: ${new Date().toLocaleDateString('es-ES')}
      
      Puedes revisar el progreso de tu campaña en el dashboard de RitterFinder.
    `

    return sendNotification({
      to,
      subject,
      message,
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
            <h2 style="color: #333; margin: 0 0 20px 0;">RitterFinder</h2>
            <div style="background: white; padding: 20px; border-radius: 8px;">
              <h3 style="color: #2563eb; margin: 0 0 15px 0;">${subject}</h3>
              <div style="color: #374151; line-height: 1.6;">
                <p>Tu campaña <strong>"${campaignName}"</strong> ha sido <strong>${status.toLowerCase()}</strong>.</p>
                
                <div style="background: #f3f4f6; padding: 15px; border-radius: 6px; margin: 15px 0;">
                  <h4 style="margin: 0 0 10px 0; color: #374151;">Detalles de la campaña:</h4>
                  <ul style="margin: 0; padding-left: 20px; color: #6b7280;">
                    <li><strong>Nombre:</strong> ${campaignName}</li>
                    <li><strong>Estado:</strong> ${status}</li>
                    <li><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-ES')}</li>
                  </ul>
                </div>
                
                <p>Puedes revisar el progreso de tu campaña en el dashboard de RitterFinder.</p>
              </div>
            </div>
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
              <p style="margin: 0;">Este es un mensaje automático del sistema RitterFinder.</p>
            </div>
          </div>
        </div>
      `
    })
  }, [sendNotification])

  const sendWelcomeNotification = useCallback(async (
    to: string, 
    name: string
  ): Promise<NotificationResult> => {
    const subject = '¡Bienvenido a RitterFinder!'
    const message = `
      ¡Hola ${name}!
      
      Te damos la bienvenida a RitterFinder, tu plataforma de generación de leads y gestión de campañas.
      
      Ya puedes comenzar a:
      - Buscar leads en tu sector
      - Crear campañas de email
      - Analizar resultados
      - Gestionar tu pipeline de ventas
      
      Si tienes alguna pregunta, no dudes en contactarnos.
      
      ¡Que tengas mucho éxito!
      El equipo de RitterFinder
    `

    return sendNotification({
      to,
      name,
      subject,
      message,
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 8px;">
            <h2 style="color: white; margin: 0 0 20px 0; text-align: center;">🎉 ¡Bienvenido a RitterFinder!</h2>
            <div style="background: white; padding: 20px; border-radius: 8px;">
              <h3 style="color: #2563eb; margin: 0 0 15px 0;">¡Hola ${name}!</h3>
              <div style="color: #374151; line-height: 1.6;">
                <p>Te damos la bienvenida a <strong>RitterFinder</strong>, tu plataforma de generación de leads y gestión de campañas.</p>
                
                <div style="background: #f3f4f6; padding: 15px; border-radius: 6px; margin: 15px 0;">
                  <h4 style="margin: 0 0 10px 0; color: #374151;">Ya puedes comenzar a:</h4>
                  <ul style="margin: 0; padding-left: 20px; color: #6b7280;">
                    <li>🔍 Buscar leads en tu sector</li>
                    <li>📧 Crear campañas de email</li>
                    <li>📊 Analizar resultados</li>
                    <li>🎯 Gestionar tu pipeline de ventas</li>
                  </ul>
                </div>
                
                <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
                
                <p style="margin-top: 20px; color: #6b7280;">
                  ¡Que tengas mucho éxito!<br>
                  <strong>El equipo de RitterFinder</strong>
                </p>
              </div>
            </div>
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.2); color: rgba(255,255,255,0.8); font-size: 14px; text-align: center;">
              <p style="margin: 0;">RitterFinder - Tu plataforma de generación de leads</p>
            </div>
          </div>
        </div>
      `
    })
  }, [sendNotification])

  const reset = useCallback(() => {
    setIsSending(false)
    setLastResult(null)
  }, [])

  return {
    isSending,
    lastResult,
    sendNotification,
    sendSystemNotification,
    sendCampaignNotification,
    sendWelcomeNotification,
    reset
  }
} 