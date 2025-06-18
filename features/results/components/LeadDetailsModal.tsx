"use client"

import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Phone, MapPin, Users, Euro, Calendar, ExternalLink, Globe, Mail, CheckCircle, XCircle } from "lucide-react"
import type { LeadDetailsModalProps } from "../types"
import styles from "../styles/LeadDetailsModal.module.css"

export function LeadDetailsModal({ lead, isOpen, onClose }: LeadDetailsModalProps) {
  if (!lead) return null

  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 90) return styles.confidenceHigh
    if (confidence >= 80) return styles.confidenceMedium
    return styles.confidenceLow
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={styles.modalContent}>
        <DialogHeader className={styles.modalHeader}>
          <DialogTitle className={styles.modalTitle}>Detalles del Lead</DialogTitle>
        </DialogHeader>
        
        <div className={styles.modalBody}>
          {/* Contact Information */}
          <div className={styles.contactGrid}>
            <div className={styles.contactSection}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Contacto</label>
                <p className={styles.fieldValue}>{lead.name}</p>
                <p className={styles.fieldValueSecondary}>{lead.position}</p>
              </div>
              
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Email</label>
                <p className={styles.fieldValueEmail}>{lead.email}</p>
              </div>
              
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Teléfono</label>
                <p className={styles.contactInfo}>
                  <Phone className={styles.contactIcon} />
                  {lead.phone}
                </p>
              </div>
            </div>
            
            <div className={styles.contactSection}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Empresa</label>
                <p className={styles.fieldValue}>{lead.company}</p>
                <a
                  href={`https://${lead.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.websiteLink}
                >
                  {lead.website}
                  <ExternalLink className={styles.externalIcon} />
                </a>
              </div>
              
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Ubicación</label>
                <p className={styles.contactInfo}>
                  <MapPin className={styles.contactIcon} />
                  {lead.location}
                </p>
              </div>
              
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Industria</label>
                <span className={styles.industryBadge}>{lead.industry}</span>
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
                  {lead.website ? (
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
                  {lead.verified_email ? (
                    <>
                      <CheckCircle className={styles.validationSuccess} />
                      <span className={styles.validationText}>Email verificado</span>
                    </>
                  ) : (
                    <>
                      <XCircle className={styles.validationError} />
                      <span className={styles.validationText}>Email no verificado</span>
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

          {/* Company Metrics */}
          <div className={styles.metricsGrid}>
            <div className={styles.metricItem}>
              <label className={styles.fieldLabel}>Empleados</label>
              <p className={styles.metricValue}>
                <Users className={styles.metricIcon} />
                {lead.employees}
              </p>
            </div>
            
            <div className={styles.metricItem}>
              <label className={styles.fieldLabel}>Ingresos</label>
              <p className={styles.metricValue}>
                <Euro className={styles.metricIcon} />
                {lead.revenue}
              </p>
            </div>
            
            <div className={styles.metricItem}>
              <label className={styles.fieldLabel}>Confianza</label>
              <span className={`${styles.confidenceBadge} ${getConfidenceColor(lead.confidence)}`}>
                {lead.confidence}%
              </span>
            </div>
          </div>

          {/* Notes */}
          <div className={styles.notesSection}>
            <label className={styles.fieldLabel}>Notas</label>
            <p className={styles.notesContent}>{lead.notes}</p>
          </div>

          {/* Footer with metadata */}
          <div className={styles.modalFooter}>
            <div className={styles.footerInfo}>
              <Calendar className={styles.footerIcon} />
              <span>Última actividad: {new Date(lead.lastActivity).toLocaleDateString()}</span>
            </div>
            <div className={styles.footerSource}>
              Fuente: {lead.source}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 