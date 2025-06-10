"use client"

import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Phone, MapPin, Users, Euro, Calendar, ExternalLink } from "lucide-react"
import type { LeadDetailsModalProps } from "../types"

export function LeadDetailsModal({ lead, isOpen, onClose }: LeadDetailsModalProps) {
  if (!lead) return null

  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 90) return "bg-green-100 text-green-800"
    if (confidence >= 80) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalles del Lead</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Contact Information */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Contacto</label>
                <p className="font-medium">{lead.name}</p>
                <p className="text-sm text-muted-foreground">{lead.position}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-blue-600">{lead.email}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Teléfono</label>
                <p className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {lead.phone}
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Empresa</label>
                <p className="font-medium">{lead.company}</p>
                <a
                  href={`https://${lead.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                >
                  {lead.website}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Ubicación</label>
                <p className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {lead.location}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Industria</label>
                <Badge variant="outline">{lead.industry}</Badge>
              </div>
            </div>
          </div>

          {/* Company Metrics */}
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm font-medium text-gray-500">Empleados</label>
              <p className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {lead.employees}
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Ingresos</label>
              <p className="flex items-center gap-1">
                <Euro className="h-3 w-3" />
                {lead.revenue}
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Confianza</label>
              <Badge className={`${getConfidenceColor(lead.confidence)} border-0`}>
                {lead.confidence}%
              </Badge>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm font-medium text-gray-500">Notas</label>
            <p className="text-sm mt-1 p-3 bg-gray-50 rounded-md">{lead.notes}</p>
          </div>

          {/* Footer with metadata */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Última actividad: {new Date(lead.lastActivity).toLocaleDateString()}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              Fuente: {lead.source}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 