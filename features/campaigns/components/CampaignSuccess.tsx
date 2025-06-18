"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, Mail, Clock, Target } from "lucide-react"
import type { Lead } from "../types"
import styles from "../styles/CampaignSuccess.module.css"

interface CampaignSuccessProps {
  selectedLeads: Lead[]
}

export function CampaignSuccess({ selectedLeads }: CampaignSuccessProps) {
  return (
    <Card className={`${styles.campaignSuccess} border-green-200 bg-green-50`}>
      <CardContent className={`${styles.content} pt-6`}>
        <div className={styles.checkmarkContainer}>
          <div className={styles.checkmark}>
            <CheckCircle2 className={`${styles.checkmarkIcon} h-8 w-8`} />
            <div className={styles.waveAnimation}></div>
          </div>
        </div>

        <Alert className={`${styles.successAlert} bg-green-50 border-green-200`}>
          <div className={styles.alertContent}>
            <CheckCircle2 className={`${styles.alertIcon} h-4 w-4 text-green-600`} />
            <div className={styles.alertText}>
              <AlertTitle className={`${styles.alertTitle} text-green-800`}>
                ¡Campaña Enviada Exitosamente!
              </AlertTitle>
              <AlertDescription className={`${styles.alertDescription} text-green-700`}>
                Tu campaña de email ha sido enviada a {selectedLeads.length} destinatarios. 
                Los emails serán entregados en los próximos 2-5 minutos.
              </AlertDescription>
            </div>
          </div>
        </Alert>

        <div className={`${styles.statsGrid} mt-6 grid gap-4 md:grid-cols-3`}>
          <div className={`${styles.statCard} text-center p-4 bg-white rounded-lg border`}>
            <Mail className={`${styles.statIcon} ${styles.statIconMail} mx-auto h-8 w-8 text-blue-600 mb-2`} />
            <p className={`${styles.statValue} font-semibold`}>{selectedLeads.length}</p>
            <p className={`${styles.statLabel} text-sm text-muted-foreground`}>Emails Enviados</p>
          </div>
          
          <div className={`${styles.statCard} text-center p-4 bg-white rounded-lg border`}>
            <Clock className={`${styles.statIcon} ${styles.statIconClock} mx-auto h-8 w-8 text-orange-600 mb-2`} />
            <p className={`${styles.statValue} font-semibold`}>2-5 min</p>
            <p className={`${styles.statLabel} text-sm text-muted-foreground`}>Tiempo de Entrega</p>
          </div>
          
          <div className={`${styles.statCard} text-center p-4 bg-white rounded-lg border`}>
            <Target className={`${styles.statIcon} ${styles.statIconTarget} mx-auto h-8 w-8 text-green-600 mb-2`} />
            <p className={`${styles.statValue} font-semibold`}>85%</p>
            <p className={`${styles.statLabel} text-sm text-muted-foreground`}>Tasa de Apertura Esperada</p>
          </div>
        </div>

        <div className={`${styles.summaryCard} mt-6 p-4 bg-white rounded-lg border`}>
          <h3 className={`${styles.summaryTitle} font-medium mb-2`}>Resumen de la Campaña</h3>
          <div className={`${styles.summaryList} grid gap-2 text-sm`}>
            <div className={`${styles.summaryItem} flex justify-between`}>
              <span className={`${styles.summaryLabel} text-muted-foreground`}>Destinatarios:</span>
              <span className={`${styles.summaryValue} font-medium`}>{selectedLeads.length} contactos</span>
            </div>
            <div className={`${styles.summaryItem} flex justify-between`}>
              <span className={`${styles.summaryLabel} text-muted-foreground`}>Categorías objetivo:</span>
              <span className={`${styles.summaryValue} font-medium`}>
                {Array.from(new Set(selectedLeads.map(lead => lead.industry || lead.category))).length} sectores
              </span>
            </div>
            <div className={`${styles.summaryItem} flex justify-between`}>
              <span className={`${styles.summaryLabel} text-muted-foreground`}>Empresas contactadas:</span>
              <span className={`${styles.summaryValue} font-medium`}>
                {Array.from(new Set(selectedLeads.map(lead => lead.company || lead.company_name))).length} empresas
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 