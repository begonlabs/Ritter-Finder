"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, Mail, Eye, Send, Users, Clock, FileText, Sparkles, Target } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

interface Lead {
  id: string
  name: string
  company: string
  email: string
  position: string
  industry: string
}

interface EnhancedEmailComposerProps {
  selectedLeads: Lead[]
  onSendCampaign: (campaignData: any) => void
  emailSent: boolean
}

export function EnhancedEmailComposer({ selectedLeads, onSendCampaign, emailSent }: EnhancedEmailComposerProps) {
  const { t, language } = useLanguage()
  const [subject, setSubject] = useState("")
  const [emailContent, setEmailContent] = useState("")
  const [senderName, setSenderName] = useState("Demo User")
  const [senderEmail, setSenderEmail] = useState("demo@ritterfinder.com")
  const [previewLead, setPreviewLead] = useState<Lead | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Email templates for different languages
  const emailTemplates = {
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

  const currentTemplate = emailTemplates[language] || emailTemplates.en

  const loadTemplate = () => {
    setSubject(currentTemplate.subject)
    setEmailContent(currentTemplate.content)
  }

  const personalizeEmail = (content: string, lead: Lead) => {
    return content
      .replace(/\[Contact Name\]/g, lead.name)
      .replace(/\[Company Name\]/g, lead.company)
      .replace(/\[Sender Name\]/g, senderName)
      .replace(/\[Sender Email\]/g, senderEmail)
  }

  const handleSendCampaign = async () => {
    if (!subject.trim() || !emailContent.trim()) {
      return
    }

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const campaignData = {
      subject,
      content: emailContent,
      senderName,
      senderEmail,
      recipients: selectedLeads,
      sentAt: new Date().toISOString(),
      estimatedDelivery: "2-5 minutes",
    }

    onSendCampaign(campaignData)
    setIsLoading(false)
  }

  if (selectedLeads.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Campaña de Email</CardTitle>
          <CardDescription>No hay leads seleccionados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-muted-foreground">Selecciona algunos leads primero para crear una campaña de email.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {emailSent ? (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">¡Campaña Enviada Exitosamente!</AlertTitle>
              <AlertDescription className="text-green-700">
                Tu campaña de email ha sido enviada a {selectedLeads.length} destinatarios. Los emails serán entregados
                en los próximos 2-5 minutos.
              </AlertDescription>
            </Alert>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 bg-white rounded-lg border">
                <Mail className="mx-auto h-8 w-8 text-blue-600 mb-2" />
                <p className="font-semibold">{selectedLeads.length}</p>
                <p className="text-sm text-muted-foreground">Emails Enviados</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <Clock className="mx-auto h-8 w-8 text-orange-600 mb-2" />
                <p className="font-semibold">2-5 min</p>
                <p className="text-sm text-muted-foreground">Tiempo de Entrega</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <Target className="mx-auto h-8 w-8 text-green-600 mb-2" />
                <p className="font-semibold">85%</p>
                <p className="text-sm text-muted-foreground">Tasa de Apertura Esperada</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="compose" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="compose">Componer</TabsTrigger>
            <TabsTrigger value="recipients">Destinatarios</TabsTrigger>
            <TabsTrigger value="preview">Vista Previa</TabsTrigger>
          </TabsList>

          <TabsContent value="compose" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Componer Email
                </CardTitle>
                <CardDescription>Personaliza tu mensaje para {selectedLeads.length} destinatarios</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="sender-name">Nombre del Remitente</Label>
                    <Input id="sender-name" value={senderName} onChange={(e) => setSenderName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sender-email">Email del Remitente</Label>
                    <Input
                      id="sender-email"
                      type="email"
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Asunto del Email</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Ingresa el asunto del email..."
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-content">Contenido del Email</Label>
                    <Button variant="outline" size="sm" onClick={loadTemplate} className="flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      Usar Plantilla
                    </Button>
                  </div>
                  <Textarea
                    id="email-content"
                    value={emailContent}
                    onChange={(e) => setEmailContent(e.target.value)}
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
            </Card>
          </TabsContent>

          <TabsContent value="recipients" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Destinatarios ({selectedLeads.length})
                </CardTitle>
                <CardDescription>Revisa la lista de contactos que recibirán tu campaña</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedLeads.map((lead, index) => (
                    <div key={lead.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="bg-ritter-gold text-ritter-dark rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{lead.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {lead.position} en {lead.company}
                          </p>
                          <p className="text-sm text-blue-600">{lead.email}</p>
                        </div>
                      </div>
                      <Badge variant="outline">{lead.industry}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Vista Previa del Email
                </CardTitle>
                <CardDescription>Así se verá tu email para los destinatarios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Label>Vista previa para:</Label>
                    <select
                      className="border rounded px-2 py-1"
                      onChange={(e) => {
                        const lead = selectedLeads.find((l) => l.id === e.target.value)
                        setPreviewLead(lead || selectedLeads[0])
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
                        De: {senderName} &lt;{senderEmail}&gt;
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Para: {previewLead?.name || selectedLeads[0]?.name} &lt;
                        {previewLead?.email || selectedLeads[0]?.email}&gt;
                      </p>
                      <p className="font-semibold mt-2">Asunto: {subject || "Sin asunto"}</p>
                    </div>
                    <div className="whitespace-pre-wrap">
                      {personalizeEmail(emailContent, previewLead || selectedLeads[0]) || "Sin contenido"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <Card className="border-0 shadow-sm">
            <CardFooter className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {selectedLeads.length} destinatarios • Entrega estimada: 2-5 minutos
              </div>
              <Button
                onClick={handleSendCampaign}
                disabled={!subject.trim() || !emailContent.trim() || isLoading}
                className="bg-green-600 hover:bg-green-700"
                size="lg"
              >
                {isLoading ? (
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
        </Tabs>
      )}
    </div>
  )
}
