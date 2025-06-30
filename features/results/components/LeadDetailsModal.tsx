"use client"

import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Phone, MapPin, Building, Globe, Mail, CheckCircle, XCircle, Calendar, Star, Info } from "lucide-react"
import type { LeadDetailsModalProps } from "../types"
import styles from "../styles/LeadDetailsModal.module.css"

export function LeadDetailsModal({ lead, isOpen, onClose }: LeadDetailsModalProps) {
  if (!lead) return null

  const getQualityColor = (score: number): string => {
    if (score >= 4) return styles.confidenceHigh
    if (score >= 3) return styles.confidenceMedium
    return styles.confidenceLow
  }

  const getQualityLabel = (score: number): string => {
    if (score >= 4) return "Alta Calidad"
    if (score >= 3) return "Calidad Media"
    return "Calidad Básica"
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={styles.modalContent}>
        <DialogHeader className={styles.modalHeader}>
          <DialogTitle className={styles.modalTitle}>Detalles del Lead</DialogTitle>
        </DialogHeader>
        
        <div className={styles.modalBody}>
          {/* Company Information */}
          <div className={styles.contactGrid}>
            <div className={styles.contactSection}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Empresa</label>
                <p className={styles.fieldValue}>{lead.company_name || lead.company}</p>
                {lead.activity && (
                  <p className={styles.fieldValueSecondary}>{lead.activity}</p>
                )}
              </div>
              
              {lead.company_website && (
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Sitio Web</label>
                  <a
                    href={lead.company_website.startsWith('http') ? lead.company_website : `https://${lead.company_website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.websiteLink}
                  >
                    {lead.company_website}
                    <Globe className={styles.externalIcon} />
                  </a>
                </div>
              )}
              
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Categoría</label>
                <span className={styles.industryBadge}>{lead.category || lead.industry || 'Sin categoría'}</span>
              </div>
            </div>
            
            <div className={styles.contactSection}>
              {lead.email && (
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Email</label>
                  <p className={styles.fieldValueEmail}>{lead.email}</p>
                </div>
              )}
              
              {lead.phone && (
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Teléfono</label>
                  <p className={styles.contactInfo}>
                    <Phone className={styles.contactIcon} />
                    {lead.phone}
                  </p>
                </div>
              )}
              
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Ubicación</label>
                <p className={styles.contactInfo}>
                  <MapPin className={styles.contactIcon} />
                  {lead.location || `${lead.state || ''}, ${lead.country || ''}`.replace(/^, |, $/, '') || 'Ubicación no disponible'}
                </p>
                {lead.address && (
                  <p className={styles.fieldValueSecondary}>{lead.address}</p>
                )}
              </div>
            </div>
          </div>

          {/* Validation Status */}
          <div className={styles.validationSection}>
            <label className={styles.fieldLabel}>Estado de Validación</label>
            <div className={styles.validationGrid}>
              <div className={styles.validationItem}>
                <div className={styles.validationHeader}>
                  <Globe className={styles.validationIcon} />
                  <span className={styles.validationLabel}>Sitio Web</span>
                </div>
                <div className={styles.validationStatus}>
                  {lead.company_website ? (
                    lead.verified_website ? (
                      <>
                        <CheckCircle className={styles.validationSuccess} />
                        <span className={styles.validationText}>Sitio web verificado</span>
                      </>
                    ) : (
                      <>
                        <XCircle className={styles.validationError} />
                        <span className={styles.validationText}>Sitio web no verificado</span>
                      </>
                    )
                  ) : (
                    <>
                      <XCircle className={styles.validationError} />
                      <span className={styles.validationText}>Sin sitio web</span>
                    </>
                  )}
                </div>
              </div>
              
              <div className={styles.validationItem}>
                <div className={styles.validationHeader}>
                  <Mail className={styles.validationIcon} />
                  <span className={styles.validationLabel}>Email</span>
                </div>
                <div className={styles.validationStatus}>
                  {lead.email ? (
                    lead.verified_email ? (
                      <>
                        <CheckCircle className={styles.validationSuccess} />
                        <span className={styles.validationText}>Email verificado</span>
                      </>
                    ) : (
                      <>
                        <XCircle className={styles.validationError} />
                        <span className={styles.validationText}>Email no verificado</span>
                      </>
                    )
                  ) : (
                    <>
                      <XCircle className={styles.validationError} />
                      <span className={styles.validationText}>Sin email</span>
                    </>
                  )}
                </div>
              </div>
              
              <div className={styles.validationItem}>
                <div className={styles.validationHeader}>
                  <Phone className={styles.validationIcon} />
                  <span className={styles.validationLabel}>Teléfono</span>
                </div>
                <div className={styles.validationStatus}>
                  {lead.phone ? (
                    lead.verified_phone ? (
                      <>
                        <CheckCircle className={styles.validationSuccess} />
                        <span className={styles.validationText}>Teléfono verificado</span>
                      </>
                    ) : (
                      <>
                        <XCircle className={styles.validationError} />
                        <span className={styles.validationText}>Teléfono no verificado</span>
                      </>
                    )
                  ) : (
                    <>
                      <XCircle className={styles.validationError} />
                      <span className={styles.validationText}>Sin teléfono</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quality Score and Business Info */}
          <div className={styles.metricsGrid}>
            <div className={styles.metricItem}>
              <label className={styles.fieldLabel}>Calidad de Datos</label>
              <div className={styles.qualityScore}>
                <Star className={styles.metricIcon} />
                <span className={`${styles.confidenceBadge} ${getQualityColor(lead.data_quality_score || 1)}`}>
                  {lead.data_quality_score || 1}/5 - {getQualityLabel(lead.data_quality_score || 1)}
                </span>
              </div>
            </div>
            
            <div className={styles.metricItem}>
              <label className={styles.fieldLabel}>Tipo de Negocio</label>
              <p className={styles.metricValue}>
                <Building className={styles.metricIcon} />
                {lead.activity || 'No especificado'}
              </p>
            </div>
            
            <div className={styles.metricItem}>
              <label className={styles.fieldLabel}>Fuente</label>
              <p className={styles.metricValue}>
                <Info className={styles.metricIcon} />
                {lead.source || 'RitterFinder Database'}
              </p>
            </div>
          </div>

          {/* Description */}
          {lead.description && (
            <div className={styles.notesSection}>
              <label className={styles.fieldLabel}>Descripción del Negocio</label>
              <p className={styles.notesContent}>{lead.description}</p>
            </div>
          )}

          {/* Footer with metadata */}
          <div className={styles.modalFooter}>
            <div className={styles.footerInfo}>
              <Calendar className={styles.footerIcon} />
              <span>
                Última actualización: {lead.updated_at ? new Date(lead.updated_at).toLocaleDateString('es-ES') : 'No disponible'}
              </span>
            </div>
            <div className={styles.footerSource}>
              Agregado: {lead.created_at ? new Date(lead.created_at).toLocaleDateString('es-ES') : 'No disponible'}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 