"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Eye } from "lucide-react"
import type { Lead, EmailComposerState, EmailComposerActions } from "../types"

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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Vista Previa del Email
          </CardTitle>
          <CardDescription>No hay leads disponibles para la vista previa</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Vista Previa del Email
        </CardTitle>
        <CardDescription>
          Así se verá tu email para los destinatarios
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Label>Vista previa para:</Label>
            <select
              className="border rounded px-2 py-1"
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

          <div className="border rounded-lg p-4 bg-white">
            <div className="border-b pb-3 mb-4">
              <p className="text-sm text-muted-foreground">
                De: {composer.senderName} &lt;{composer.senderEmail}&gt;
              </p>
              <p className="text-sm text-muted-foreground">
                Para: {previewLead.name} &lt;{previewLead.email}&gt;
              </p>
              <p className="font-semibold mt-2">
                Asunto: {composer.subject || "Sin asunto"}
              </p>
            </div>
            
            <div className="whitespace-pre-wrap">
              {composer.content ? 
                composer.personalizeEmail(composer.content, previewLead) : 
                "Sin contenido"
              }
            </div>
          </div>

          {!composer.subject.trim() && (
            <p className="text-sm text-orange-600">
              ⚠️ No has ingresado un asunto para el email
            </p>
          )}
          
          {!composer.content.trim() && (
            <p className="text-sm text-orange-600">
              ⚠️ No has ingresado contenido para el email
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 