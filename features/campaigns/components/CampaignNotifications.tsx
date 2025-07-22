"use client"

import { useEffect } from 'react'
import { useNotifications } from '../hooks/useNotifications'
import { Bell, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import type { Campaign } from '../types'
import styles from '../styles/CampaignNotifications.module.css'

interface CampaignNotificationsProps {
  campaign: Campaign
  userEmail: string
  userName?: string
  onNotificationSent?: (success: boolean) => void
  className?: string
}

export function CampaignNotifications({
  campaign,
  userEmail,
  userName,
  onNotificationSent,
  className
}: CampaignNotificationsProps) {
  const {
    isSending,
    lastResult,
    sendCampaignNotification,
    sendSystemNotification,
    reset
  } = useNotifications()

  // Enviar notificación cuando la campaña cambia de estado
  useEffect(() => {
    if (campaign.status === 'sent') {
      handleCampaignNotification()
    }
  }, [campaign.status])

  const handleCampaignNotification = async () => {
    try {
      const result = await sendCampaignNotification(
        userEmail,
        campaign.subject,
        'Enviada'
      )

      if (result.success) {
        console.log('✅ Notificación de campaña enviada:', result.messageId)
        onNotificationSent?.(true)
      } else {
        console.error('❌ Error al enviar notificación:', result.error)
        onNotificationSent?.(false)
      }
    } catch (error) {
      console.error('Error en notificación de campaña:', error)
      onNotificationSent?.(false)
    }
  }

  const handleSystemNotification = async (subject: string, message: string) => {
    try {
      const result = await sendSystemNotification(userEmail, subject, message)
      
      if (result.success) {
        console.log('✅ Notificación del sistema enviada:', result.messageId)
        return true
      } else {
        console.error('❌ Error al enviar notificación del sistema:', result.error)
        return false
      }
    } catch (error) {
      console.error('Error en notificación del sistema:', error)
      return false
    }
  }

  const getStatusIcon = () => {
    if (isSending) return <AlertCircle className="h-4 w-4 animate-pulse" />
    if (lastResult?.success) return <CheckCircle className="h-4 w-4 text-green-600" />
    if (lastResult?.error) return <XCircle className="h-4 w-4 text-red-600" />
    return <Bell className="h-4 w-4" />
  }

  const getStatusText = () => {
    if (isSending) return 'Enviando notificación...'
    if (lastResult?.success) return 'Notificación enviada'
    if (lastResult?.error) return 'Error al enviar notificación'
    return 'Listo para enviar notificaciones'
  }

  return (
    <div className={`${styles.campaignNotifications} ${className || ''}`}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <Bell className={styles.headerIcon} />
          <h3 className={styles.title}>Notificaciones de Campaña</h3>
        </div>
        <div className={styles.statusIndicator}>
          {getStatusIcon()}
          <span className={styles.statusText}>{getStatusText()}</span>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.notificationInfo}>
          <p className={styles.infoText}>
            Recibirás notificaciones por email cuando:
          </p>
          <ul className={styles.notificationList}>
            <li>La campaña se envíe exitosamente</li>
            <li>Se complete el procesamiento de la cola</li>
            <li>Ocurra algún error en el envío</li>
          </ul>
        </div>

        {lastResult && (
          <div className={`${styles.resultCard} ${lastResult.success ? styles.success : styles.error}`}>
            <div className={styles.resultHeader}>
              {lastResult.success ? (
                <CheckCircle className={styles.resultIcon} />
              ) : (
                <XCircle className={styles.resultIcon} />
              )}
              <span className={styles.resultTitle}>
                {lastResult.success ? 'Notificación Enviada' : 'Error al Enviar'}
              </span>
            </div>
            {lastResult.success ? (
              <p className={styles.resultMessage}>
                Se envió una notificación a {userEmail}
                {lastResult.messageId && (
                  <span className={styles.messageId}>
                    ID: {lastResult.messageId}
                  </span>
                )}
              </p>
            ) : (
              <p className={styles.resultMessage}>
                Error: {lastResult.error}
              </p>
            )}
          </div>
        )}

        <div className={styles.actions}>
          <button
            onClick={handleCampaignNotification}
            disabled={isSending}
            className={styles.actionButton}
          >
            {isSending ? 'Enviando...' : 'Enviar Notificación de Prueba'}
          </button>
          
          <button
            onClick={() => handleSystemNotification(
              'Prueba de Sistema',
              'Esta es una notificación de prueba del sistema RitterFinder.'
            )}
            disabled={isSending}
            className={`${styles.actionButton} ${styles.secondaryButton}`}
          >
            Notificación de Sistema
          </button>

          {lastResult && (
            <button
              onClick={reset}
              className={`${styles.actionButton} ${styles.resetButton}`}
            >
              Limpiar Estado
            </button>
          )}
        </div>
      </div>
    </div>
  )
} 