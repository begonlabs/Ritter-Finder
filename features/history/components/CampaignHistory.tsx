"use client"

import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Search, MoreHorizontal, Copy, Eye, Mail, Calendar, Trash2, Clock, Send } from "lucide-react"
import { useCampaignHistory } from "../hooks/useCampaignHistory"
import type { CampaignHistoryProps } from "../types"

export function CampaignHistory({
  onViewCampaign,
  onDuplicateCampaign,
  onDeleteCampaign,
  showActions = true,
  compact = false
}: Omit<CampaignHistoryProps, 'campaigns'>) {
  const campaigns = useCampaignHistory()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'sent':
        return 'Enviada'
      case 'draft':
        return 'Borrador'
      case 'scheduled':
        return 'Programada'
      case 'failed':
        return 'Fallida'
      default:
        return status
    }
  }

  const getCampaignTypeColor = (type?: string) => {
    switch (type) {
      case 'promotional':
        return 'bg-purple-100 text-purple-800'
      case 'follow_up':
        return 'bg-blue-100 text-blue-800'
      case 'newsletter':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCampaignTypeText = (type?: string) => {
    switch (type) {
      case 'promotional':
        return 'Promocional'
      case 'follow_up':
        return 'Seguimiento'
      case 'newsletter':
        return 'Newsletter'
      default:
        return 'General'
    }
  }

  if (campaigns.isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-muted-foreground">Cargando historial de campañas...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className={compact ? "pb-4" : "flex flex-row items-center justify-between"}>
        <div>
          <CardTitle className={compact ? "text-lg" : "text-xl"}>
            Historial de Campañas
          </CardTitle>
          <CardDescription>
            Seguimiento del rendimiento de tus campañas de email ({campaigns.stats.totalCampaigns} campañas)
          </CardDescription>
        </div>
        
        {!compact && (
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar campañas..."
                className="pl-8"
                value={campaigns.searchTerm}
                onChange={(e) => campaigns.setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={campaigns.statusFilter} onValueChange={campaigns.setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="sent">Enviadas</SelectItem>
                <SelectItem value="draft">Borradores</SelectItem>
                <SelectItem value="scheduled">Programadas</SelectItem>
                <SelectItem value="failed">Fallidas</SelectItem>
              </SelectContent>
            </Select>
            <Select value={campaigns.typeFilter} onValueChange={campaigns.setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="promotional">Promocional</SelectItem>
                <SelectItem value="follow_up">Seguimiento</SelectItem>
                <SelectItem value="newsletter">Newsletter</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        {!campaigns.hasCampaigns ? (
          <div className="text-center py-12">
            <Mail className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay campañas de email
            </h3>
            <p className="text-gray-500">
              Crea tu primera campaña para comenzar a ver el historial
            </p>
          </div>
        ) : !campaigns.hasFilteredResults ? (
          <div className="text-center py-12">
            <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron campañas
            </h3>
            <p className="text-gray-500">
              Intenta ajustar tus filtros de búsqueda
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Asunto</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-center">Destinatarios</TableHead>
                  <TableHead>Tasa de Apertura</TableHead>
                  <TableHead>Tasa de Clicks</TableHead>
                  <TableHead>Estado</TableHead>
                  {showActions && <TableHead className="text-right">Acciones</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.campaigns.map((campaign) => (
                  <TableRow key={campaign.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">
                            {format(new Date(campaign.sentAt), "MMM d, yyyy")}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {format(new Date(campaign.sentAt), "h:mm a")}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-64">
                        <div className="font-medium truncate" title={campaign.subject}>
                          {campaign.subject}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {campaign.senderName}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getCampaignTypeColor(campaign.metadata?.campaign_type)}>
                        {getCampaignTypeText(campaign.metadata?.campaign_type)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Send className="h-3 w-3 text-muted-foreground" />
                        <span className="font-medium">{campaign.recipients}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {campaign.status === 'sent' ? (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{campaign.openRate.toFixed(1)}%</span>
                          </div>
                          <Progress value={campaign.openRate} className="h-1.5" />
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {campaign.status === 'sent' ? (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{campaign.clickRate.toFixed(1)}%</span>
                          </div>
                          <Progress value={campaign.clickRate} className="h-1.5" />
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={`border ${getStatusColor(campaign.status)}`}>
                        {getStatusText(campaign.status)}
                      </Badge>
                    </TableCell>
                    {showActions && (
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Acciones</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onViewCampaign(campaign.id)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Ver Detalles
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDuplicateCampaign(campaign.id)}>
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicar Campaña
                            </DropdownMenuItem>
                            {onDeleteCampaign && (
                              <DropdownMenuItem 
                                onClick={() => onDeleteCampaign(campaign.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Eliminar
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Campaign Stats */}
        {campaigns.hasCampaigns && !compact && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-semibold text-blue-700">{campaigns.stats.totalCampaigns}</div>
              <div className="text-xs text-blue-600">Campañas Totales</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-semibold text-green-700">{campaigns.stats.totalRecipients}</div>
              <div className="text-xs text-green-600">Destinatarios</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-lg font-semibold text-purple-700">{campaigns.stats.averageOpenRate}%</div>
              <div className="text-xs text-purple-600">Apertura Promedio</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-lg font-semibold text-orange-700">{campaigns.stats.averageClickRate}%</div>
              <div className="text-xs text-orange-600">Clicks Promedio</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 