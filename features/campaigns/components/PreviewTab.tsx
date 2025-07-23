"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Eye, Code, ExternalLink, Users, Building, MapPin, Mail, Phone, Globe, CheckCircle, AlertCircle } from "lucide-react"
import { campaignClient } from '../../../lib/campaign-client'
import type { Lead } from "../types"
import styles from "../styles/PreviewTab.module.css"

import type { UseEmailComposerReturn } from '../hooks/useEmailComposer';

interface PreviewTabProps {
  composer: UseEmailComposerReturn;
  selectedLeads: Lead[]
}

export function PreviewTab({ composer, selectedLeads }: PreviewTabProps) {
  const [selectedLeadId, setSelectedLeadId] = useState<string>(
    composer.data.previewLead?.id || selectedLeads[0]?.id || ''
  );

  const selectedLead = selectedLeads.find(lead => lead.id === selectedLeadId) || selectedLeads[0];

  if (!selectedLead) {
    return (
      <Card className={styles.previewTab}>
        <CardHeader className={styles.header}>
          <CardTitle className={`${styles.title} flex items-center gap-2`}>
            <Eye className={`${styles.titleIcon} h-5 w-5`} />
            Vista Previa del Email
          </CardTitle>
          <CardDescription className={styles.description}>
            No hay leads disponibles para la vista previa
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const personalizedSubject = composer.personalizeEmail(composer.data.subject, selectedLead);
  const personalizedContent = composer.data.contentMode === 'html' ? 
    composer.renderHtmlContent(selectedLead) : 
    composer.personalizeEmail(composer.data.content, selectedLead);

  const handleLeadChange = (leadId: string) => {
    setSelectedLeadId(leadId);
    const lead = selectedLeads.find(l => l.id === leadId);
    if (lead) {
      composer.setPreviewLead(lead);
    }
  };

  const getDataQualityColor = (score?: number) => {
    if (!score) return 'bg-gray-100 text-gray-800';
    if (score >= 4) return 'bg-green-100 text-green-800';
    if (score >= 3) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <Card className={styles.previewTab}>
      <CardHeader className={styles.header}>
        <CardTitle className={`${styles.title} flex items-center gap-2`}>
          <Eye className={`${styles.titleIcon} h-5 w-5`} />
          Vista Previa del Email
        </CardTitle>
        <CardDescription className={styles.description}>
          Así se verá tu email para cada destinatario
        </CardDescription>
      </CardHeader>
      
      <CardContent className={styles.content}>
        <div className={`${styles.previewContainer} space-y-4`}>
          {/* Lead Selector */}
          <div className={`${styles.previewControls} flex items-center justify-between`}>
            <div className="flex items-center gap-4">
              <Label className={styles.controlLabel}>Vista previa para:</Label>
              <Select value={selectedLeadId} onValueChange={handleLeadChange}>
                <SelectTrigger className={`${styles.leadSelector} w-80`}>
                  <SelectValue placeholder="Selecciona un lead" />
                </SelectTrigger>
                <SelectContent>
                  {selectedLeads.map((lead, index) => (
                    <SelectItem key={lead.id} value={lead.id}>
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {lead.name || lead.company_name}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {index + 1}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                          {lead.emailValidated && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Mail className="h-3 w-3 text-green-600" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Email validado</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                          {lead.phoneValidated && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Phone className="h-3 w-3 text-blue-600" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Teléfono validado</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                          {lead.websiteExists && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Globe className="h-3 w-3 text-purple-600" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Sitio web existe</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className={styles.previewMeta}>
              <Badge variant="outline" className={styles.modeBadge}>
                {composer.data.contentMode === 'html' ? (
                  <>
                    <Code className="h-3 w-3 mr-1" />
                    HTML
                  </>
                ) : (
                  <>
                    📝
                    Texto
                  </>
                )}
              </Badge>
            </div>
          </div>

          {/* Lead Information Card */}
          <div className={`${styles.leadInfoCard} bg-gray-50 rounded-lg p-4`}>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Información del Lead Seleccionado
              </h4>
              {selectedLead.data_quality_score && (
                <Badge className={getDataQualityColor(selectedLead.data_quality_score)}>
                  {selectedLead.data_quality_score}/5 calidad
                </Badge>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Company Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Building className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Empresa:</span>
                </div>
                <p className="text-sm text-gray-700 ml-6">
                  {selectedLead.company_name || 'No especificada'}
                </p>
                {selectedLead.activity && (
                  <p className="text-xs text-gray-500 ml-6">
                    Actividad: {selectedLead.activity}
                  </p>
                )}
              </div>

              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Contacto:</span>
                </div>
                <p className="text-sm text-gray-700 ml-6">
                  {selectedLead.email || 'No especificado'}
                </p>
                {selectedLead.phone && (
                  <p className="text-xs text-gray-500 ml-6">
                    Tel: {selectedLead.phone}
                  </p>
                )}
              </div>

              {/* Location Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Ubicación:</span>
                </div>
                <p className="text-sm text-gray-700 ml-6">
                  {selectedLead.state && selectedLead.country 
                    ? `${selectedLead.state}, ${selectedLead.country}`
                    : selectedLead.state || selectedLead.country || 'No especificada'
                  }
                </p>
                {selectedLead.category && (
                  <p className="text-xs text-gray-500 ml-6">
                    Categoría: {selectedLead.category}
                  </p>
                )}
              </div>
            </div>

            {/* Validation Status */}
            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="flex items-center gap-4 text-xs">
                <span className="font-medium text-gray-700">Validación:</span>
                <div className="flex items-center gap-2">
                  {selectedLead.emailValidated ? (
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="h-3 w-3" />
                      Email
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-gray-400">
                      <AlertCircle className="h-3 w-3" />
                      Email
                    </div>
                  )}
                  
                  {selectedLead.phoneValidated ? (
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="h-3 w-3" />
                      Teléfono
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-gray-400">
                      <AlertCircle className="h-3 w-3" />
                      Teléfono
                    </div>
                  )}
                  
                  {selectedLead.websiteExists ? (
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="h-3 w-3" />
                      Web
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-gray-400">
                      <AlertCircle className="h-3 w-3" />
                      Web
                    </div>
                  )}
                </div>
              </div>
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
                    {process.env.NEXT_PUBLIC_BREVO_SENDER_NAME || 'RitterFinder Team'} &lt;{process.env.NEXT_PUBLIC_BREVO_SENDER_EMAIL || 'info@rittermor.energy'}&gt;
                  </span>
                </div>
                <div className={styles.emailMetaLine}>
                  <span className={styles.emailLabel}>Para:</span>
                  <span className={styles.emailValue}>
                    {selectedLead.name || selectedLead.company_name} &lt;{selectedLead.email}&gt;
                  </span>
                </div>
                <div className={`${styles.emailSubject} font-semibold mt-3 p-2 bg-white rounded border`}>
                  <span className={styles.subjectLabel}>Asunto:</span> {personalizedSubject || "Sin asunto"}
                </div>
              </div>
            </div>
            
            {/* Email Body */}
            <div className={styles.emailBodyContainer}>
              {composer.data.contentMode === 'html' && personalizedContent ? (
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

          {/* Validation Warnings */}
          <div className={styles.validationWarnings}>
            {!(composer.data.subject || '').trim() && (
              <div className={`${styles.warningItem} text-sm text-orange-600`}>
                <span className={styles.warningIcon}>⚠️</span>
                No has ingresado un asunto para el email
              </div>
            )}
            
            {!(composer.data.content || '').trim() && (
              <div className={`${styles.warningItem} text-sm text-orange-600`}>
                <span className={styles.warningIcon}>⚠️</span>
                No has ingresado contenido para el email
              </div>
            )}

            {composer.data.contentMode === 'html' && personalizedContent && !personalizedContent.includes('<html>') && (
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