"use client"

import { useState, useCallback } from "react"
import type { 
  Lead, 
  EmailTemplate, 
  EmailComposerState, 
  EmailComposerActions,
  Language,
  Campaign
} from "../types"

const EMAIL_TEMPLATES: Record<Language, EmailTemplate> = {
  en: {
    subject: "Partnership Opportunity in Renewable Energy",
    content: `Dear [Contact Name],

I hope this email finds you well. I noticed that [Company Name] has been making significant strides in the renewable energy sector, and I wanted to reach out to discuss a potential partnership opportunity.

At RitterMor Energy, we specialize in providing innovative solutions that help companies like yours optimize their renewable energy operations and reduce costs by up to 30%.

I would love to schedule a brief 15-minute call to discuss how we might be able to support [Company Name]'s continued growth in the renewable energy space.

Would you be available for a call next week? I'm flexible with timing and can work around your schedule.

Best regards,
[Sender Name]
RitterMor Energy
[Sender Email]

P.S. I've attached a brief case study showing how we helped a similar company in your industry achieve remarkable results.`,
  },
  es: {
    subject: "Oportunidad de Colaboración en Energías Renovables",
    content: `Estimado/a [Contact Name],

Espero que este email le encuentre bien. He notado que [Company Name] ha estado haciendo avances significativos en el sector de energías renovables, y quería contactarle para discutir una posible oportunidad de colaboración.

En RitterMor Energy, nos especializamos en proporcionar soluciones innovadoras que ayudan a empresas como la suya a optimizar sus operaciones de energía renovable y reducir costos hasta en un 30%.

Me encantaría programar una breve llamada de 15 minutos para discutir cómo podríamos apoyar el crecimiento continuo de [Company Name] en el espacio de energías renovables.

¿Estaría disponible para una llamada la próxima semana? Soy flexible con los horarios y puedo adaptarme a su agenda.

Saludos cordiales,
[Sender Name]
RitterMor Energy
[Sender Email]

P.D. He adjuntado un breve caso de estudio que muestra cómo ayudamos a una empresa similar en su industria a lograr resultados extraordinarios.`,
  },
  de: {
    subject: "Partnerschaftsmöglichkeit im Bereich Erneuerbare Energien",
    content: `Sehr geehrte(r) [Contact Name],

ich hoffe, diese E-Mail erreicht Sie bei bester Gesundheit. Mir ist aufgefallen, dass [Company Name] bedeutende Fortschritte im Bereich der erneuerbaren Energien gemacht hat, und ich wollte mich bei Ihnen melden, um eine mögliche Partnerschaftsmöglichkeit zu besprechen.

Bei RitterMor Energy sind wir darauf spezialisiert, innovative Lösungen anzubieten, die Unternehmen wie Ihrem dabei helfen, ihre Abläufe im Bereich erneuerbarer Energien zu optimieren und Kosten um bis zu 30% zu reduzieren.

Ich würde gerne ein kurzes 15-minütiges Gespräch vereinbaren, um zu besprechen, wie wir das kontinuierliche Wachstum von [Company Name] im Bereich erneuerbarer Energien unterstützen könnten.

Wären Sie nächste Woche für ein Gespräch verfügbar? Ich bin zeitlich flexibel und kann mich an Ihren Zeitplan anpassen.

Mit freundlichen Grüßen,
[Sender Name]
RitterMor Energy
[Sender Email]

P.S. Ich habe eine kurze Fallstudie beigefügt, die zeigt, wie wir einem ähnlichen Unternehmen in Ihrer Branche zu bemerkenswerten Ergebnissen verholfen haben.`,
  },
}

export function useEmailComposer(
  language: Language = 'es',
  onCampaignSent?: (campaign: Campaign) => void
): EmailComposerState & EmailComposerActions & { personalizeEmail: (content: string, lead: Lead) => string } {
  const [subject, setSubject] = useState("")
  const [content, setContent] = useState("")
  const [senderName, setSenderName] = useState("Demo User")
  const [senderEmail, setSenderEmail] = useState("demo@ritterfinder.com")
  const [previewLead, setPreviewLead] = useState<Lead | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const loadTemplate = useCallback((template?: EmailTemplate) => {
    const templateToUse = template || EMAIL_TEMPLATES[language] || EMAIL_TEMPLATES.es
    setSubject(templateToUse.subject)
    setContent(templateToUse.content)
  }, [language])

  const personalizeEmail = useCallback((content: string, lead: Lead): string => {
    return content
      .replace(/\[Contact Name\]/g, lead.name)
      .replace(/\[Company Name\]/g, lead.company)
      .replace(/\[Sender Name\]/g, senderName)
      .replace(/\[Sender Email\]/g, senderEmail)
  }, [senderName, senderEmail])

  const sendCampaign = useCallback(async (leads: Lead[]): Promise<void> => {
    if (!subject.trim() || !content.trim() || leads.length === 0) {
      throw new Error("Missing required fields")
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      const campaign: Campaign = {
        id: `campaign_${Date.now()}`,
        subject,
        content,
        senderName,
        senderEmail,
        recipients: leads,
        sentAt: new Date().toISOString(),
        estimatedDelivery: "2-5 minutes",
        status: 'sent'
      }

      setEmailSent(true)
      onCampaignSent?.(campaign)

    } catch (error) {
      console.error('Error sending campaign:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [subject, content, senderName, senderEmail, onCampaignSent])

  const resetComposer = useCallback(() => {
    setSubject("")
    setContent("")
    setPreviewLead(null)
    setEmailSent(false)
    setIsLoading(false)
  }, [])

  return {
    // State
    subject,
    content,
    senderName,
    senderEmail,
    previewLead,
    isLoading,
    emailSent,
    
    // Actions
    setSubject,
    setContent,
    setSenderName,
    setSenderEmail,
    setPreviewLead,
    loadTemplate,
    sendCampaign,
    resetComposer,
    
    // Utilities
    personalizeEmail
  }
}
