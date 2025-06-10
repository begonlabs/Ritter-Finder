"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2 } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

interface EmailComposerProps {
  selectedLeads: any[]
  onSendCampaign: () => void
  emailSent: boolean
}

export function EmailComposer({ selectedLeads, onSendCampaign, emailSent }: EmailComposerProps) {
  const { t, language } = useLanguage()

  // Email templates for different languages
  const emailTemplates = {
    en: `Dear [Contact Name],

I noticed that [Company Name] has been making significant strides in the renewable energy sector. I wanted to reach out to discuss how our solutions might help you further optimize your operations.

Would you be available for a brief call next week to explore potential synergies?

Best regards,
Demo User
Ritter Finder`,
    es: `Estimado/a [Contact Name],

He notado que [Company Name] ha estado haciendo avances significativos en el sector de energías renovables. Quería contactarle para discutir cómo nuestras soluciones podrían ayudarle a optimizar aún más sus operaciones.

¿Estaría disponible para una breve llamada la próxima semana para explorar posibles sinergias?

Saludos cordiales,
Usuario Demo
Ritter Finder`,
    de: `Sehr geehrte(r) [Contact Name],

Ich habe bemerkt, dass [Company Name] bedeutende Fortschritte im Bereich der erneuerbaren Energien gemacht hat. Ich wollte mich bei Ihnen melden, um zu besprechen, wie unsere Lösungen Ihnen helfen könnten, Ihre Abläufe weiter zu optimieren.

Wären Sie nächste Woche für ein kurzes Gespräch verfügbar, um mögliche Synergien zu erkunden?

Mit freundlichen Grüßen,
Demo-Benutzer
Ritter Finder`,
  }

  const [emailContent, setEmailContent] = useState(emailTemplates[language] || emailTemplates.en)

  // Si no hay leads seleccionados, mostrar mensaje
  if (selectedLeads.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("email.campaign.title")}</CardTitle>
          <CardDescription>{t("results.empty")}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Selecciona algunos leads primero para crear una campaña de email.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("email.campaign.title")}</CardTitle>
        <CardDescription>
          {t("email.campaign.desc").replace("{count}", selectedLeads.length.toString())}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {emailSent ? (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">{t("email.success.title")}</AlertTitle>
            <AlertDescription className="text-green-700">
              {t("email.success.desc").replace("{count}", selectedLeads.length.toString())}
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
              <h3 className="font-medium text-blue-800 mb-1">{t("email.recipients")}</h3>
              <div className="text-sm text-blue-700">
                {selectedLeads.map((lead, index) => (
                  <span key={lead.id}>
                    {lead.name} ({lead.email}){index < selectedLeads.length - 1 ? ", " : ""}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email-content" className="text-sm font-medium">
                {t("email.content")}
              </label>
              <Textarea
                id="email-content"
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                rows={12}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">{t("email.placeholders")}</p>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter>
        {!emailSent && (
          <Button onClick={onSendCampaign} className="bg-green-600 hover:bg-green-700 w-full" size="lg">
            {t("email.send")}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
