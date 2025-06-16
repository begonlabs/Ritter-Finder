"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Lead } from '../types'
import styles from '../styles/CampaignActionButton.module.css'

interface CampaignActionButtonProps {
  selectedLeads: Lead[]
  isDisabled?: boolean
  className?: string
}

export function CampaignActionButton({ 
  selectedLeads, 
  isDisabled = false,
  className = ''
}: CampaignActionButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleCreateCampaign = async () => {
    if (selectedLeads.length === 0 || isDisabled) return

    setIsLoading(true)
    
    try {
      // Store selected leads in sessionStorage for transfer to campaigns page
      const campaignData = {
        selectedLeadIds: selectedLeads.map(lead => lead.id),
        timestamp: Date.now(),
        source: 'results_page'
      }
      
      sessionStorage.setItem('ritterfinder_campaign_leads', JSON.stringify(campaignData))
      
      // Navigate to campaigns page
      router.push('/campaigns?from=results')
      
    } catch (error) {
      console.error('Error creating campaign:', error)
      setIsLoading(false)
    }
  }

  const getButtonText = () => {
    if (isLoading) return 'Creando campaña...'
    if (selectedLeads.length === 0) return 'Crear campaña de email'
    if (selectedLeads.length === 1) return 'Crear campaña (1 lead)'
    return `Crear campaña (${selectedLeads.length} leads)`
  }

  const getValidLeadsCount = () => {
    return selectedLeads.filter(lead => lead.email && lead.email.trim() !== '').length
  }

  const getInvalidLeadsCount = () => {
    return selectedLeads.length - getValidLeadsCount()
  }

  const validLeadsCount = getValidLeadsCount()
  const invalidLeadsCount = getInvalidLeadsCount()

  return (
    <div className={`${styles.campaignAction} ${className}`}>
      <button
        onClick={handleCreateCampaign}
        disabled={isDisabled || selectedLeads.length === 0 || isLoading}
        className={`${styles.campaignButton} ${
          isDisabled || selectedLeads.length === 0 ? styles.disabled : ''
        } ${isLoading ? styles.loading : ''}`}
      >
        <span className={styles.buttonIcon}>📧</span>
        <span className={styles.buttonText}>{getButtonText()}</span>
        {isLoading && (
          <div className={styles.spinner}></div>
        )}
      </button>

      {selectedLeads.length > 0 && (
        <div className={styles.campaignStats}>
          <div className={styles.statItem}>
            <span className={`${styles.statNumber} ${styles.valid}`}>
              {validLeadsCount}
            </span>
            <span className={styles.statLabel}>
              con email válido
            </span>
          </div>
          
          {invalidLeadsCount > 0 && (
            <div className={styles.statItem}>
              <span className={`${styles.statNumber} ${styles.invalid}`}>
                {invalidLeadsCount}
              </span>
              <span className={styles.statLabel}>
                sin email
              </span>
            </div>
          )}
        </div>
      )}

      {selectedLeads.length > 0 && validLeadsCount === 0 && (
        <div className={styles.warningMessage}>
          <span className={styles.warningIcon}>⚠️</span>
          <span className={styles.warningText}>
            Ningún lead seleccionado tiene email válido
          </span>
        </div>
      )}

      {selectedLeads.length > 0 && invalidLeadsCount > 0 && validLeadsCount > 0 && (
        <div className={styles.infoMessage}>
          <span className={styles.infoIcon}>ℹ️</span>
          <span className={styles.infoText}>
            Solo se incluirán los leads con email válido en la campaña
          </span>
        </div>
      )}
    </div>
  )
} 