"use client"

import { useState, useEffect } from 'react'
import { useLeadAdapter } from '../hooks/useLeadAdapter'
import { useEmailQueue } from '../hooks/useEmailQueue'
import { useNotifications } from '../hooks/useNotifications'
import { EmailComposer } from './EmailComposer'
import { CampaignSuccess } from './CampaignSuccess'
import { EmailQueueProgress } from './EmailQueueProgress'
import { CampaignNotifications } from './CampaignNotifications'
import { campaignClient } from '../../../lib/campaign-client'
import type { Lead, NormalizedLead, Campaign } from '../types'
import styles from '../styles/CampaignIntegration.module.css'

interface CampaignIntegrationProps {
  // Leads normalizados de la página de resultados
  normalizedLeads: NormalizedLead[]
  selectedLeadIds: string[]
  
  // Callbacks
  onSendCampaign: (campaignData: Campaign) => Promise<void>
  onBack?: () => void
  
  // Estado
  emailSent?: boolean
  className?: string
  
  // User info for notifications
  userEmail?: string
  userName?: string
}

export function CampaignIntegration({
  normalizedLeads,
  selectedLeadIds,
  onSendCampaign,
  onBack,
  emailSent = false,
  className,
  userEmail,
  userName
}: CampaignIntegrationProps) {
  const [adaptedLeads, setAdaptedLeads] = useState<Lead[]>([])
  const [validationIssues, setValidationIssues] = useState<Record<string, string[]>>({})
  const [showSuccess, setShowSuccess] = useState(emailSent)
  const [showQueue, setShowQueue] = useState(false)
  const [campaignResult, setCampaignResult] = useState<{
    sentCount: number
    failedCount: number
    results?: Array<{
      email: string
      success: boolean
      messageId?: string
      error?: string
    }>
  } | null>(null)
  
  const { adaptLeadsForCampaign, validateLeadForCampaign } = useLeadAdapter()
  const { 
    queue, 
    progress, 
    status, 
    addToQueue, 
    startQueue, 
    pauseQueue, 
    resumeQueue, 
    clearQueue,
    calculateEstimatedTime 
  } = useEmailQueue()
  const { sendCampaignNotification } = useNotifications()

  // Adaptar leads cuando cambian los datos
  useEffect(() => {
    const selectedNormalized = normalizedLeads.filter(lead => 
      selectedLeadIds.includes(lead.id)
    )
    
    const adapted = adaptLeadsForCampaign(selectedNormalized)
    setAdaptedLeads(adapted)
    
    // Validar cada lead
    const issues: Record<string, string[]> = {}
    adapted.forEach(lead => {
      const validation = validateLeadForCampaign(lead)
      if (!validation.isValid) {
        issues[lead.id] = validation.issues
      }
    })
    setValidationIssues(issues)
  }, [normalizedLeads, selectedLeadIds, adaptLeadsForCampaign, validateLeadForCampaign])

  // Manejar envío de campaña
  const handleSendCampaign = async (campaignData: Campaign) => {
    try {
      // Calcular tiempo estimado
      const { days, hours } = calculateEstimatedTime(adaptedLeads.length)
      
      // Mostrar confirmación con tiempo estimado
      const confirmed = window.confirm(
        `¿Estás seguro de que quieres enviar ${adaptedLeads.length} emails?\n\n` +
        `Tiempo estimado: ${days} días (${hours} horas)\n` +
        `Límites: 25 emails/hora, 100 emails/día\n\n` +
        `La campaña continuará ejecutándose aunque te desconectes.`
      )
      
      if (!confirmed) return

      // Agregar a la cola
      await addToQueue(campaignData, adaptedLeads)
      
      // Mostrar progreso de la cola
      setShowQueue(true)
      
      // Iniciar procesamiento
      await startQueue()
      
      // Enviar notificación si hay email de usuario
      if (userEmail) {
        try {
          await sendCampaignNotification(
            userEmail,
            campaignData.subject,
            'Iniciada'
          )
        } catch (error) {
          console.error('Error sending notification:', error)
        }
      }
      
    } catch (error) {
      console.error('Error sending campaign:', error)
      throw error
    }
  }

  // Estadísticas de los leads
  const stats = {
    total: adaptedLeads.length,
    withValidEmail: adaptedLeads.filter(lead => lead.emailValidated).length,
    withWebsite: adaptedLeads.filter(lead => lead.websiteExists).length,
    highQuality: adaptedLeads.filter(lead => (lead.data_quality_score || 1) >= 4).length,
    issuesCount: Object.keys(validationIssues).length
  }

  if (showSuccess) {
    return (
      <div className={`${styles.campaignIntegration} ${className || ''}`}>
        <CampaignSuccess selectedLeads={adaptedLeads} />
        {onBack && (
          <div className={styles.successActions}>
            <button
              onClick={onBack}
              className={styles.backButton}
            >
              ← Volver a Resultados
            </button>
          </div>
        )}
      </div>
    )
  }

  if (showQueue) {
    return (
      <div className={`${styles.campaignIntegration} ${className || ''}`}>
        <EmailQueueProgress
          progress={progress}
          status={status}
          onStart={startQueue}
          onPause={pauseQueue}
          onResume={resumeQueue}
          onStop={clearQueue}
        />
        
        {onBack && (
          <div className={styles.queueActions}>
            <button
              onClick={onBack}
              className={styles.backButton}
            >
              ← Volver a Resultados
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`${styles.campaignIntegration} ${className || ''}`}>
      {/* Header */}
      <div className={styles.integrationHeader}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>
            Crear Campaña desde Resultados
          </h2>
          <p className={styles.subtitle}>
            {stats.total} lead{stats.total !== 1 ? 's' : ''} seleccionado{stats.total !== 1 ? 's' : ''} para la campaña
          </p>
        </div>

        {onBack && (
          <button
            onClick={onBack}
            className={styles.backButton}
          >
            ← Volver a Resultados
          </button>
        )}
      </div>

      {/* Stats Card */}
      <div className={styles.statsCard}>
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{stats.total}</span>
            <span className={styles.statLabel}>Total Leads</span>
          </div>
          <div className={styles.statItem}>
            <span className={`${styles.statNumber} ${stats.withValidEmail > 0 ? styles.statPositive : styles.statNeutral}`}>
              {stats.withValidEmail}
            </span>
            <span className={styles.statLabel}>Emails Validados</span>
          </div>
          <div className={styles.statItem}>
            <span className={`${styles.statNumber} ${stats.withWebsite > 0 ? styles.statPositive : styles.statNeutral}`}>
              {stats.withWebsite}
            </span>
            <span className={styles.statLabel}>Con Website</span>
          </div>
          <div className={styles.statItem}>
            <span className={`${styles.statNumber} ${stats.highQuality > 0 ? styles.statPositive : styles.statNeutral}`}>
              {stats.highQuality}
            </span>
            <span className={styles.statLabel}>Alta Calidad</span>
          </div>
        </div>

        {stats.issuesCount > 0 && (
          <div className={styles.warningBanner}>
            <span className={styles.warningIcon}>⚠️</span>
            <span className={styles.warningText}>
              {stats.issuesCount} lead{stats.issuesCount !== 1 ? 's' : ''} {stats.issuesCount !== 1 ? 'tienen' : 'tiene'} problemas de validación. 
              Revisa la información antes de enviar.
            </span>
          </div>
        )}
      </div>

      {/* Email Composer */}
      <EmailComposer
        selectedLeads={adaptedLeads}
        onSendCampaign={handleSendCampaign}
        emailSent={showSuccess}
        campaignResult={campaignResult || undefined}
      />

      {/* Validation Issues */}
      {stats.issuesCount > 0 && (
        <div className={styles.validationIssues}>
          <h3 className={styles.issuesTitle}>
            Problemas de Validación Detectados
          </h3>
          <div className={styles.issuesList}>
            {Object.entries(validationIssues).map(([leadId, issues]) => {
              const lead = adaptedLeads.find(l => l.id === leadId)
              if (!lead) return null
              
              return (
                <div key={leadId} className={styles.issueItem}>
                  <div className={styles.issueHeader}>
                    <span className={styles.issueLead}>
                      {lead.name || lead.company_name} ({lead.company || lead.company_name})
                    </span>
                  </div>
                  <ul className={styles.issueDetails}>
                    {issues.map((issue, index) => (
                      <li key={index} className={styles.issueDetail}>
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Notifications Component */}
      {userEmail && (
        <div className={styles.notificationsSection}>
          <CampaignNotifications
            campaign={{
              id: 'temp-campaign',
              subject: 'Campaña desde Resultados',
              content: '',
              recipients: adaptedLeads,
              senderName: 'RitterFinder',
              senderEmail: 'info@rittermor.energy',
              status: 'draft',
              sentAt: new Date()
            }}
            userEmail={userEmail}
            userName={userName}
            onNotificationSent={(success) => {
              console.log('Notification sent:', success)
            }}
          />
        </div>
      )}
    </div>
  )
} 