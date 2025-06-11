"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Code, FileText, ExternalLink } from "lucide-react"
import type { Lead, EmailTemplate } from "../types"
import styles from "../styles/PreviewTab.module.css"

interface PreviewTabProps {
  composer: {
    data: {
      subject: string;
      content: string;
      htmlContent?: string;
      selectedTemplate: EmailTemplate | null;
      isHtmlMode: boolean;
      senderName: string;
      senderEmail: string;
      previewLead?: Lead;
      templateVariables: Record<string, string>;
    };
    setPreviewLead: (lead: Lead) => void;
    personalizeEmail: (content: string, lead: Lead) => string;
    renderHtmlContent: (lead: Lead) => string;
  }
  selectedLeads: Lead[]
}

export function PreviewTab({ composer, selectedLeads }: PreviewTabProps) {
  const previewLead = composer.data.previewLead || selectedLeads[0]

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

  const personalizedSubject = composer.personalizeEmail(composer.data.subject, previewLead)
  const personalizedContent = composer.data.isHtmlMode ? 
    composer.renderHtmlContent(previewLead) : 
    composer.personalizeEmail(composer.data.content, previewLead)

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
          {/* Preview Controls */}
          <div className={`${styles.previewControls} flex items-center justify-between`}>
            <div className="flex items-center gap-2">
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
            
            <div className={styles.previewMeta}>
              <Badge variant="outline" className={styles.modeBadge}>
                {composer.data.isHtmlMode ? (
                  <>
                    <Code className="h-3 w-3 mr-1" />
                    HTML
                  </>
                ) : (
                  <>
                    <FileText className="h-3 w-3 mr-1" />
                    Texto
                  </>
                )}
              </Badge>
              {composer.data.selectedTemplate && (
                <Badge variant="secondary" className={styles.templateBadge}>
                  📧 {composer.data.selectedTemplate.name}
                </Badge>
              )}
            </div>
          </div>

          {/* Email Preview */}
          <div className={`${styles.emailPreview} border rounded-lg overflow-hidden bg-white`}>
            {/* Email Header */}
            <div className={`${styles.emailHeader} border-b p-4 bg-gray-50`}>
              <div className={styles.emailMeta}>
                <div className={styles.emailMetaLine}>
                  <span className={styles.emailLabel}>De:</span>
                  <span className={styles.emailValue}>
                    {composer.data.senderName} &lt;{composer.data.senderEmail}&gt;
                  </span>
                </div>
                <div className={styles.emailMetaLine}>
                  <span className={styles.emailLabel}>Para:</span>
                  <span className={styles.emailValue}>
                    {previewLead.name} &lt;{previewLead.email}&gt;
                  </span>
                </div>
                <div className={`${styles.emailSubject} font-semibold mt-3 p-2 bg-white rounded border`}>
                  <span className={styles.subjectLabel}>Asunto:</span> {personalizedSubject || "Sin asunto"}
                </div>
              </div>
            </div>
            
            {/* Email Body */}
            <div className={styles.emailBodyContainer}>
              {composer.data.isHtmlMode && personalizedContent ? (
                <div className={styles.htmlPreview}>
                  <iframe
                    srcDoc={`
                      <!DOCTYPE html>
                      <html>
                        <head>
                          <meta charset="utf-8">
                          <meta name="viewport" content="width=device-width, initial-scale=1">
                          <style>
                            body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
                            * { box-sizing: border-box; }
                          </style>
                        </head>
                        <body>
                          ${personalizedContent}
                        </body>
                      </html>
                    `}
                    className={styles.htmlIframe}
                    title="Vista previa HTML"
                    sandbox="allow-same-origin"
                  />
                  <div className={styles.htmlActions}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newWindow = window.open('', '_blank')
                        if (newWindow) {
                          newWindow.document.write(`
                            <!DOCTYPE html>
                            <html>
                              <head>
                                <meta charset="utf-8">
                                <meta name="viewport" content="width=device-width, initial-scale=1">
                                <title>Vista Previa - ${personalizedSubject}</title>
                                <style>
                                  body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
                                  * { box-sizing: border-box; }
                                </style>
                              </head>
                              <body>
                                ${personalizedContent}
                              </body>
                            </html>
                          `)
                          newWindow.document.close()
                        }
                      }}
                      className={styles.openInNewTab}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Abrir en nueva pestaña
                    </Button>
                  </div>
                </div>
              ) : (
                <div className={`${styles.emailBody} p-4 whitespace-pre-wrap`}>
                  {personalizedContent || "Sin contenido"}
                </div>
              )}
            </div>
          </div>

          {/* Template Variables Info */}
          {composer.data.selectedTemplate && Object.keys(composer.data.templateVariables).length > 0 && (
            <div className={styles.variablesInfo}>
              <Label className={styles.variablesLabel}>Variables utilizadas:</Label>
              <div className={styles.variablesList}>
                {Object.entries(composer.data.templateVariables).map(([key, value]) => (
                  <div key={key} className={styles.variableItem}>
                    <Badge variant="outline" className={styles.variableBadge}>
                      {key}: {value || '(vacío)'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Validation Warnings */}
          <div className={styles.validationWarnings}>
            {!(composer.data.subject || '').trim() && (
              <div className={`${styles.warningItem} text-sm text-orange-600`}>
                <span className={styles.warningIcon}>⚠️</span>
                No has ingresado un asunto para el email
              </div>
            )}
            
            {!(composer.data.content || '').trim() && !(composer.data.htmlContent || '').trim() && (
              <div className={`${styles.warningItem} text-sm text-orange-600`}>
                <span className={styles.warningIcon}>⚠️</span>
                No has ingresado contenido para el email
              </div>
            )}

            {composer.data.selectedTemplate && composer.data.selectedTemplate.variables && composer.data.selectedTemplate.variables.some(v => 
              v.required && !(composer.data.templateVariables?.[v.key] || '').trim()
            ) && (
              <div className={`${styles.warningItem} text-sm text-orange-600`}>
                <span className={styles.warningIcon}>⚠️</span>
                Algunas variables obligatorias están vacías
              </div>
            )}

            {composer.data.isHtmlMode && composer.data.htmlContent && !(composer.data.htmlContent || '').includes('<html>') && (
              <div className={`${styles.warningItem} text-sm text-blue-600`}>
                <span className={styles.warningIcon}>ℹ️</span>
                El contenido HTML se mostrará dentro de un documento básico
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 