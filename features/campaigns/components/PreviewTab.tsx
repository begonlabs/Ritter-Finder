"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Eye } from "lucide-react"
import type { Lead, EmailComposerState, EmailComposerActions } from "../types"
import styles from "../styles/PreviewTab.module.css"

interface PreviewTabProps {
  composer: EmailComposerState & EmailComposerActions & { 
    personalizeEmail: (content: string, lead: Lead) => string 
  }
  selectedLeads: Lead[]
}

export function PreviewTab({ composer, selectedLeads }: PreviewTabProps) {
  const previewLead = composer.previewLead || selectedLeads[0]

  if (!previewLead) {
    return (
      <Card className={styles.previewTab}>
        <CardHeader className={styles.header}>
          <CardTitle className={`${styles.title} flex items-center gap-2`}>
            <Eye className={`${styles.titleIcon} h-5 w-5`} />
            Vista Previa del Email
          </CardTitle>
          <CardDescription className={styles.description}>No hay leads disponibles para la vista previa</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className={styles.previewTab}>
      <CardHeader className={styles.header}>
        <CardTitle className={`${styles.title} flex items-center gap-2`}>
          <Eye className={`${styles.titleIcon} h-5 w-5`} />
          Vista Previa del Email
        </CardTitle>
        <CardDescription className={styles.description}>
          Así se verá tu email para los destinatarios
        </CardDescription>
      </CardHeader>
      
      <CardContent className={styles.content}>
        <div className={`${styles.previewContainer} space-y-4`}>
          <div className={`${styles.previewControls} flex items-center gap-2`}>
            <Label className={styles.controlLabel}>Vista previa para:</Label>
            <select
              className={`${styles.leadSelector} border rounded px-2 py-1`}
              value={previewLead.id}
              onChange={(e) => {
                const lead = selectedLeads.find((l) => l.id === e.target.value)
                composer.setPreviewLead(lead || selectedLeads[0])
              }}
            >
              {selectedLeads.map((lead) => (
                <option key={lead.id} value={lead.id}>
                  {lead.name} ({lead.company})
                </option>
              ))}
            </select>
          </div>

          <div className={`${styles.emailPreview} border rounded-lg p-4 bg-white`}>
            <div className={`${styles.emailHeader} border-b pb-3 mb-4`}>
              <div className={styles.emailMeta}>
                <div className={styles.emailMetaLine}>
                  <span className={styles.emailLabel}>De:</span>
                  <span className={styles.emailValue}>
                    {composer.senderName} &lt;{composer.senderEmail}&gt;
                  </span>
                </div>
                <div className={styles.emailMetaLine}>
                  <span className={styles.emailLabel}>Para:</span>
                  <span className={styles.emailValue}>
                    {previewLead.name} &lt;{previewLead.email}&gt;
                  </span>
                </div>
                <div className={`${styles.emailSubject} font-semibold mt-2`}>
                  Asunto: {composer.subject || "Sin asunto"}
                </div>
              </div>
            </div>
            
            <div className={`${styles.emailBody} whitespace-pre-wrap`}>
              {composer.content ? 
                composer.personalizeEmail(composer.content, previewLead) : 
                "Sin contenido"
              }
            </div>
          </div>

          <div className={styles.validationWarnings}>
            {!composer.subject.trim() && (
              <div className={`${styles.warningItem} text-sm text-orange-600`}>
                <span className={styles.warningIcon}>⚠️</span>
                No has ingresado un asunto para el email
              </div>
            )}
            
            {!composer.content.trim() && (
              <div className={`${styles.warningItem} text-sm text-orange-600`}>
                <span className={styles.warningIcon}>⚠️</span>
                No has ingresado contenido para el email
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 