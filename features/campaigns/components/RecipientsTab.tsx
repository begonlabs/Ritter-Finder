"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"
import type { Lead } from "../types"
import styles from "../styles/RecipientsTab.module.css"

interface RecipientsTabProps {
  selectedLeads: Lead[]
}

export function RecipientsTab({ selectedLeads }: RecipientsTabProps) {
  return (
    <Card className={styles.recipientsTab}>
      <CardHeader className={styles.header}>
        <CardTitle className={`${styles.title} flex items-center gap-2`}>
          <Users className={`${styles.titleIcon} h-5 w-5`} />
          Destinatarios ({selectedLeads.length})
        </CardTitle>
        <CardDescription className={styles.description}>
          Revisa la lista de contactos que recibirán tu campaña
        </CardDescription>
      </CardHeader>
      
      <CardContent className={styles.content}>
        <div className={`${styles.recipientsList} space-y-3`}>
          {selectedLeads.map((lead, index) => (
            <div 
              key={lead.id} 
              className={`${styles.recipientItem} flex items-center justify-between p-3 bg-gray-50 rounded-lg`}
            >
              <div className={`${styles.recipientLeft} flex items-center gap-3`}>
                <div className={`${styles.recipientNumber} bg-ritter-gold text-ritter-dark rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold`}>
                  {index + 1}
                </div>
                <div className={styles.recipientInfo}>
                  <p className={`${styles.recipientName} font-medium`}>{lead.name}</p>
                  <p className={`${styles.recipientPosition} text-sm text-muted-foreground`}>
                    {lead.position} en {lead.company}
                  </p>
                  <p className={`${styles.recipientEmail} text-sm text-blue-600`}>{lead.email}</p>
                  {lead.location && (
                    <p className={`${styles.recipientLocation} text-xs text-gray-500`}>
                      📍 {lead.location}
                    </p>
                  )}
                  {lead.confidence && (
                    <p className={`${styles.recipientConfidence} text-xs`}>
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${
                        lead.confidence > 0.7 ? 'bg-green-100 text-green-800' :
                        lead.confidence > 0.4 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {Math.round(lead.confidence * 100)}% confianza
                      </span>
                    </p>
                  )}
                </div>
              </div>
              <div className={`${styles.recipientRight} flex flex-col items-end gap-1`}>
                <Badge variant="outline" className={styles.recipientBadge}>{lead.industry}</Badge>
                {lead.source && (
                  <Badge variant="secondary" className={`${styles.sourceBadge} text-xs`}>
                    {lead.source === 'paginas_amarillas' ? 'P. Amarillas' : 
                     lead.source === 'axesor' ? 'Axesor' : 
                     lead.source}
                  </Badge>
                )}
                <div className={`${styles.validationIcons} flex gap-1 mt-1`}>
                  {lead.emailValidated && (
                    <span className="text-green-600 text-xs" title="Email validado">📧✓</span>
                  )}
                  {lead.websiteExists && (
                    <span className="text-blue-600 text-xs" title="Web validada">🌐✓</span>
                  )}
                  {lead.phoneValidated && (
                    <span className="text-purple-600 text-xs" title="Teléfono validado">📞✓</span>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {selectedLeads.length === 0 && (
            <div className={`${styles.emptyState} text-center py-8`}>
              <Users className={`${styles.emptyStateIcon} mx-auto h-12 w-12 text-gray-400 mb-4`} />
              <p className={`${styles.emptyStateText} text-muted-foreground`}>
                No hay leads seleccionados para esta campaña.
              </p>
            </div>
          )}
        </div>
        
        {selectedLeads.length > 0 && (
          <div className={styles.recipientsSummary}>
            <div className={styles.summaryText}>
              <span className={styles.summaryCount}>{selectedLeads.length}</span> destinatarios seleccionados
            </div>
            <div className={styles.summaryStats}>
              <div className={styles.statItem}>
                <div className={styles.statDot}></div>
                <span>{Array.from(new Set(selectedLeads.map(lead => lead.company))).length} empresas</span>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statDot}></div>
                <span>{Array.from(new Set(selectedLeads.map(lead => lead.industry))).length} sectores</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 