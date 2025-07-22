import { NextApiRequest, NextApiResponse } from 'next'
import { brevoService } from '../../../lib/brevo-service'

interface NotificationRequest {
  to: string
  subject: string
  message: string
  htmlContent?: string
  name?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { to, subject, message, htmlContent, name }: NotificationRequest = req.body

    if (!to || !subject || !message) {
      return res.status(400).json({ 
        error: 'Missing required fields: to, subject, message' 
      })
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(to)) {
      return res.status(400).json({ 
        error: 'Invalid email format' 
      })
    }

    console.log('📧 Enviando notificación con Brevo:', {
      to,
      subject,
      messageLength: message.length,
      hasHtmlContent: !!htmlContent
    })

    // Enviar email usando Brevo
    const result = await brevoService.sendEmail({
      to,
      name,
      subject,
      htmlContent: htmlContent || brevoService.textToHtml(message),
      textContent: message
    })

    if (result.success) {
      console.log('✅ Notificación enviada exitosamente:', result.messageId)
      res.status(200).json({ 
        success: true, 
        message: 'Notification sent successfully',
        messageId: result.messageId,
        timestamp: new Date().toISOString()
      })
    } else {
      console.error('❌ Error al enviar notificación:', result.error)
      res.status(500).json({ 
        error: 'Failed to send notification',
        details: result.error
      })
    }

  } catch (error) {
    console.error('Error sending notification:', error)
    res.status(500).json({ 
      error: 'Failed to send notification',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
} 