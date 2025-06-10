"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileText, Sparkles, Send } from "lucide-react"
import type { Lead, EmailComposerState, EmailComposerActions } from "../types"

interface ComposeTabProps {
  composer: EmailComposerState & EmailComposerActions & { 
    personalizeEmail: (content: string, lead: Lead) => string 
  }
  selectedLeads: Lead[]
}

export function ComposeTab({ composer, selectedLeads }: ComposeTabProps) {
  const handleSendCampaign = async () => {
    try {
      await composer.sendCampaign(selectedLeads)
    } catch (error) {
      console.error('Error sending campaign:', error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Componer Email
        </CardTitle>
        <CardDescription>
          Personaliza tu mensaje para {selectedLeads.length} destinatarios
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="sender-name">Nombre del Remitente</Label>
            <Input 
              id="sender-name" 
              value={composer.senderName} 
              onChange={(e) => composer.setSenderName(e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sender-email">Email del Remitente</Label>
            <Input
              id="sender-email"
              type="email"
              value={composer.senderEmail}
              onChange={(e) => composer.setSenderEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">Asunto del Email</Label>
          <Input
            id="subject"
            value={composer.subject}
            onChange={(e) => composer.setSubject(e.target.value)}
            placeholder="Ingresa el asunto del email..."
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-content">Contenido del Email</Label>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => composer.loadTemplate()} 
              className="flex items-center gap-1"
            >
              <Sparkles className="h-3 w-3" />
              Usar Plantilla
            </Button>
          </div>
          <Textarea
            id="email-content"
            value={composer.content}
            onChange={(e) => composer.setContent(e.target.value)}
            rows={15}
            className="resize-none"
            placeholder="Escribe tu mensaje aquí..."
          />
          <p className="text-xs text-muted-foreground">
            💡 Usa [Contact Name], [Company Name], [Sender Name] y [Sender Email] como variables que serán
            reemplazadas automáticamente.
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {selectedLeads.length} destinatarios • Entrega estimada: 2-5 minutos
        </div>
        <Button
          onClick={handleSendCampaign}
          disabled={!composer.subject.trim() || !composer.content.trim() || composer.isLoading}
          className="bg-green-600 hover:bg-green-700"
          size="lg"
        >
          {composer.isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Enviando...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Enviar Campaña
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
} 