"use client"

import { useState, useEffect } from 'react'
import { useLeadAdapter } from '../hooks/useLeadAdapter'
import { EmailComposer } from './EmailComposer'
import { CampaignSuccess } from './CampaignSuccess'
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
}

export function CampaignIntegration({
  normalizedLeads,
  selectedLeadIds,
  onSendCampaign,
  onBack,
  emailSent = false,
  className
}: CampaignIntegrationProps) {
  const [adaptedLeads, setAdaptedLeads] = useState<Lead[]>([])
  const [validationIssues, setValidationIssues] = useState<Record<string, string[]>>({})
  const [showSuccess, setShowSuccess] = useState(emailSent)
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
      // Enviar campaña usando Campaign Client
      const result = await campaignClient.sendCampaign({
        subject: campaignData.subject,
        content: campaignData.content,
        htmlContent: campaignData.htmlContent,
        senderName: process.env.NEXT_PUBLIC_BREVO_SENDER_NAME || 'RitterFinder Team',
        senderEmail: process.env.NEXT_PUBLIC_BREVO_SENDER_EMAIL || 'info@rittermor.energy',
        recipients: adaptedLeads.map(lead => ({
          email: lead.email || '',
          name: lead.name || lead.company_name
        })).filter(recipient => recipient.email)
      });

      // Guardar resultados de la campaña
      setCampaignResult({
        sentCount: result.sentCount,
        failedCount: result.failedCount,
        results: result.results
      });

      if (!result.success) {
        throw new Error(`Error al enviar campaña: ${result.failedCount} emails fallaron`);
      }

      await onSendCampaign(campaignData)
      setShowSuccess(true)
    } catch (error) {
      console.error('Error sending campaign:', error)
      // Aquí podrías mostrar un toast de error
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
    </div>
  )
} 