"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, Mail, Clock, Target } from "lucide-react"
import type { Lead } from "../types"

interface CampaignSuccessProps {
  selectedLeads: Lead[]
}

export function CampaignSuccess({ selectedLeads }: CampaignSuccessProps) {
  return (
    <Card className="border-green-200 bg-green-50">
      <CardContent className="pt-6">
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">
            ¡Campaña Enviada Exitosamente!
          </AlertTitle>
          <AlertDescription className="text-green-700">
            Tu campaña de email ha sido enviada a {selectedLeads.length} destinatarios. 
            Los emails serán entregados en los próximos 2-5 minutos.
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

        <div className="mt-6 p-4 bg-white rounded-lg border">
          <h3 className="font-medium mb-2">Resumen de la Campaña</h3>
          <div className="grid gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Destinatarios:</span>
              <span className="font-medium">{selectedLeads.length} contactos</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Industrias objetivo:</span>
              <span className="font-medium">
                {Array.from(new Set(selectedLeads.map(lead => lead.industry))).length} sectores
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Empresas contactadas:</span>
              <span className="font-medium">
                {Array.from(new Set(selectedLeads.map(lead => lead.company))).length} empresas
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 