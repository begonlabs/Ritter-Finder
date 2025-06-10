"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"
import type { Lead } from "../types"

interface RecipientsTabProps {
  selectedLeads: Lead[]
}

export function RecipientsTab({ selectedLeads }: RecipientsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Destinatarios ({selectedLeads.length})
        </CardTitle>
        <CardDescription>
          Revisa la lista de contactos que recibirán tu campaña
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {selectedLeads.map((lead, index) => (
            <div 
              key={lead.id} 
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
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
          
          {selectedLeads.length === 0 && (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-muted-foreground">
                No hay leads seleccionados para esta campaña.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 