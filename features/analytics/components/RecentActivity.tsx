"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users, Search, Mail, Download } from "lucide-react"
import { useLanguage, formatMessage } from "@/lib/language-context"

interface ActivityItem {
  id: string
  type: 'search' | 'campaign' | 'export'
  title: string
  description: string
  date: string
  metadata?: {
    leadsFound?: number
    clientType?: string
    recipients?: number
    subject?: string
  }
}

interface RecentActivityProps {
  showHeader?: boolean
  compact?: boolean
  maxItems?: number
}

// Mock activity data - in real app this would come from API
const mockActivity: ActivityItem[] = [
  {
    id: "1",
    type: "search",
    title: "Búsqueda completada",
    description: "24 leads encontrados para clientes residenciales",
    date: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    metadata: {
      leadsFound: 24,
      clientType: "residential"
    }
  },
  {
    id: "2",
    type: "campaign",
    title: "Campaña de email enviada",
    description: "\"Oferta especial de energía solar\" enviada a 18 destinatarios",
    date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    metadata: {
      recipients: 18,
      subject: "Oferta especial de energía solar"
    }
  },
  {
    id: "3",
    type: "search",
    title: "Búsqueda completada",
    description: "31 leads encontrados para clientes comerciales",
    date: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
    metadata: {
      leadsFound: 31,
      clientType: "commercial"
    }
  },
  {
    id: "4",
    type: "export",
    title: "Datos exportados",
    description: "Lista de 42 leads exportada a CSV",
    date: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
    metadata: {
      leadsFound: 42
    }
  },
  {
    id: "5",
    type: "campaign",
    title: "Campaña de email enviada",
    description: "\"Información sobre paneles solares\" enviada a 25 destinatarios",
    date: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
    metadata: {
      recipients: 25,
      subject: "Información sobre paneles solares"
    }
  }
]

function getActivityIcon(type: string) {
  switch (type) {
    case 'search':
      return <Search className="h-4 w-4 text-ritter-gold" />
    case 'campaign':
      return <Mail className="h-4 w-4 text-blue-600" />
    case 'export':
      return <Download className="h-4 w-4 text-green-600" />
    default:
      return <Users className="h-4 w-4 text-gray-500" />
  }
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) {
    return 'Hace unos segundos'
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `Hace ${diffInMinutes} ${diffInMinutes === 1 ? 'minuto' : 'minutos'}`
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `Hace ${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`
  }
  
  return date.toLocaleDateString('es-ES', { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function RecentActivity({ 
  showHeader = true, 
  compact = false, 
  maxItems = 5 
}: RecentActivityProps) {
  const { t } = useLanguage()
  
  const displayItems = mockActivity.slice(0, maxItems)

  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
      {showHeader && (
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-ritter-gold" />
            {t("dashboard.activity")}
          </CardTitle>
          <CardDescription>{t("dashboard.activity.desc")}</CardDescription>
        </CardHeader>
      )}
      
      <CardContent>
        <div className="space-y-4">
          {displayItems.map((item) => (
            <div 
              key={item.id} 
              className="flex items-start gap-4 pb-4 border-b last:border-0"
            >
              <div className="bg-ritter-gold/10 p-2 rounded-full">
                {getActivityIcon(item.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatRelativeTime(item.date)}
                </p>
              </div>
              {!compact && item.metadata && (
                <div className="text-right">
                  {item.type === 'search' && item.metadata.leadsFound && (
                    <div className="text-xs text-ritter-gold font-medium">
                      {item.metadata.leadsFound} leads
                    </div>
                  )}
                  {item.type === 'campaign' && item.metadata.recipients && (
                    <div className="text-xs text-blue-600 font-medium">
                      {item.metadata.recipients} destinatarios
                    </div>
                  )}
                  {item.type === 'export' && item.metadata.leadsFound && (
                    <div className="text-xs text-green-600 font-medium">
                      {item.metadata.leadsFound} registros
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          
          {displayItems.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No hay actividad reciente</p>
              <p className="text-sm text-gray-400">
                La actividad aparecerá aquí cuando realices búsquedas o campañas
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 