"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileText, Sparkles, Send } from "lucide-react"
import type { Lead, EmailComposerState, EmailComposerActions } from "../types"
import styles from "../styles/ComposeTab.module.css"

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
    <Card className={styles.composeTab}>
      <CardHeader className={styles.header}>
        <CardTitle className={`${styles.title} flex items-center gap-2`}>
          <FileText className={`${styles.titleIcon} h-5 w-5`} />
          Componer Email
        </CardTitle>
        <CardDescription className={styles.description}>
          Personaliza tu mensaje para {selectedLeads.length} destinatarios
        </CardDescription>
      </CardHeader>
      
      <CardContent className={`${styles.content} space-y-4`}>
        <form className={styles.form}>
          <div className={`${styles.formGrid} grid gap-4 md:grid-cols-2`}>
            <div className={`${styles.formGroup} space-y-2`}>
              <Label htmlFor="sender-name" className={styles.formLabel}>Nombre del Remitente</Label>
              <Input 
                id="sender-name" 
                value={composer.senderName} 
                onChange={(e) => composer.setSenderName(e.target.value)}
                className={styles.formInput}
              />
            </div>
            <div className={`${styles.formGroup} space-y-2`}>
              <Label htmlFor="sender-email" className={styles.formLabel}>Email del Remitente</Label>
              <Input
                id="sender-email"
                type="email"
                value={composer.senderEmail}
                onChange={(e) => composer.setSenderEmail(e.target.value)}
                className={styles.formInput}
              />
            </div>
          </div>

          <div className={`${styles.formGroup} space-y-2`}>
            <div className={styles.subjectControls}>
              <Label htmlFor="subject" className={styles.formLabel}>Asunto del Email</Label>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => composer.loadTemplate()} 
                className={`${styles.templateButton} flex items-center gap-1`}
              >
                <Sparkles className={`${styles.templateButtonIcon} h-3 w-3`} />
                Usar Plantilla
              </Button>
            </div>
            <Input
              id="subject"
              value={composer.subject}
              onChange={(e) => composer.setSubject(e.target.value)}
              placeholder="Ingresa el asunto del email..."
              className={styles.formInput}
            />
          </div>

          <div className={`${styles.formGroup} space-y-2`}>
            <Label htmlFor="email-content" className={styles.formLabel}>Contenido del Email</Label>
            <Textarea
              id="email-content"
              value={composer.content}
              onChange={(e) => composer.setContent(e.target.value)}
              rows={15}
              className={`${styles.formTextarea} resize-none`}
              placeholder="Escribe tu mensaje aquí..."
            />
            <p className={`${styles.helperText} text-xs text-muted-foreground`}>
              💡 Usa [Contact Name], [Company Name], [Sender Name] y [Sender Email] como variables que serán
              reemplazadas automáticamente.
            </p>
          </div>
        </form>
      </CardContent>

      <CardFooter className={`${styles.footer} flex items-center justify-between`}>
        <div className={`${styles.footerInfo} text-sm text-muted-foreground`}>
          <span className={styles.recipientCount}>
            {selectedLeads.length} destinatarios
          </span>
          <span className={styles.deliveryTime}>
            Entrega estimada: 2-5 minutos
          </span>
        </div>
        <Button
          onClick={handleSendCampaign}
          disabled={!composer.subject.trim() || !composer.content.trim() || composer.isLoading}
          className={`${styles.sendButton} bg-green-600 hover:bg-green-700`}
          size="lg"
        >
          {composer.isLoading ? (
            <>
              <div className={`${styles.loadingSpinner} animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2`}></div>
              Enviando...
            </>
          ) : (
            <>
              <Send className={`${styles.sendButtonIcon} mr-2 h-4 w-4`} />
              Enviar Campaña
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
} 